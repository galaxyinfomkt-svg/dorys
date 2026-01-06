const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DOMAIN = 'https://doryscleaningservices.com';

// Collect all HTML files
function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'scripts' && item !== 'data' && item !== 'build') {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Get clean URL from file path
function getCleanUrl(filePath) {
  let relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return '/' + relativePath.replace('/index.html', '');
  return '/' + relativePath.replace('.html', '');
}

// Parse sitemap and extract URLs
function parseSitemap(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1].replace(DOMAIN, ''));
  }
  return urls;
}

// Main
const htmlFiles = getAllHtmlFiles(ROOT_DIR);
const sitemapFiles = [
  'sitemap-pages.xml',
  'sitemap-locations.xml',
  'sitemap-services-janitorial-service.xml',
  'sitemap-services-deep-cleaning.xml',
  'sitemap-services-carpet-cleaning.xml',
  'sitemap-services-general-housekeeping.xml',
  'sitemap-services-upholstery-cleaning.xml'
];

const sitemapUrls = new Set();
for (const sitemap of sitemapFiles) {
  const sitemapPath = path.join(ROOT_DIR, sitemap);
  if (fs.existsSync(sitemapPath)) {
    parseSitemap(sitemapPath).forEach(url => sitemapUrls.add(url));
  }
}

console.log('Pages NOT in any sitemap:');
console.log('-'.repeat(50));

let count = 0;
for (const file of htmlFiles) {
  const cleanUrl = getCleanUrl(file);
  // Skip special pages
  if (cleanUrl === '/404' || cleanUrl === '/500') continue;

  if (!sitemapUrls.has(cleanUrl)) {
    console.log(cleanUrl);
    count++;
  }
}

console.log('-'.repeat(50));
console.log(`Total: ${count} pages not in sitemap`);
console.log(`\nSitemap has: ${sitemapUrls.size} URLs`);
console.log(`HTML files: ${htmlFiles.length}`);
