# AI Accessibility Enhancer

A **Chrome extension** (Manifest V3) that uses AI to help users with visual, cognitive, and reading difficulties browse the web more easily. It adds four on-demand accessibility tools to any webpage via a clean popup interface.

---

## Features

**Alt Text Generator** — Scans images on the current page and generates descriptive alt text for any images that are missing it, improving the experience for screen-reader users.

**Simplify Text** — Rewrites complex or dense content on the page into plain, easy-to-read language, useful for users with cognitive disabilities or reading difficulties.

**Text-to-Speech** — Reads the page content aloud using the browser's speech synthesis API, with full playback controls (Pause, Resume, Stop) available directly in the popup.

**Analyse Accessibility** — Audits the current page for common accessibility issues and surfaces a results summary in the popup.

---

## Tech Stack

| Component | Technology |
|---|---|
| Extension platform | Chrome (Manifest V3) |
| Background logic | Service worker (`background.js`) |
| Page interaction | Content script (`content.js`) |
| UI | HTML/CSS/JS popup (`popup.html` + `popup.js`) |
| AI features | Powered via the background service worker (API calls to an AI model) |

---

## Project Structure

```
ai-accessibility-enhancer/
├── manifest.json       # Extension manifest (MV3) — permissions, icons, script registration
├── popup.html          # Extension popup UI — buttons and results panel
├── popup.js            # Popup logic — button handlers, messaging to content/background scripts
├── content.js          # Content script — runs on every page, performs DOM analysis and modifications
├── background.js       # Service worker — handles AI API calls and coordinates between popup and content scripts
├── content/            # Supporting content assets
├── icons/              # Extension icons (16px, 32px, 128px)
└── .gitignore
```

### File overview

**`manifest.json`** — Declares the extension's name, version, and permissions (`activeTab`, `scripting`, `storage`). Registers `content.js` to run at `document_start` on all URLs, and `background.js` as a module-type service worker.

**`popup.html`** — The extension's popup UI. Contains four action buttons (Alt Text Generator, Simplify Text, Text-to-Speech, Analyse Accessibility), a TTS controls row (Pause/Resume/Stop), and a results panel where output is displayed.

**`popup.js`** — Wires up the popup buttons; sends messages to the content script or background service worker to trigger each feature and renders results in the popup's results div.

**`content.js`** — Injected into every webpage. Responds to messages from the popup by reading and modifying the live DOM — extracting text, finding images, applying simplified text, and so on.

**`background.js`** — The extension's service worker. Handles communication that requires elevated permissions, such as making AI API calls, and relays results back to the popup.

---

## Installation (Developer Mode)

Since this extension isn't published to the Chrome Web Store, you'll need to load it manually:

1. Clone or download the repository:
   ```bash
   git clone https://github.com/aishwaryakore/ai-accessibility-enhancer.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **Load unpacked** and select the cloned repository folder.

5. The extension icon will appear in your toolbar. Click it on any webpage to open the popup.

---

## Usage

1. Navigate to any webpage in Chrome.
2. Click the **AI Accessibility Enhancer** icon in the toolbar.
3. Choose one of the four actions:
   - **Alt Text Generator** — generates alt text for images on the page.
   - **Simplify Text** — rewrites the page content in plain language.
   - **Text-to-Speech** — starts reading the page aloud; use Pause/Resume/Stop to control playback.
   - **Analyse Accessibility** — runs an accessibility audit and shows the findings in the results panel.

---

## Permissions

| Permission | Purpose |
|---|---|
| `activeTab` | Access the content of the currently active tab |
| `scripting` | Inject and execute scripts in the page |
| `storage` | Persist user settings across sessions |
| `host_permissions: <all_urls>` | Allow the extension to operate on any website |