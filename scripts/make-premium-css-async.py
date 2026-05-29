"""
Make /assets/css/premium.css load asynchronously on every HTML page
(location pages, service-city pages, service hubs, top-level pages).

The inline <style> in each page's <head> already contains the
above-the-fold critical rules, so deferring premium.css doesn't break
the initial render but improves First Contentful Paint and LCP scores.

Idempotent: only converts the sync version; skips files already converted.
"""

from pathlib import Path
import re

SITE = Path(r"c:/Users/Admin/Downloads/dorys")

# Match the sync version: <link rel="stylesheet" href="/assets/css/premium.css">
SYNC_RE = re.compile(
    r'<link rel="stylesheet" href="/assets/css/premium\.css"\s*/?>',
    re.IGNORECASE,
)
ASYNC_REPLACEMENT = (
    '<link rel="preload" as="style" href="/assets/css/premium.css" '
    'onload="this.onload=null;this.rel=\'stylesheet\'">'
    '<noscript><link rel="stylesheet" href="/assets/css/premium.css"></noscript>'
)

# Search EVERY .html file across the site (excluding build/ and node_modules)
EXCLUDE = {"build", "node_modules", "tmp", "workspace"}

files: list[Path] = []
for f in SITE.rglob("*.html"):
    if any(p in EXCLUDE for p in f.parts):
        continue
    files.append(f)

touched = 0
skipped_already = 0
skipped_no_match = 0
errors: list[str] = []

for f in files:
    try:
        text = f.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        errors.append(f"{f}: read failed: {e}")
        continue
    if 'preload" as="style" href="/assets/css/premium.css"' in text:
        skipped_already += 1
        continue
    new_text, n = SYNC_RE.subn(ASYNC_REPLACEMENT, text, count=1)
    if n == 0:
        skipped_no_match += 1
        continue
    try:
        f.write_text(new_text, encoding="utf-8")
        touched += 1
    except Exception as e:
        errors.append(f"{f}: write failed: {e}")

print(f"Files modified:        {touched}")
print(f"Already async:         {skipped_already}")
print(f"No premium.css ref:    {skipped_no_match}")
print(f"Errors:                {len(errors)}")
for e in errors[:5]:
    print(f"  - {e}")
