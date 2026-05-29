"""
Batch 2 fixes for the 2026-05-29 SEO audit.

  - 10 blog posts have wrong H1 (template copy-paste bug); rewrite each
    H1 to match its title/slug topic
  - 297 location pages still say "Free quote" in <meta description> and
    og:description, contradicting the B2B "Free facility assessment"
    positioning we shipped on the home page
  - Framingham location page declares aggregateRating 5.0 / 47 reviews,
    contradicting the home's 4.7 / 10 (the truth from Google Maps).
    Inconsistent AggregateRating is a Google Rich Results violation —
    fix Framingham to match
  - 1,498 pages have a leading emoji in <title> / og:title /
    twitter:title / JSON-LD Service.name. Emojis read residential, not
    B2B, and Google strips most of them anyway. Strip them.
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")


# ============================================================================
# Fix #3 — Blog H1 mismatches (10 posts)
# ============================================================================
BLOG_H1_REWRITES = {
    "cdc-compliance-environmental-sanitation-clinics":
        "CDC Compliance for Specialty Clinic Sanitation in Massachusetts",
    "choosing-healthcare-cleaning-service-massachusetts":
        "How to Choose a Healthcare Cleaning Service in Massachusetts: 7 Criteria for Facility Managers",
    "dental-office-sterilization-environmental-services":
        "Dental Office Sterilization and Environmental Services: An OSHA Guide for Massachusetts Practices",
    "epa-registered-disinfectants-healthcare-guide":
        "EPA-Registered Disinfectants for Healthcare: 2026 Selection Guide for Massachusetts Facilities",
    "healthcare-cleaning-staff-training-certification":
        "Healthcare Cleaning Staff Training and Certification: What Massachusetts Facilities Should Require",
    "hipaa-compliant-cleaning-medical-offices":
        "HIPAA-Compliant Cleaning for Medical Offices: A Massachusetts Compliance Guide",
    "infection-control-best-practices-medical-offices":
        "Infection Control Best Practices for Medical Offices: A Massachusetts Guide",
    "infection-prevention-assisted-living-facilities":
        "Infection Prevention in Assisted Living Facilities: A Massachusetts Compliance Guide",
    "operating-room-terminal-cleaning-protocols":
        "Operating Room Terminal Cleaning Protocols for Massachusetts Surgery Centers",
    "scheduled-sanitation-program-healthcare-facilities":
        "Building a Scheduled Sanitation Program for Healthcare Facilities in Massachusetts",
}

# Replace the first <h1>...</h1> regardless of attributes.
H1_RE = re.compile(r"(<h1[^>]*>)([^<]+)(</h1>)", re.IGNORECASE)

blog_h1_changed = 0
blog_h1_missed = []
for slug, new_h1 in BLOG_H1_REWRITES.items():
    path = ROOT / "blog" / f"{slug}.html"
    if not path.exists():
        blog_h1_missed.append(slug)
        continue
    text = path.read_text(encoding="utf-8")
    new_text, n = H1_RE.subn(rf"\g<1>{new_h1}\g<3>", text, count=1)
    if n and new_text != text:
        path.write_text(new_text, encoding="utf-8")
        blog_h1_changed += 1
    elif n == 0:
        blog_h1_missed.append(f"{slug} (no <h1> matched)")


# ============================================================================
# Fix #7 — "Free quote" -> "Free facility assessment" in location meta
# ============================================================================
# Targets the literal phrase in <meta description> / og:description /
# twitter:description. Case-sensitive on purpose so we don't touch on-page
# CTA buttons that say "Get Your Free Quote".
FREE_QUOTE_PATTERNS = [
    (re.compile(r'Free quote: '), 'Free facility assessment: '),
    (re.compile(r'Free quote:'),  'Free facility assessment:'),
]

loc_dir = ROOT / "locations"
loc_files_changed = 0
loc_lines_changed = 0
for html in sorted(loc_dir.glob("*.html")):
    if html.name == "index.html":
        continue
    text = html.read_text(encoding="utf-8")
    new = text
    n_total = 0
    for pat, repl in FREE_QUOTE_PATTERNS:
        new, n = pat.subn(repl, new)
        n_total += n
    if new != text:
        html.write_text(new, encoding="utf-8")
        loc_files_changed += 1
        loc_lines_changed += n_total


# ============================================================================
# Fix #13 — Framingham rating must match the canonical 4.7/10
# ============================================================================
fram = ROOT / "locations" / "framingham-ma.html"
fram_text = fram.read_text(encoding="utf-8")
fram_new = (
    fram_text
    .replace('"ratingValue": "5.0"', '"ratingValue": "4.7"')
    .replace('"reviewCount": "47"',  '"reviewCount": "10"')
)
fram_fixed = fram_text != fram_new
if fram_fixed:
    fram.write_text(fram_new, encoding="utf-8")


# ============================================================================
# Fix #6 — Strip leading emoji from titles + JSON-LD Service.name
# ============================================================================
# Matches one-or-more emoji codepoints (with optional VS-16) at the start of:
#   <title>EMOJI...</title>
#   <meta property="og:title" content="EMOJI...">
#   <meta name="twitter:title" content="EMOJI...">
#   "name":"EMOJI..." inside Service / WebPage JSON-LD
EMOJI_CLASS = (
    r"["
    r"\U0001F000-\U0001FFFF"   # most emoji
    r"\U00002600-\U000027BF"   # misc symbols + dingbats
    r"\U00002300-\U000023FF"   # misc technical
    r"\U00002B00-\U00002BFF"   # arrows + extras
    r"\U00002700-\U000027BF"   # dingbats
    r"⚕"                  # medical symbol
    r"❤"                  # heart
    r"]"
    r"[️‍]?"         # optional variation selector / ZWJ
    r"[\U0001F000-\U0001FFFF\U00002600-\U000027BF⚕❤️‍]*"
)

TITLE_EMOJI_RES = [
    re.compile(rf"(<title>)\s*{EMOJI_CLASS}\s*"),
    re.compile(rf'(<meta property="og:title" content=")\s*{EMOJI_CLASS}\s*'),
    re.compile(rf'(<meta name="twitter:title" content=")\s*{EMOJI_CLASS}\s*'),
    # JSON-LD name field (Service / WebPage / etc.)
    re.compile(rf'("name":")\s*{EMOJI_CLASS}\s*'),
]

emoji_files_changed = 0
emoji_replacements = 0
for html in ROOT.rglob("*.html"):
    # Skip node_modules etc. if any (none in this repo, but defensive)
    if "node_modules" in html.parts:
        continue
    text = html.read_text(encoding="utf-8")
    new = text
    file_n = 0
    for pat in TITLE_EMOJI_RES:
        new, n = pat.subn(r"\1", new)
        file_n += n
    if new != text:
        html.write_text(new, encoding="utf-8")
        emoji_files_changed += 1
        emoji_replacements += file_n


# ============================================================================
# Report
# ============================================================================
print("=== Batch 2 fixes ===\n")
print(f"Blog H1 rewrites:                {blog_h1_changed}/10")
if blog_h1_missed:
    print(f"  Missed: {blog_h1_missed}")
print()
print(f"Locations 'Free quote' -> 'Free facility assessment':")
print(f"  Files changed:                 {loc_files_changed}")
print(f"  Lines replaced:                {loc_lines_changed}")
print()
print(f"Framingham rating fixed:         {fram_fixed}")
print()
print(f"Emoji-stripped files:            {emoji_files_changed}")
print(f"  Title/og/twitter/JSON-LD hits: {emoji_replacements}")
