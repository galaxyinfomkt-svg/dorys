const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Check a sample of service+city pages for internal links
const serviceDirs = [
  'services/janitorial-service',
  'services/deep-cleaning',
  'services/carpet-cleaning',
  'services/general-housekeeping',
  'services/upholstery-cleaning'
];

console.log('Checking internal links in service+city pages...\n');

let totalChecked = 0;
let pagesWithHomeLink = 0;
let pagesWithServicesLink = 0;
let pagesWithLocationsLink = 0;
let pagesWithContactLink = 0;

for (const dir of serviceDirs) {
  const dirPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(dirPath)) continue;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html') && f !== 'index.html');

  // Check first 5 files from each service
  const sampled = files.slice(0, 5);

  for (const file of sampled) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    totalChecked++;

    if (content.includes('href="/"') || content.includes("href='/'")) pagesWithHomeLink++;
    if (content.includes('href="/services"') || content.includes('href="/services/')) pagesWithServicesLink++;
    if (content.includes('href="/locations"') || content.includes('href="/locations/')) pagesWithLocationsLink++;
    if (content.includes('href="/contact"')) pagesWithContactLink++;
  }
}

console.log(`Pages checked: ${totalChecked}`);
console.log(`With home link: ${pagesWithHomeLink} (${Math.round(pagesWithHomeLink/totalChecked*100)}%)`);
console.log(`With services link: ${pagesWithServicesLink} (${Math.round(pagesWithServicesLink/totalChecked*100)}%)`);
console.log(`With locations link: ${pagesWithLocationsLink} (${Math.round(pagesWithLocationsLink/totalChecked*100)}%)`);
console.log(`With contact link: ${pagesWithContactLink} (${Math.round(pagesWithContactLink/totalChecked*100)}%)`);

// Check homepage links
console.log('\n--- Homepage internal links ---');
const homepage = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');

const importantLinks = [
  '/services',
  '/locations',
  '/contact',
  '/about',
  '/reviews'
];

for (const link of importantLinks) {
  const hasLink = homepage.includes(`href="${link}"`) || homepage.includes(`href="${link}/"`);
  console.log(`${link}: ${hasLink ? 'YES' : 'MISSING!'}`);
}

// Check service hub pages
console.log('\n--- Service hub pages ---');
for (const dir of serviceDirs) {
  const indexPath = path.join(ROOT_DIR, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8');
    // Count how many city links
    const cityLinks = (content.match(/href="\/services\/[^"]+\/[^"]+"/g) || []).length;
    console.log(`${dir}/index.html: ${cityLinks} city links`);
  }
}

// Check locations hub
console.log('\n--- Locations hub ---');
const locationsIndex = path.join(ROOT_DIR, 'locations', 'index.html');
if (fs.existsSync(locationsIndex)) {
  const content = fs.readFileSync(locationsIndex, 'utf-8');
  const locationLinks = (content.match(/href="\/locations\/[^"]+"/g) || []).length;
  console.log(`locations/index.html: ${locationLinks} location links`);
}
