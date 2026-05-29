"""
Add "Healthcare Cleaning in Nearby Cities" internal-linking block to each
of the 297 location pages.

Strategy:
  - Parse each /locations/{city}-ma.html to extract its county from
    the hero subtitle ("Serving {City} and {County} County...")
  - Group cities by county
  - For each city, pick 6 OTHER cities in the SAME county
    (deterministic alphabetical order — same set every build)
  - Inject a "Near Cities" section before the closing </main>

Why this matters:
  - Distributes PageRank across 297 city pages (currently each city is
    an "orphan" with no internal links from siblings)
  - Helps users discover nearby coverage
  - Crawl budget: Google can find more pages per crawl
  - Adds genuinely useful UX content (no manipulation)

Safety:
  - Idempotent: skip files that already contain the marker comment
  - Only modifies the /locations/ folder
  - Block is wrapped in a marker for easy removal/regeneration
"""

from pathlib import Path
import re

SITE = Path(r"c:/Users/Admin/Downloads/dorys")
LOCATIONS_DIR = SITE / "locations"
MARKER_START = "<!-- NEAR-CITIES:START -->"
MARKER_END = "<!-- NEAR-CITIES:END -->"

# Regex to pull the county from the hero subtitle.
COUNTY_RE = re.compile(
    r"Serving\s+[^<]+?\s+and\s+([A-Z][A-Za-z ]+?)\s+County",
    re.IGNORECASE,
)

# We inject just before </main>
INJECT_BEFORE = re.compile(r"(</main>)", re.IGNORECASE)


def slug_to_name(slug: str) -> str:
    """Convert 'arlington-heights-ma' -> 'Arlington Heights'"""
    parts = slug.replace("-ma", "").split("-")
    return " ".join(p.capitalize() for p in parts if p)


# ---------------------------------------------------------------------------
# Pass 1 — build city → county map
# ---------------------------------------------------------------------------
city_to_county: dict[str, str] = {}
files: list[Path] = sorted(LOCATIONS_DIR.glob("*-ma.html"))

for f in files:
    slug = f.stem  # e.g. "abington-ma"
    try:
        text = f.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    m = COUNTY_RE.search(text)
    if m:
        county = m.group(1).strip()
        city_to_county[slug] = county

# Group cities by county
county_to_cities: dict[str, list[str]] = {}
for slug, county in city_to_county.items():
    county_to_cities.setdefault(county, []).append(slug)
# Sort each county's list alphabetically (deterministic)
for k in county_to_cities:
    county_to_cities[k].sort()

print(f"Parsed {len(city_to_county)} cities across {len(county_to_cities)} counties")
for county, cities in sorted(county_to_cities.items()):
    print(f"  {county} County: {len(cities)} cities")


# ---------------------------------------------------------------------------
# Pass 2 — inject "Near Cities" block into each file
# ---------------------------------------------------------------------------
def build_block(current_slug: str, county: str, siblings: list[str]) -> str:
    """Build the HTML block of 6 nearby cities (same county, excl. current)."""
    others = [s for s in siblings if s != current_slug]
    # Pick 6 nearest by alphabetical proximity to current.
    current_idx = siblings.index(current_slug) if current_slug in siblings else 0
    # Window centered on the current city
    window: list[str] = []
    for delta in range(1, len(siblings)):
        if len(window) >= 6:
            break
        for sign in (-1, 1):
            j = current_idx + sign * delta
            if 0 <= j < len(siblings) and siblings[j] != current_slug:
                window.append(siblings[j])
                if len(window) >= 6:
                    break
    if not window:
        return ""

    items_html = "\n".join(
        f'        <li><a href="/locations/{s}" class="near-cities__link">'
        f'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">'
        f'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
        f'<span>{slug_to_name(s)}</span></a></li>'
        for s in window
    )
    current_name = slug_to_name(current_slug)
    return f"""\
{MARKER_START}
<section class="section near-cities" style="background:#f8fafc;padding:3rem 0;border-top:1px solid #e2e8f0;">
  <div class="container container--narrow">
    <h2 class="section__title" style="font-size:1.5rem;margin-bottom:0.5rem;color:#1e293b;">Healthcare Cleaning in Nearby Cities</h2>
    <p style="color:#475569;margin-bottom:1.5rem;font-size:0.95rem;">We also serve {county} County and neighboring areas around {current_name}:</p>
    <ul class="near-cities__list" style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.5rem;">
{items_html}
    </ul>
    <p style="margin-top:1.5rem;font-size:0.9rem;color:#64748b;">
      <a href="/locations/" style="color:#2b70e4;font-weight:600;text-decoration:none;">View all 297 Massachusetts service areas →</a>
    </p>
  </div>
</section>
{MARKER_END}"""


touched = 0
skipped_already = 0
skipped_no_county = 0
errors: list[str] = []

for f in files:
    slug = f.stem
    try:
        text = f.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        errors.append(f"{f}: read failed: {e}")
        continue

    if MARKER_START in text:
        skipped_already += 1
        continue
    county = city_to_county.get(slug)
    if not county:
        skipped_no_county += 1
        continue
    siblings = county_to_cities.get(county, [])
    if len(siblings) < 2:
        # Only city in its county — no near-cities to show
        continue

    block = build_block(slug, county, siblings)
    if not block:
        continue
    new_text, n = INJECT_BEFORE.subn(rf"{block}\n \1", text, count=1)
    if n == 0:
        errors.append(f"{f}: no </main> to inject before")
        continue
    try:
        f.write_text(new_text, encoding="utf-8")
        touched += 1
    except Exception as e:
        errors.append(f"{f}: write failed: {e}")

print(f"\nResults:")
print(f"  Files modified:   {touched}")
print(f"  Already had it:   {skipped_already}")
print(f"  No county found:  {skipped_no_county}")
print(f"  Errors:           {len(errors)}")
for e in errors[:5]:
    print(f"   - {e}")
