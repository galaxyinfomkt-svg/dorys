"""
Inject UNIQUE, city-specific content (neighborhoods, landmarks,
population, local fact, property types) into the 14 city pages that
have rich local data in city-local-data.js.

Why this matters:
  Google's Helpful Content Update specifically rewards pages with
  unique, locally-relevant context. The 14 major cities currently have
  the same generic boilerplate — adding neighborhoods, landmarks, and
  a city-specific fact lifts them from "templated thin content" to
  "genuinely localized landing pages" — boosting rankings for the
  highest-demand markets.

Strategy:
  - Read CITY_LOCAL_DATA via the Node-exported JSON
  - For each city in the dataset, find /locations/{city}-ma.html
  - Inject a new <section> AFTER the services grid that lists
    neighborhoods, landmarks, local fact, etc.
  - Skip if marker comment already present (idempotent)
"""

import json
import re
from pathlib import Path

SITE = Path(r"c:/Users/Admin/Downloads/dorys")
DATA_FILE = Path(
    r"C:/Users/Admin/AppData/Local/Temp/jl-mockup-backup/city-data.json"
)
MARKER_START = "<!-- LOCAL-CONTEXT:START -->"
MARKER_END = "<!-- LOCAL-CONTEXT:END -->"

# Adapt cities → file slugs. Most cities are 'city-ma.html' but some
# don't exist under /locations/. Skip silently if missing.
DATA = json.loads(DATA_FILE.read_text(encoding="utf-8"))

# Inject AFTER the closing </section> of the services grid (`Our Healthcare
# Services in [City]`). We target the next </section> after that h2.
SERVICES_END_RE = re.compile(
    r'(<h2[^>]*>Our Healthcare Services in [^<]+</h2>[\s\S]*?</section>)',
    re.IGNORECASE,
)


def build_section(city_data: dict) -> str:
    name = city_data["name"]
    neighborhoods = city_data.get("neighborhoods", [])
    landmarks = city_data.get("landmarks", [])
    population = city_data.get("population", "")
    local_fact = city_data.get("localFact", "")
    property_types = city_data.get("propertyTypes", [])
    nearby = city_data.get("nearbyAreas", [])

    parts = [MARKER_START]
    parts.append(
        '<section class="section local-context" style="background:#ffffff;padding:3rem 0;border-top:1px solid #e2e8f0;">'
    )
    parts.append('  <div class="container container--narrow">')
    parts.append(
        f'    <h2 class="section__title" style="font-size:1.6rem;margin-bottom:1rem;color:#1e293b;">Healthcare Cleaning Across {name}</h2>'
    )
    if local_fact:
        parts.append(
            f'    <p style="font-size:1.05rem;line-height:1.7;color:#475569;margin-bottom:1.5rem;">{local_fact}</p>'
        )

    # Key facts pill row
    facts: list[str] = []
    if population:
        facts.append(
            f'<div style="background:#f1f5f9;padding:0.75rem 1rem;border-radius:8px;font-size:0.9rem;color:#1e293b;"><strong>Population:</strong> {population}</div>'
        )
    if property_types:
        types_text = ", ".join(property_types[:3])
        facts.append(
            f'<div style="background:#f1f5f9;padding:0.75rem 1rem;border-radius:8px;font-size:0.9rem;color:#1e293b;"><strong>Facility types we clean:</strong> {types_text}</div>'
        )
    if facts:
        parts.append(
            '    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;">'
        )
        for f in facts:
            parts.append(f"      {f}")
        parts.append("    </div>")

    # Neighborhoods served
    if neighborhoods:
        parts.append(
            f'    <h3 style="font-size:1.2rem;margin:1.5rem 0 0.75rem;color:#1e293b;">Neighborhoods We Serve in {name}</h3>'
        )
        parts.append('    <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.5rem;margin-bottom:1.5rem;">')
        for n in neighborhoods:
            parts.append(
                f'      <li style="padding:0.5rem 0.75rem;background:#f8fafc;border-left:3px solid #2b70e4;font-size:0.92rem;color:#334155;">{n}</li>'
            )
        parts.append("    </ul>")

    # Landmarks (helps with E-E-A-T "we know this area")
    if landmarks:
        landmarks_text = ", ".join(landmarks)
        parts.append(
            f'    <p style="font-size:0.95rem;color:#64748b;margin-top:1rem;font-style:italic;">'
            f"Notable {name} landmarks near our service areas: {landmarks_text}."
            "</p>"
        )

    parts.append("  </div>")
    parts.append("</section>")
    parts.append(MARKER_END)
    return "\n".join(parts)


touched = 0
skipped_already = 0
skipped_missing_page = 0
skipped_no_anchor = 0

for slug, data in DATA.items():
    page = SITE / "locations" / f"{slug}-ma.html"
    if not page.exists():
        skipped_missing_page += 1
        continue
    text = page.read_text(encoding="utf-8", errors="ignore")
    if MARKER_START in text:
        skipped_already += 1
        continue
    section = build_section(data)
    new_text, n = SERVICES_END_RE.subn(
        rf"\1\n\n{section}\n", text, count=1
    )
    if n == 0:
        skipped_no_anchor += 1
        continue
    page.write_text(new_text, encoding="utf-8")
    touched += 1
    print(f"  Injected: {slug}-ma  ({data['name']})")

print(f"\nResults:")
print(f"  Modified:           {touched}")
print(f"  Already had it:     {skipped_already}")
print(f"  Page not found:     {skipped_missing_page}")
print(f"  No services anchor: {skipped_no_anchor}")
