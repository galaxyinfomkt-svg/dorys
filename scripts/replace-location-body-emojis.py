"""
Replace inline body emojis on the 295 location pages with monochrome
SVG icons. The inject-local-content.py script seeded these into two
sections per page:

  1) "Healthcare Facilities We Clean in {City}" compliance <li> list
     (lines ~334-338): emoji + <strong>Service type</strong> — description
  2) "All {City} Healthcare Cleaning Services" cross-services <a> card
     grid (lines ~375-395): emoji inside .service-icon <div> + service title

The home page's COMPLIANT · LICENSED · INSURED badges were already
SVG-ified earlier today (commit b01b665b0); this script applies the
same outline-icon convention to the location pages so the whole site
reads as a single B2B clinical brand instead of a casual residential
service.

Icons match the home badge style (24x24 viewBox, brand blue #2b70e4,
outline stroke 1.75px) but sized larger here (28px) because they sit
above a heading rather than next to a tiny credential label.
"""

from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
LOC = ROOT / "locations"

# Shared SVG wrapper attrs — outline style, brand blue
SVG_OPEN_LARGE = (
    '<svg width="28" height="28" viewBox="0 0 24 24" '
    'fill="none" stroke="currentColor" stroke-width="1.75" '
    'stroke-linecap="round" stroke-linejoin="round" '
    'role="img" focusable="false" aria-hidden="true">'
)
SVG_OPEN_INLINE = (
    '<svg width="20" height="20" viewBox="0 0 24 24" '
    'fill="none" stroke="currentColor" stroke-width="1.75" '
    'stroke-linecap="round" stroke-linejoin="round" '
    'style="vertical-align:-4px;margin-right:0.5rem;" '
    'role="img" focusable="false" aria-hidden="true">'
)

ICON_PATHS = {
    # 🏥 Medical office — hospital cross in circle
    "medical": '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    # 🔬 Specialty clinic — microscope-y two-diamond beaker
    "specialty": '<path d="M9 3h6v6l4 4v8H5v-8l4-4z"/><path d="M9 3v6M15 3v6"/>',
    # 🏃 Ambulatory / outpatient — running stick figure (compact)
    "ambulatory": '<circle cx="12" cy="5" r="1.5"/><path d="M9 22l3-8 3 4M9 14l-2-4 3-3 4 3-1 4M5 13l3-4"/>',
    # 💊 Rehab / nursing — pill (two halves)
    "rehab": '<path d="M10.5 4.5l9 9a4.95 4.95 0 0 1-7 7l-9-9a4.95 4.95 0 0 1 7-7z"/><path d="M8.5 8.5l7 7"/>',
    # 📋 Healthcare admin — clipboard with check
    "admin": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 13l2 2 4-4"/>',
}

# Section 1: inline list emojis (small inline SVG)
INLINE_REPLACEMENTS = {
    '">🏥 <strong>': f'">{SVG_OPEN_INLINE}{ICON_PATHS["medical"]}</svg><strong>',
    '">🔬 <strong>': f'">{SVG_OPEN_INLINE}{ICON_PATHS["specialty"]}</svg><strong>',
    '">🏃 <strong>': f'">{SVG_OPEN_INLINE}{ICON_PATHS["ambulatory"]}</svg><strong>',
    '">💊 <strong>': f'">{SVG_OPEN_INLINE}{ICON_PATHS["rehab"]}</strong>'.replace('</strong>', '</svg><strong>'),
    '">📋 <strong>': f'">{SVG_OPEN_INLINE}{ICON_PATHS["admin"]}</svg><strong>',
}
# Fix the bad chained replace for rehab
INLINE_REPLACEMENTS['">💊 <strong>'] = f'">{SVG_OPEN_INLINE}{ICON_PATHS["rehab"]}</svg><strong>'

# Section 2: card icon emojis (large block SVG)
def card_icon(name):
    return (
        f'<div style="margin-bottom:0.5rem;color:#2b70e4;line-height:1;">'
        f'{SVG_OPEN_LARGE}{ICON_PATHS[name]}</svg>'
        f'</div>'
    )

CARD_REPLACEMENTS = {
    '<div style="font-size:1.5rem;margin-bottom:0.5rem;">🏥</div>': card_icon("medical"),
    '<div style="font-size:1.5rem;margin-bottom:0.5rem;">🔬</div>': card_icon("specialty"),
    '<div style="font-size:1.5rem;margin-bottom:0.5rem;">🏃</div>': card_icon("ambulatory"),
    '<div style="font-size:1.5rem;margin-bottom:0.5rem;">💊</div>': card_icon("rehab"),
    '<div style="font-size:1.5rem;margin-bottom:0.5rem;">📋</div>': card_icon("admin"),
}

files_changed = 0
inline_swaps = 0
card_swaps = 0

for html in sorted(LOC.glob("*.html")):
    if html.name == "index.html":
        continue
    text = html.read_text(encoding="utf-8")
    new = text
    for old, repl in INLINE_REPLACEMENTS.items():
        c = new.count(old)
        if c:
            new = new.replace(old, repl)
            inline_swaps += c
    for old, repl in CARD_REPLACEMENTS.items():
        c = new.count(old)
        if c:
            new = new.replace(old, repl)
            card_swaps += c
    if new != text:
        html.write_text(new, encoding="utf-8")
        files_changed += 1

print(f"files changed:    {files_changed}/295")
print(f"inline emoji->svg swaps: {inline_swaps}")
print(f"card   emoji->svg swaps: {card_swaps}")
