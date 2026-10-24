import { EditorSelection, StateEffect, StateField, type Extension } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, type Panel, showPanel } from "@codemirror/view";
import { compileMatcher, findMatches, type MatchRange, type SearchMode } from "./matcher";

interface SearchState {
	open: boolean;
	mode: SearchMode;
	query: string;
	matches: MatchRange[];
	activeIndex: number;
	invalidRegex: boolean;
	decorations: DecorationSet;
}

const initialState: SearchState = {
	open: false,
	mode: "regex",
	query: "",
	matches: [],
	activeIndex: -1,
	invalidRegex: false,
	decorations: Decoration.none,
};

export const toggleOpenEffect = StateEffect.define<boolean>();
export const setQueryEffect = StateEffect.define<string>();
export const setModeEffect = StateEffect.define<SearchMode>();
const navigateEffect = StateEffect.define<number>();

function buildDecorations(matches: MatchRange[], activeIndex: number): DecorationSet {
	if (!matches.length) return Decoration.none;
	const marks = matches.map((m, i) =>
		Decoration.mark({
			class: i === activeIndex ? "regex-search-match regex-search-match-active" : "regex-search-match",
		}).range(m.from, m.to)
	);
	return Decoration.set(marks);
}

const searchField = StateField.define<SearchState>({
	create: () => initialState,
	update(value, tr) {
		let next = value;
		let openChanged = false;
		let queryOrModeChanged = false;

		for (const effect of tr.effects) {
			if (effect.is(toggleOpenEffect)) {
				if (effect.value !== next.open) {
					next = { ...next, open: effect.value, activeIndex: effect.value ? next.activeIndex : -1 };
					openChanged = true;
				}
			} else if (effect.is(setQueryEffect)) {
				next = { ...next, query: effect.value };
				queryOrModeChanged = true;
			} else if (effect.is(setModeEffect)) {
				next = { ...next, mode: effect.value };
				queryOrModeChanged = true;
			}
		}

		if (next.open && (tr.docChanged || openChanged || queryOrModeChanged)) {
			const { regex, usedLiteralFallback } = compileMatcher(next.query, next.mode);
			const matches = regex ? findMatches(tr.state.doc.toString(), regex) : [];
			let activeIndex = next.activeIndex;
			if (activeIndex < 0 || activeIndex >= matches.length) {
				activeIndex = matches.length ? 0 : -1;
			}
			next = {
				...next,
				matches,
				activeIndex,
				invalidRegex: usedLiteralFallback,
				decorations: buildDecorations(matches, activeIndex),
			};
		} else if (!next.open && openChanged) {
			next = { ...next, matches: [], activeIndex: -1, decorations: Decoration.none, invalidRegex: false };
		}

		for (const effect of tr.effects) {
			if (effect.is(navigateEffect) && next.matches.length) {
				next = { ...next, activeIndex: effect.value, decorations: buildDecorations(next.matches, effect.value) };
			}
		}

		return next;
	},
	provide: (field) => [
		EditorView.decorations.from(field, (v) => v.decorations),
		showPanel.from(field, (v) => (v.open ? createSearchPanel : null)),
	],
});

function nextActiveIndex(state: SearchState, dir: 1 | -1): number {
	if (!state.matches.length) return -1;
	let idx = state.activeIndex + dir;
	if (idx < 0) idx = state.matches.length - 1;
	if (idx >= state.matches.length) idx = 0;
	return idx;
}

export function openSearchBar(view: EditorView): void {
	const alreadyOpen = view.state.field(searchField).open;
	const effects: StateEffect<unknown>[] = [toggleOpenEffect.of(true)];
	// Only seed from the selection on a fresh open: while the bar is open, navigating
	// sets the selection to the current match, which would clobber a regex query.
	if (!alreadyOpen) {
		const sel = view.state.selection.main;
		const selectedText = sel.empty ? "" : view.state.sliceDoc(sel.from, sel.to);
		if (selectedText && !selectedText.includes("\n")) {
			effects.push(setQueryEffect.of(selectedText));
		}
	}
	view.dispatch({ effects });

	// The panel's mount() only focuses on creation, so re-focus when it was already open.
	const input = view.dom.querySelector<HTMLInputElement>(".regex-search-input");
	input?.focus();
	input?.select();
}

export function closeSearchBar(view: EditorView): void {
	view.dispatch({ effects: toggleOpenEffect.of(false) });
	view.focus();
}

export function setQuery(view: EditorView, query: string): void {
	view.dispatch({ effects: setQueryEffect.of(query) });
}

export function toggleMode(view: EditorView): void {
	const state = view.state.field(searchField);
	view.dispatch({ effects: setModeEffect.of(state.mode === "regex" ? "exact" : "regex") });
}

