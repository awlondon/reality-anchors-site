#!/usr/bin/env python3
"""Export PNG brand assets from SVG sources without committing binaries.

Requires playwright + chromium:
  python -m pip install playwright
  python -m playwright install chromium

Usage:
  python scripts/export_brand_pngs.py --base-url http://127.0.0.1:4173
"""

from __future__ import annotations

import argparse
import asyncio
from dataclasses import dataclass
from pathlib import Path

from playwright.async_api import async_playwright


@dataclass(frozen=True)
class ExportTarget:
    source_path: str
    output_path: str
    width: int
    height: int


TARGETS = [
    ExportTarget(
        source_path="assets/brand/svg/reality_anchors_limited_wordmark.svg",
        output_path="assets/brand/reality-anchors-lockup.png",
        width=1200,
        height=600,
    ),
    ExportTarget(
        source_path="assets/brand/svg/reality_anchors_limited_wordmark.svg",
        output_path="assets/brand/reality-anchors-lockup-dark.png",
        width=1200,
        height=600,
    ),
    ExportTarget(
        source_path="assets/brand/svg/reality_anchors_favicon.svg",
        output_path="assets/brand/favicon-light.png",
        width=512,
        height=512,
    ),
    ExportTarget(
        source_path="assets/brand/svg/reality_anchors_favicon_dark.svg",
        output_path="assets/brand/favicon-dark.png",
        width=512,
        height=512,
    ),
    ExportTarget(
        source_path="assets/brand/svg/reality_anchors_favicon.svg",
        output_path="assets/brand/apple-touch-icon.png",
        width=512,
        height=512,
    ),
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--base-url",
        required=True,
        help="Base URL where this repo is being served (e.g. http://127.0.0.1:4173)",
    )
    return parser.parse_args()


async def export_pngs(base_url: str) -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        for target in TARGETS:
            source_url = f"{base_url.rstrip('/')}/{target.source_path}"
            output_file = Path(target.output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            await page.set_viewport_size({"width": target.width, "height": target.height})
            await page.set_content(
                (
                    "<!doctype html><html><body style='margin:0;background:transparent'>"
                    f"<img src='{source_url}' style='width:{target.width}px;height:{target.height}px;"
                    "display:block;object-fit:contain' />"
                    "</body></html>"
                )
            )
            await page.wait_for_timeout(250)
            await page.screenshot(path=str(output_file), omit_background=True)
            print(f"exported {output_file}")

        await browser.close()


def main() -> None:
    args = parse_args()
    asyncio.run(export_pngs(args.base_url))


if __name__ == "__main__":
    main()
