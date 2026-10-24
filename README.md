# Regex Search

Find matches in the current note using a regex or plain-text pattern, with live highlighting, next/previous navigation, and select-all-to-edit.

## Usage

- Run **"Open regex search bar"** to open the search bar above the note. If the bar is already open, running the command again moves focus back to the input and selects its text.
- Click the icon button to toggle between regex and plain-text matching. An invalid regex falls back to plain-text matching automatically.
- Type to see matches highlighted live.
- `Enter` / `Shift+Enter` (or the arrow buttons) jump to the next / previous match.
- `Alt+Enter` (or **Select all**) selects every match as multiple cursors. Start typing to replace all occurrences at once.
- `Esc` (or the `×` button) closes the search bar.

## Setting up a hotkey

No hotkey is bound by default. I recommend using `Cmd/Ctrl+F`, since that's where you'd normally reach for search:

1. Open Settings → Hotkeys.
2. Search for "Search in current file" and clear its hotkey. Obsidian binds `Cmd/Ctrl+F` to it by default, so the two would conflict.
3. Search for "Regex Search: Open regex search bar" and assign `Cmd/Ctrl+F`.

If you'd rather keep the built-in search, `Cmd/Ctrl+Shift+F` is a conflict-free choice.

## Development

```bash
npm install    # install dependencies (run once, or after they change)
npm run dev    # bundle src/main.ts into main.js and rebuild on every save
npm run build  # type-check, then produce a minified main.js for release
```

Point `<vault>/.obsidian/plugins/regex-search/` at this repo (or symlink it) during `npm run dev`, and reload the plugin in Obsidian after each save. Run `npm run build` before copying the plugin into a vault for real use.

## Manual installation

Copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/regex-search/`, then enable the plugin in Settings → Community plugins.
