/**
 * Add Cross-Links Between Services Script
 * Adds "Other Services in [City]" section to all service+city pages
 * This improves internal linking and topical authority
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SERVICES_DIR = path.join(ROOT_DIR, 'services');

// All services with their display names
const allServices = {
  'janitorial-service': { name: 'Janitorial Service', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z' },
  'deep-cleaning': { name: 'Deep Cleaning', icon: 'M12 2L4 7v7c0 5.1 3.4 9.8 8 11 4.6-1.2 8-5.9 8-11V7l-8-5zm0 6c1.4 0 2.5 1.1 2.5 2.5S13.4 13 12 13s-2.5-1.1-2.5-2.5S10.6 8 12 8z' },
  'carpet-cleaning': { name: 'Carpet Cleaning', icon: 'M20 12c0-1.1-.9-2-2-2V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.3l.7 2h12l.7-2H20v-5z' },
  'general-housekeeping': { name: 'Housekeeping', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  'upholstery-cleaning': { name: 'Upholstery Cleaning', icon: 'M21 9V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v5h1.3l.7 2h14l.7-2H19v-5c0-1.1-.9-2-2-2z' }
};

let stats = {
  filesProcessed: 0,
  crossLinksAdded: 0
};

function generateCrossLinksSection(currentService, citySlug, cityName) {
  const otherServices = Object.entries(allServices)
    .filter(([key]) => key !== currentService)
    .map(([key, value]) => ({
      slug: key,
      name: value.name,
      icon: value.icon,
      url: `/services/${key}/${citySlug}-ma`
    }));

  return `
    <!-- Related Services Section - Cross Links -->
    <section class="section section--related-services">
      <div class="container">
        <div class="section__header section__header--center">
          <span class="section__badge">Complete Solutions</span>
          <h2 class="section__title">Other Cleaning Services in ${cityName}</h2>
          <p class="section__description">We offer a full range of professional cleaning services in ${cityName}. Explore our other solutions:</p>
        </div>
        <div class="related-services-grid">
          ${otherServices.map(s => `
          <a href="${s.url}" class="related-service-card">
            <div class="related-service-card__icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="${s.icon}"/></svg>
            </div>
            <h3 class="related-service-card__title">${s.name}</h3>
            <span class="related-service-card__link">View ${s.name} in ${cityName} →</span>
          </a>`).join('')}
        </div>
      </div>
    </section>`;
}

function processServiceCityPage(filePath, serviceSlug) {
  const fileName = path.basename(filePath);

  // Skip index.html files
  if (fileName === 'index.html') return false;

  // Extract city from filename (e.g., boston-ma.html -> boston)
  const cityMatch = fileName.match(/^(.+)-ma\.html$/);
  if (!cityMatch) return false;

  const citySlug = cityMatch[1];
  const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if cross-links already exist
  if (content.includes('section--related-services')) {
    return false;
  }

  // Find the position to insert (before the Final CTA Section)
  const insertPoint = content.indexOf('<!-- Final CTA Section -->');
  if (insertPoint === -1) {
    // Try alternative: before </main>
    const mainClose = content.indexOf('</main>');
    if (mainClose === -1) return false;

    const crossLinksHTML = generateCrossLinksSection(serviceSlug, citySlug, cityName);
    content = content.slice(0, mainClose) + crossLinksHTML + '\n  ' + content.slice(mainClose);
  } else {
    const crossLinksHTML = generateCrossLinksSection(serviceSlug, citySlug, cityName);
    content = content.slice(0, insertPoint) + crossLinksHTML + '\n\n    ' + content.slice(insertPoint);
  }

  fs.writeFileSync(filePath, content);
  stats.filesProcessed++;
  stats.crossLinksAdded++;
  return true;
}

function processServiceDirectory(serviceSlug) {
  const serviceDir = path.join(SERVICES_DIR, serviceSlug);

  if (!fs.existsSync(serviceDir)) {
    console.log(`Directory not found: ${serviceDir}`);
    return;
  }

  const files = fs.readdirSync(serviceDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  for (const file of files) {
    processServiceCityPage(path.join(serviceDir, file), serviceSlug);
  }
}

console.log('Adding cross-links between services...\n');

// Process each service directory
for (const serviceSlug of Object.keys(allServices)) {
  console.log(`Processing ${serviceSlug}...`);
  processServiceDirectory(serviceSlug);
}

console.log('\n=== CROSS-LINKS ADDED ===');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Cross-links sections added: ${stats.crossLinksAdded}`);

// Now add CSS for the related services grid
const cssPath = path.join(ROOT_DIR, 'assets', 'css', 'service-pages.css');
const relatedServicesCSS = `

/* Related Services Cross-Links Grid */
.section--related-services {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 4rem 0;
}

.related-services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 991px) {
  .related-services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 575px) {
  .related-services-grid {
    grid-template-columns: 1fr;
  }
}

.related-service-card {
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.related-service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(43, 112, 228, 0.15);
  border-color: #2b70e4;
}

.related-service-card__icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(43, 112, 228, 0.1) 0%, rgba(43, 112, 228, 0.05) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-service-card__icon svg {
  width: 28px;
  height: 28px;
  fill: #2b70e4;
}

.related-service-card__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.related-service-card__link {
  font-size: 0.875rem;
  color: #2b70e4;
  font-weight: 500;
}

.related-service-card:hover .related-service-card__link {
  text-decoration: underline;
}
`;

// Check if CSS already has related services styles
let cssContent = fs.readFileSync(cssPath, 'utf-8');
if (!cssContent.includes('.related-services-grid')) {
  cssContent += relatedServicesCSS;
  fs.writeFileSync(cssPath, cssContent);
  console.log('\nCSS for related services grid added to service-pages.css');
}
