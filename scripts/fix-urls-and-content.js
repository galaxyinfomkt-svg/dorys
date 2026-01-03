/**
 * Fix URLs and improve page content
 * - Remove .html from internal URLs
 * - Add more image sections
 * - Improve overall page quality
 */

const fs = require('fs');
const path = require('path');

// Directories to process
const DIRS = [
  'services/deep-cleaning',
  'services/carpet-cleaning',
  'services/janitorial-service',
  'services/general-housekeeping',
  'services/upholstery-cleaning',
  'locations'
];

const MAIN_PAGES = [
  'about.html',
  'contact.html',
  'reviews.html',
  'privacy.html',
  'terms.html',
  'sitemap.html'
];

// URL fixes - remove .html from internal links
function fixUrls(content) {
  // Fix location links: /locations/xxx-ma.html -> /locations/xxx-ma
  content = content.replace(/href="\/locations\/([^"]+)\.html"/g, 'href="/locations/$1"');

  // Fix service links: /services/xxx/yyy-ma.html -> /services/xxx/yyy-ma
  content = content.replace(/href="\/services\/([^/]+)\/([^"]+)\.html"/g, 'href="/services/$1/$2"');

  // Fix main page links (keep these as .html for now since they're single pages)
  // content = content.replace(/href="\/about\.html"/g, 'href="/about"');
  // content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');
  // etc.

  // Fix canonical URLs
  content = content.replace(/rel="canonical" href="([^"]+)\.html"/g, 'rel="canonical" href="$1"');

  // Fix og:url
  content = content.replace(/property="og:url" content="([^"]+)\.html"/g, 'property="og:url" content="$1"');

  // Fix schema.org URLs
  content = content.replace(/"url": "([^"]+)\.html"/g, '"url": "$1"');
  content = content.replace(/"item": "([^"]+)\.html"/g, '"item": "$1"');

  return content;
}

// Add image gallery section after hero
function addImageSection(content, serviceSlug) {
  const imageSection = `
    <!-- Service Gallery -->
    <section class="section section--light">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">Our Work</span>
          <h2 class="section__title">Professional Results You Can Trust</h2>
          <p class="section__description">See the quality and attention to detail we bring to every job.</p>
        </div>
        <div class="gallery-grid">
          <div class="gallery-item animate-on-scroll animate-fade-up">
            <img src="/assets/images/services/${serviceSlug}-1.jpg" alt="Professional ${serviceSlug.replace(/-/g, ' ')} service" loading="lazy" class="gallery-item__img" onerror="this.src='/assets/images/services/${serviceSlug}.jpg'">
          </div>
          <div class="gallery-item animate-on-scroll animate-fade-up animate-delay-100">
            <img src="/assets/images/services/${serviceSlug}-2.jpg" alt="${serviceSlug.replace(/-/g, ' ')} results" loading="lazy" class="gallery-item__img" onerror="this.src='/assets/images/services/${serviceSlug}.jpg'">
          </div>
          <div class="gallery-item animate-on-scroll animate-fade-up animate-delay-200">
            <img src="/assets/images/services/${serviceSlug}-3.jpg" alt="Before and after ${serviceSlug.replace(/-/g, ' ')}" loading="lazy" class="gallery-item__img" onerror="this.src='/assets/images/services/${serviceSlug}.jpg'">
          </div>
        </div>
      </div>
    </section>
`;

  // Insert after hero section
  const heroEnd = '</section>\n\n    <!-- Service Details -->';
  if (content.includes(heroEnd)) {
    content = content.replace(heroEnd, '</section>\n' + imageSection + '\n    <!-- Service Details -->');
  }

  return content;
}

// Add trust badges section
function addTrustSection(content, cityName) {
  const trustSection = `
    <!-- Why Choose Us -->
    <section class="section section--gradient">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">Why ${cityName} Trusts Us</span>
          <h2 class="section__title">The Dorys Difference</h2>
        </div>
        <div class="trust-grid">
          <div class="trust-card animate-on-scroll animate-fade-up">
            <div class="trust-card__icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
            <h3 class="trust-card__title">21+ Years Experience</h3>
            <p class="trust-card__text">Serving Massachusetts families and businesses since 2004 with professional, reliable cleaning services.</p>
          </div>
          <div class="trust-card animate-on-scroll animate-fade-up animate-delay-100">
            <div class="trust-card__icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
            </div>
            <h3 class="trust-card__title">Fully Insured</h3>
            <p class="trust-card__text">$2,000,000 insurance coverage and MA License HIC #213341 for your complete peace of mind.</p>
          </div>
          <div class="trust-card animate-on-scroll animate-fade-up animate-delay-200">
            <div class="trust-card__icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <h3 class="trust-card__title">5-Star Rated</h3>
            <p class="trust-card__text">Consistently rated 5 stars by our customers for quality, reliability, and exceptional service.</p>
          </div>
          <div class="trust-card animate-on-scroll animate-fade-up animate-delay-300">
            <div class="trust-card__icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <h3 class="trust-card__title">Eco-Friendly</h3>
            <p class="trust-card__text">We use professional-grade, eco-friendly products safe for your family, pets, and the environment.</p>
          </div>
        </div>
      </div>
    </section>
`;

  // Insert before FAQ section
  const faqStart = '    <!-- FAQ -->';
  if (content.includes(faqStart)) {
    content = content.replace(faqStart, trustSection + '\n' + faqStart);
  }

  return content;
}

// Process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Get service slug and city name from path
  const pathParts = filePath.split(path.sep);
  const fileName = pathParts[pathParts.length - 1];
  const serviceSlug = pathParts[pathParts.length - 2];
  const citySlug = fileName.replace('.html', '');

  // Extract city name from content
  const cityMatch = content.match(/<h1[^>]*>.*?in ([^,<]+),/);
  const cityName = cityMatch ? cityMatch[1] : citySlug.replace(/-ma$/, '').replace(/-/g, ' ');

  // Fix URLs
  content = fixUrls(content);

  // Add image section (only for service pages)
  if (filePath.includes('services') && !content.includes('gallery-grid')) {
    content = addImageSection(content, serviceSlug);
  }

  // Add trust section (only for service pages)
  if (filePath.includes('services') && !content.includes('trust-grid')) {
    content = addTrustSection(content, cityName);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// Main function
function main() {
  const baseDir = path.join(__dirname, '..');
  let processed = 0;
  let errors = 0;

  console.log('='.repeat(60));
  console.log('Fixing URLs and improving content');
  console.log('='.repeat(60));

  // Process service directories
  DIRS.forEach(dir => {
    const fullDir = path.join(baseDir, dir);
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.html') && f !== 'index.html');
      console.log('\nProcessing ' + dir + ' (' + files.length + ' files)');

      files.forEach(file => {
        try {
          processFile(path.join(fullDir, file));
          processed++;
        } catch (e) {
          console.error('Error processing ' + file + ': ' + e.message);
          errors++;
        }
      });
    }
  });

  // Process main pages
  console.log('\nProcessing main pages');
  MAIN_PAGES.forEach(page => {
    const filePath = path.join(baseDir, page);
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = fixUrls(content);
        fs.writeFileSync(filePath, content, 'utf8');
        processed++;
        console.log('  Updated: ' + page);
      } catch (e) {
        console.error('Error processing ' + page + ': ' + e.message);
        errors++;
      }
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log('Processed: ' + processed + ' files');
  console.log('Errors: ' + errors);
}

main();
