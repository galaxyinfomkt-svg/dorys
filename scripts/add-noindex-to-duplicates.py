"""
Add <meta name="robots" content="noindex,follow"> to the 5 service-city
sub-folders (1,485 pages).

Rationale:
  Each /services/{service}/{city}-ma.html shares 95%+ of its content with
  every other city-variant of the same service. Google treats this as
  "doorway pages" / thin content under the Helpful Content policy.

Effect:
  - Pages remain accessible to users (links from /locations/ pages still work)
  - Google won't index or rank these as separate URLs
  - Authority consolidates to the parent /services/{service}/ hub page
  - Reversible: just remove the meta tag later

Safety:
  - Idempotent: if the meta is already present we skip the file
  - Only touches the 5 service sub-folders, never the /locations/ pages
"""

from pathlib import Path
import re

SITE_ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
SERVICE_DIRS = [
    "services/ambulatory-outpatient",
    "services/healthcare-admin-offices",
    "services/medical-office-cleaning",
    "services/rehab-nursing",
    "services/specialty-clinics",
]

NOINDEX_TAG = '<meta name="robots" content="noindex,follow">'
# Match either the existing canonical or the description meta and inject
# the noindex tag right after the title (keeps clean grouping in <head>).
INJECT_AFTER = re.compile(r"(</title>)", re.IGNORECASE)

touched = 0
skipped_already = 0
skipped_index = 0
errors = []

for sub in SERVICE_DIRS:
    folder = SITE_ROOT / sub
    if not folder.is_dir():
        errors.append(f"missing folder: {folder}")
        continue
    for html in folder.glob("*.html"):
        # Skip the service's own index.html — that one IS the canonical hub
        # and should remain indexed.
        if html.name == "index.html":
            skipped_index += 1
            continue
        try:
            text = html.read_text(encoding="utf-8")
            if "noindex" in text.lower():
                skipped_already += 1
                continue
            new_text, n = INJECT_AFTER.subn(
                lambda m: m.group(1) + "\n " + NOINDEX_TAG,
                text,
                count=1,
            )
            if n == 0:
                errors.append(f"no <title> tag to inject after: {html}")
                continue
            html.write_text(new_text, encoding="utf-8")
            touched += 1
        except Exception as e:
            errors.append(f"{html}: {e}")

print(f"Files modified:      {touched}")
print(f"Already had noindex: {skipped_already}")
print(f"Skipped (index.html): {skipped_index}")
print(f"Errors:              {len(errors)}")
for e in errors[:10]:
    print(f"  - {e}")
