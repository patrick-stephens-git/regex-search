# Regex Search & Replace

Find matches in the current note using a regex or plain-text pattern, with live highlighting, next/previous navigation, and select-all-to-edit.

## Usage

- Run **"Open regex find bar"** to open the find bar above the note. No hotkey is bound by default — assign one in Settings → Hotkeys (e.g. `Cmd/Ctrl+Shift+F`, since the default Obsidian in-note search already owns `Cmd/Ctrl+F`).
- Click the icon button to toggle between regex and plain-text matching. An invalid regex falls back to plain-text matching automatically.
- Type to see matches highlighted live as you type.
- `Enter` / `Shift+Enter` (or the arrow buttons) jump to the next / previous match.
- `Alt+Enter` (or **Select all**) selects every match as multiple cursors — start typing to replace all occurrences at once.
- `Esc` (or the `×` button) closes the find bar.

## Development

```bash
npm install
npm run dev    # watch build
npm run build  # type-check + production build
```

## Manual installation

Copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/regex-search-and-replace/`, then enable the plugin in Settings → Community plugins.
