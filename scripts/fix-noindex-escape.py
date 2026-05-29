"""
Fix the escaped-quote bug introduced by add-noindex-to-duplicates.py.

What add-noindex-to-duplicates.py did wrong:
  Injected `<meta name=\"robots\" content=\"noindex,follow\">` (literal
  backslashes) instead of `<meta name="robots" content="noindex,follow">`.
  The raw f-string preserved the backslashes; HTML browsers see garbage.

This script:
  1. Removes the broken line on every affected file
  2. Replaces the legacy `<meta name="robots" content="index, follow">`
     with the intended `<meta name="robots" content="noindex,follow">`,
     so only one (correct) robots meta remains per page.
"""

from pathlib import Path

SITE_ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
SERVICE_DIRS = [
    "services/ambulatory-outpatient",
    "services/healthcare-admin-offices",
    "services/medical-office-cleaning",
    "services/rehab-nursing",
    "services/specialty-clinics",
]

BROKEN_LINE = ' <meta name=\\"robots\\" content=\\"noindex,follow\\">'
OLD_INDEX_META = '<meta name="robots" content="index, follow">'
NEW_NOINDEX_META = '<meta name="robots" content="noindex,follow">'

fixed = 0
no_broken = 0
no_index_meta = 0

for sub in SERVICE_DIRS:
    folder = SITE_ROOT / sub
    if not folder.is_dir():
        print(f"missing folder: {folder}")
        continue
    for html in folder.glob("*.html"):
        if html.name == "index.html":
            continue
        text = html.read_text(encoding="utf-8")
        new_text = text

        if BROKEN_LINE in new_text:
            # Remove the broken line (and the preceding newline that the
            # injection script added)
            new_text = new_text.replace("\n" + BROKEN_LINE, "")
        else:
            no_broken += 1

        if OLD_INDEX_META in new_text:
            new_text = new_text.replace(OLD_INDEX_META, NEW_NOINDEX_META)
        else:
            no_index_meta += 1

        if new_text != text:
            html.write_text(new_text, encoding="utf-8")
            fixed += 1

print(f"fixed: {fixed}")
print(f"files with no broken line found: {no_broken}")
print(f"files with no old index meta found: {no_index_meta}")
