const fs = require('fs');
const path = require('path');

// Get all city slugs from location files
const allCities = fs.readdirSync('locations')
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => {
    const slug = f.replace('.html', '');
    const name = slug.replace(/-ma$/, '').split('-')
      .map(w => w === 'afb' ? 'AFB' : w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return { slug, name };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

console.log('Total cities: ' + allCities.length);

const svgIcon = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>';

function generateCityLinks(serviceSlug) {
  return allCities.map(c =>
    `                 <a href="/services/${serviceSlug}/${c.slug}" class="city-link">${svgIcon}${c.name}</a>`
  ).join('\n');
}

// === UPDATE locations/index.html ===
let locIndex = fs.readFileSync('locations/index.html', 'utf8');

const svcTypes = [
  'specialty-clinics',
  'medical-office-cleaning',
  'rehab-nursing',
  'ambulatory-outpatient',
  'healthcare-admin-offices'
];

for (const svc of svcTypes) {
  // Strategy: find all <a> tags for this service, replace the block
  const pattern = new RegExp(
    '(class="service-block__cities">)([\\s\\S]*?)(/services/' + svc + '/)',
    'g'
  );

  // Find the start of city links for this service
  const marker = '/services/' + svc + '/';
  const firstIdx = locIndex.indexOf(marker);
  if (firstIdx === -1) {
    console.log('Not found in locations/index: ' + svc);
    continue;
  }

  // Find the <div class="service-block__cities"> before it
  const blockCitiesIdx = locIndex.lastIndexOf('service-block__cities', firstIdx);
  const divOpen = locIndex.indexOf('>', blockCitiesIdx) + 1;

  // Find the </div> that closes this cities block
  // Count from the last city-link for this service
  let lastMarker = firstIdx;
  let next = locIndex.indexOf(marker, lastMarker + 1);
  while (next !== -1 && next < locIndex.indexOf('service-block__cta', lastMarker)) {
    lastMarker = next;
    next = locIndex.indexOf(marker, lastMarker + 1);
  }
  // Find closing </a> after last link, then </div>
  const lastAClose = locIndex.indexOf('</a>', lastMarker) + 4;
  const divClose = locIndex.indexOf('</div>', lastAClose);

  if (divOpen > 0 && divClose > divOpen) {
    const newLinks = '\n' + generateCityLinks(svc) + '\n                 ';
    locIndex = locIndex.substring(0, divOpen) + newLinks + locIndex.substring(divClose);
    console.log('Updated locations/index: ' + svc + ' (' + allCities.length + ' cities)');
  }
}

// Update counts
locIndex = locIndex.replace(/>100\+</g, '>296<');
locIndex = locIndex.replace(/100\+ Cities/g, '296 Cities');
locIndex = locIndex.replace(/100\+ Massachusetts/g, '296 Massachusetts');
locIndex = locIndex.replace(/over 100 cities/gi, 'over 290 cities');
locIndex = locIndex.replace(/100\+ cities/g, '296 cities');
locIndex = locIndex.replace(/View All 100\+/g, 'View All 296');
fs.writeFileSync('locations/index.html', locIndex);

// === UPDATE each service hub index.html ===
for (const svc of svcTypes) {
  const indexPath = path.join('services', svc, 'index.html');
  if (!fs.existsSync(indexPath)) continue;

  let html = fs.readFileSync(indexPath, 'utf8');
  const marker = '/services/' + svc + '/';
  const firstIdx = html.indexOf(marker);
  if (firstIdx === -1) {
    console.log('No city links in ' + indexPath);
    continue;
  }

  // Find the container div
  let containerStart = html.lastIndexOf('<div', firstIdx);
  // Walk back to find a div with cities-related class
  let searchBack = firstIdx;
  for (let i = 0; i < 5; i++) {
    const prevDiv = html.lastIndexOf('<div', searchBack - 1);
    if (prevDiv === -1) break;
    const divTag = html.substring(prevDiv, html.indexOf('>', prevDiv) + 1);
    if (divTag.includes('cities') || divTag.includes('grid')) {
      containerStart = prevDiv;
      break;
    }
    searchBack = prevDiv;
  }

  const divOpenEnd = html.indexOf('>', containerStart) + 1;

  // Find last city link
  let lastIdx = firstIdx;
  let nextIdx = html.indexOf(marker, lastIdx + 1);
  while (nextIdx !== -1) {
    // Make sure we don't go past a section boundary
    const nextSection = html.indexOf('</section>', lastIdx);
    if (nextSection !== -1 && nextIdx > nextSection) break;
    lastIdx = nextIdx;
    nextIdx = html.indexOf(marker, lastIdx + 1);
  }
  const lastAClose = html.indexOf('</a>', lastIdx) + 4;
  const divClose = html.indexOf('</div>', lastAClose);

  if (divOpenEnd > 0 && divClose > divOpenEnd) {
    const newLinks = '\n' + generateCityLinks(svc) + '\n                 ';
    html = html.substring(0, divOpenEnd) + newLinks + html.substring(divClose);
    html = html.replace(/>100\+</g, '>296<');
    html = html.replace(/100\+ Cities/g, '296 Cities');
    html = html.replace(/100\+ Massachusetts/g, '296 Massachusetts');
    html = html.replace(/100\+ cities/g, '296 cities');
    fs.writeFileSync(indexPath, html);
    console.log('Updated ' + indexPath);
  }
}

// Update services/index.html
let svcIndex = fs.readFileSync('services/index.html', 'utf8');
svcIndex = svcIndex.replace(/100\+ cities/gi, '296 cities');
svcIndex = svcIndex.replace(/100\+ Massachusetts/gi, '296 Massachusetts');
svcIndex = svcIndex.replace(/>100\+</g, '>296<');
fs.writeFileSync('services/index.html', svcIndex);

// Update main pages counts
const mainPages = ['index.html', 'about.html', 'contact.html', 'reviews.html', 'healthcare-facilities.html'];
for (const pg of mainPages) {
  if (!fs.existsSync(pg)) continue;
  let html = fs.readFileSync(pg, 'utf8');
  const orig = html;
  html = html.replace(/100\+ Cities/g, '296 Cities');
  html = html.replace(/>100\+</g, '>296<');
  html = html.replace(/View All 100\+/g, 'View All 296');
  html = html.replace(/100\+ cities/g, '296 cities');
  if (html !== orig) fs.writeFileSync(pg, html);
}

console.log('\nDone! All hub pages updated.');
