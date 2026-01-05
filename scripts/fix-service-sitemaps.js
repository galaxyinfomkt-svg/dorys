/**
 * Fix Service Sitemaps - Include Parent Pages
 * Each service sitemap must include:
 * 1. The parent service page (e.g., /services/janitorial-service)
 * 2. All city-specific pages
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

const SERVICES = [
  { slug: 'janitorial-service', name: 'Janitorial Service' },
  { slug: 'deep-cleaning', name: 'Deep Cleaning' },
  { slug: 'carpet-cleaning', name: 'Carpet Cleaning' },
  { slug: 'general-housekeeping', name: 'General Housekeeping' },
  { slug: 'upholstery-cleaning', name: 'Upholstery Cleaning' }
];

function getCities(serviceSlug) {
  const serviceDir = path.join(baseDir, 'services', serviceSlug);
  if (!fs.existsSync(serviceDir)) return [];

  return fs.readdirSync(serviceDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => f.replace('.html', ''))
    .sort();
}

function generateServiceSitemap(service) {
  const cities = getCities(service.slug);

  // Build URLs - PARENT PAGE FIRST, then city pages
  let urls = [];

  // 1. Add parent service page (HIGH PRIORITY)
  urls.push(`  <!-- Parent Service Page -->
  <url>
    <loc>https://doryscleaningservices.com/services/${service.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

  // 2. Add all city pages
  cities.forEach(city => {
    urls.push(`  <url>
    <loc>https://doryscleaningservices.com/services/${service.slug}/${city}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ${service.name} Sitemap -->
  <!-- Parent page + ${cities.length} city pages = ${cities.length + 1} total URLs -->

${urls.join('\n')}
</urlset>`;

  const filename = `sitemap-services-${service.slug}.xml`;
  fs.writeFileSync(path.join(baseDir, filename), xml, 'utf8');
  console.log(`Generated: ${filename} (1 parent + ${cities.length} cities = ${cities.length + 1} URLs)`);
  return cities.length + 1;
}

function main() {
  console.log('='.repeat(60));
  console.log('Fixing Service Sitemaps - Including Parent Pages');
  console.log('='.repeat(60));
  console.log(`Date: ${today}\n`);

  let totalUrls = 0;

  SERVICES.forEach(service => {
    totalUrls += generateServiceSitemap(service);
  });

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total URLs in service sitemaps: ${totalUrls}`);
}

main();
