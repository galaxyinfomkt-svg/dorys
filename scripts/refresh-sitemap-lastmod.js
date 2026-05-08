/**
 * Atualiza lastmod de todos os sitemaps pra hoje (2026-05-08).
 * Sinal de freshness pro Google + Bing — força re-crawl mais rápido.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const today = '2026-05-08';

const sitemaps = [
  'sitemap.xml',
  'sitemap-pages.xml',
  'sitemap-blog.xml',
  'sitemap-locations.xml',
  'sitemap-services-medical-office-cleaning.xml',
  'sitemap-services-specialty-clinics.xml',
  'sitemap-services-ambulatory-outpatient.xml',
  'sitemap-services-rehab-nursing.xml',
  'sitemap-services-healthcare-admin-offices.xml',
];

let total = 0;
sitemaps.forEach(name => {
  const fp = path.join(rootDir, name);
  if (!fs.existsSync(fp)) return;
  let xml = fs.readFileSync(fp, 'utf8');
  const before = xml;
  xml = xml.replace(/<lastmod>[^<]+<\/lastmod>/g, '<lastmod>' + today + '</lastmod>');
  if (xml !== before) {
    fs.writeFileSync(fp, xml);
    const count = (xml.match(/<lastmod>/g) || []).length;
    total += count;
    console.log(name + ' atualizado (' + count + ' lastmod)');
  }
});
console.log('Total lastmod tags atualizadas: ' + total);
