const { Plugin, Notice } = require("obsidian");

function normalizeChatGPTText(input) {
  // 1) Remove lines containing exactly '---' and the line above.
  const lines = input.split(/\r?\n/);
  const kept = [];
  for (const line of lines) {
    if (/^---[ \t]*$/.test(line)) {
      if (kept.length > 0) {
        kept.pop();
      }
      continue;
    }
    kept.push(line);
  }

  let text = kept.join("\n");

  // 2) Normalize curly quotes and em dashes.
  text = text
    .replace(/[‘’]/g, "'")
    .replace(/[„“”]/g, '"')
    .replace(/—/g, "-");

  // 3) Remove trailing backslashes at end of lines.
  text = text.replace(/\\[ \t]*$/gm, "");

  // 4) Remove empty lines immediately after markdown headers.
  text = text.replace(/^(#+ .*\n)([ \t]*\n)+/gm, "$1");

  // 5) Remove contentReference markers.
  text = text.replace(/:contentReference\[oaicite:\d+\]{index=\d+}/g, "");

  // 6) Compact numbered lists (remove blank lines between numbered items only).
  const numbered = text.split("\n");
  const isItem = (line) => /^[ \t]*\d+[.)][ \t]+/.test(line);
  const isBlank = (line) => /^[ \t]*$/.test(line);

  let i = 0;
  while (i < numbered.length) {
    if (!isItem(numbered[i])) {
      i += 1;
      continue;
    }

    let j = i + 1;
    while (j < numbered.length && isBlank(numbered[j])) {
      j += 1;
    }

    const blankCount = j - (i + 1);
    if (blankCount > 0 && j < numbered.length && isItem(numbered[j])) {
      numbered.splice(i + 1, blankCount);
    }

    i += 1;
  }

  return numbered.join("\n");
}

module.exports = class NormalizeChatGPTTextPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "normalize-chatgpt-text-active-note",
      name: "Normalize ChatGPT text in active note",
      editorCallback: (editor) => {
        const original = editor.getValue();
        const normalized = normalizeChatGPTText(original);

        if (normalized === original) {
          new Notice("No changes needed.");
          return;
        }

        editor.setValue(normalized);
        new Notice("Normalized ChatGPT text.");
      }
    });
  }
};
