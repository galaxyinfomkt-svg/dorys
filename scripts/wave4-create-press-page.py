"""
Create /press.html as a media kit / press hub.

Purpose:
  Backlinkable target. Journalists, bloggers, podcast hosts who need
  a citation source for "MA healthcare cleaning expert" go here.
  Acts as a high-authority page on the site and pulls citations the
  site otherwise wouldn't earn.

Strategy:
  Reuse about.html as scaffold so the page inherits the global nav,
  top-bar, header, breadcrumb, footer, and existing CSS — then swap
  the <head> metadata + schema and the <main> content. No new CSS
  needed; everything reuses utility classes already loaded site-wide.
"""

import re
from pathlib import Path

ROOT = Path(r"c:/Users/Admin/Downloads/dorys")
ABOUT = ROOT / "about.html"
OUT = ROOT / "press.html"

text = ABOUT.read_text(encoding="utf-8")

# -- 1. Swap head: title, description, canonical, og --
text = text.replace(
    "<title>About Dory's — 22 Years Healthcare Cleaning</title>",
    "<title>Press & Media Kit | Dory's Cleaning Services Inc.</title>",
)
text = re.sub(
    r'<meta name="description" content="[^"]*">',
    '<meta name="description" content="Press kit, media inquiries, founder bio, brand assets, and verified facts for journalists covering Massachusetts healthcare cleaning. Contact (978) 307-8107.">',
    text,
    count=1,
)
text = text.replace(
    '<link rel="canonical" href="https://doryscleaningservices.com/about">',
    '<link rel="canonical" href="https://doryscleaningservices.com/press">',
)
text = text.replace(
    "https://doryscleaningservices.com/about", "https://doryscleaningservices.com/press"
)
text = re.sub(
    r'<meta property="og:title" content="[^"]*">',
    '<meta property="og:title" content="Press & Media Kit | Dory\'s Cleaning Services">',
    text,
    count=1,
)
text = re.sub(
    r'<meta name="twitter:title" content="[^"]*">',
    '<meta name="twitter:title" content="Press & Media Kit | Dory\'s Cleaning Services">',
    text,
    count=1,
)
text = re.sub(
    r'<meta property="og:description" content="[^"]*">',
    '<meta property="og:description" content="Press kit, founder bio, brand assets, and verified facts for media covering Massachusetts healthcare cleaning. Media contact: (978) 307-8107.">',
    text,
    count=1,
)

