# Installation Guide

This guide walks through every step needed to run the snippet and export a Claude in Chrome conversation. No prior developer experience is required.

---

## Prerequisites

Before you start, make sure you have all of the following:

1. **Google Chrome** — this tool does not work in other browsers (Edge, Firefox, Brave, etc.), even Chromium-based ones, due to side-panel API differences.
2. **Claude in Chrome extension** — install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn). You need a paid Claude plan (Pro, Max, Team, or Enterprise) to use it.
3. **An active conversation** — open the Claude side panel on any page and send at least one message before exporting.

---

## Step-by-step

### 1. Open an active conversation

Click the Claude icon in your Chrome toolbar to open the side panel. Start or resume a conversation. The snippet can only export what is currently rendered in the panel — it cannot reach into your claude.ai history.

### 2. Copy the snippet

Open the [`snippet.js`](../snippet.js) file in this repository. Select all of its contents and copy them to your clipboard.

If you are viewing this on GitHub, click the **Copy** button in the top-right corner of the code block.

### 3. Open Chrome DevTools Console

| Platform | Shortcut |
|---|---|
| Windows / Linux | `F12`, then click the **Console** tab |
| macOS | `Cmd + Option + J` (opens Console directly) |

> **Important:** Make sure DevTools is docked to the **bottom** or **right side** of the window. If it opens in a separate window, the Console will still work, but you need to make sure it is targeting the same tab where your Claude side panel is open.

### 4. Paste and run

Click inside the Console input line (the area next to the `>` prompt at the bottom of the Console panel). Paste the snippet and press **Enter**.

You may see a warning like:

> *Understand that pasting code you don't understand into this console can allow attackers to take over your browser session...*

This is a standard Chrome safety warning. It appears for any code pasted into the Console. Since this snippet runs entirely locally and never sends data anywhere, it is safe to proceed. Click **Understand** if prompted.

### 5. Confirm the download

A Markdown file downloads automatically to your default downloads folder. The filename includes a timestamp so you can sort and identify exports easily:

```
claude-conversation-2025-01-31T14-30-00.md
```

A confirmation alert also appears in the browser.

### 6. Open the exported file

You can open the `.md` file with any of these tools:

| Tool | How |
|---|---|
| **VS Code** | `File → Open File`, or drag and drop. Markdown renders in the preview pane (`Ctrl + Shift + V`). |
| **GitHub** | Push it to a repo — GitHub renders `.md` files automatically. |
| **Obsidian** | Drop it into your vault. It appears immediately in your note list. |
| **Any text editor** | The raw Markdown is plain text and fully readable without rendering. |

---

## Troubleshooting

### "The exported file is empty or only contains the header"

The snippet could not find any conversation content in the DOM. This usually means:

- The side panel has no active conversation loaded. Make sure you have sent at least one message.
- Claude's UI was recently updated and the CSS class names changed. Open an issue on this repo with a screenshot of the side panel and the browser's DOM inspector open on a message element.

### "I only see a few messages, not the full conversation"

The side panel may be using **virtualized rendering** — only messages currently visible in the viewport are present in the DOM. Try scrolling through the entire conversation before running the snippet, so that all messages are rendered.

### "The export worked but the User/Claude labels are wrong"

The role detection relies on CSS class heuristics. If Claude's UI update changed the relevant classes, the labels may misfire. The content itself is still captured. Open an issue with the incorrect output and a DOM snapshot so the selectors can be updated.

### "Chrome stripped my paste"

Chrome sometimes removes the leading `javascript:` text if you paste into the **address bar** instead of the Console. Always paste into the **Console tab** inside DevTools, never the address bar.

---

## Next steps

Once you are comfortable with the snippet workflow, keep an eye on the [roadmap](../README.md#roadmap) — a full Chrome extension with one-click export, keyboard shortcuts, and multi-format support is planned for Phase 2.
