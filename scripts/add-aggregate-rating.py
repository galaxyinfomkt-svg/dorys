#!/usr/bin/env python3
"""
Inject a Service-scoped AggregateRating schema into every page that doesn't
already have one, so each indexed URL is eligible for ★4.8 stars in the SERP.

The block references the central business via `provider: { @id: #business }`,
so AggregateRating is properly anchored to the brand entity — not duplicated.

Run from repo root:
    python scripts/add-aggregate-rating.py
"""

from __future__ import annotations

import html as html_lib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

RATING_VALUE = "4.8"
RATING_COUNT = "127"  # owner to replace with the real Google reviews count

SKIP_DIRS = {"node_modules", "build", ".git", "dist", ".next", "scripts"}

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def derive_service_name(html: str, fname: str) -> str:
    m = TITLE_RE.search(html)
    if m:
        # Strip " | brand" trailing and any em-dash subtitle
        title = m.group(1).split("|")[0].split("—")[0].strip()
        # Light unescape for & etc.
        return html_lib.unescape(title)[:120]
    return fname.replace("-", " ").replace(".html", "").title()


def build_block(html: str, fname: str) -> str:
    service_name = derive_service_name(html, fname)
    return (
        '<script type="application/ld+json">'
        '{"@context":"https://schema.org",'
        '"@type":"Service",'
        f'"name":"{service_name}",'
        '"provider":{"@id":"https://doryscleaningservices.com/#business"},'
        '"areaServed":{"@type":"State","name":"Massachusetts"},'
        '"aggregateRating":{'
        '"@type":"AggregateRating",'
        f'"ratingValue":"{RATING_VALUE}",'
        '"bestRating":"5","worstRating":"1",'
        f'"ratingCount":"{RATING_COUNT}","reviewCount":"{RATING_COUNT}"'
        '}'
        '}</script>'
    )


def main() -> None:
    added = 0
    skipped_has_rating = 0
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        try:
            html = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if "aggregateRating" in html:
            skipped_has_rating += 1
            continue
        head_close = html.find("</head>")
        if head_close < 0:
            continue
        block = build_block(html, path.name)
        new_html = html[:head_close] + block + "\n" + html[head_close:]
        path.write_text(new_html, encoding="utf-8")
        added += 1

    print(f"Service+AggregateRating added: {added}")
    print(f"Skipped (already had rating): {skipped_has_rating}")


if __name__ == "__main__":
    main()
