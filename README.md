# Regex Search & Replace

Find matches in the current note using a regex or plain-text pattern, with live highlighting, next/previous navigation, and select-all-to-edit.

## Usage

- Run **"Open regex find bar"** (default hotkey `Cmd/Ctrl+Shift+F`) to open the find bar above the note.
- Click `.*` / `Aa` to toggle between regex and plain-text matching. An invalid regex falls back to plain-text matching automatically.
- Type to see matches highlighted live as you type.
- `Enter` / `Shift+Enter` (or the arrow buttons) jump to the next / previous match.
- `Alt+Enter` (or **Select all**) selects every match as multiple cursors — start typing to replace all occurrences at once.
- `Esc` (or the `×` button) closes the find bar.

If you'd like this bound to `Cmd/Ctrl+F` instead, remap it in Settings → Hotkeys (the default Obsidian in-note search stays on that key otherwise).

## Development

```bash
npm install
npm run dev    # watch build
npm run build  # type-check + production build
```

## Manual installation

Copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/regex-search-and-replace/`, then enable the plugin in Settings → Community plugins.
