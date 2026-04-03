/**
 * CTR & Impressions Optimizer
 *
 * Rewrites all title tags and meta descriptions for maximum CTR.
 *
 * Title rules (2026 SEO):
 * - Under 60 characters (Google truncates at ~60)
 * - Primary keyword first
 * - Power words: "Trusted", "Free", numbers
 * - Brand name last after pipe
 *
 * Meta description rules:
 * - Under 155 characters (Google truncates at ~155-160)
 * - Start with action verb or benefit
 * - Include differentiator (22 yrs, $2M, license)
 * - End with CTA (phone number or action)
 */

const fs = require('fs');
const path = require('path');

function findFiles(dir, ext, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', '.vercel'].includes(entry.name)) {
      findFiles(fp, ext, results);
    } else if (entry.name.endsWith(ext)) {
      results.push(fp);
    }
  }
  return results;
}

function setAllTitles(html, title) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  );
  html = html.replace(
    /(<meta\s+(?:name|property)="twitter:title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  );
  // Also handle name="title" meta
  html = html.replace(
    /(<meta\s+name="title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  );
  return html;
}

function setAllDescs(html, desc) {
  html = html.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${desc}$2`
  );
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${desc}$2`
  );
  html = html.replace(
    /(<meta\s+(?:name|property)="twitter:description"\s+content=")[^"]*(")/,
    `$1${desc}$2`
  );
  return html;
}

const rootDir = path.resolve(__dirname, '..');
let totalFixed = 0;

function processFile(relPath, titleFn, descFn) {
  const fp = path.join(rootDir, relPath);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;
  if (titleFn) html = titleFn(html);
  if (descFn) html = descFn(html);
  if (html !== orig) {
    fs.writeFileSync(fp, html);
    totalFixed++;
  }
}

// ============================================================
// 1. MAIN PAGES — Hand-crafted for maximum CTR
// ============================================================

processFile('index.html',
  h => setAllTitles(h, 'Healthcare Facility Cleaning MA | Dorys Cleaning'),
  h => setAllDescs(h, 'Trusted healthcare cleaning for MA medical offices, clinics &amp; nursing facilities. 22+ yrs clinical experience, $2M insured. Call (978) 307-8107')
);

processFile('about.html',
  h => setAllTitles(h, 'About Dorys \u2014 22 Years Healthcare Cleaning MA'),
  h => setAllDescs(h, 'Meet Jeneva Thomas, founder with 22+ years inside clinical environments. MA licensed (HIC #213341), $2M insured. See why facilities trust us.')
);

processFile('contact.html',
  h => setAllTitles(h, 'Contact Us \u2014 Free Facility Assessment | Dorys'),
  h => setAllDescs(h, 'Request your free healthcare facility assessment. Call (978) 307-8107. 22+ yrs clinical experience, $2M insured. Response within 24 hours.')
);

processFile('healthcare-facilities.html',
  h => setAllTitles(h, 'For Healthcare Facilities in MA | Dorys Cleaning'),
  h => setAllDescs(h, 'Clinical-grade cleaning built for MA healthcare facilities. CDC/OSHA protocols, EPA disinfectants, $2M insured. Free assessment: (978) 307-8107')
);

processFile('reviews.html',
  h => setAllTitles(h, '5-Star Reviews \u2014 Healthcare Cleaning | Dorys MA'),
  h => setAllDescs(h, 'See why MA healthcare facilities rate us 5 stars. 22+ years trusted medical office &amp; clinic cleaning. Read verified reviews. (978) 307-8107')
);

processFile('privacy.html',
  h => setAllTitles(h, 'Privacy Policy | Dorys Cleaning Services'),
  null
);

processFile('terms.html',
  h => setAllTitles(h, 'Terms of Service | Dorys Cleaning Services'),
  null
);

processFile('sitemap.html',
  h => setAllTitles(h, 'Sitemap | Dorys Cleaning Services MA'),
  null
);

processFile('blog/index.html',
  h => setAllTitles(h, 'Healthcare Cleaning Blog &amp; Guides | Dorys MA'),
  h => setAllDescs(h, 'Expert guides on infection control, compliance &amp; CDC protocols for MA healthcare facilities. Tips from a 22-year clinical cleaning professional.')
);

// ============================================================
// 2. SERVICE HUB PAGES (5 category index pages)
// ============================================================

const serviceHubs = [
  {
    path: 'services/index.html',
    title: 'Healthcare Cleaning Services in MA | Dorys',
    desc: '5 specialized cleaning services for MA healthcare facilities. Medical offices, clinics, rehab &amp; more. 22+ yrs, $2M insured. Call (978) 307-8107'
  },
  {
    path: 'services/medical-office-cleaning/index.html',
    title: 'Medical Office Cleaning MA | Dorys Cleaning',
    desc: 'Professional medical office cleaning across 100+ MA cities. CDC protocols, HIPAA-aware, $2M insured. Free quote: (978) 307-8107'
  },
  {
    path: 'services/specialty-clinics/index.html',
    title: 'Specialty Clinic Cleaning MA | Dorys Cleaning',
    desc: 'Clinic cleaning for cardiology, dental &amp; urgent care in MA. Terminal cleaning, infection control. 22+ yrs, $2M insured. (978) 307-8107'
  },
  {
    path: 'services/ambulatory-outpatient/index.html',
    title: 'Outpatient Facility Cleaning MA | Dorys',
    desc: 'Ambulatory &amp; outpatient facility cleaning across MA. Fast turnaround, CDC protocols, $2M insured. 22+ yrs experience. (978) 307-8107'
  },
  {
    path: 'services/rehab-nursing/index.html',
    title: 'Rehab &amp; Nursing Facility Cleaning | Dorys MA',
    desc: 'Trusted cleaning for MA rehab centers &amp; nursing homes. Patient-safe protocols, infection control. 22+ yrs, $2M insured. (978) 307-8107'
  },
  {
    path: 'services/healthcare-admin-offices/index.html',
    title: 'Healthcare Admin Office Cleaning | Dorys MA',
    desc: 'Professional cleaning for healthcare admin offices in MA. HIPAA-aware, organized spaces. 22+ yrs clinical experience. Call (978) 307-8107'
  },
];

for (const hub of serviceHubs) {
  processFile(hub.path,
    h => setAllTitles(h, hub.title),
    h => setAllDescs(h, hub.desc)
  );
}

// ============================================================
// 3. BLOG POSTS — Curiosity-driven, click-worthy titles
// ============================================================

const blogPosts = [
  {
    path: 'blog/infection-control-best-practices-medical-offices.html',
    title: 'Infection Control for Medical Offices | Best Practices',
    desc: 'Complete guide to disinfection &amp; high-touch surface cleaning in medical offices. CDC protocols explained by a 22-year clinical cleaning pro.'
  },
  {
    path: 'blog/cdc-compliance-environmental-sanitation-clinics.html',
    title: 'CDC Compliance for Clinic Sanitation | Expert Guide',
    desc: 'How specialty clinics meet CDC sanitation standards. Protocols, EPA products &amp; documentation requirements. By a 22-year clinical professional.'
  },
  {
    path: 'blog/choosing-healthcare-cleaning-service-massachusetts.html',
    title: 'How to Choose Healthcare Cleaning in MA | 7 Tips',
    desc: '7 questions to ask before hiring a healthcare cleaning service in Massachusetts. Credentials, red flags &amp; what to look for.'
  },
  {
    path: 'blog/dental-office-sterilization-environmental-services.html',
    title: 'Rehab Center Sanitation Guide | What You Need',
    desc: 'Sanitation guide for rehabilitation centers. Safety protocols, resident comfort &amp; compliance requirements explained by a clinical cleaning expert.'
  },
  {
    path: 'blog/epa-registered-disinfectants-healthcare-guide.html',
    title: 'EPA Disinfectants for Healthcare | Complete Guide',
    desc: 'How to choose EPA-registered disinfectants for healthcare. List N, kill claims &amp; application protocols explained. Expert guide.'
  },
  {
    path: 'blog/healthcare-cleaning-staff-training-certification.html',
    title: 'Healthcare Cleaning Staff Training | What to Know',
    desc: 'What training do healthcare cleaning staff need? Bloodborne pathogens, PPE, infection control &amp; HIPAA requirements explained.'
  },
  {
    path: 'blog/hipaa-compliant-cleaning-medical-offices.html',
    title: 'Outpatient Cleaning Around Clinical Schedules',
    desc: 'How to schedule facility cleaning around clinical workflows. Minimize disruption while maintaining infection control. Expert tips inside.'
  },
  {
    path: 'blog/infection-prevention-assisted-living-facilities.html',
    title: 'Infection Prevention in Specialty Clinics | Guide',
    desc: 'Sanitation protocols for specialty clinics that protect patients &amp; staff. High-touch disinfection, compliance &amp; workflow-safe cleaning.'
  },
  {
    path: 'blog/operating-room-terminal-cleaning-protocols.html',
    title: 'Admin Office Cleaning for Healthcare Operations',
    desc: 'Why healthcare admin office cleaning impacts clinical operations. Professional standards, HIPAA awareness &amp; staff productivity tips.'
  },
  {
    path: 'blog/scheduled-sanitation-program-healthcare-facilities.html',
    title: 'Scheduled Sanitation for Healthcare | How to Plan',
    desc: 'Build a structured sanitation program for your facility. Frequency, documentation &amp; quality control explained by a 22-year clinical pro.'
  },
];

for (const post of blogPosts) {
  processFile(post.path,
    h => setAllTitles(h, post.title),
    h => setAllDescs(h, post.desc)
  );
}

// ============================================================
// 4. LOCATION PAGES (101 pages) — Standardized CTR format
// ============================================================

const locDir = path.join(rootDir, 'locations');
const locFiles = fs.readdirSync(locDir).filter(f => f.endsWith('.html') && f !== 'index.html');

processFile('locations/index.html',
  h => setAllTitles(h, 'Service Areas \u2014 100+ MA Cities | Dorys Cleaning'),
  h => setAllDescs(h, 'Healthcare cleaning across 100+ Massachusetts cities. Marlborough, Worcester, Framingham &amp; more. 22+ yrs, $2M insured. (978) 307-8107')
);

for (const file of locFiles) {
  const citySlug = file.replace('.html', '').replace(/-ma$/, '');
  const cityName = citySlug
    .split('-')
    .map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const fp = path.join(locDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;

  // Title: "Healthcare Cleaning [City], MA | Dorys" — under 60
  let title = `Healthcare Cleaning ${cityName}, MA | Dorys`;
  const decoded = title.replace(/&amp;/g, '&');
  if (decoded.length > 60) {
    title = `Healthcare Cleaning ${cityName} MA | Dorys`;
  }
  if (title.replace(/&amp;/g, '&').length > 60) {
    title = `Healthcare Cleaning ${cityName} | Dorys`;
  }
  html = setAllTitles(html, title);

  // Meta: Under 155 chars with CTA
  let desc = `Trusted healthcare cleaning in ${cityName}, MA. Medical offices, clinics &amp; facilities. 22+ yrs, $2M insured. Free assessment: (978) 307-8107`;
  if (desc.replace(/&amp;/g, '&').length > 155) {
    desc = `Healthcare cleaning in ${cityName}, MA. Medical offices &amp; clinics. 22+ yrs, $2M insured. Call (978) 307-8107`;
  }
  html = setAllDescs(html, desc);

  if (html !== orig) {
    fs.writeFileSync(fp, html);
    totalFixed++;
  }
}

// ============================================================
// 5. SERVICE + CITY PAGES (505 pages)
// ============================================================

const serviceTypes = [
  {
    dir: 'services/medical-office-cleaning',
    prefix: 'Medical Office Cleaning',
    desc: (city) => `Medical office cleaning in ${city}, MA. CDC protocols, HIPAA-aware, $2M insured. 22+ yrs clinical experience. Call (978) 307-8107`
  },
  {
    dir: 'services/specialty-clinics',
    prefix: 'Clinic Cleaning',
    desc: (city) => `Specialty clinic cleaning in ${city}, MA. Infection control, terminal cleaning, $2M insured. 22+ yrs experience. (978) 307-8107`
  },
  {
    dir: 'services/ambulatory-outpatient',
    prefix: 'Outpatient Cleaning',
    desc: (city) => `Outpatient facility cleaning in ${city}, MA. Fast turnaround, CDC protocols, $2M insured. 22+ yrs experience. (978) 307-8107`
  },
  {
    dir: 'services/rehab-nursing',
    prefix: 'Rehab Cleaning',
    desc: (city) => `Rehab &amp; nursing cleaning in ${city}, MA. Patient-safe protocols, $2M insured. 22+ yrs clinical experience. Call (978) 307-8107`
  },
  {
    dir: 'services/healthcare-admin-offices',
    prefix: 'Admin Office Cleaning',
    desc: (city) => `Healthcare admin cleaning in ${city}, MA. HIPAA-aware, professional maintenance. 22+ yrs, $2M insured. Call (978) 307-8107`
  },
];

for (const svc of serviceTypes) {
  const svcDir = path.join(rootDir, svc.dir);
  if (!fs.existsSync(svcDir)) continue;

  const files = fs.readdirSync(svcDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  for (const file of files) {
    const citySlug = file.replace('.html', '').replace(/-ma$/, '');
    const cityName = citySlug
      .split('-')
      .map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const fp = path.join(svcDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const orig = html;

    // Title under 60 chars
    let title = `${svc.prefix} ${cityName}, MA | Dorys`;
    if (title.replace(/&amp;/g, '&').length > 60) {
      title = `${svc.prefix} ${cityName} | Dorys`;
    }
    if (title.replace(/&amp;/g, '&').length > 60) {
      title = `${svc.prefix} in ${cityName} | Dorys`;
    }
    html = setAllTitles(html, title);

    // Description
    html = setAllDescs(html, svc.desc(cityName));

    if (html !== orig) {
      fs.writeFileSync(fp, html);
      totalFixed++;
    }
  }
}

// ============================================================
// VERIFICATION
// ============================================================

console.log(`\nCTR optimization complete. Files updated: ${totalFixed}`);

const allHtml = findFiles(rootDir, '.html');
let overTitle = 0, overDesc = 0, noCta = 0;
let titleExamples = [];

for (const f of allHtml) {
  const c = fs.readFileSync(f, 'utf8');
  const rel = path.relative(rootDir, f);

  const tm = c.match(/<title>([^<]*)<\/title>/);
  if (tm) {
    const decoded = tm[1].replace(/&amp;/g, '&').replace(/&mdash;/g, '\u2014').replace(/&#8212;/g, '\u2014');
    if (decoded.length > 60) {
      overTitle++;
      if (titleExamples.length < 10) titleExamples.push(`  ${decoded.length}ch: ${rel} -> "${decoded}"`);
    }
  }

  const dm = c.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  if (dm) {
    const decoded = dm[1].replace(/&amp;/g, '&');
    if (decoded.length > 160) overDesc++;
    if (!decoded.match(/978|call|free|contact|schedule/i)) noCta++;
  }
}

console.log(`\n=== QUALITY REPORT ===`);
console.log(`Total pages: ${allHtml.length}`);
console.log(`Titles over 60 chars: ${overTitle}`);
if (titleExamples.length > 0) {
  console.log(`Examples:`);
  titleExamples.forEach(e => console.log(e));
}
console.log(`Descriptions over 160 chars: ${overDesc}`);
console.log(`Descriptions without CTA: ${noCta}`);
