/**
 * UPDATE IMAGES & VIDEOS ACROSS ALL PAGES
 * 1. Ensure correct hero images per page type
 * 2. Replace old video IDs with healthcare-relevant ones
 * 3. Fix any remaining old image references
 */

const fs = require('fs');
const path = require('path');

function findAllHtml(dir, list = []) {
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      if (['.git','node_modules','.vercel','.claude','scripts'].includes(entry)) return;
      findAllHtml(full, list);
    } else if (entry.endsWith('.html')) {
      list.push(full);
    }
  });
  return list;
}

// Image mapping: which hero image each page type should use
const SERVICE_IMAGE_MAP = {
  'medical-office-cleaning': '/assets/images/services/medical-office-cleaning.jpg',
  'clinic-outpatient-sanitation': '/assets/images/services/clinic-outpatient-sanitation.jpg',
  'assisted-living-senior-care': '/assets/images/services/assisted-living-senior-care.jpg',
  'infection-control-disinfection': '/assets/images/services/infection-control-disinfection.jpg',
  'compliance-scheduled-sanitation': '/assets/images/services/compliance-scheduled-sanitation.jpg',
};

// Old video IDs to replace
const OLD_VIDEO_IDS = ['hJ2YOZkyGs4', 'sTSS8julfA4'];
const NEW_VIDEO_IDS = ['_O4B0Nmfr40', '7waDSzAh28k'];

const ROOT = path.resolve(__dirname, '..');
const allFiles = findAllHtml(ROOT);
let updated = 0;

allFiles.forEach(fp => {
  const relPath = path.relative(ROOT, fp).replace(/\\/g, '/');
  let c = fs.readFileSync(fp, 'utf-8');
  const orig = c;

  // 1. Replace old video IDs everywhere
  OLD_VIDEO_IDS.forEach((oldId, i) => {
    const newId = NEW_VIDEO_IDS[i] || NEW_VIDEO_IDS[0];
    c = c.split(oldId).join(newId);
  });

  // 2. Fix old service image references (from old services)
  c = c.replace(/\/assets\/images\/services\/janitorial-service\.jpg/g, '/assets/images/services/medical-office-cleaning.jpg');
  c = c.replace(/\/assets\/images\/services\/deep-cleaning\.jpg/g, '/assets/images/services/clinic-outpatient-sanitation.jpg');
  c = c.replace(/\/assets\/images\/services\/carpet-cleaning\.jpg/g, '/assets/images/services/assisted-living-senior-care.jpg');
  c = c.replace(/\/assets\/images\/services\/upholstery-cleaning\.jpg/g, '/assets/images/services/infection-control-disinfection.jpg');
  c = c.replace(/\/assets\/images\/services\/general-housekeeping\.jpg/g, '/assets/images/services/compliance-scheduled-sanitation.jpg');
  // Also without leading /
  c = c.replace(/assets\/images\/services\/janitorial-service\.jpg/g, '/assets/images/services/medical-office-cleaning.jpg');
  c = c.replace(/assets\/images\/services\/deep-cleaning\.jpg/g, '/assets/images/services/clinic-outpatient-sanitation.jpg');
  c = c.replace(/assets\/images\/services\/carpet-cleaning\.jpg/g, '/assets/images/services/assisted-living-senior-care.jpg');
  c = c.replace(/assets\/images\/services\/upholstery-cleaning\.jpg/g, '/assets/images/services/infection-control-disinfection.jpg');
  c = c.replace(/assets\/images\/services\/general-housekeeping\.jpg/g, '/assets/images/services/compliance-scheduled-sanitation.jpg');

  // 3. Ensure service city pages use the correct service image
  for (const [serviceSlug, imgPath] of Object.entries(SERVICE_IMAGE_MAP)) {
    if (relPath.includes(`services/${serviceSlug}/`)) {
      // Make sure the hero uses the right service image
      // Pattern: hero__background img src
      c = c.replace(
        /(<div class="hero__background">\s*<img src=")[^"]*(")/,
        `$1${imgPath}$2`
      );
      break;
    }
  }

  // 4. Location pages should use the healthcare hero
  if (relPath.startsWith('locations/') && relPath !== 'locations/index.html') {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      '$1/assets/images/hero/healthcare-hero.jpg$2'
    );
  }

  // locations/index.html uses locations hero
  if (relPath === 'locations/index.html') {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      '$1/assets/images/hero/locations-hero.jpg$2'
    );
  }

  // 5. Service hub pages use services hero
  if (relPath.match(/^services\/[^/]+\/index\.html$/)) {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      `$1/assets/images/hero/services-hero.jpg$2`
    );
  }

  // 6. About page
  if (relPath === 'about.html') {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      '$1/assets/images/hero/about-hero.jpg$2'
    );
  }

  // 7. Contact page
  if (relPath === 'contact.html') {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      '$1/assets/images/hero/contact-hero.jpg$2'
    );
  }

  // 8. Reviews page
  if (relPath === 'reviews.html') {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      '$1/assets/images/hero/healthcare-hero.jpg$2'
    );
  }

  // 9. Blog pages
  if (relPath.startsWith('blog/')) {
    c = c.replace(
      /(<div class="hero__background">\s*<img src=")[^"]*(")/,
      '$1/assets/images/hero/services-hero.jpg$2'
    );
  }

  // 10. Fix old video text that may still reference old content
  c = c.replace(/Professional Cleaning You Can Trust/g, 'Healthcare Environmental Services You Can Trust');
  c = c.replace(/Dorys Cleaning team professional cleaning demonstration video/g, 'Healthcare facility environmental services and sanitation video');

  if (c !== orig) {
    fs.writeFileSync(fp, c, 'utf-8');
    updated++;
  }
});

console.log(`Updated ${updated} files with correct images and videos.`);
