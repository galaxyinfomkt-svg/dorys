"""
Batch fix for the top 5 P0/P1 findings from the 2026-05-29 SEO audit.

Run once. Idempotent: safe to re-run, will skip already-fixed sections.

Fixes:
  #1  malformed WebPage JSON-LD `}}}` -> `}}` on location pages
  #2  home title "Free Quote" -> "Free Facility Assessment" (3 places)
  #4  delete per-city LocalBusiness block; upgrade Service.areaServed
      from State/Massachusetts to City/<city>
  #5  rel="nofollow" on the 5 service-hub city-grid links (PageRank no
      longer flows into noindexed pages)
  #10 hero image preload on every location page
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")

# ---- Fix #1 ---------------------------------------------------------------

BAD_WEBPAGE = (
    '<script type="application/ld+json">{"@context":"https://schema.org",'
    '"@type":"WebPage","isPartOf":{"@id":"https://doryscleaningservices.com/#business"},'
    '"about":{"@id":"https://doryscleaningservices.com/#business"}}}</script>'
)
GOOD_WEBPAGE = (
    '<script type="application/ld+json">{"@context":"https://schema.org",'
    '"@type":"WebPage","isPartOf":{"@id":"https://doryscleaningservices.com/#business"},'
    '"about":{"@id":"https://doryscleaningservices.com/#business"}}</script>'
)

# ---- Fix #4 ---------------------------------------------------------------
# Match the LocalBusiness block injected into each location page, e.g.:
#   <script type="application/ld+json">
#    {
#    "@context": "https://schema.org",
#    "@type": "LocalBusiness",
#    ...
#    "areaServed": {"@type": "City", "name": "Boston"}
#    }
#   </script>
LOCAL_BUSINESS_RE = re.compile(
    r'\s*<script type="application/ld\+json">\s*\{\s*'
    r'"@context":\s*"https://schema.org",\s*'
    r'"@type":\s*"LocalBusiness",.*?"areaServed":\s*\{"@type":\s*"City",\s*"name":\s*"([^"]+)"\}\s*'
    r'\}\s*</script>',
    re.DOTALL,
)

# Match the trailing Service block on each location page and capture
# enough context to upgrade its areaServed from State to City. Example:
#   <script type="application/ld+json">{"@context":"https://schema.org",
#   "@type":"Service","name":"Healthcare Cleaning Boston, MA",
#   "provider":{"@id":"..."},
#   "areaServed":{"@type":"State","name":"Massachusetts"}, ...
SERVICE_AREASERVED_STATE_RE = re.compile(
    r'("@type":"Service"[^<]*?"areaServed":)\{"@type":"State","name":"Massachusetts"\}'
)

# ---- Fix #10 --------------------------------------------------------------
# Inject right after the mobile-fixes.css <link> on location pages.
LOCATION_CSS_ANCHOR = (
    '<link rel="stylesheet" href="/assets/css/mobile-fixes.css">'
)
HERO_PRELOAD = (
    '\n <link rel="preload" as="image" '
    'href="/assets/images/hero/healthcare-hero.webp" fetchpriority="high">'
)

# ---- Fix #5 ---------------------------------------------------------------
# Add rel="nofollow" to every city link in the 5 service-hub index pages.
# Pattern: <a href="/services/<service>/<city>-ma" class="city-link">
NOFOLLOW_CITY_LINK_RE = re.compile(
    r'(<a href="/services/[^"]+-ma")( class="city-link")'
)


# ============================================================================
# Run fixes
# ============================================================================
loc_dir = ROOT / "locations"
loc_fixed_1 = 0
loc_fixed_4_lb_removed = 0
loc_fixed_4_areaserved = 0
loc_fixed_10 = 0
loc_total = 0

for html in sorted(loc_dir.glob("*.html")):
    if html.name == "index.html":
        continue
    loc_total += 1
    text = html.read_text(encoding="utf-8")
    new = text

    # Fix #1
    if BAD_WEBPAGE in new:
        new = new.replace(BAD_WEBPAGE, GOOD_WEBPAGE)
        loc_fixed_1 += 1

    # Fix #4 — delete LocalBusiness block, capture city
    m = LOCAL_BUSINESS_RE.search(new)
    if m:
        city = m.group(1)
        new = LOCAL_BUSINESS_RE.sub("", new, count=1)
        loc_fixed_4_lb_removed += 1
        # Upgrade Service.areaServed to that city
        new_service, n = SERVICE_AREASERVED_STATE_RE.subn(
            rf'\1{{"@type":"City","name":"{city}"}}',
            new,
        )
        if n:
            new = new_service
            loc_fixed_4_areaserved += 1

    # Fix #10 — hero preload
    if HERO_PRELOAD not in new and LOCATION_CSS_ANCHOR in new:
        new = new.replace(
            LOCATION_CSS_ANCHOR,
            LOCATION_CSS_ANCHOR + HERO_PRELOAD,
            1,
        )
        loc_fixed_10 += 1

    if new != text:
        html.write_text(new, encoding="utf-8")


# ---- Fix #2 — Home title --------------------------------------------------
home = ROOT / "index.html"
home_text = home.read_text(encoding="utf-8")
home_new = home_text.replace(
    "Healthcare Cleaning MA | Free Quote 24h",
    "Healthcare Cleaning MA | Free Facility Assessment 24h",
)
home_fixed_2 = home_text != home_new
if home_fixed_2:
    home.write_text(home_new, encoding="utf-8")


# ---- Fix #5 — nofollow on 5 service-hub city-grids ------------------------
hub_files = list(ROOT.glob("services/*/index.html"))
hub_fixed_5 = 0
hub_links_total = 0
for hub in hub_files:
    text = hub.read_text(encoding="utf-8")
    new, n = NOFOLLOW_CITY_LINK_RE.subn(r'\1 rel="nofollow"\2', text)
    if n:
        hub.write_text(new, encoding="utf-8")
        hub_fixed_5 += 1
        hub_links_total += n


# ---- Report ---------------------------------------------------------------
print(f"locations scanned:                    {loc_total}")
print(f"  Fix #1 (WebPage }}}}}} -> }}}}):           {loc_fixed_1}")
print(f"  Fix #4 LocalBusiness blocks removed: {loc_fixed_4_lb_removed}")
print(f"  Fix #4 Service areaServed upgraded:  {loc_fixed_4_areaserved}")
print(f"  Fix #10 hero preload added:          {loc_fixed_10}")
print()
print(f"Fix #2 home title updated:             {home_fixed_2}")
print()
print(f"Fix #5 service hubs updated:           {hub_fixed_5}/5")
print(f"  city-link rel=\"nofollow\" added:      {hub_links_total} links")
