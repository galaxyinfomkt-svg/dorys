/**
 * City Page Generator
 *
 * Uses existing acton-ma.html pages as EXACT templates.
 * Replaces city-specific data (name, coordinates, zip, nearby cities).
 * Creates 6 pages per city: 1 location + 5 service pages.
 */

const fs = require('fs');
const path = require('path');

// Load city data
const cityData = require('../new-cities-data.js');
console.log(`Loaded ${cityData.length} new cities`);

const rootDir = path.resolve(__dirname, '..');

// Template files (using Acton as base)
const templates = {
  location: fs.readFileSync(path.join(rootDir, 'locations/acton-ma.html'), 'utf8'),
  'medical-office-cleaning': fs.readFileSync(path.join(rootDir, 'services/medical-office-cleaning/acton-ma.html'), 'utf8'),
  'specialty-clinics': fs.readFileSync(path.join(rootDir, 'services/specialty-clinics/acton-ma.html'), 'utf8'),
  'ambulatory-outpatient': fs.readFileSync(path.join(rootDir, 'services/ambulatory-outpatient/acton-ma.html'), 'utf8'),
  'rehab-nursing': fs.readFileSync(path.join(rootDir, 'services/rehab-nursing/acton-ma.html'), 'utf8'),
  'healthcare-admin-offices': fs.readFileSync(path.join(rootDir, 'services/healthcare-admin-offices/acton-ma.html'), 'utf8'),
};

// Service display info
const serviceInfo = {
  'medical-office-cleaning': {
    name: 'Medical Office Cleaning',
    shortName: 'Medical Office Cleaning',
    titlePrefix: 'Medical Office Cleaning',
    desc: 'Specialized sanitation for medical offices, dental practices, and physician clinics with infection control protocols.',
    metaDesc: (city) => `Medical office cleaning in ${city}, MA. CDC protocols, HIPAA-aware, $2M insured. 22+ yrs clinical experience. Call (978) 307-8107`,
    breadcrumb: 'Medical Offices',
  },
  'specialty-clinics': {
    name: 'Specialty Clinic Sanitation',
    shortName: 'Specialty Clinic Cleaning',
    titlePrefix: 'Clinic Cleaning',
    desc: 'Professional sanitation for specialty clinics including cardiology practices, with attention to clinical workflow and patient safety.',
    metaDesc: (city) => `Specialty clinic cleaning in ${city}, MA. Infection control, terminal cleaning, $2M insured. 22+ yrs experience. (978) 307-8107`,
    breadcrumb: 'Specialty Clinics',
  },
  'ambulatory-outpatient': {
    name: 'Ambulatory &amp; Outpatient Facility Sanitation',
    shortName: 'Outpatient Facility Cleaning',
    titlePrefix: 'Outpatient Cleaning',
    desc: 'Structured sanitation support for ambulatory care centers and outpatient facilities, designed around clinical schedules.',
    metaDesc: (city) => `Outpatient facility cleaning in ${city}, MA. Fast turnaround, CDC protocols, $2M insured. 22+ yrs experience. (978) 307-8107`,
    breadcrumb: 'Ambulatory &amp; Outpatient',
  },
  'rehab-nursing': {
    name: 'Rehab &amp; Nursing Facility Sanitation',
    shortName: 'Rehab &amp; Nursing Cleaning',
    titlePrefix: 'Rehab Cleaning',
    desc: 'Dependable sanitation services for rehabilitation centers and nursing facilities where safety and resident comfort are priorities.',
    metaDesc: (city) => `Rehab &amp; nursing cleaning in ${city}, MA. Patient-safe protocols, $2M insured. 22+ yrs clinical experience. Call (978) 307-8107`,
    breadcrumb: 'Rehab &amp; Nursing',
  },
  'healthcare-admin-offices': {
    name: 'Healthcare Admin Office Sanitation',
    shortName: 'Healthcare Admin Cleaning',
    titlePrefix: 'Admin Office Cleaning',
    desc: 'Professional cleaning for healthcare administrative spaces, maintaining clean environments that support clinical operations.',
    metaDesc: (city) => `Healthcare admin cleaning in ${city}, MA. HIPAA-aware, professional maintenance. 22+ yrs, $2M insured. Call (978) 307-8107`,
    breadcrumb: 'Healthcare Admin Offices',
  },
};

