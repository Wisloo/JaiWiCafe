# JaiWiCafe POS

A small-batch coffee shop point-of-sale app, packaged as an **offline desktop
application** with Vite + React + Tailwind CSS v4 + Electron.

Everything it needs ships inside the installer: no internet connection required.

## Features

- Browse the menu by category and add items to an order
- Running order with quantity controls, subtotal, tax and total
- Cash checkout with a numeric keypad and quick-tender buttons
- Printable receipt
- **Order history** (last 200 sales) with reprint
- **Settings** — store name, tagline, tax rate and receipt footer
- **Local persistence** — in-progress order, order number, history and settings
  survive restarts (stored in the app's local storage)

## Requirements

- Windows 10/11 (the packaged target)
- [Node.js](https://nodejs.org/) 20+ (for development only)

## Getting started

```sh
npm install
npm run dev          # web dev server at http://localhost:5173
npm run electron:dev # Electron + Vite together (desktop dev)
```

## Building a downloadable installer

```sh
npm run electron:build
```

Outputs `release/JaiWiCafe Setup <version>.exe` (NSIS installer) and an unpacked
`release/win-unpacked/` folder. Share the `.exe` — no internet needed to run it.

## Assets

Menu photography and fonts are bundled locally so the app works offline.

```sh
npm run assets:download   # downloads both images and fonts
npm run images:download   # menu images  -> public/menu/
npm run fonts:download    # web fonts     -> src/assets/fonts/ + src/fonts.css
```

Both scripts are idempotent (existing files are skipped). Delete a file or its
folder to force a fresh download. See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for
image credits.

## Project structure

```
electron/main.js         Electron main process
scripts/                 Asset download scripts (images, fonts)
public/menu/             Bundled menu images
src/assets/fonts/        Bundled web fonts
src/fonts.css            Generated @font-face rules (self-hosted)
src/components/pos/      POS UI (header, menu, order, checkout, receipt, ...)
src/components/icons.jsx Inline SVG icon set
src/data/menu.js         Menu items and categories
src/data/pos.js          Totals + receipt (de)serialization
src/data/settings.js     Default settings + history limit
src/utils/storage.js     localStorage wrapper (safe fallback)
src/utils/usePersistentState.js  useState + auto-persist hook
src/index.css            Tailwind v4 theme tokens + component classes
```

## Notes

- `vite.config.js` sets `base: "./"` so the app loads from `file://` when packaged.
- Electron security: `contextIsolation: true`, `nodeIntegration: false`,
  `sandbox: true`. Add a `preload.js` before introducing any `ipcRenderer` work.
- `JAIWI_FORCE_FILE=1` makes dev Electron load `dist/` instead of the dev server.
