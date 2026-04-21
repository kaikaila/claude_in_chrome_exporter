# claude-chrome-exporter

Export your **Claude in Chrome** side-panel conversations to Markdown files.

Claude in Chrome runs conversations inside a browser side-panel that does not reliably sync with your main claude.ai chat history. This tool lets you snapshot any active conversation and save it as a local `.md` file in seconds — no account setup, no extra software.

---

## Why this exists

| Problem | How this tool helps |
|---|---|
| Side-panel conversations disappear or don't appear in claude.ai history | One-click export captures the conversation exactly as it appears |
| No official export button exists in the side panel | Runs entirely in your browser — nothing to install for the snippet version |
| Existing Claude exporters only target claude.ai, not the side panel | This snippet reads directly from the side-panel DOM |

### Snippet vs. Chrome Extension

| | Snippet (current) | Chrome Extension (planned) |
|---|---|---|
| Setup | Paste into console | One-click install from Web Store |
| Trigger | Manual, per-session | Keyboard shortcut or toolbar button |
| Export formats | Markdown | Markdown, JSON, TXT |
| Auto-backup | No | Planned |
| Target audience | Developers | Everyone |

---

## Quick Start

> **Requirements:** Google Chrome with the [Claude in Chrome](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) extension installed and an active conversation open in the side panel.

**Step 1 — Open DevTools**

Press `F12` (Windows/Linux) or `Cmd + Option + J` (macOS) to open Chrome DevTools, then click the **Console** tab.

**Step 2 — Paste the snippet**

Copy the contents of [`snippet.js`](snippet.js) and paste the entire block into the Console input line. Press **Enter**.

> Chrome may strip the `javascript:` prefix if you paste into the address bar. Always use the **Console** tab.

**Step 3 — Confirm the download**

A `.md` file downloads automatically. The filename follows the pattern:

```
claude-conversation-2025-01-31T12-00-00.md
```

Open it in any Markdown viewer (VS Code, GitHub, Obsidian, etc.) to review your exported conversation.

---

## How it works

1. The snippet queries the side-panel DOM for known Claude message container classes (`group/message`, `response-body`, etc.).
2. It labels each block as a **User** or **Claude** turn based on CSS class heuristics.
3. If the primary selectors miss (e.g., after a UI update), it falls back to scanning all `<p>` and `<div>` elements, then to a full text-node walk as a last resort.
4. Two deduplication passes run before output: first, exact-duplicate text nodes (common due to DOM nesting) are dropped; then, a fingerprint-based pass removes fragment blocks — cases where Claude's full response is also emitted as a series of per-paragraph sub-blocks, each with its own `## 🤖 Claude` header. Only the first (most complete) block in each consecutive Claude run is kept.
5. The result is assembled as a Markdown document and triggered as a browser download — no data ever leaves your machine.

---

## Known Limitations

- **User messages may be missing.** Depending on the DOM structure of the side panel at the time of export, user turns may not be captured. This is a known gap in the CSS-class heuristics.
- **Selector fragility.** Claude's side-panel class names change without notice. If exports are empty, the selectors likely need updating — open an issue with the affected DOM structure.
- **Single conversation only.** The snippet captures the currently-visible conversation; batch export is not supported.

---

## Output format

```markdown
# Claude in Chrome Conversation Export

Exported at: 1/31/2025, 12:00:00 PM

---

## 👤 User

What is the difference between TCP and UDP?

---

## 🤖 Claude

TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) differ primarily in ...

---
```

Each turn is a level-2 heading with a role emoji, making the file easy to navigate and search.

---

## Roadmap

### Phase 2 — Chrome Extension

The snippet will be packaged as a proper Chrome extension for a better experience:

- **One-click install** — no DevTools required.
- **Keyboard shortcut** — trigger export with `Ctrl + Shift + E` from anywhere.
- **Toolbar button** — export icon added directly to the side panel.
- **Multiple formats** — export as Markdown, JSON, or plain text.
- **Auto-backup** (stretch goal) — periodically save conversations to a configured cloud destination.

Planned file structure:

```
extension/
├── manifest.json
├── background.js          # Listens for keyboard shortcut
├── content_script.js      # Injected into the side panel
├── popup.html             # Optional toolbar popup UI
└── icons/
```

---

## Contributing

Contributions are welcome. The main areas where help would be valuable:

- **Selector updates** — Claude's UI classes change frequently; PRs that fix or extend the selectors are especially useful.
- **Format additions** — JSON and TXT export in the snippet before the extension lands.
- **Testing** — reports of broken exports with the DOM structure that caused them.

---

## License

MIT
