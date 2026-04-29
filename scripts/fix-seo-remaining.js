const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const blogFixes = {
  'blog/bloodborne-pathogen-cleanup-protocols-clinical-environments.html': {
    title: 'Bloodborne Pathogen Cleanup for Clinics | Guide',
    desc: 'OSHA-compliant bloodborne pathogen cleanup protocols for healthcare facilities. PPE, disinfectants, documentation. Expert MA cleaning guide.'
  },
  'blog/covid-cleaning-legacy-permanent-changes-healthcare.html': {
    title: 'COVID-Era Cleaning: 5 Permanent Changes',
    desc: 'How COVID transformed healthcare facility cleaning forever. Higher disinfection standards, ATP testing, and the new normal for MA clinics.'
  },
  'blog/environmental-services-quality-control-healthcare.html': {
    title: 'Quality Control for Healthcare Cleaning',
    desc: 'How to build a quality control program for healthcare environmental services. ATP testing, audits, and compliance documentation.'
  },
  'blog/healthcare-cleaning-vendor-evaluation-rfp-checklist.html': {
    title: 'Healthcare Cleaning RFP Checklist',
    desc: '15-point RFP checklist for evaluating healthcare cleaning vendors. Credentials, protocols, insurance — what every facility manager needs.'
  },
  'blog/healthcare-inspection-preparation-guide-massachusetts.html': {
    title: 'MA Healthcare Inspection Prep Guide',
    desc: 'How to prepare for Massachusetts DPH healthcare facility inspections. Cleaning standards, documentation, and compliance checklist.'
  },
  'blog/high-touch-surface-disinfection-frequency-healthcare.html': {
    title: 'High-Touch Disinfection Frequency Guide',
    desc: 'Best practices for high-touch surface disinfection in healthcare. CDC-recommended frequencies for different facility types and risk areas.'
  },
  'blog/massachusetts-healthcare-facility-sanitation-regulations.html': {
    title: 'MA Healthcare Sanitation Regulations',
    desc: 'Complete guide to Massachusetts healthcare facility sanitation regulations. DPH standards, OSHA, EPA, and Joint Commission requirements.'
  },
  'blog/osha-cleaning-requirements-medical-offices-2026.html': {
    title: 'OSHA Cleaning Rules for Medical Offices 2026',
    desc: 'Updated 2026 OSHA cleaning requirements for medical offices. Bloodborne pathogen, hazcom, and PPE compliance for MA practices.'
  },
  'blog/terminal-cleaning-vs-concurrent-cleaning-healthcare.html': {
    title: 'Terminal vs Concurrent Cleaning Explained',
    desc: 'Difference between terminal and concurrent cleaning in healthcare facilities. Protocols, frequency, and when to use each approach.'
  },
  'blog/dental-office-sterilization-environmental-services.html': {
    title: 'Dental Office Sterilization Guide',
    desc: 'Complete sterilization and environmental services guide for dental offices. CDC, OSHA compliance, and infection control standards.'
  }
};

