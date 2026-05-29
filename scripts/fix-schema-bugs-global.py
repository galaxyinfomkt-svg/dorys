"""
Global fix for the two schema bugs that batch 1 + 2b only patched
inside /locations/.

Bugs:
  1) WebPage JSON-LD ending with `}}}` (3 braces) instead of `}}`.
     The trailing brace was a typo in whatever template generated it;
     Google's Rich Results parser bails out on the whole script tag.
     Confirmed by GSC URL Inspection on the HIPAA blog post.

  2) Service block carrying inline aggregateRating. Google does not
     support Review snippets on Service type, so the AggregateRating
     fires the "Invalid object type for field '<parent_node>'" error
     without ever rendering stars in the SERP.

Scope:
  Both bugs exist on ~1,500 files in /services/{cat}/{city}.html
  (noindexed, but still flagged in GSC), /blog/*.html (indexed,
  user-visible), and a handful of utility pages. Touches everything
  except /locations/ (already clean) and the two hand-crafted location
  pages framingham/hudson (LocalBusiness with valid AggregateRating).
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")

# Bug 1 — exact malformed WebPage script tag
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

# Bug 2 — inline AggregateRating after a Service block.
# Anchored on the comma + property so we don't accidentally hit
# the hand-crafted multi-line LocalBusiness blocks on framingham/hudson.
AGG_RATING_RE = re.compile(
    r',"aggregateRating":\{"@type":"AggregateRating","ratingValue":"[^"]+",'
    r'"bestRating":"[^"]+","worstRating":"[^"]+","ratingCount":"[^"]+",'
    r'"reviewCount":"[^"]+"\}'
)

fix1 = 0
fix2 = 0
files_touched = 0

# Walk every HTML file in the repo
for html in ROOT.rglob("*.html"):
    parts = html.parts
    # Skip node_modules / .git / similar (none exist but defensive)
    if any(p in parts for p in ("node_modules", ".git", "build", "data")):
        continue
    text = html.read_text(encoding="utf-8")
    new = text
    if BAD_WEBPAGE in new:
        new = new.replace(BAD_WEBPAGE, GOOD_WEBPAGE)
        fix1 += 1
    new2, n = AGG_RATING_RE.subn("", new, count=1)
    if n:
        new = new2
        fix2 += 1
    if new != text:
        html.write_text(new, encoding="utf-8")
        files_touched += 1

print(f"Bug 1 (}}}}}} -> }}}}):                 fixed in {fix1} files")
print(f"Bug 2 (Service.aggregateRating):  fixed in {fix2} files")
print(f"Files touched:                    {files_touched}")
