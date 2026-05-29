"""
Wave 3 — Article schema upgrade across 20 blog posts.

Three changes per post:

  1) headline → sync to current <h1>. Batch 2 rewrote 10 H1s but the
     Article.headline JSON-LD still pointed at the old (mismatched)
     H1, telling Google "this article is about X" while the page
     itself was about Y. Mismatch = ranking penalty.

  2) author → switch from Organization to Person (Jeneva Thomas) for
     E-A-T. Healthcare topics specifically reward author authority;
     Google's Quality Rater Guidelines call this out for YMYL
     (your-money-your-life) content like infection control.

  3) dateModified → bump to today (2026-05-29). Freshness signal.
     Old dateModified makes Google prefer competitors' newer posts.
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
BLOG = ROOT / "blog"
TODAY = "2026-05-29"

H1_RE = re.compile(r'<h1[^>]*>([^<]+)</h1>', re.IGNORECASE)

# Locate the Article block (multi-line indented JSON) and extract its slice.
ARTICLE_BLOCK_RE = re.compile(
    r'(<script type="application/ld\+json">\s*\{\s*"@context":\s*"https://schema\.org",\s*"@type":\s*"Article",.*?\}\s*</script>)',
    re.DOTALL,
)

# Field-level patches
HEADLINE_RE = re.compile(r'("headline":\s*")[^"]+(")')
DATE_MOD_RE = re.compile(r'("dateModified":\s*")[^"]+(")')
AUTHOR_BLOCK_RE = re.compile(
    r'"author":\s*\{[^}]*"@type":\s*"Organization"[^}]*\}',
    re.DOTALL,
)
NEW_AUTHOR = (
    '"author": {'
    '"@type": "Person",'
    '"@id": "https://doryscleaningservices.com/#founder",'
    '"name": "Jeneva Thomas",'
    '"jobTitle": "Founder & CEO, Dory\'s Cleaning Services Inc.",'
    '"url": "https://doryscleaningservices.com/about",'
    '"knowsAbout": ["Healthcare facility cleaning","Infection control","CDC environmental cleaning guidelines","OSHA bloodborne pathogen compliance","HIPAA-aware environmental services"]'
    '}'
)

fixed_headline = 0
fixed_author = 0
fixed_date = 0
skipped = []

for html in sorted(BLOG.glob("*.html")):
    if html.name == "index.html":
        continue
    text = html.read_text(encoding="utf-8")

    h1_m = H1_RE.search(text)
    if not h1_m:
        skipped.append(f"{html.name} (no <h1>)")
        continue
    current_h1 = h1_m.group(1).strip()

    art_m = ARTICLE_BLOCK_RE.search(text)
    if not art_m:
        skipped.append(f"{html.name} (no Article block)")
        continue
    art_block = art_m.group(1)
    new_block = art_block

    # 1) headline sync
    new_block, n = HEADLINE_RE.subn(
        rf'\g<1>{current_h1}\g<2>', new_block, count=1
    )
    if n:
        fixed_headline += 1

    # 2) author → Person
    new_block, n = AUTHOR_BLOCK_RE.subn(NEW_AUTHOR, new_block, count=1)
    if n:
        fixed_author += 1

    # 3) dateModified bump
    new_block, n = DATE_MOD_RE.subn(rf'\g<1>{TODAY}\g<2>', new_block, count=1)
    if n:
        fixed_date += 1

    if new_block != art_block:
        new_text = text.replace(art_block, new_block, 1)
        html.write_text(new_text, encoding="utf-8")

print(f"blog posts processed: {len(list(BLOG.glob('*.html'))) - 1}")
print(f"  headline synced to H1: {fixed_headline}")
print(f"  author swapped to Person/Jeneva: {fixed_author}")
print(f"  dateModified bumped to {TODAY}: {fixed_date}")
if skipped:
    print(f"  skipped: {skipped}")
