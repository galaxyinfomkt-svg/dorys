/**
 * Fix All Sitemaps - Remove .html extensions for clean URLs
 * Also ensures all important pages are included
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// List of all cities (from locations folder)
function getCities() {
  const locationsDir = path.join(baseDir, 'locations');
  const files = fs.readdirSync(locationsDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => f.replace('.html', ''));
  return files.sort();
}

// Generate sitemap-pages.xml
function generateSitemapPages() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://doryscleaningservices.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>https://doryscleaningservices.com/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/reviews</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Services Hub -->
  <url>
    <loc>https://doryscleaningservices.com/services</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Service Category Pages -->
  <url>
    <loc>https://doryscleaningservices.com/services/janitorial-service</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/services/deep-cleaning</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/services/carpet-cleaning</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/services/general-housekeeping</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://doryscleaningservices.com/services/upholstery-cleaning</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Locations Hub -->
  <url>
    <loc>https://doryscleaningservices.com/locations</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(baseDir, 'sitemap-pages.xml'), xml);
  console.log('Generated: sitemap-pages.xml');
}

// Generate sitemap-locations.xml
function generateSitemapLocations() {
  const cities = getCities();

  let urls = cities.map(city => `  <url>
    <loc>https://doryscleaningservices.com/locations/${city}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(baseDir, 'sitemap-locations.xml'), xml);
  console.log(`Generated: sitemap-locations.xml (${cities.length} cities)`);
}

// Generate service sitemap
function generateServiceSitemap(serviceSlug, serviceName) {
  const serviceDir = path.join(baseDir, 'services', serviceSlug);

  if (!fs.existsSync(serviceDir)) {
    console.log(`Skipping ${serviceSlug} - directory not found`);
    return 0;
  }

  const files = fs.readdirSync(serviceDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => f.replace('.html', ''));

  let urls = files.map(city => `  <url>
    <loc>https://doryscleaningservices.com/services/${serviceSlug}/${city}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ${serviceName} Service Pages by City -->
${urls}
</urlset>`;

  const filename = `sitemap-services-${serviceSlug}.xml`;
  fs.writeFileSync(path.join(baseDir, filename), xml);
  console.log(`Generated: ${filename} (${files.length} pages)`);
  return files.length;
}

// Generate main sitemap index
function generateSitemapIndex() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages Sitemap -->
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Location Pages Sitemap -->
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-locations.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Service Pages Sitemaps -->
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-services-janitorial-service.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-services-deep-cleaning.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-services-carpet-cleaning.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-services-general-housekeeping.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://doryscleaningservices.com/sitemap-services-upholstery-cleaning.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.join(baseDir, 'sitemap.xml'), xml);
  console.log('Generated: sitemap.xml (index)');
}

// Main
function main() {
  console.log('='.repeat(60));
  console.log('Fixing All Sitemaps - Clean URLs');
  console.log('='.repeat(60));
  console.log(`Date: ${today}\n`);

  // Generate all sitemaps
  generateSitemapPages();
  generateSitemapLocations();

  const services = [
    ['janitorial-service', 'Janitorial Service'],
    ['deep-cleaning', 'Deep Cleaning'],
    ['carpet-cleaning', 'Carpet Cleaning'],
    ['general-housekeeping', 'General Housekeeping'],
    ['upholstery-cleaning', 'Upholstery Cleaning']
  ];

  let totalServicePages = 0;
  services.forEach(([slug, name]) => {
    totalServicePages += generateServiceSitemap(slug, name);
  });

  generateSitemapIndex();

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total service pages: ${totalServicePages}`);
}

main();
