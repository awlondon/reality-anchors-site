# Brand binary generation

This website references PNG brand binaries at these paths:

- `reality-anchors-lockup.png`
- `reality-anchors-lockup-dark.png`
- `favicon-light.png`
- `favicon-dark.png`
- `apple-touch-icon.png`

These files are intentionally not committed in this repository.

## Generate PNGs from SVG sources

1. Serve the repo root locally:
   - `python -m http.server 4173`
2. In a second terminal, run:
   - `python scripts/export_brand_pngs.py --base-url http://127.0.0.1:4173`

### Script requirements

- Python package: `playwright`
- Browser runtime: Chromium installed via Playwright

Install example:

- `python -m pip install playwright`
- `python -m playwright install chromium`
