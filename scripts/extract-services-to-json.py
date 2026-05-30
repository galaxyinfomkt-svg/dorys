"""
Same extraction pattern as `extract-locations-to-json.py`, applied to
the services tree (5 categories x 297 HTML files = 1,485 pages plus
services/index.html = 1,486).

Output layout
  data/services/index.json                       — overall services hub
  data/services/{category}/index.json            — 5 category hubs (indexable)
  data/services/{category}/{city-slug}.json      — 1,480 noindexed
                                                   service-city pages

Index files written for generateStaticParams:
  data/services-categories.json   ["ambulatory-outpatient", ...]
  data/services-cities.json       { "ambulatory-outpatient": [
                                      "abington-ma", "acton-ma", ...
                                    ], ... }
"""

import json
import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
SRC = ROOT / "services"
OUT = ROOT / "data" / "services"
OUT.mkdir(parents=True, exist_ok=True)


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


def extract(html: str) -> dict:
    name_meta = {m.group(1).lower(): m.group(2) for m in META_NAME_RE.finditer(html)}
    prop_meta = {m.group(1).lower(): m.group(2) for m in META_PROP_RE.finditer(html)}
    title_m = TITLE_RE.search(html)
    canonical_m = CANONICAL_RE.search(html)

    schemas = []
    for m in JSONLD_RE.finditer(html):
        try:
            schemas.append(json.loads(m.group(1).strip()))
        except json.JSONDecodeError:
            continue

    main_m = MAIN_RE.search(html)
    return {
        "title": title_m.group(1).strip() if title_m else "",
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
        "schemas": schemas,
        "mainHtml": main_m.group(1).strip() if main_m else "",
    }


def slug_to_city(slug: str) -> str:
    parts = slug.split("-")
    if parts[-1].lower() == "ma":
        parts = parts[:-1]
    return " ".join(p.capitalize() for p in parts)


def category_label(slug: str) -> str:
    return " ".join(p.capitalize() for p in slug.split("-"))


# 1) services/index.html
top_index = SRC / "index.html"
if top_index.exists():
    rec = extract(top_index.read_text(encoding="utf-8"))
    rec["slug"] = "index"
    (OUT / "index.json").write_text(json.dumps(rec, ensure_ascii=False), encoding="utf-8")

categories: list[str] = []
city_index: dict[str, list[str]] = {}
wrote_hub = 0
wrote_city = 0
missing_main = []

for cat_dir in sorted(p for p in SRC.iterdir() if p.is_dir()):
    cat_slug = cat_dir.name
    categories.append(cat_slug)
    out_cat = OUT / cat_slug
    out_cat.mkdir(parents=True, exist_ok=True)

    # category hub
    hub = cat_dir / "index.html"
    if hub.exists():
        rec = extract(hub.read_text(encoding="utf-8"))
        rec["slug"] = cat_slug
        rec["category"] = cat_slug
        rec["categoryLabel"] = category_label(cat_slug)
        if not rec["mainHtml"]:
            missing_main.append(f"{cat_slug}/index.html")
        (out_cat / "index.json").write_text(json.dumps(rec, ensure_ascii=False), encoding="utf-8")
        wrote_hub += 1

    # 296 city pages per category
    city_index[cat_slug] = []
    for html in sorted(cat_dir.glob("*.html")):
        if html.name == "index.html":
            continue
        slug = html.stem  # e.g. "abington-ma"
        rec = extract(html.read_text(encoding="utf-8"))
        rec["slug"] = slug
        rec["category"] = cat_slug
        rec["categoryLabel"] = category_label(cat_slug)
        rec["city"] = slug_to_city(slug)
        if not rec["mainHtml"]:
            missing_main.append(f"{cat_slug}/{slug}")
            continue
        (out_cat / f"{slug}.json").write_text(json.dumps(rec, ensure_ascii=False), encoding="utf-8")
        city_index[cat_slug].append(slug)
        wrote_city += 1

# Index files for generateStaticParams
(ROOT / "data" / "services-categories.json").write_text(
    json.dumps(sorted(categories)), encoding="utf-8"
)
(ROOT / "data" / "services-cities.json").write_text(
    json.dumps({k: sorted(v) for k, v in city_index.items()}, ensure_ascii=False), encoding="utf-8"
)

print(f"category hubs:          {wrote_hub}/5")
print(f"service-city pages:     {wrote_city}")
print(f"missing main (skipped): {len(missing_main)}")
for n in missing_main[:5]:
    print(f"  - {n}")
print(f"categories: {categories}")
