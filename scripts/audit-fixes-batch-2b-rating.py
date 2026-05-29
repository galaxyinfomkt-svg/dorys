"""
Quick fix: Google Rich Results Test flagged Service.aggregateRating as
invalid (Service is not a supported parent type for review snippets).

Solution: drop the inline aggregateRating from each Service block on
the 295 location pages. The full architectural fix (LocalBusiness root
on home referenced by @id) goes into a later batch.

After this script the Service block keeps name, provider, areaServed —
just no inline rating.
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")

# Match the trailing aggregateRating object inside a Service block and
# delete it (including the leading comma). We anchor on `,"aggregateRating"`
# so we don't accidentally touch a Service that has aggregateRating in the
# middle (none do, but defensive).
AGG_RATING_RE = re.compile(
    r',"aggregateRating":\{"@type":"AggregateRating","ratingValue":"[^"]+","bestRating":"[^"]+","worstRating":"[^"]+","ratingCount":"[^"]+","reviewCount":"[^"]+"\}'
)

changed = 0
loc_dir = ROOT / "locations"
for html in sorted(loc_dir.glob("*.html")):
    if html.name == "index.html":
        continue
    text = html.read_text(encoding="utf-8")
    new, n = AGG_RATING_RE.subn("", text, count=1)
    if n:
        html.write_text(new, encoding="utf-8")
        changed += 1

print(f"Service.aggregateRating removed from {changed} location pages")