# -- 2. Swap AboutPage schema -> CollectionPage + NewsMediaOrganization --
text = re.sub(
    r'<script type="application/ld\+json">\s*\{\s*"@context": "https://schema\.org",\s*"@type": "AboutPage".*?\}\s*\}\s*</script>',
    '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://doryscleaningservices.com/press#webpage",
      "url": "https://doryscleaningservices.com/press",
      "name": "Press & Media Kit",
      "isPartOf": {"@id": "https://doryscleaningservices.com/#website"},
      "about": {"@id": "https://doryscleaningservices.com/#business"},
      "description": "Press kit, founder bio, brand assets, and verified facts for media covering Massachusetts healthcare cleaning."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://doryscleaningservices.com/"},
        {"@type": "ListItem", "position": 2, "name": "Press & Media Kit", "item": "https://doryscleaningservices.com/press"}
      ]
    },
    {
      "@type": "Person",
      "@id": "https://doryscleaningservices.com/#founder",
      "name": "Jeneva Thomas",
      "jobTitle": "Founder & CEO",
      "worksFor": {"@id": "https://doryscleaningservices.com/#business"},
      "knowsAbout": ["Healthcare facility cleaning","Infection control","CDC environmental cleaning guidelines","OSHA bloodborne pathogen compliance","HIPAA-aware environmental services","Massachusetts DPH facility standards"],
      "description": "Founder and CEO of Dory’s Cleaning Services Inc. 22+ years leading clinical-grade environmental cleaning programs for Massachusetts healthcare facilities."
    }
  ]
}
</script>''',
    text,
    count=1,
    flags=re.DOTALL,
)

# -- 3. Replace breadcrumb text "About" -> "Press & Media Kit" --
text = re.sub(
    r'(<nav class="breadcrumb">.*?<li class="breadcrumb__item" aria-current="page">)[^<]+(</li>)',
    r'\g<1>Press & Media Kit\g<2>',
    text,
    count=1,
    flags=re.DOTALL,
)

# -- 4. Replace <main> ... </main> with our press kit content --
PRESS_MAIN = '''<main id="main-content">
 <section class="hero hero--inner">
 <div class="hero__background">
 <img src="/assets/images/hero/about-hero.webp" alt="Dory's Cleaning Services Press & Media Kit" loading="eager" fetchpriority="high" width="1200" height="600">
 <div class="hero__overlay hero__overlay--gradient"></div>
 </div>
 <div class="container">
 <div class="hero__content hero__content--center">
 <h1 class="hero__title">Press &amp; Media Kit</h1>
 <p class="hero__subtitle">Verified facts, founder bio, brand assets, and media contact for journalists and editors covering Massachusetts healthcare cleaning, infection control, and clinical environmental services.</p>
 <div class="hero__ctas">
 <a href="mailto:contact@doryscleaningservices.com?subject=Media%20Inquiry" class="btn btn--primary btn--lg">Email Media Contact</a>
 <a href="tel:+19783078107" class="btn btn--outline-light btn--lg">Call (978) 307-8107</a>
 </div>
 </div>
 </div>
 </section>

 <section class="section">
 <div class="container container--narrow">
 <h2 class="section__title">Quick Facts</h2>
 <p class="section__subtitle">Cite freely. Please credit "Dory&rsquo;s Cleaning Services Inc., Marlborough, MA" with a link to <a href="https://doryscleaningservices.com/">doryscleaningservices.com</a>.</p>
 <div style="background:#f8fafc;border-radius:12px;padding:1.5rem;margin-top:1.5rem;">
   <table style="width:100%;border-collapse:collapse;font-size:1rem;">
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;width:40%;">Legal name</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">Dory&rsquo;s Cleaning Services Inc.</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Founded</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">2003</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Founder &amp; CEO</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">Jeneva Thomas</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Headquarters</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">Marlborough, MA 01752</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Industry</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">Commercial healthcare facility environmental services</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Service area</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">296 cities across Massachusetts</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Years of experience</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">22+</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">License</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">MA HIC #213341</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Insurance</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">$2,000,000 general liability</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#64748b;">Compliance</td><td style="padding:0.625rem 0.75rem;border-bottom:1px solid #e2e8f0;color:#1a1a2e;font-weight:600;">CDC, OSHA 29 CFR 1910.1030, EPA, HIPAA-aware</td></tr>
     <tr><td style="padding:0.625rem 0.75rem;color:#64748b;">Google rating</td><td style="padding:0.625rem 0.75rem;color:#1a1a2e;font-weight:600;">4.7 / 5.0 (10 verified reviews)</td></tr>
   </table>
 </div>
 </div>
 </section>

 <section class="section" style="background:#f8fafc;">
 <div class="container container--narrow">
 <h2 class="section__title">Founder Bio &mdash; Jeneva Thomas</h2>
 <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.25rem;"><strong>Short bio (50 words):</strong> Jeneva Thomas is the founder and CEO of Dory&rsquo;s Cleaning Services Inc., a Marlborough, MA-based clinical environmental services company serving healthcare facilities across 296 Massachusetts cities. With 22+ years inside hospital and outpatient environments, she leads infection control programs, ATP verification testing, and OSHA-compliant cleaning protocols.</p>
 <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.25rem;"><strong>Long bio (150 words):</strong> Jeneva Thomas founded Dory&rsquo;s Cleaning Services Inc. in 2003 with a singular focus: bring hospital-grade environmental services standards to Massachusetts medical offices, specialty clinics, ambulatory facilities, rehabilitation centers, and healthcare administrative offices. Over 22+ years, she has built a clinical cleaning practice grounded in CDC environmental cleaning guidelines, OSHA Bloodborne Pathogens compliance (29 CFR 1910.1030), EPA-registered hospital-grade disinfectants, and ATP bioluminescence verification testing &mdash; the same evidence-based protocols used by major teaching hospitals. Dory&rsquo;s now serves 296 Massachusetts cities with documented compliance reports for Joint Commission, AAAHC, CARF, and Massachusetts DPH surveys. Licensed (MA HIC #213341) and insured ($2,000,000 liability), the company operates with the discipline of a healthcare partner, not a janitorial vendor. Jeneva is available for expert commentary on infection control, environmental cleaning compliance, and clinical sanitation best practices.</p>
 <p style="font-size:1.0625rem;line-height:1.75;color:#475569;"><strong>Expert commentary topics:</strong> Healthcare-associated infections (HAIs), terminal cleaning protocols, ATP bioluminescence testing, EPA List N disinfectants, OSHA compliance for medical office staff, Joint Commission environmental services surveys, MA DPH facility cleaning requirements, COVID disinfection legacy in clinical settings, infection prevention in assisted living, HIPAA-aware environmental services.</p>
 </div>
 </section>

 <section class="section">
 <div class="container container--narrow">
 <h2 class="section__title">Brand Assets</h2>
 <p class="section__subtitle">Use freely in articles, blog posts, and citations. Right-click to save.</p>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;margin-top:1.5rem;">
   <a href="/assets/images/logo/logo-original.jpg" download style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;text-align:center;">
     <img src="/assets/images/logo/logo-80.webp" alt="Dory's Cleaning Services Logo" width="180" height="60" style="margin:0 auto 0.75rem;">
     <div style="font-weight:600;color:#1a1a2e;">Logo (JPG)</div>
     <div style="font-size:0.875rem;color:#64748b;">High-resolution</div>
   </a>
   <a href="/assets/images/logo/favicon.svg" download style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;text-align:center;">
     <img src="/assets/images/logo/favicon.svg" alt="Dory's icon" width="60" height="60" style="margin:0 auto 0.75rem;">
     <div style="font-weight:600;color:#1a1a2e;">Icon (SVG)</div>
     <div style="font-size:0.875rem;color:#64748b;">Vector, any size</div>
   </a>
   <a href="/ai.txt" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;text-align:center;">
     <div style="font-size:2.5rem;margin-bottom:0.5rem;">&#128203;</div>
     <div style="font-weight:600;color:#1a1a2e;">Fact Sheet (ai.txt)</div>
     <div style="font-size:0.875rem;color:#64748b;">Structured facts for AI &amp; reporters</div>
   </a>
   <a href="/llms.txt" style="display:block;padding:1.25rem;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;text-align:center;">
     <div style="font-size:2.5rem;margin-bottom:0.5rem;">&#128221;</div>
     <div style="font-weight:600;color:#1a1a2e;">Press Manifest (llms.txt)</div>
     <div style="font-size:0.875rem;color:#64748b;">Markdown citation guide</div>
   </a>
 </div>
 </div>
 </section>

 <section class="section" style="background:#f8fafc;">
 <div class="container container--narrow">
 <h2 class="section__title">Approved Boilerplate</h2>
 <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.25rem;">Use this paragraph in articles, press releases, or directory listings:</p>
 <blockquote style="background:#fff;border-left:4px solid #2b70e4;padding:1.25rem 1.5rem;border-radius:0 8px 8px 0;font-size:1.0625rem;line-height:1.75;color:#1a1a2e;margin:0;">Dory&rsquo;s Cleaning Services Inc., founded by Jeneva Thomas in 2003, is a Massachusetts-based clinical environmental services company serving 296 cities across the Commonwealth. The firm specializes in CDC-aligned environmental cleaning, OSHA Bloodborne Pathogens compliance, EPA-registered hospital-grade disinfection, and ATP bioluminescence verification testing for medical offices, specialty clinics, ambulatory and outpatient facilities, rehabilitation centers, assisted living, and healthcare administrative offices. Licensed under MA HIC #213341 and insured for $2,000,000 in general liability. Headquartered in Marlborough, MA. (978) 307-8107 &mdash; <a href="https://doryscleaningservices.com/" style="color:#2b70e4;">doryscleaningservices.com</a>.</blockquote>
 </div>
 </section>

 <section class="section">
 <div class="container container--narrow">
 <h2 class="section__title">Media Contact</h2>
 <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.75rem;margin-top:1rem;">
   <p style="font-size:1.0625rem;line-height:1.75;color:#475569;margin:0 0 1rem;">For interviews, expert commentary, fact-checks, or asset requests:</p>
   <ul style="list-style:none;padding:0;margin:0;">
     <li style="padding:0.5rem 0;font-size:1.0625rem;"><strong>Phone:</strong> <a href="tel:+19783078107" style="color:#2b70e4;font-weight:600;">(978) 307-8107</a></li>
     <li style="padding:0.5rem 0;font-size:1.0625rem;"><strong>Email:</strong> <a href="mailto:contact@doryscleaningservices.com?subject=Media%20Inquiry" style="color:#2b70e4;font-weight:600;">contact@doryscleaningservices.com</a></li>
     <li style="padding:0.5rem 0;font-size:1.0625rem;"><strong>Response time:</strong> Within 24 hours, Monday&ndash;Saturday</li>
     <li style="padding:0.5rem 0;font-size:1.0625rem;"><strong>Languages:</strong> English, Portuguese, Spanish</li>
   </ul>
 </div>
 </div>
 </section>

 <section class="section" style="background:#f8fafc;">
 <div class="container container--narrow">
 <h2 class="section__title">Authoritative Sources We Reference</h2>
 <p class="section__subtitle">When citing Dory&rsquo;s standards, you may also reference the source frameworks our protocols align with:</p>
 <ul style="list-style:none;padding:0;margin:1.5rem 0 0;">
   <li style="padding:0.5rem 0;"><a href="https://www.cdc.gov/hai/prevent/resource-limited/environmental-cleaning.html" rel="noopener" target="_blank" style="color:#2b70e4;font-weight:600;">CDC &mdash; Environmental Cleaning for Healthcare Facilities</a></li>
   <li style="padding:0.5rem 0;"><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030" rel="noopener" target="_blank" style="color:#2b70e4;font-weight:600;">OSHA &mdash; Bloodborne Pathogens Standard 29 CFR 1910.1030</a></li>
   <li style="padding:0.5rem 0;"><a href="https://www.epa.gov/pesticide-registration/list-n-disinfectants-coronavirus-covid-19" rel="noopener" target="_blank" style="color:#2b70e4;font-weight:600;">EPA &mdash; List N Disinfectants</a></li>
   <li style="padding:0.5rem 0;"><a href="https://www.mass.gov/orgs/department-of-public-health" rel="noopener" target="_blank" style="color:#2b70e4;font-weight:600;">Massachusetts Department of Public Health</a></li>
   <li style="padding:0.5rem 0;"><a href="https://www.jointcommission.org/" rel="noopener" target="_blank" style="color:#2b70e4;font-weight:600;">The Joint Commission</a></li>
 </ul>
 </div>
 </section>
</main>'''

text = re.sub(
    r'<main id="main-content">.*?</main>',
    PRESS_MAIN,
    text,
    count=1,
    flags=re.DOTALL,
)

OUT.write_text(text, encoding="utf-8")
print(f"wrote {OUT}")
print(f"size: {len(text):,} chars")
