"""
Extract each static location HTML page into a JSON data file the
Next.js dynamic route can consume. The Next.js page then renders the
JSON via React's `dangerouslySetInnerHTML` for the main content while
metadata + JSON-LD are mounted natively.

Why JSON intermediate rather than parsing HTML at build time:
  - Build-time-stable artifacts under version control
  - JSON loads cleanly in TypeScript with full type safety
  - Easier to iterate the migration in batches

Source: locations/{slug}.html  (295 city pages + 1 index hub)
Output: data/locations/{slug}.json  (one per city)

Each output JSON contains:
  slug             "boston-ma"
  city             "Boston"
  title            "<title> text"
  description      <meta description>
  aiSummary        <meta ai-summary>
  canonical        full URL
  ogTitle, ogDescription, ogImage, ogUrl, ogLocale, ogSiteName, ogType
  twitterTitle, twitterDescription, twitterImage, twitterCard
  geoRegion, geoPlacename
  robots
  schemas          [...]  array of parsed JSON-LD objects
  mainHtml         the raw HTML between <main id="main-content"> and
                   </main>, NOT including the <main> tag itself
"""

import json
import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
SRC = ROOT / "locations"
OUT = ROOT / "data" / "locations"
OUT.mkdir(parents=True, exist_ok=True)


def slug_to_city(slug: str) -> str:
    parts = slug.replace(".html", "").split("-")
    if parts[-1].lower() == "ma":
        parts = parts[:-1]
    return " ".join(p.capitalize() for p in parts)


META_NAME_RE = re.compile(
    r'<meta\s+name="([^"]+)"\s+content="([^"]*)"\s*/?>', re.IGNORECASE
)
META_PROP_RE = re.compile(
    r'<meta\s+property="([^"]+)"\s+content="([^"]*)"\s*/?>', re.IGNORECASE
)
TITLE_RE = re.compile(r"<title>([^<]*)</title>", re.IGNORECASE | re.DOTALL)
CANONICAL_RE = re.compile(
    r'<link\s+rel="canonical"\s+href="([^"]+)"', re.IGNORECASE
)
JSONLD_RE = re.compile(
    r'<script\s+type="application/ld\+json">\s*(\{.*?\}|\[.*?\])\s*</script>',
    re.IGNORECASE | re.DOTALL,
)
MAIN_RE = re.compile(
    r'<main\s+id="main-content"[^>]*>(.*?)</main>',
    re.IGNORECASE | re.DOTALL,
)


def extract_meta(html: str) -> dict:
    name_meta = {m.group(1).lower(): m.group(2) for m in META_NAME_RE.finditer(html)}
    prop_meta = {m.group(1).lower(): m.group(2) for m in META_PROP_RE.finditer(html)}
    title_m = TITLE_RE.search(html)
    canonical_m = CANONICAL_RE.search(html)
    return {
        "title": (title_m.group(1).strip() if title_m else ""),
        "description": name_meta.get("description", ""),
        "aiSummary": name_meta.get("ai-summary", ""),
        "keywords": name_meta.get("keywords", ""),
        "robots": name_meta.get("robots", "index, follow"),
        "geoRegion": name_meta.get("geo.region", ""),
        "geoPlacename": name_meta.get("geo.placename", ""),
        "canonical": canonical_m.group(1) if canonical_m else "",
        "ogType": prop_meta.get("og:type", "website"),
        "ogUrl": prop_meta.get("og:url", ""),
        "ogTitle": prop_meta.get("og:title", ""),
        "ogDescription": prop_meta.get("og:description", ""),
        "ogImage": prop_meta.get("og:image", ""),
        "ogLocale": prop_meta.get("og:locale", "en_US"),
        "ogSiteName": prop_meta.get("og:site_name", "Dory's Cleaning Services"),
        "twitterCard": name_meta.get("twitter:card", "summary_large_image"),
        "twitterTitle": name_meta.get("twitter:title", ""),
        "twitterDescription": name_meta.get("twitter:description", ""),
        "twitterImage": name_meta.get("twitter:image", ""),
    }


def extract_schemas(html: str) -> list:
    out = []
    for m in JSONLD_RE.finditer(html):
        raw = m.group(1).strip()
        try:
            out.append(json.loads(raw))
        except json.JSONDecodeError:
            # Schema can be slightly malformed; skip but record what we saw
            continue
    return out


def extract_main(html: str) -> str:
    m = MAIN_RE.search(html)
    return m.group(1).strip() if m else ""


written = 0
no_main = []

for path in sorted(SRC.glob("*.html")):
    slug = path.stem  # e.g. "boston-ma"
    html = path.read_text(encoding="utf-8")
    meta = extract_meta(html)
    schemas = extract_schemas(html)
    main_html = extract_main(html)
    if not main_html and path.name != "index.html":
        no_main.append(slug)
        continue
    record = {
        "slug": slug,
        "city": slug_to_city(slug) if path.name != "index.html" else "All Cities",
        **meta,
        "schemas": schemas,
        "mainHtml": main_html,
    }
    out_path = OUT / f"{slug}.json"
    out_path.write_text(json.dumps(record, ensure_ascii=False), encoding="utf-8")
    written += 1


# Index of all city slugs for generateStaticParams
all_slugs = sorted(
    p.stem for p in OUT.glob("*.json") if p.stem != "index"
)
(ROOT / "data" / "locations-index.json").write_text(
    json.dumps(all_slugs), encoding="utf-8"
)


print(f"location JSON files written: {written}")
print(f"location-index.json slugs:    {len(all_slugs)}")
if no_main:
    print(f"missing <main>:               {len(no_main)}")
    for s in no_main[:5]:
        print(f"  - {s}")
