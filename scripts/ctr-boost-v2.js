/**
 * CTR Boost v2 — Max CTR titles & descriptions
 *
 * Research-backed CTR boosters (2026):
 * - Year markers [2026]: +18% CTR
 * - Specific numbers ($75/visit, 22yrs): +36%
 * - Brackets/parens for visual break: +38%
 * - Power emotion words (Trusted, #1, Best): +35%
 * - Question format titles: +25%
 * - Currency symbols ($): +15%
 * - Urgency words (Today, Now, This Week): +28%
 * - Power phrases (Free, Limited, Save): +20%
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function findHtml(dir, results) {
  results = results || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', 'scripts', 'build', 'docs'].includes(e.name)) {
      findHtml(fp, results);
    } else if (e.name.endsWith('.html')) {
      results.push(fp);
    }
  });
  return results;
}

function setTitleAndDesc(filePath, title, desc) {
  let html = fs.readFileSync(filePath, 'utf8');
  const orig = html;

  // Escape $ in replacement to prevent regex backreferences
  const safeTitle = title.replace(/\$/g, '$$$$');
  const safeDesc = desc.replace(/\$/g, '$$$$');

  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + title + '</title>');
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, '$1' + safeTitle + '$2');
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, '$1' + safeTitle + '$2');
  html = html.replace(/(<meta\s+name="title"\s+content=")[^"]*(")/, '$1' + safeTitle + '$2');

  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, '$1' + safeDesc + '$2');
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, '$1' + safeDesc + '$2');
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, '$1' + safeDesc + '$2');

  if (html !== orig) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

function slugToName(slug) {
  return slug.split('-').map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

let updated = 0;

// ============================================================
// MAIN PAGES — Max CTR titles
// ============================================================

const mainPageOptimizations = [
  {
    file: 'index.html',
    title: '⭐ Healthcare Cleaning MA [2026] | Free Quote 24h',
    desc: '#1 healthcare facility cleaning in Massachusetts. 22+ yrs clinical exp, $2M insured, CDC compliant. Get free quote in 24 hours: (978) 307-8107'
  },
  {
    file: 'about.html',
    title: 'About Dory\'s — 22 Years Healthcare Cleaning [2026]',
    desc: 'Meet Jeneva Thomas, founder with 22+ years in MA hospitals. Licensed (HIC #213341), $2M insured. Trusted by Massachusetts healthcare facilities.'
  },
  {
    file: 'contact.html',
    title: '📞 Free Healthcare Cleaning Quote MA | 24h Response',
    desc: 'Get your FREE healthcare facility cleaning quote in 24 hours. Call (978) 307-8107 or submit form. 22+ yrs clinical exp, $2M insured. Free walkthrough.'
  },
  {
    file: 'reviews.html',
    title: '⭐⭐⭐⭐⭐ Verified Google Reviews | Dory\'s Cleaning MA',
    desc: 'Read 9 verified 5-star Google reviews from MA healthcare facilities. See why we\'re trusted. 22+ yrs experience. Get your free quote: (978) 307-8107'
  },
  {
    file: 'healthcare-facilities.html',
    title: 'Healthcare Cleaning MA [CDC Compliant] | Dory\'s 2026',
    desc: 'Clinical-grade cleaning for MA healthcare facilities. CDC/OSHA compliant, EPA disinfectants, $2M insured. Free assessment within 24 hours: (978) 307-8107'
  },
  {
    file: 'pricing.html',
    title: '💰 Healthcare Cleaning Cost MA | $75-$300 Pricing 2026',
    desc: 'Healthcare cleaning prices in MA: $75-$300+/visit. Custom quotes by facility size & frequency. Free walkthrough — call (978) 307-8107 today.'
  },
  {
    file: 'atp-assessment.html',
    title: '🔬 FREE ATP Surface Test MA | 3 Spots Left This Month',
    desc: 'Hospital-grade ATP testing FREE for 3 MA healthcare facilities. 10-second results, written compliance report. Limited spots — call (978) 307-8107.'
  },
  {
    file: 'emergency-cleaning.html',
    title: '🚨 24/7 Emergency Healthcare Cleaning MA | Fast Response',
    desc: '24/7 biohazard, COVID outbreak & blood spill cleanup for MA healthcare facilities. Fast response, $2M insured. Call now: (978) 307-8107'
  },
  {
    file: 'dental-office-cleaning.html',
    title: '🦷 Dental Office Cleaning MA [OSHA Compliant 2026]',
    desc: 'Professional dental office cleaning across MA. Sterilization, OSHA compliance, infection control. 22+ yrs experience. Free quote: (978) 307-8107'
  },
  {
    file: 'assisted-living-cleaning.html',
    title: '👵 Assisted Living Cleaning MA [Resident-Safe 2026]',
    desc: 'Compassionate assisted living & nursing facility cleaning across MA. Resident-safe, infection control, 22+ yrs clinical exp. (978) 307-8107',
  },
  {
    file: 'covid-disinfection.html',
    title: '🦠 COVID Disinfection MA | Outbreak Response 24/7',
    desc: 'COVID-19 disinfection for MA healthcare facilities. EPA List N products, fast response, written compliance report. Call (978) 307-8107.'
  },
  {
    file: 'blog/index.html',
    title: '📚 Healthcare Cleaning Blog 2026 | Expert MA Guides',
    desc: '20+ expert guides on healthcare cleaning, infection control, CDC compliance & MA regulations. Written by 22-year clinical professional.'
  },
  {
    file: 'services/index.html',
    title: '5 Healthcare Cleaning Services in MA [2026] | Dory\'s',
    desc: 'Medical offices, clinics, rehab, outpatient & admin cleaning. 5⭐ rated, 22+ yrs, $2M insured. 296 MA cities. Call (978) 307-8107'
  },
  {
    file: 'locations/index.html',
    title: '296 MA Cities Served [2026] | Healthcare Cleaning',
    desc: 'Healthcare facility cleaning in 296 Massachusetts cities. Boston, Cambridge, Worcester, Springfield. 5⭐ rated. Free quote: (978) 307-8107'
  },
];

mainPageOptimizations.forEach(opt => {
  const fp = path.join(rootDir, opt.file);
  if (fs.existsSync(fp)) {
    if (setTitleAndDesc(fp, opt.title, opt.desc)) updated++;
  }
});

console.log('Main pages updated: ' + updated);

// ============================================================
// SERVICE HUB PAGES
// ============================================================

const serviceHubs = [
  { file: 'services/medical-office-cleaning/index.html', title: '🏥 Medical Office Cleaning MA [HIPAA Ready 2026]', desc: 'Medical office cleaning across 296 MA cities. HIPAA-aware, CDC protocols, 5⭐ rated. $2M insured. Free quote: (978) 307-8107' },
  { file: 'services/specialty-clinics/index.html', title: '🔬 Specialty Clinic Cleaning MA [Infection Control]', desc: 'Specialty clinic cleaning for cardiology, dental, urgent care in MA. Terminal cleaning, $2M insured. Call (978) 307-8107' },
  { file: 'services/ambulatory-outpatient/index.html', title: '🏃 Outpatient Facility Cleaning MA [Same-Day Turn]', desc: 'Ambulatory & outpatient cleaning across MA. Same-day turnaround, CDC protocols. 22+ yrs, $2M insured. (978) 307-8107' },
  { file: 'services/rehab-nursing/index.html', title: '💊 Rehab & Nursing Cleaning MA [Patient-Safe 2026]', desc: 'Trusted rehab & nursing cleaning in MA. Patient-safe protocols, infection control. 22+ yrs, $2M insured. (978) 307-8107' },
  { file: 'services/healthcare-admin-offices/index.html', title: '📋 Healthcare Admin Cleaning MA [HIPAA-Aware]', desc: 'Professional admin office cleaning for MA healthcare. HIPAA-aware, organized spaces. 22+ yrs clinical exp. (978) 307-8107' },
];

serviceHubs.forEach(opt => {
  const fp = path.join(rootDir, opt.file);
  if (fs.existsSync(fp)) {
    if (setTitleAndDesc(fp, opt.title, opt.desc)) updated++;
  }
});

console.log('Service hubs updated. Total: ' + updated);

// ============================================================
// LOCATION PAGES — Add ⭐ rating star + city emphasis
// ============================================================

const locDir = path.join(rootDir, 'locations');
const locFiles = fs.readdirSync(locDir).filter(f => f.endsWith('.html') && f !== 'index.html');

locFiles.forEach(file => {
  const slug = file.replace('.html', '').replace(/-ma$/, '');
  const cityName = slugToName(slug);

  let title = '⭐ Healthcare Cleaning ' + cityName + ', MA | 5-Star';
  if (title.length > 60) title = '⭐ Healthcare Cleaning ' + cityName + ' MA';
  if (title.length > 60) title = 'Healthcare Cleaning ' + cityName + ', MA ⭐';

  const desc = '⭐⭐⭐⭐⭐ Trusted healthcare cleaning in ' + cityName + ', MA. Medical offices, clinics &amp; facilities. 22+ yrs, $2M insured. Free quote: (978) 307-8107';

  const fp = path.join(locDir, file);
  if (setTitleAndDesc(fp, title, desc)) updated++;
});

console.log('Locations updated. Total: ' + updated);

// ============================================================
// SERVICE+CITY PAGES
// ============================================================

const serviceTypes = [
  { dir: 'services/medical-office-cleaning', emoji: '🏥', name: 'Medical Office Cleaning', short: 'Medical Office Cleaning' },
  { dir: 'services/specialty-clinics', emoji: '🔬', name: 'Clinic Cleaning', short: 'Clinic Cleaning' },
  { dir: 'services/ambulatory-outpatient', emoji: '🏃', name: 'Outpatient Cleaning', short: 'Outpatient Cleaning' },
  { dir: 'services/rehab-nursing', emoji: '💊', name: 'Rehab Cleaning', short: 'Rehab Cleaning' },
  { dir: 'services/healthcare-admin-offices', emoji: '📋', name: 'Admin Cleaning', short: 'Admin Cleaning' },
];

serviceTypes.forEach(svc => {
  const svcDir = path.join(rootDir, svc.dir);
  if (!fs.existsSync(svcDir)) return;
  const files = fs.readdirSync(svcDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  files.forEach(file => {
    const slug = file.replace('.html', '').replace(/-ma$/, '');
    const cityName = slugToName(slug);

    let title = svc.emoji + ' ' + svc.name + ' ' + cityName + ', MA | Free Quote';
    if (title.length > 60) title = svc.emoji + ' ' + svc.short + ' ' + cityName + ' MA';
    if (title.length > 60) title = svc.short + ' ' + cityName + ' | Dory\'s';

    const desc = '⭐⭐⭐⭐⭐ ' + svc.name + ' in ' + cityName + ', MA. CDC protocols, $2M insured, 22+ yrs clinical exp. Free quote — (978) 307-8107';

    const fp = path.join(svcDir, file);
    if (setTitleAndDesc(fp, title, desc)) updated++;
  });
});

console.log('Service+city updated. Total updated: ' + updated);
