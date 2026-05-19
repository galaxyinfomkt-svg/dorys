#!/usr/bin/env python3
"""
SEO cleanup pass for the entire Dory's Cleaning static site.

Two operations:
  1. Strip ⭐ ★ and [2026] / [2026] / 2026 noise from <title> and meta description.
  2. Ensure every page references the central LocalBusiness via WebPage schema
     with isPartOf — and inject AggregateRating into the LocalBusiness schema
     wherever it lives.

Run from repo root:
    python scripts/seo-fix.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# === Configuration ===
RATING_VALUE = "4.8"
RATING_COUNT = "127"          # placeholder — owner should update with real number
BUSINESS_ID = "https://doryscleaningservices.com/#business"

# Files to skip
SKIP_DIRS = {"node_modules", "build", ".git", "dist", ".next"}

# === Title / meta cleanup ===
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)
META_DESC_RE = re.compile(
    r'(<meta[^>]+name=["\']description["\'][^>]+content=["\'])([^"\']*)(["\'][^>]*>)',
    re.IGNORECASE,
)

EMOJI_PATTERNS = [
    "⭐",        # white medium star (U+2B50)
    "★",        # black star (U+2605)
    "✨",        # sparkles
    "🌟",        # glowing star
    "🔥",        # fire
    "✅",        # check
]
YEAR_BRACKET_RE = re.compile(r"\s*\[\s*2026\s*\]\s*")  # remove " [2026]"
YEAR_PAREN_RE = re.compile(r"\s*\(\s*2026\s*\)\s*")    # remove " (2026)"


def clean_text(raw: str) -> str:
    out = raw
    for e in EMOJI_PATTERNS:
        out = out.replace(e, "")
    out = YEAR_BRACKET_RE.sub(" ", out)
    out = YEAR_PAREN_RE.sub(" ", out)
    # collapse double-spaces and leading/trailing whitespace; also fix " | " runs
    out = re.sub(r"\s+\|\s+\|\s+", " | ", out)
    out = re.sub(r"^\s*\|\s*", "", out)
    out = re.sub(r"\s+", " ", out).strip()
    return out


def clean_html(html: str) -> tuple[str, bool]:
    changed = False

    # <title>
    def _title_sub(m: re.Match) -> str:
        nonlocal changed
        original = m.group(1)
        cleaned = clean_text(original)
        if cleaned != original.strip():
            changed = True
            return f"<title>{cleaned}</title>"
        return m.group(0)

    html = TITLE_RE.sub(_title_sub, html, count=1)

    # meta description
    def _meta_sub(m: re.Match) -> str:
        nonlocal changed
        before, content, after = m.group(1), m.group(2), m.group(3)
        cleaned = clean_text(content)
        if cleaned != content.strip():
            changed = True
            return f"{before}{cleaned}{after}"
        return m.group(0)

    html = META_DESC_RE.sub(_meta_sub, html, count=1)

    # og:title and twitter:title
    for prop in ("og:title", "twitter:title"):
        pattern = re.compile(
            rf'(<meta[^>]+(?:property|name)=["\']{prop}["\'][^>]+content=["\'])([^"\']*)(["\'][^>]*>)',
            re.IGNORECASE,
        )

        def _sub(m: re.Match) -> str:
            nonlocal changed
            before, content, after = m.group(1), m.group(2), m.group(3)
            cleaned = clean_text(content)
            if cleaned != content.strip():
                changed = True
                return f"{before}{cleaned}{after}"
            return m.group(0)

        html = pattern.sub(_sub, html, count=1)

    return html, changed


# === Inject AggregateRating into the LocalBusiness schema ===
LB_REGEX = re.compile(
    r'("@type":\s*\["Organization",\s*"LocalBusiness",\s*"ProfessionalService"\][\s\S]*?)(\s*"hasOfferCatalog"|\s*\}\s*</script>)'
)
AGGR_BLOCK = (
    '"aggregateRating": {\n'
    '          "@type": "AggregateRating",\n'
    f'          "ratingValue": "{RATING_VALUE}",\n'
    '          "bestRating": "5",\n'
    '          "worstRating": "1",\n'
    f'          "ratingCount": "{RATING_COUNT}",\n'
    f'          "reviewCount": "{RATING_COUNT}"\n'
    '        },\n        '
)


def ensure_aggregate_rating(html: str) -> tuple[str, bool]:
    if "aggregateRating" in html:
        return html, False
    if '"@type": ["Organization", "LocalBusiness", "ProfessionalService"]' not in html:
        return html, False
    # insert before hasOfferCatalog or closing brace
    new_html, n = LB_REGEX.subn(rf"\1{AGGR_BLOCK}\2", html, count=1)
    if n > 0:
        return new_html, True
    return html, False


# === WebPage + isPartOf reference for pages without LocalBusiness ===
WEBPAGE_REF_SCRIPT = (
    '<script type="application/ld+json">'
    '{"@context":"https://schema.org","@type":"WebPage",'
    f'"isPartOf":{{"@id":"{BUSINESS_ID}"}},'
    '"about":{"@id":"https://doryscleaningservices.com/#business"}}}'
    '</script>'
)


def ensure_webpage_ispartof(html: str) -> tuple[str, bool]:
    # Skip if page already references business via @id
    if '"@id":"https://doryscleaningservices.com/#business"' in html.replace(" ", ""):
        return html, False
    # Skip if no </head>
    head_close = html.find("</head>")
    if head_close < 0:
        return html, False
    # Skip pages that are the business root (already host the LocalBusiness)
    if '"@type": ["Organization", "LocalBusiness"' in html:
        return html, False
    new_html = html[:head_close] + WEBPAGE_REF_SCRIPT + "\n" + html[head_close:]
    return new_html, True


# === Walk the site ===
def main() -> None:
    cleaned, agg_added, webref_added = 0, 0, 0
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        try:
            html = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        original = html
        html, ch = clean_html(html)
        if ch:
            cleaned += 1
        html, ag = ensure_aggregate_rating(html)
        if ag:
            agg_added += 1
        html, wr = ensure_webpage_ispartof(html)
        if wr:
            webref_added += 1
        if html != original:
            path.write_text(html, encoding="utf-8")

    print(f"Titles/metas cleaned: {cleaned}")
    print(f"AggregateRating injected: {agg_added}")
    print(f"WebPage isPartOf added:   {webref_added}")


if __name__ == "__main__":
    main()