let titleFixed = 0;
Object.keys(blogFixes).forEach(rel => {
  const fp = path.join(rootDir, rel);
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  const fix = blogFixes[rel];
  c = c.replace(/<title>[^<]*<\/title>/, '<title>' + fix.title + '</title>');
  c = c.replace(/(og:title"\s+content=")[^"]*(")/g, '$1' + fix.title + '$2');
  c = c.replace(/(twitter:title"\s+content=")[^"]*(")/g, '$1' + fix.title + '$2');
  c = c.replace(/(name="title"\s+content=")[^"]*(")/g, '$1' + fix.title + '$2');
  c = c.replace(/(name="description"\s+content=")[^"]*(")/g, '$1' + fix.desc + '$2');
  c = c.replace(/(og:description"\s+content=")[^"]*(")/g, '$1' + fix.desc + '$2');
  c = c.replace(/(twitter:description"\s+content=")[^"]*(")/g, '$1' + fix.desc + '$2');
  if (c !== orig) {
    fs.writeFileSync(fp, c);
    titleFixed++;
  }
});
console.log('Blog titles/descs fixed: ' + titleFixed);

// 404/500 pages
const errorPages = ['404.html', '500.html'];
errorPages.forEach(rel => {
  const fp = path.join(rootDir, rel);
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  const isFour = rel === '404.html';
  const title = isFour ? 'Page Not Found | Dorys Cleaning' : 'Server Error | Dorys Cleaning';
  const desc = isFour
    ? 'Page not found. Return to Dorys Cleaning for healthcare facility cleaning in Massachusetts.'
    : 'Server error. Return to Dorys Cleaning homepage for MA healthcare facility cleaning.';
  if (!c.includes('rel="canonical"')) {
    const canonical = '\n  <link rel="canonical" href="https://doryscleaningservices.com/' + (isFour ? '404' : '500') + '">';
    c = c.replace(/<title>/, canonical + '\n  <title>');
  }
  if (!c.includes('og:title')) {
    const ogTags = '\n  <meta property="og:title" content="' + title + '">' +
      '\n  <meta property="og:description" content="' + desc + '">' +
      '\n  <meta property="og:image" content="https://doryscleaningservices.com/assets/images/hero/about-hero.webp">' +
      '\n  <meta property="og:type" content="website">' +
      '\n  <meta name="twitter:card" content="summary_large_image">' +
      '\n  <meta name="twitter:title" content="' + title + '">';
    c = c.replace('</title>', '</title>' + ogTags);
  }
  if (c !== orig) fs.writeFileSync(fp, c);
});
console.log('404/500 pages fixed');

// Privacy/Terms
const legalPages = ['privacy.html', 'terms.html'];
legalPages.forEach(rel => {
  const fp = path.join(rootDir, rel);
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  const isPrivacy = rel === 'privacy.html';
  const title = isPrivacy ? 'Privacy Policy | Dorys Cleaning Services' : 'Terms of Service | Dorys Cleaning Services';
  const desc = isPrivacy
    ? 'Privacy policy for Dorys Cleaning Services. How we handle your data and protect your privacy.'
    : 'Terms of service for Dorys Cleaning Services. Service agreements and policies.';
  if (!c.includes('og:title')) {
    const ogTags = '\n  <meta property="og:title" content="' + title + '">' +
      '\n  <meta property="og:description" content="' + desc + '">' +
      '\n  <meta property="og:image" content="https://doryscleaningservices.com/assets/images/hero/about-hero.webp">' +
      '\n  <meta property="og:type" content="website">' +
      '\n  <meta property="og:url" content="https://doryscleaningservices.com/' + rel.replace('.html','') + '">' +
      '\n  <meta name="twitter:card" content="summary_large_image">' +
      '\n  <meta name="twitter:title" content="' + title + '">';
    c = c.replace('</head>', ogTags + '\n</head>');
  }
  if (c !== orig) fs.writeFileSync(fp, c);
});
console.log('Privacy/Terms pages fixed');

// Breadcrumbs
const breadcrumbPages = {
  'about.html': '[{"@type":"ListItem","position":1,"name":"Home","item":"https://doryscleaningservices.com/"},{"@type":"ListItem","position":2,"name":"About","item":"https://doryscleaningservices.com/about"}]',
  'contact.html': '[{"@type":"ListItem","position":1,"name":"Home","item":"https://doryscleaningservices.com/"},{"@type":"ListItem","position":2,"name":"Contact","item":"https://doryscleaningservices.com/contact"}]',
  'healthcare-facilities.html': '[{"@type":"ListItem","position":1,"name":"Home","item":"https://doryscleaningservices.com/"},{"@type":"ListItem","position":2,"name":"For Healthcare Facilities","item":"https://doryscleaningservices.com/healthcare-facilities"}]'
};
Object.keys(breadcrumbPages).forEach(rel => {
  const fp = path.join(rootDir, rel);
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  if (!c.includes('BreadcrumbList')) {
    const schema = '\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":' + breadcrumbPages[rel] + '}</script>';
    c = c.replace('</head>', schema + '\n</head>');
    fs.writeFileSync(fp, c);
  }
});
console.log('Breadcrumb schemas added');

// FAQ schema for blog
const blogDir = path.join(rootDir, 'blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');
const blogFaqsDefault = [
  { q: "What healthcare facilities does Dorys Cleaning serve in Massachusetts?", a: "We serve medical offices, specialty clinics, ambulatory and outpatient facilities, rehabilitation and nursing facilities, and healthcare administrative offices across 296 cities in Massachusetts." },
  { q: "Are you licensed and insured for healthcare facility cleaning?", a: "Yes. We hold MA HIC License #213341 and carry $2,000,000 in liability insurance. Our staff is certified in Infection Control, Bloodborne Pathogens, and ATP Bioluminescence Testing." },
  { q: "How can I request a free facility cleaning assessment?", a: "Call (978) 307-8107 or submit our online form. We respond within 24 hours and offer free walkthroughs for Massachusetts healthcare facilities." }
];
let faqAdded = 0;
blogFiles.forEach(file => {
  const fp = path.join(blogDir, file);
  let c = fs.readFileSync(fp, 'utf8');
  if (!c.includes('FAQPage')) {
    const faqs = blogFaqsDefault.map(f =>
      '{"@type":"Question","name":' + JSON.stringify(f.q) + ',"acceptedAnswer":{"@type":"Answer","text":' + JSON.stringify(f.a) + '}}'
    ).join(',');
    const schema = '\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[' + faqs + ']}</script>';
    c = c.replace('</head>', schema + '\n</head>');
    fs.writeFileSync(fp, c);
    faqAdded++;
  }
});
console.log('FAQ schemas added to blog: ' + faqAdded);

// Image width/height
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

let imgFixed = 0;
findHtml(rootDir).forEach(fp => {
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  c = c.replace(/<img(\s+[^>]*?)>/g, (match, attrs) => {
    if (attrs.includes('width=') && attrs.includes('height=')) return match;
    if (!attrs.includes('src=')) return match;
    const srcMatch = attrs.match(/src="([^"]*)"/);
    if (!srcMatch) return match;
    let w = '600', h = '400';
    if (srcMatch[1].includes('logo')) { w = '180'; h = '60'; }
    else if (srcMatch[1].includes('hero')) { w = '1200'; h = '600'; }
    else if (srcMatch[1].includes('icon')) { w = '24'; h = '24'; }
    else if (srcMatch[1].includes('avatar') || srcMatch[1].includes('team')) { w = '300'; h = '300'; }
    else if (srcMatch[1].includes('blog')) { w = '800'; h = '400'; }
    let newAttrs = attrs;
    if (!attrs.includes('width=')) newAttrs += ' width="' + w + '"';
    if (!attrs.includes('height=')) newAttrs += ' height="' + h + '"';
    return '<img' + newAttrs + '>';
  });
  if (c !== orig) {
    fs.writeFileSync(fp, c);
    imgFixed++;
  }
});
console.log('Images width/height added in ' + imgFixed + ' files');

console.log('\nAll fixes complete!');