export function navigateMatch(view: EditorView, dir: 1 | -1): void {
	const state = view.state.field(searchField);
	const idx = nextActiveIndex(state, dir);
	if (idx === -1) return;
	const match = state.matches[idx];
	view.dispatch({
		effects: [navigateEffect.of(idx), EditorView.scrollIntoView(match.from, { y: "center" })],
		selection: EditorSelection.range(match.from, match.to),
	});
}

export function selectAllMatches(view: EditorView): void {
	const state = view.state.field(searchField);
	if (!state.matches.length) return;
	const ranges = state.matches.map((m) => EditorSelection.range(m.from, m.to));
	view.dispatch({
		selection: EditorSelection.create(ranges, 0),
		effects: toggleOpenEffect.of(false),
	});
	view.focus();
}

function createSearchPanel(view: EditorView): Panel {
	const dom = document.createElement("div");
	dom.className = "regex-search-panel";

	const modeButton = document.createElement("button");
	modeButton.className = "regex-search-mode-button clickable-icon";
	modeButton.type = "button";
	modeButton.setAttribute("aria-label", "Toggle regex / plain text mode");
	modeButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon regex-search-mode-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
		'<circle cx="4" cy="19" r="1.6" fill="currentColor" stroke="none"></circle>' +
		'<line x1="15" y1="4" x2="15" y2="16"></line>' +
		'<line x1="20" y1="7" x2="10" y2="13"></line>' +
		'<line x1="10" y1="7" x2="20" y2="13"></line>' +
		"</svg>";

	const inputWrap = document.createElement("div");
	inputWrap.className = "regex-search-input-wrap";

	const input = document.createElement("input");
	input.type = "text";
	input.className = "regex-search-input";
	input.placeholder = "Search (regex or text)";
	input.spellcheck = false;

	const countLabel = document.createElement("span");
	countLabel.className = "regex-search-count";

	inputWrap.append(input, countLabel);

	const prevButton = document.createElement("button");
	prevButton.type = "button";
	prevButton.className = "regex-search-nav-button";
	prevButton.textContent = "↑";
	prevButton.title = "Previous match (Shift+Enter)";

	const nextButton = document.createElement("button");
	nextButton.type = "button";
	nextButton.className = "regex-search-nav-button";
	nextButton.textContent = "↓";
	nextButton.title = "Next match (Enter)";

	const selectAllButton = document.createElement("button");
	selectAllButton.type = "button";
	selectAllButton.className = "regex-search-select-all-button";
	selectAllButton.textContent = "Select all";
	selectAllButton.title = "Select all matches (Alt+Enter)";

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className = "regex-search-close-button";
	closeButton.textContent = "×";
	closeButton.title = "Close (Esc)";

	function refresh() {
		const state = view.state.field(searchField);
		modeButton.title =
			state.mode === "regex" ? "Regex mode (click for plain text)" : "Plain text mode (click for regex)";
		modeButton.classList.toggle("is-active", state.mode === "regex");

		if (input.value !== state.query) input.value = state.query;

		if (!state.query) {
			countLabel.textContent = "";
		} else if (state.matches.length === 0) {
			countLabel.textContent = "No matches";
		} else {
			countLabel.textContent = `${state.activeIndex + 1}/${state.matches.length}`;
		}
		countLabel.classList.toggle("regex-search-invalid", state.invalidRegex);
		if (state.invalidRegex) countLabel.title = "Invalid regex, matching as plain text";
		else countLabel.removeAttribute("title");

		const hasMatches = state.matches.length > 0;
		prevButton.disabled = !hasMatches;
		nextButton.disabled = !hasMatches;
		selectAllButton.disabled = !hasMatches;
	}

	modeButton.addEventListener("click", () => {
		toggleMode(view);
		input.focus();
	});
	input.addEventListener("input", () => setQuery(view, input.value));
	input.addEventListener("keydown", (evt) => {
		if (evt.key !== "Enter" && evt.key !== "Escape") return;

		evt.preventDefault();
		evt.stopPropagation();

		if (evt.key === "Escape") {
			closeSearchBar(view);
			return;
		}

		// Enter never edits the query; pin the value back in case anything upstream
		// (e.g. a stray keypress/input event) manages to slip a character through.
		const query = input.value;
		if (evt.altKey) {
			selectAllMatches(view);
		} else if (evt.shiftKey) {
			navigateMatch(view, -1);
		} else {
			navigateMatch(view, 1);
		}
		if (input.value !== query) input.value = query;
	});
	prevButton.addEventListener("click", () => navigateMatch(view, -1));
	nextButton.addEventListener("click", () => navigateMatch(view, 1));
	selectAllButton.addEventListener("click", () => selectAllMatches(view));
	closeButton.addEventListener("click", () => closeSearchBar(view));

	dom.append(modeButton, inputWrap, prevButton, nextButton, selectAllButton, closeButton);

	return {
		dom,
		top: true,
		mount() {
			const state = view.state.field(searchField);
			input.value = state.query;
			refresh();
			input.focus();
			input.select();
		},
		update() {
			refresh();
		},
	};
}

export const regexSearchExtension: Extension = [searchField];
