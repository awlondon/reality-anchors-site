# Brand binary placeholders

This folder is the canonical location for production brand binaries referenced by the website:

- `reality-anchors-lockup.png`
- `reality-anchors-lockup-dark.png`
- `favicon-light.ico`
- `favicon-dark.ico`
- `apple-touch-icon.png`

Codex has updated HTML/CSS references to these paths.

## Manual export workflow (binary files are not stored in this repo)

1. Export PNG/ICO assets locally from `assets/brand/svg/` source files.
2. Place generated binaries into this folder.
3. Provide these binaries at deploy time (artifact step/CDN/static host upload), keeping Git source-only.
