# Normalize ChatGPT Text (Obsidian Plugin)

This plugin adds a command that normalizes ChatGPT-generated content in the currently opened note.

## Command

- **Normalize ChatGPT text in active note**

## What it does

The command applies the following transformations to the active note:

1. Removes any line containing exactly `---` and also removes the line directly above it.
2. Replaces curly single quotes (`‘’`) with `'`.
3. Replaces curly double quotes (`„“”`) with `"`.
4. Replaces em dashes (`—`) with `-`.
5. Removes trailing backslashes at end of lines.
6. Removes blank lines immediately following Markdown headers.
7. Removes markers like `:contentReference[oaicite:N]{index=M}`.
8. Removes blank lines between numbered list items (e.g., `1.`, `2)`), while leaving non-list spacing untouched.

## Installation (manual)

1. Copy `manifest.json` and `main.js` into a folder under your vault's plugins directory:
   `.obsidian/plugins/normalize-chatgpt-text/`
2. Enable **Normalize ChatGPT Text** in Obsidian → **Settings** → **Community plugins**.
3. Run the command from the command palette.
