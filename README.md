# Regex Search

Find matches in the current note using a regex or plain-text pattern, with live highlighting, next/previous navigation, and select-all-to-edit.

## Usage

- Run **"Open regex find bar"** to open the find bar above the note. No hotkey is bound by default — assign one in Settings → Hotkeys. Running the command while the bar is already open moves focus back to the input and selects its text. To make it your `Cmd/Ctrl+F`, first clear that key from Obsidian's built-in "Search in current file" (which owns it by default), then bind it to this command; otherwise `Cmd/Ctrl+Shift+F` is a conflict-free choice.
- Click the icon button to toggle between regex and plain-text matching. An invalid regex falls back to plain-text matching automatically.
- Type to see matches highlighted live as you type.
- `Enter` / `Shift+Enter` (or the arrow buttons) jump to the next / previous match.
- `Alt+Enter` (or **Select all**) selects every match as multiple cursors — start typing to replace all occurrences at once.
- `Esc` (or the `×` button) closes the find bar.

## Development

```bash
npm install    # install dependencies (run once, or after they change)
npm run dev    # bundle src/main.ts into main.js and rebuild on every save
npm run build  # type-check, then produce a minified main.js for release
```

Point `<vault>/.obsidian/plugins/regex-search/` at this repo (or symlink it) during `npm run dev`, and reload the plugin in Obsidian after each save. Run `npm run build` before copying the plugin into a vault for real use.

## Manual installation

Copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/regex-search/`, then enable the plugin in Settings → Community plugins.
