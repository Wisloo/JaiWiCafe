# Changelog

All notable changes to this project are documented here.
This project follows [Keep a Changelog](https://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-10-17

### Added
- Point-of-sale interface: category menu, current order, cash checkout, receipt
- Order history (last 200 sales) with reprint
- Settings panel: store name, tagline, tax rate, receipt footer
- Local persistence for the in-progress order, running order number, history and
  settings
- Self-hosted web fonts (Lora, Roboto, JetBrains Mono) bundled for offline use
- Menu images bundled locally under `public/menu/`
- Asset download scripts: `images:download`, `fonts:download`, `assets:download`
- Windows NSIS installer build via `electron:build`

