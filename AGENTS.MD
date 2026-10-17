# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

JaiWiCafe — a coffee shop **point-of-sale (POS)** app packaged as an **offline
desktop application** with Vite + React + Tailwind CSS v4 + Electron. Menu
photography and web fonts are bundled locally so it runs without internet.

### Commands
- `npm install` — install dependencies
- `npm run dev` — web dev server (http://localhost:5173)
- `npm run build` — production web build to `dist/`
- `npm run preview` — serve the production web build
- `npm run electron:dev` — run Electron + Vite dev server together
- `npm run electron:build` — build `dist/` and package the Windows NSIS installer to `release/`
- `npm run images:download` — fetch menu images into `public/menu/`
- `npm run fonts:download` — fetch web fonts into `src/assets/fonts/` + write `src/fonts.css`
- `npm run assets:download` — run both download scripts

### Structure
- `electron/main.js` — Electron main process (loads the Vite dev URL, or `dist/` when packaged)
- `build/icon.ico` — app icon (16–256px), used by electron-builder
- `release/` — packaged output: `JaiWiCafe Setup <version>.exe` + `win-unpacked/`
- `scripts/` — Node asset-download scripts (images, fonts)
- `public/menu/` — bundled menu images (offline)
- `src/assets/fonts/` — bundled woff2 web fonts (offline)
- `src/fonts.css` — generated `@font-face` rules (do not edit by hand)
- `src/components/pos/` — PosHeader, PosMenu, PosOrder, PosCheckout, PosReceipt, PosHistory, PosSettings
- `src/components/icons.jsx` — inline SVG icon set (no emojis in UI)
- `src/data/menu.js` — menu items and categories
- `src/data/pos.js` — `computeTotals`, `round2`, history (de)serialization
- `src/data/settings.js` — default settings + `HISTORY_LIMIT`
- `src/utils/storage.js` — namespaced localStorage wrapper with in-memory fallback
- `src/utils/usePersistentState.js` — `useState` + auto-persist hook
- `src/index.css` — Tailwind v4 `@theme` design tokens + `@layer components` classes
  (warm-bg, warm-rule, btn-primary, btn-ghost, card-warm, field-warm, chip-warm).
  Palette: caramel, cinnamon, croissant, latte, cream, parchment, roast, espresso,
  linen (warm artisanal coffee theme, see `design.md`)
- Fonts: Lora (display/body), Roboto (accent), JetBrains Mono (metadata) — self-hosted

### State & persistence
- Order, order number, history and settings persist via `usePersistentState`
  (namespaced localStorage keys `jaiwicafe:*`). History is capped at `HISTORY_LIMIT`.
- Receipts store a `meta` snapshot (store name, tagline, footer, tax rate) so
  reprints stay accurate.

### Electron notes
- `vite.config.js` sets `base: "./"` so `file://` loading works from `dist/`.
- `server.port` is `strictPort: true` on 5173 — `wait-on tcp:5173` in `electron:dev` depends on it.
- Main process security: `contextIsolation: true`, `nodeIntegration: false`,
  `sandbox: true`. Add a `preload.js` before any `ipcRenderer` work.
- `JAIWI_FORCE_FILE=1` env var makes dev Electron load `dist/` instead of the dev server
  (useful for testing the packaged path).

Note: Tailwind v4 uses `bg-linear-to-*` (not `bg-gradient-to-*`) and `@import "tailwindcss"`.

Avoid PowerShell `Set-Content` on source files — it defaults to ANSI and will mangle UTF-8
(emojis → `?`). Use the Write/Edit tools instead.



## Free AI design prompt resources

Use these when generating UI/UX designs, mockups, or component layouts. All are free.

### Prompt libraries
- Awesome ChatGPT Prompts — https://github.com/f/awesome-chatgpt-prompts
- FlowGPT — https://flowgpt.com
- PromptHero — https://prompthero.com
- Learn Prompting — https://learnprompting.org
- Anthropic Prompt Library — https://docs.anthropic.com
- OpenAI Cookbook — https://cookbook.openai.com

### Free UI/web builders with community prompts
- v0.dev — https://v0.dev (free tier, public community prompts)
- Bolt.new — https://bolt.new (free tokens, shared projects)
- Lovable — https://lovable.dev (free tier)
- Cursor Directory — https://cursor.directory (free rules/prompts)
- Uizard — https://uizard.io (free tier, UI + mobile mockups)
- Visily — https://visily.ai (free tier)

### GitHub prompt packs (search)
- `awesome-ai-design`, `awesome-prompts`, `ui-prompts`, `system-prompts`

### Free design reference (turn into prompts)
- Mobbin, Dribbble, Figma Community
- Material 3 — https://m3.material.io
- Apple HIG — https://developer.apple.com/design/human-interface-guidelines

## Reusable design prompt templates

Fill in the `[bracketed]` placeholders. Keep prompts specific about layout, spacing,
typography, color, and interaction states.

### Web (desktop-first / responsive)
```
You are a senior product designer and frontend engineer.
Design a [responsive web page / component] for a [cafe / e-commerce / dashboard]
called [JaiWiCafe].

Requirements:
- Layout: [header, hero, grid, footer], max content width [1200px], [12]-column grid
- Style: [minimal / warm / editorial], color palette [hex values], font [e.g. Inter]
- Spacing scale: 4/8/16/24/32/48px
- Breakpoints: mobile 375px, tablet 768px, desktop 1280px
- Accessibility: WCAG AA contrast, keyboard focus states, semantic HTML
- Output: production-ready [React + Tailwind] markup with hover/active/focus states

Show the component hierarchy first, then the code.
```

### Desktop app
```
You are a senior desktop UX designer.
Design a [native / Electron / Tauri] desktop application window for [purpose].

Requirements:
- Window: [1280x800] default, resizable, min [960x600]
- Chrome: [custom title bar / native], menu bar, toolbar
- Layout: [sidebar 240px] + [main content] + [optional right panel]
- Interactions: keyboard shortcuts, right-click context menus, drag-and-drop
- States: empty, loading, error, populated, selected
- Follow [Windows Fluent / macOS HIG] conventions
- Output: [C#/WPF, Electron+React, or Tauri] structure with component breakdown
```

### Mobile
```
You are a senior mobile product designer.
Design a mobile app screen for [iOS / Android / cross-platform Flutter] for [purpose].

Requirements:
- Device: [390x844 iPhone 15] safe areas respected
- Navigation: [bottom tab bar / stack / drawer]
- Style: [Material 3 / Cupertino], colors [hex], typography [scale]
- Components: [list screens/components needed]
- Touch targets: min 44x44pt (iOS) / 48x48dp (Android)
- States: [default, pressed, disabled, loading, empty, error]
- Output: [SwiftUI / Jetpack Compose / Flutter] widget tree + code
```

### Design critique / iteration
```
Here is my current design: [paste code or describe].
Critique it against: hierarchy, spacing rhythm, contrast, consistency, accessibility.
List the top 5 issues by impact, then give specific fixes with exact values.
```

## Conventions

- Prefer free tools and resources.
- When proposing designs, state assumptions explicitly.
- No comments in generated code unless requested.
