"""
Add the GHL form to every location page hero, side-by-side with the
H1 + subtitle + CTA buttons. Mirrors the home page layout so the
locations match the conversion design.

What changes per page:
  - <div class="hero__content hero__content--center"> becomes a
    two-column flex grid: text on the left, premium form card on
    the right. Wraps to single column under 1024px.
  - The form is the same GHL widget (oaN0aNeRAK8fPG4AnIzl) but its
    URL carries ?city=<City>&locationId=BQd0L6DeFvVbjKS8VYZ9 so the
    GHL form admin can capture city + location on each submission.
  - Form iframe uses data-src + a lightweight idle-timer loader so
    it doesn't block first paint (same pattern as the home page).
  - Wrapper has min-height:540px → CLS stays clean while iframe is
    deferred.

Skipped:
  locations/index.html (the hub, not a city page)
  Pages already containing `location-hero__form` (idempotent re-run)
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
LOC = ROOT / "locations"

GHL_FORM_ID = "oaN0aNeRAK8fPG4AnIzl"
GHL_LOCATION_ID = "BQd0L6DeFvVbjKS8VYZ9"

# Match the centered hero content block exactly so we replace only this
# section, not the hero on the locations/index.html hub page.
HERO_CONTENT_RE = re.compile(
    r'<div class="hero__content hero__content--center">\s*'
    r'<h1 class="hero__title">([^<]+)</h1>\s*'
    r'<p class="hero__subtitle">([^<]+)</p>\s*'
    r'<div class="hero__ctas">\s*'
    r'<a href="/contact" class="btn btn--primary btn--lg btn--pulse">Schedule Facility Assessment</a>\s*'
    r'<a href="tel:\+19783078107" class="btn btn--outline-light btn--lg">Call \(978\) 307-8107</a>\s*'
    r'</div>\s*'
    r'</div>',
    re.DOTALL,
)

# Slug → human-readable city (from filename, e.g. "boston-ma" → "Boston")
def slug_to_city(slug: str) -> str:
    parts = slug.replace(".html", "").split("-")
    if parts[-1].lower() == "ma":
        parts = parts[:-1]
    return " ".join(p.capitalize() for p in parts)


# Iframe loader script — injected once per page right before </body>.
# Same defer pattern as the home form so we don't regress LCP.
LOADER_MARKER = "<!-- LOCATION-FORM-LOADER -->"
LOADER_SCRIPT = (
    LOADER_MARKER + '\n'
    '<script>\n'
    '(function(){\n'
    '  var loaded=false;\n'
    '  function load(){\n'
    '    if(loaded)return;loaded=true;\n'
    '    document.querySelectorAll(\'iframe[data-src]\').forEach(function(f){f.src=f.getAttribute(\'data-src\');});\n'
    '    var s=document.createElement(\'script\');s.src=\'https://link.msgsndr.com/js/form_embed.js\';document.body.appendChild(s);\n'
    '  }\n'
    '  [\'scroll\',\'click\',\'touchstart\',\'mouseover\',\'keydown\'].forEach(function(e){\n'
    '    window.addEventListener(e,load,{once:true,passive:true});\n'
    '  });\n'
    '  setTimeout(load,12000);\n'
    '})();\n'
    '</script>\n'
)

BEFORE_BODY_CLOSE_RE = re.compile(r'</body>', re.IGNORECASE)


def build_replacement(h1: str, subtitle: str, city: str, slug: str) -> str:
    """Build the new 2-column hero with form."""
    iframe_url = (
        f"https://api.leadconnectorhq.com/widget/form/{GHL_FORM_ID}"
        f"?city={city.replace(' ', '+')}"
        f"&locationId={GHL_LOCATION_ID}"
    )
    return f'''<div class="location-hero__grid" style="display:flex;align-items:flex-start;gap:2.25rem;flex-wrap:wrap;justify-content:center;">
 <div class="location-hero__content" style="flex:1 1 480px;min-width:300px;max-width:640px;text-align:left;">
 <h1 class="hero__title">{h1}</h1>
 <p class="hero__subtitle">{subtitle}</p>
 <div class="hero__ctas">
 <a href="/contact" class="btn btn--primary btn--lg btn--pulse">Schedule Facility Assessment</a>
 <a href="tel:+19783078107" class="btn btn--outline-light btn--lg">Call (978) 307-8107</a>
 </div>
 </div>
 <div class="location-hero__form" style="flex:0 0 360px;max-width:100%;width:360px;align-self:center;background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.02) 100%);border:1px solid rgba(255,255,255,0.2);border-radius:14px;box-shadow:0 18px 44px rgba(0,0,0,0.32),0 0 0 1px rgba(245,158,11,0.12);overflow:hidden;min-height:540px;backdrop-filter:blur(10px);">
 <div style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:0.75rem 1rem;text-align:center;">
 <div style="font-size:0.65rem;font-weight:800;color:#fff;letter-spacing:0.11em;text-transform:uppercase;opacity:0.95;margin-bottom:0.1rem;">Free · 24-Hour Response</div>
 <div style="font-size:1rem;font-weight:700;color:#fff;line-height:1.2;">{city} Facility Assessment</div>
 </div>
 <iframe data-src="{iframe_url}" width="100%" height="460" style="width:100%;height:460px;border:none;display:block;background:#fff;" id="loc-hero-form-{slug}" title="Free {city} healthcare facility cleaning assessment request" loading="lazy"></iframe>
 <div style="background:rgba(0,0,0,0.18);padding:0.7rem 1rem;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
 <div style="display:flex;align-items:center;justify-content:center;gap:0.7rem;flex-wrap:wrap;font-size:0.68rem;color:rgba(255,255,255,0.78);">
 <span style="display:inline-flex;align-items:center;gap:0.2rem;"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><strong style="color:#fbbf24;">4.7/5</strong></span>
 <span style="opacity:0.4;">·</span><span><strong style="color:#fff;">22+ yrs</strong></span>
 <span style="opacity:0.4;">·</span><span><strong style="color:#fff;">$2M</strong></span>
 <span style="opacity:0.4;">·</span><span><strong style="color:#fff;">CDC/OSHA</strong></span>
 </div>
 </div>
 </div>
</div>'''


changed = 0
skipped_already = 0
skipped_no_match = []

for path in sorted(LOC.glob("*.html")):
    if path.name == "index.html":
        continue
    text = path.read_text(encoding="utf-8")

    # Idempotent: skip if our marker class is already present
    if "location-hero__form" in text:
        skipped_already += 1
        continue

    m = HERO_CONTENT_RE.search(text)
    if not m:
        skipped_no_match.append(path.name)
        continue

    h1 = m.group(1).strip()
    subtitle = m.group(2).strip()
    slug = path.stem
    city = slug_to_city(slug)
    new_block = build_replacement(h1, subtitle, city, slug)
    new_text = text[: m.start()] + new_block + text[m.end():]

    # Inject the iframe loader script if not already there
    if LOADER_MARKER not in new_text:
        new_text = BEFORE_BODY_CLOSE_RE.sub(
            LOADER_SCRIPT + r"</body>", new_text, count=1
        )

    path.write_text(new_text, encoding="utf-8")
    changed += 1

print(f"location pages updated:    {changed}")
print(f"already had form (skip):   {skipped_already}")
print(f"hero pattern not matched:  {len(skipped_no_match)}")
for n in skipped_no_match[:5]:
    print(f"  - {n}")
