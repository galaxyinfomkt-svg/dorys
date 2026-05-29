"""
Replace the 6 emoji icons in the COMPLIANT · LICENSED · INSURED badge
strip with monochrome SVG icons in the brand's primary blue.

Why:
  Emojis read residential and render inconsistently across OS/font
  stacks (Apple's red heart vs Google's blue, Android's flat warning,
  etc.). For a B2B healthcare-cleaning audience, professional inline
  SVGs reinforce the "clinical, credentialed" frame the badges exist
  to communicate.

Affected:
  14 top-level HTML pages with the badge strip (home, services hub,
  pillar pages, about, contact, pricing, etc.)
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")

# Shared SVG attributes — outline style at 32px, primary brand blue.
SVG_OPEN = (
    '<svg width="32" height="32" viewBox="0 0 24 24" '
    'fill="none" stroke="currentColor" stroke-width="1.75" '
    'stroke-linecap="round" stroke-linejoin="round" '
    'role="img" focusable="false">'
)

ICONS = {
    # 🏥 CDC Aligned — hospital cross inside a circle (medical/clinical)
    "🏥": (
        SVG_OPEN
        + '<circle cx="12" cy="12" r="9"/>'
        + '<path d="M12 8v8M8 12h8"/>'
        + '</svg>'
    ),
    # ⚠️ OSHA Compliant — clipboard with check (regulatory compliance)
    "⚠️": (
        SVG_OPEN
        + '<rect x="8" y="2" width="8" height="4" rx="1"/>'
        + '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'
        + '<path d="M9 13l2 2 4-4"/>'
        + '</svg>'
    ),
    # 🌿 EPA Registered — leaf (eco / EPA List N disinfectants)
    "🌿": (
        SVG_OPEN
        + '<path d="M11 20A7 7 0 0 1 4 13 5 5 0 0 1 9 8c4 0 9-2 11-6 0 8-3 14-9 18Z"/>'
        + '<path d="M2 22c4-4 8-5 11-5"/>'
        + '</svg>'
    ),
    # 🔒 HIPAA Aware — padlock (privacy)
    "🔒": (
        SVG_OPEN
        + '<rect x="4" y="11" width="16" height="10" rx="2"/>'
        + '<path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
        + '</svg>'
    ),
    # 📜 MA Licensed — document with lines (certificate / license)
    "📜": (
        SVG_OPEN
        + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>'
        + '<polyline points="14 2 14 8 20 8"/>'
        + '<line x1="8" y1="13" x2="16" y2="13"/>'
        + '<line x1="8" y1="17" x2="13" y2="17"/>'
        + '</svg>'
    ),
    # 🛡️ $2M Insured — shield (protection)
    "🛡️": (
        SVG_OPEN
        + '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
        + '</svg>'
    ),
}

# Old wrapper                                              New wrapper (loses font-size, gains brand color)
# <div style="font-size:1.75rem;margin-bottom:.25rem;"     <div style="margin-bottom:.25rem;color:#2b70e4;line-height:1;"
#      aria-hidden="true">EMOJI</div>                           aria-hidden="true">SVG</div>

OLD_OPEN = (
    '<div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">'
)
NEW_OPEN = (
    '<div style="margin-bottom:.25rem;color:#2b70e4;line-height:1;" aria-hidden="true">'
)

# Build full replacement table
REPLACEMENTS = {
    f"{OLD_OPEN}{emoji}</div>": f"{NEW_OPEN}{svg}</div>"
    for emoji, svg in ICONS.items()
}

# Target only files known to contain the badge section
TARGET_FILES = [
    "index.html",
    "about.html",
    "contact.html",
    "pricing.html",
    "healthcare-facilities.html",
    "atp-assessment.html",
    "assisted-living-cleaning.html",
    "cardiology-clinic-cleaning.html",
    "covid-disinfection.html",
    "dental-office-cleaning.html",
    "dialysis-clinic-cleaning.html",
    "emergency-cleaning.html",
    "surgery-center-cleaning.html",
    "urgent-care-cleaning.html",
]

changed_files = 0
total_replacements = 0
not_found = []

for rel in TARGET_FILES:
    path = ROOT / rel
    if not path.exists():
        not_found.append(rel)
        continue
    text = path.read_text(encoding="utf-8")
    new = text
    file_n = 0
    for old, repl in REPLACEMENTS.items():
        new, n = new.replace(old, repl), new.count(old)
        file_n += n
    # str.replace doesn't return count, redo correctly
    new = text
    file_n = 0
    for old, repl in REPLACEMENTS.items():
        count = new.count(old)
        if count:
            new = new.replace(old, repl)
            file_n += count
    if new != text:
        path.write_text(new, encoding="utf-8")
        changed_files += 1
        total_replacements += file_n

print(f"Files updated:        {changed_files}/14")
print(f"Total emoji→SVG swaps: {total_replacements}")
if not_found:
    print(f"Files not found:      {not_found}")
