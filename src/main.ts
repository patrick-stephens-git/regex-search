import { Plugin } from "obsidian";
import type { EditorView } from "@codemirror/view";
import { openSearchBar, regexSearchExtension } from "./searchExtension";

export default class RegexSearchPlugin extends Plugin {
	async onload(): Promise<void> {
		this.registerEditorExtension(regexSearchExtension);

		this.addCommand({
			id: "open-search-bar",
			name: "Open regex search bar",
			editorCallback: (editor) => {
				const view = (editor as unknown as { cm?: EditorView }).cm;
				if (!view) return;
				openSearchBar(view);
			},
		});
	}
}
