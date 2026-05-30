"""
Session 4 of the Next.js migration. Extracts:

  - blog/*.html (20 posts + blog/index.html hub) -> data/blog/{slug}.json
  - root *.html EXCEPT index.html / 404.html / 500.html  -> data/pages/{slug}.json

`index.html` already has a hand-built React page (app/page.tsx).
`404.html` / `500.html` are replaced by Next.js's built-in error pages
(app/not-found.tsx already exists).

After this script runs the migration scripts can generate
  app/blog/page.tsx
  app/blog/[slug]/page.tsx
  app/{slug}/page.tsx  (one per root page)
"""

import json
import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")

BLOG_OUT = ROOT / "data" / "blog"
PAGES_OUT = ROOT / "data" / "pages"
BLOG_OUT.mkdir(parents=True, exist_ok=True)
PAGES_OUT.mkdir(parents=True, exist_ok=True)

SKIP_ROOT = {"index.html", "404.html", "500.html"}


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
# Fallback for pages where <main> id is named differently (e.g. blog)
ARTICLE_FALLBACK_RE = re.compile(
    r'<main[^>]*>(.*?)</main>',
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
    if not main_m:
        main_m = ARTICLE_FALLBACK_RE.search(html)
    main_html = main_m.group(1).strip() if main_m else ""

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
        "mainHtml": main_html,
    }


# --------- Blog ----------------------------------------------------------
blog_slugs: list[str] = []
for path in sorted((ROOT / "blog").glob("*.html")):
    rec = extract(path.read_text(encoding="utf-8"))
    rec["slug"] = path.stem
    (BLOG_OUT / f"{path.stem}.json").write_text(
        json.dumps(rec, ensure_ascii=False), encoding="utf-8"
    )
    if path.stem != "index":
        blog_slugs.append(path.stem)

(ROOT / "data" / "blog-index.json").write_text(
    json.dumps(sorted(blog_slugs)), encoding="utf-8"
)

# --------- Root pages ----------------------------------------------------
root_slugs: list[str] = []
for path in sorted(ROOT.glob("*.html")):
    if path.name in SKIP_ROOT:
        continue
    rec = extract(path.read_text(encoding="utf-8"))
    rec["slug"] = path.stem
    (PAGES_OUT / f"{path.stem}.json").write_text(
        json.dumps(rec, ensure_ascii=False), encoding="utf-8"
    )
    root_slugs.append(path.stem)

(ROOT / "data" / "pages-index.json").write_text(
    json.dumps(sorted(root_slugs)), encoding="utf-8"
)

print(f"blog posts:  {len(blog_slugs)} (+ index)")
print(f"root pages:  {len(root_slugs)}")
print(f"root slugs:  {root_slugs}")
