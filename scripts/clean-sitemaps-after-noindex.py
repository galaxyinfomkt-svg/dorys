"""
Clean up the 5 service sub-sitemaps after we noindexed the 1,485
service-city pages. Each sub-sitemap currently lists all 297 city
URLs that are now noindexed — which causes "Excluded by noindex tag"
warnings in Google Search Console.

After this script:
  - sitemap-services-{category}.xml contains ONLY the service hub URL
  - The 297 city URLs are removed (they're noindexed, so they shouldn't
    be in any sitemap)
"""

from pathlib import Path
from datetime import date

SITE_ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
TODAY = date.today().isoformat()

SERVICES = [
    "ambulatory-outpatient",
    "healthcare-admin-offices",
    "medical-office-cleaning",
    "rehab-nursing",
    "specialty-clinics",
]

for svc in SERVICES:
    sitemap_path = SITE_ROOT / f"sitemap-services-{svc}.xml"
    hub_url = f"https://doryscleaningservices.com/services/{svc}/"
    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{hub_url}</loc><lastmod>{TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>
"""
    sitemap_path.write_text(content, encoding="utf-8")
    print(f"Rewrote {sitemap_path.name}: 1 hub URL kept")

print("Done.")
