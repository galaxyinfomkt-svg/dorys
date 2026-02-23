const fs = require('fs');
const path = require('path');

const baseUrl = 'https://doryscleaningservices.com';
const today = new Date().toISOString().split('T')[0]; // 2026-02-23

const services = [
  'medical-office-cleaning',
  'clinic-outpatient-sanitation',
  'assisted-living-senior-care',
  'infection-control-disinfection',
  'compliance-scheduled-sanitation',
];

const rootDir = path.join(__dirname, '..');

// Generate service sitemaps
for (const service of services) {
  const serviceDir = path.join(rootDir, 'services', service);
  const files = fs.readdirSync(serviceDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => f.replace('.html', ''))
    .sort();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ${service} Sitemap -->
  <!-- Parent page + ${files.length} city pages = ${files.length + 1} total URLs -->

  <!-- Parent Service Page -->
  <url>
    <loc>${baseUrl}/services/${service}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  for (const city of files) {
    xml += `  <url>
    <loc>${baseUrl}/services/${service}/${city}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  const outPath = path.join(rootDir, `sitemap-services-${service}.xml`);
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`Created: sitemap-services-${service}.xml (${files.length + 1} URLs)`);
}

// Update sitemap.xml index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Location Pages Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-locations.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Service Pages Sitemaps -->
  <sitemap>
    <loc>${baseUrl}/sitemap-services-medical-office-cleaning.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services-clinic-outpatient-sanitation.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services-assisted-living-senior-care.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services-infection-control-disinfection.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services-compliance-scheduled-sanitation.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Blog Pages Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapIndex, 'utf8');
console.log('Updated: sitemap.xml (index)');

// Update sitemap-pages.xml with new date
let pagesXml = fs.readFileSync(path.join(rootDir, 'sitemap-pages.xml'), 'utf8');
pagesXml = pagesXml.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
fs.writeFileSync(path.join(rootDir, 'sitemap-pages.xml'), pagesXml, 'utf8');
console.log('Updated: sitemap-pages.xml (dates)');

// Update sitemap-locations.xml with new date
let locationsXml = fs.readFileSync(path.join(rootDir, 'sitemap-locations.xml'), 'utf8');
locationsXml = locationsXml.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
fs.writeFileSync(path.join(rootDir, 'sitemap-locations.xml'), locationsXml, 'utf8');
console.log('Updated: sitemap-locations.xml (dates)');

console.log('\nDone! All sitemaps generated and updated.');
