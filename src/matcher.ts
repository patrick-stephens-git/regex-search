export type SearchMode = "regex" | "exact";

export interface MatchRange {
	from: number;
	to: number;
}

/** Safety cap so a pathological pattern over a huge note can't hang the UI. */
const MAX_MATCHES = 5000;

function escapeRegExp(literal: string): string {
	return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compiles the user's query into a RegExp. In regex mode, an invalid pattern
 * falls back to literal-text matching instead of erroring (per spec: a typo
 * in the pattern shouldn't block the user from finding anything).
 */
export function compileMatcher(
	query: string,
	mode: SearchMode
): { regex: RegExp | null; usedLiteralFallback: boolean } {
	if (!query) return { regex: null, usedLiteralFallback: false };

	if (mode === "exact") {
		return { regex: new RegExp(escapeRegExp(query), "gi"), usedLiteralFallback: false };
	}

	try {
		return { regex: new RegExp(query, "gi"), usedLiteralFallback: false };
	} catch {
		return { regex: new RegExp(escapeRegExp(query), "gi"), usedLiteralFallback: true };
	}
}

export function findMatches(text: string, regex: RegExp): MatchRange[] {
	const matches: MatchRange[] = [];
	regex.lastIndex = 0;
	let m: RegExpExecArray | null;
	while ((m = regex.exec(text))) {
		matches.push({ from: m.index, to: m.index + m[0].length });
		if (m[0].length === 0) {
			regex.lastIndex++;
		}
		if (matches.length >= MAX_MATCHES) break;
	}
	return matches;
}
