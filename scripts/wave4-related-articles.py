"""
Inject a "Related Reading" widget with 4 contextually-related blog
links above the footer of every blog post.

Why:
  Internal links with descriptive anchors are still one of the
  highest-leverage on-page signals. The blog cluster currently has
  zero post-to-post linking — so all 20 posts compete in isolation.
  This widget turns the cluster into a topical web Google can read
  as authority depth on healthcare cleaning.

Strategy:
  Hand-curated 4-relations-per-post map grouped by topic affinity:
    - Compliance / regulatory
    - Infection control
    - Terminal / scheduled cleaning
    - Vendor / comparison
    - Specialty / training
  Each link uses a descriptive anchor (the post's headline) instead
  of a generic "click here" so Google can read topical relevance.
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
BLOG = ROOT / "blog"

# Hand-curated relation map: slug -> [4 related slugs]
RELATIONS = {
    "bloodborne-pathogen-cleanup-protocols-clinical-environments": [
        "osha-cleaning-requirements-medical-offices-2026",
        "infection-control-best-practices-medical-offices",
        "high-touch-surface-disinfection-frequency-healthcare",
        "operating-room-terminal-cleaning-protocols",
    ],
    "cdc-compliance-environmental-sanitation-clinics": [
        "osha-cleaning-requirements-medical-offices-2026",
        "epa-registered-disinfectants-healthcare-guide",
        "massachusetts-healthcare-facility-sanitation-regulations",
        "infection-control-best-practices-medical-offices",
    ],
    "choosing-healthcare-cleaning-service-massachusetts": [
        "healthcare-cleaning-vendor-evaluation-rfp-checklist",
        "clinical-cleaning-vs-janitorial-cleaning-differences",
        "environmental-services-quality-control-healthcare",
        "healthcare-cleaning-staff-training-certification",
    ],
    "clinical-cleaning-vs-janitorial-cleaning-differences": [
        "healthcare-cleaning-staff-training-certification",
        "choosing-healthcare-cleaning-service-massachusetts",
        "environmental-services-quality-control-healthcare",
        "healthcare-cleaning-vendor-evaluation-rfp-checklist",
    ],
    "covid-cleaning-legacy-permanent-changes-healthcare": [
        "high-touch-surface-disinfection-frequency-healthcare",
        "epa-registered-disinfectants-healthcare-guide",
        "infection-control-best-practices-medical-offices",
        "terminal-cleaning-vs-concurrent-cleaning-healthcare",
    ],
    "dental-office-sterilization-environmental-services": [
        "osha-cleaning-requirements-medical-offices-2026",
        "epa-registered-disinfectants-healthcare-guide",
        "bloodborne-pathogen-cleanup-protocols-clinical-environments",
        "infection-control-best-practices-medical-offices",
    ],
    "environmental-services-quality-control-healthcare": [
        "high-touch-surface-disinfection-frequency-healthcare",
        "healthcare-cleaning-staff-training-certification",
        "scheduled-sanitation-program-healthcare-facilities",
        "clinical-cleaning-vs-janitorial-cleaning-differences",
    ],
    "epa-registered-disinfectants-healthcare-guide": [
        "high-touch-surface-disinfection-frequency-healthcare",
        "cdc-compliance-environmental-sanitation-clinics",
        "covid-cleaning-legacy-permanent-changes-healthcare",
        "terminal-cleaning-vs-concurrent-cleaning-healthcare",
    ],
    "healthcare-cleaning-staff-training-certification": [
        "clinical-cleaning-vs-janitorial-cleaning-differences",
        "environmental-services-quality-control-healthcare",
        "osha-cleaning-requirements-medical-offices-2026",
        "bloodborne-pathogen-cleanup-protocols-clinical-environments",
    ],
    "healthcare-cleaning-vendor-evaluation-rfp-checklist": [
        "choosing-healthcare-cleaning-service-massachusetts",
        "clinical-cleaning-vs-janitorial-cleaning-differences",
        "environmental-services-quality-control-healthcare",
        "healthcare-cleaning-staff-training-certification",
    ],
    "healthcare-inspection-preparation-guide-massachusetts": [
        "massachusetts-healthcare-facility-sanitation-regulations",
        "cdc-compliance-environmental-sanitation-clinics",
        "osha-cleaning-requirements-medical-offices-2026",
        "environmental-services-quality-control-healthcare",
    ],
    "high-touch-surface-disinfection-frequency-healthcare": [
        "epa-registered-disinfectants-healthcare-guide",
        "covid-cleaning-legacy-permanent-changes-healthcare",
        "infection-control-best-practices-medical-offices",
        "terminal-cleaning-vs-concurrent-cleaning-healthcare",
    ],
    "hipaa-compliant-cleaning-medical-offices": [
        "osha-cleaning-requirements-medical-offices-2026",
        "infection-control-best-practices-medical-offices",
        "cdc-compliance-environmental-sanitation-clinics",
        "healthcare-inspection-preparation-guide-massachusetts",
    ],
    "infection-control-best-practices-medical-offices": [
        "cdc-compliance-environmental-sanitation-clinics",
        "high-touch-surface-disinfection-frequency-healthcare",
        "bloodborne-pathogen-cleanup-protocols-clinical-environments",
        "epa-registered-disinfectants-healthcare-guide",
    ],
    "infection-prevention-assisted-living-facilities": [
        "high-touch-surface-disinfection-frequency-healthcare",
        "infection-control-best-practices-medical-offices",
        "scheduled-sanitation-program-healthcare-facilities",
        "epa-registered-disinfectants-healthcare-guide",
    ],
    "massachusetts-healthcare-facility-sanitation-regulations": [
        "cdc-compliance-environmental-sanitation-clinics",
        "osha-cleaning-requirements-medical-offices-2026",
        "healthcare-inspection-preparation-guide-massachusetts",
        "hipaa-compliant-cleaning-medical-offices",
    ],
    "operating-room-terminal-cleaning-protocols": [
        "terminal-cleaning-vs-concurrent-cleaning-healthcare",
        "bloodborne-pathogen-cleanup-protocols-clinical-environments",
        "scheduled-sanitation-program-healthcare-facilities",
        "epa-registered-disinfectants-healthcare-guide",
    ],
    "osha-cleaning-requirements-medical-offices-2026": [
        "bloodborne-pathogen-cleanup-protocols-clinical-environments",
        "healthcare-cleaning-staff-training-certification",
        "cdc-compliance-environmental-sanitation-clinics",
        "massachusetts-healthcare-facility-sanitation-regulations",
    ],
    "scheduled-sanitation-program-healthcare-facilities": [
        "environmental-services-quality-control-healthcare",
        "terminal-cleaning-vs-concurrent-cleaning-healthcare",
        "infection-prevention-assisted-living-facilities",
        "operating-room-terminal-cleaning-protocols",
    ],
    "terminal-cleaning-vs-concurrent-cleaning-healthcare": [
        "operating-room-terminal-cleaning-protocols",
        "scheduled-sanitation-program-healthcare-facilities",
        "high-touch-surface-disinfection-frequency-healthcare",
        "epa-registered-disinfectants-healthcare-guide",
    ],
}

# Read H1 of each post once
HEADLINES = {}
H1_RE = re.compile(r'<h1[^>]*>([^<]+)</h1>', re.IGNORECASE)
for slug in RELATIONS:
    path = BLOG / f"{slug}.html"
    if not path.exists():
        continue
    m = H1_RE.search(path.read_text(encoding="utf-8"))
    if m:
        HEADLINES[slug] = m.group(1).strip()

MARKER_START = "<!-- RELATED-ARTICLES:START -->"
MARKER_END = "<!-- RELATED-ARTICLES:END -->"

def build_widget(related_slugs):
    cards = []
    for s in related_slugs:
        title = HEADLINES.get(s, s.replace("-", " ").title())
        cards.append(
            f'<a href="/blog/{s}" class="related-card" '
            f'style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:10px;text-decoration:none;transition:box-shadow 0.2s;">'
            f'<div style="font-size:0.75rem;font-weight:600;color:#2b70e4;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Related Reading</div>'
            f'<div style="font-size:1.05rem;font-weight:700;color:#1a1a2e;line-height:1.35;">{title}</div>'
            f'</a>'
        )
    return (
        f'\n{MARKER_START}\n'
        f'<section class="section" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:3rem 0;">\n'
        f'  <div class="container container--narrow">\n'
        f'    <h2 class="section__title" style="font-size:1.5rem;margin-bottom:0.5rem;color:#1e293b;">Continue Reading</h2>\n'
        f'    <p style="color:#475569;margin-bottom:1.5rem;font-size:0.95rem;">More clinical environmental services resources from Dory&rsquo;s:</p>\n'
        f'    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">\n'
        f'      {"".join(cards)}\n'
        f'    </div>\n'
        f'  </div>\n'
        f'</section>\n'
        f'{MARKER_END}\n'
    )


INJECT_BEFORE = re.compile(r'(</main>)', re.IGNORECASE)
REMOVE_OLD_RE = re.compile(
    re.escape(MARKER_START) + r'.*?' + re.escape(MARKER_END) + r'\n?',
    re.DOTALL,
)

injected = 0
for slug, related in RELATIONS.items():
    path = BLOG / f"{slug}.html"
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    # Strip prior widget if present (idempotent)
    text = REMOVE_OLD_RE.sub("", text)
    widget = build_widget(related)
    new_text, n = INJECT_BEFORE.subn(widget + r"\1", text, count=1)
    if n:
        path.write_text(new_text, encoding="utf-8")
        injected += 1

print(f"Related Reading widget injected on {injected}/{len(RELATIONS)} blog posts")
