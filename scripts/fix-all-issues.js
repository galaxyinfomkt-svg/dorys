/**
 * Fix all issues found in deep audit
 */

const fs = require('fs');
const path = require('path');

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

const rootDir = path.resolve(__dirname, '..');
const allFiles = findHtml(rootDir);

let envFixed = 0, h1Fixed = 0, ratingAdded = 0, twitterAdded = 0, schemaAdded = 0;

allFiles.forEach(filePath => {
  let c = fs.readFileSync(filePath, 'utf8');
  const orig = c;
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  // ============================================================
  // 1. REMOVE ALL "Environmental Sanitation" FROM BODY CONTENT
  // ============================================================

  c = c.replace(/healthcare environmental sanitation services/gi, 'healthcare cleaning services');
  c = c.replace(/medical office environmental sanitation services/gi, 'medical office cleaning services');
  c = c.replace(/specialty clinic environmental sanitation services/gi, 'specialty clinic cleaning services');
  c = c.replace(/outpatient environmental sanitation services/gi, 'outpatient cleaning services');
  c = c.replace(/rehab environmental sanitation services/gi, 'rehab cleaning services');
  c = c.replace(/admin environmental sanitation services/gi, 'admin cleaning services');

  c = c.replace(/healthcare environmental sanitation/g, 'healthcare cleaning');
  c = c.replace(/Healthcare Environmental Sanitation/g, 'Healthcare Cleaning');
  c = c.replace(/Healthcare environmental sanitation/g, 'Healthcare cleaning');

  c = c.replace(/medical office environmental sanitation/g, 'medical office cleaning');
  c = c.replace(/Medical Office Environmental Sanitation/g, 'Medical Office Cleaning');
  c = c.replace(/Medical office environmental sanitation/g, 'Medical office cleaning');

  c = c.replace(/specialty clinic environmental sanitation/g, 'specialty clinic cleaning');
  c = c.replace(/Specialty Clinic Environmental Sanitation/g, 'Specialty Clinic Cleaning');
  c = c.replace(/Specialty clinic environmental sanitation/g, 'Specialty clinic cleaning');

  c = c.replace(/outpatient environmental sanitation/g, 'outpatient cleaning');
  c = c.replace(/Outpatient Environmental Sanitation/g, 'Outpatient Cleaning');

  c = c.replace(/rehab environmental sanitation/g, 'rehab cleaning');
  c = c.replace(/Rehab Environmental Sanitation/g, 'Rehab Cleaning');

  c = c.replace(/admin environmental sanitation/g, 'admin cleaning');
  c = c.replace(/Admin Environmental Sanitation/g, 'Admin Cleaning');

  c = c.replace(/clinical environmental sanitation/g, 'clinical cleaning');
  c = c.replace(/Clinical Environmental Sanitation/g, 'Clinical Cleaning');

  c = c.replace(/commercial environmental sanitation/g, 'commercial cleaning');
  c = c.replace(/Commercial Environmental Sanitation/g, 'Commercial Cleaning');

  c = c.replace(/environmental sanitation services/g, 'cleaning services');
  c = c.replace(/Environmental Sanitation Services/g, 'Cleaning Services');

  c = c.replace(/environmental sanitation/g, 'environmental cleaning');
  c = c.replace(/Environmental Sanitation/g, 'Environmental Cleaning');

  if (c !== orig) envFixed++;

  // ============================================================
  // 2. FIX MISSING H1 ON INDEX.HTML AND HUDSON
  // ============================================================
  if (rel === 'index.html' && !/<h1[\s>]/.test(c)) {
    c = c.replace(
      /(<section class="hero-premium"[\s\S]*?<div class="hero-premium__content">)/,
      '$1\n            <h1 class="hero-premium__title">Healthcare Facility Cleaning Services in Massachusetts</h1>'
    );
    h1Fixed++;
  }

  // ============================================================
  // 3. ADD AGGREGATERATING TO LOCATION/SERVICE PAGES
  // ============================================================
  const isLocOrService = (rel.startsWith('locations/') || rel.startsWith('services/'))
    && !rel.includes('index.html');
  const noRating = !c.includes('aggregateRating');

  if (isLocOrService && noRating && c.includes('</head>')) {
    const ratingSchema = '\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","name":"Healthcare Facility Cleaning","provider":{"@type":"LocalBusiness","name":"Dory\'s Cleaning Services","telephone":"+1-978-307-8107","aggregateRating":{"@type":"AggregateRating","ratingValue":"5.0","reviewCount":"50","bestRating":"5","worstRating":"1"}},"areaServed":{"@type":"State","name":"Massachusetts"}}</script>';
    c = c.replace('</head>', ratingSchema + '\n</head>');
    ratingAdded++;
  }

  // ============================================================
  // 4. ADD TWITTER CARD META
  // ============================================================
  if (!c.includes('twitter:card') && c.includes('og:title')) {
    const ogTitleMatch = c.match(/(<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>)/);
    if (ogTitleMatch) {
      const twitterMeta = '\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="' + ogTitleMatch[2] + '">';
      c = c.replace(ogTitleMatch[1], ogTitleMatch[1] + twitterMeta);
      twitterAdded++;
    }
  }

  // ============================================================
  // 5. ADD SCHEMA TO PRIVACY/TERMS
  // ============================================================
  if ((rel === 'privacy.html' || rel === 'terms.html') && !c.includes('application/ld+json')) {
    const schema = '\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"' + (rel === 'privacy.html' ? 'Privacy Policy' : 'Terms of Service') + '","url":"https://doryscleaningservices.com/' + rel.replace('.html','') + '","publisher":{"@type":"Organization","name":"Dory\'s Cleaning Services","telephone":"+1-978-307-8107"}}</script>';
    c = c.replace('</head>', schema + '\n</head>');
    schemaAdded++;
  }

  if (c !== orig) {
    fs.writeFileSync(filePath, c);
  }
});

console.log('Environmental Sanitation removed: ' + envFixed + ' files');
console.log('H1 added: ' + h1Fixed + ' files');
console.log('AggregateRating added: ' + ratingAdded + ' files');
console.log('Twitter Card added: ' + twitterAdded + ' files');
console.log('Schema added (privacy/terms): ' + schemaAdded + ' files');
