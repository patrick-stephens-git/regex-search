import { Plugin } from "obsidian";
import type { EditorView } from "@codemirror/view";
import { openFindBar, regexFindExtension } from "./findExtension";

export default class RegexSearchReplacePlugin extends Plugin {
	async onload(): Promise<void> {
		this.registerEditorExtension(regexFindExtension);

		this.addCommand({
			id: "open-regex-find-bar",
			name: "Open regex find bar",
			editorCallback: (editor) => {
				const view = (editor as unknown as { cm?: EditorView }).cm;
				if (!view) return;
				openFindBar(view);
			},
		});
	}
}