function slugToName(slug) {
  return slug.split('-').map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function replaceCity(template, city, serviceType) {
  let html = template;

  // === Replace Acton-specific data with new city ===

  // City name (display)
  html = html.replace(/\bActon\b/g, city.name);
  html = html.replace(/\bacton\b/g, city.slug);

  // Slug in URLs
  html = html.replace(/acton-ma\.html/g, `${city.slug}-ma.html`);
  html = html.replace(/acton-ma"/g, `${city.slug}-ma"`);
  html = html.replace(/acton-ma</g, `${city.slug}-ma<`);

  // ZIP code
  html = html.replace(/"postalCode":\s*"01720"/g, `"postalCode": "${city.zip}"`);

  // Coordinates
  html = html.replace(/42\.4851/g, city.lat.toString());
  html = html.replace(/-71\.4329/g, city.lng.toString());
  html = html.replace(/42\.4851,\s*-71\.4329/g, `${city.lat}, ${city.lng}`);

  // County
  html = html.replace(/Middlesex County/g, `${city.county} County`);

  // Nearby cities links
  if (city.nearby && city.nearby.length > 0) {
    const nearbyLinks = city.nearby.map(n => {
      const nName = slugToName(n);
      if (serviceType && serviceType !== 'location') {
        return `<a href="/services/${serviceType}/${n}-ma.html" class="nearby-cities__link">${nName}</a>`;
      }
      return `<a href="/locations/${n}-ma" class="nearby-cities__link">${nName}</a>`;
    }).join('\n ');

    // Replace the existing nearby cities block
    html = html.replace(
      /<div class="nearby-cities__list">[\s\S]*?<\/div>\s*<\/div>/,
      `<div class="nearby-cities__list">\n ${nearbyLinks}\n </div>\n </div>`
    );
  }

  // Update title and meta for optimal CTR
  if (serviceType && serviceType !== 'location') {
    const svc = serviceInfo[serviceType];
    let title = `${svc.titlePrefix} ${city.name}, MA | Dorys`;
    if (title.length > 60) title = `${svc.titlePrefix} ${city.name} | Dorys`;

    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    html = html.replace(/(og:title[^>]*content=")[^"]*(")/g, `$1${title}$2`);
    html = html.replace(/(twitter:title[^>]*content=")[^"]*(")/g, `$1${title}$2`);

    const desc = svc.metaDesc(city.name);
    html = html.replace(/(name="description"[^>]*content=")[^"]*(")/g, `$1${desc}$2`);
    html = html.replace(/(og:description[^>]*content=")[^"]*(")/g, `$1${desc}$2`);
    html = html.replace(/(twitter:description[^>]*content=")[^"]*(")/g, `$1${desc}$2`);
  } else {
    // Location page
    let title = `Healthcare Cleaning ${city.name}, MA | Dorys`;
    if (title.length > 60) title = `Healthcare Cleaning ${city.name} | Dorys`;

    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    html = html.replace(/(og:title[^>]*content=")[^"]*(")/g, `$1${title}$2`);

    const desc = `Trusted healthcare cleaning in ${city.name}, MA. Medical offices, clinics &amp; facilities. 22+ yrs, $2M insured. Free assessment: (978) 307-8107`;
    html = html.replace(/(name="description"[^>]*content=")[^"]*(")/g, `$1${desc}$2`);
    html = html.replace(/(og:description[^>]*content=")[^"]*(")/g, `$1${desc}$2`);
  }

  return html;
}

let created = 0;

for (const city of cityData) {
  // 1. Location page
  const locPath = path.join(rootDir, 'locations', `${city.slug}-ma.html`);
  if (!fs.existsSync(locPath)) {
    const locHtml = replaceCity(templates.location, city, 'location');
    fs.writeFileSync(locPath, locHtml);
    created++;
  }

  // 2-6. Service pages
  for (const [svcType, template] of Object.entries(templates)) {
    if (svcType === 'location') continue;
    const svcDir = path.join(rootDir, 'services', svcType);
    const svcPath = path.join(svcDir, `${city.slug}-ma.html`);
    if (!fs.existsSync(svcPath)) {
      const svcHtml = replaceCity(template, city, svcType);
      fs.writeFileSync(svcPath, svcHtml);
      created++;
    }
  }
}

console.log(`\nPages created: ${created}`);
console.log(`Expected: ${cityData.length} x 6 = ${cityData.length * 6}`);

// Count total
let totalPages = 0;
function countHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', 'scripts', 'build', 'docs'].includes(e.name)) {
      countHtml(fp);
    } else if (e.name.endsWith('.html')) {
      totalPages++;
    }
  }
}
countHtml(rootDir);
console.log(`Total site pages: ${totalPages}`);
