const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

// Read all sitemap files
const sitemapFiles = [
  'sitemap-pages.xml',
  'sitemap-locations.xml',
  'sitemap-services-janitorial-service.xml',
  'sitemap-services-deep-cleaning.xml',
  'sitemap-services-carpet-cleaning.xml',
  'sitemap-services-general-housekeeping.xml',
  'sitemap-services-upholstery-cleaning.xml'
];

const issues = {
  notFound: [],
  redirectNeeded: [],
  duplicates: []
};

// Get all existing HTML files
function getAllHtmlFiles() {
  const files = new Set();

  // Root HTML files
  fs.readdirSync(baseDir).forEach(file => {
    if (file.endsWith('.html')) {
      files.add('/' + file.replace('.html', ''));
      if (file === 'index.html') files.add('/');
    }
  });

  // Services files
  const servicesDir = path.join(baseDir, 'services');
  if (fs.existsSync(servicesDir)) {
    fs.readdirSync(servicesDir).forEach(subdir => {
      const subdirPath = path.join(servicesDir, subdir);
      if (fs.statSync(subdirPath).isDirectory()) {
        fs.readdirSync(subdirPath).forEach(file => {
          if (file.endsWith('.html')) {
            if (file === 'index.html') {
              files.add('/services/' + subdir);
            } else {
              files.add('/services/' + subdir + '/' + file.replace('.html', ''));
            }
          }
        });
      } else if (subdir.endsWith('.html')) {
        if (subdir === 'index.html') {
          files.add('/services');
        } else {
          files.add('/services/' + subdir.replace('.html', ''));
        }
      }
    });
  }

  // Locations files
  const locationsDir = path.join(baseDir, 'locations');
  if (fs.existsSync(locationsDir)) {
    fs.readdirSync(locationsDir).forEach(file => {
      if (file.endsWith('.html')) {
        if (file === 'index.html') {
          files.add('/locations');
        } else {
          files.add('/locations/' + file.replace('.html', ''));
        }
      }
    });
  }

  return files;
}

// Parse sitemap and extract URLs
function parseSitemap(filename) {
  const filepath = path.join(baseDir, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`Sitemap not found: ${filename}`);
    return [];
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Check if URL has corresponding file
function urlToPath(url) {
  return url.replace('https://doryscleaningservices.com', '').replace(/\/$/, '') || '/';
}

// Main validation
console.log('='.repeat(60));
console.log('SITEMAP VALIDATION REPORT');
console.log('='.repeat(60));

const existingFiles = getAllHtmlFiles();
console.log(`\nTotal HTML files found: ${existingFiles.size}`);

const allSitemapUrls = new Set();

sitemapFiles.forEach(sitemap => {
  const urls = parseSitemap(sitemap);
  console.log(`\n${sitemap}: ${urls.length} URLs`);

  urls.forEach(url => {
    const urlPath = urlToPath(url);
    allSitemapUrls.add(urlPath);

    if (!existingFiles.has(urlPath)) {
      issues.notFound.push({ sitemap, url, path: urlPath });
    }
  });
});

// Check for duplicates
const urlCounts = {};
sitemapFiles.forEach(sitemap => {
  parseSitemap(sitemap).forEach(url => {
    const urlPath = urlToPath(url);
    if (!urlCounts[urlPath]) urlCounts[urlPath] = [];
    urlCounts[urlPath].push(sitemap);
  });
});

Object.entries(urlCounts).forEach(([url, sitemaps]) => {
  if (sitemaps.length > 1) {
    issues.duplicates.push({ url, sitemaps });
  }
});

// Report
console.log('\n' + '='.repeat(60));
console.log('ISSUES FOUND');
console.log('='.repeat(60));

if (issues.notFound.length > 0) {
  console.log(`\n404 - FILES NOT FOUND (${issues.notFound.length}):`);
  issues.notFound.forEach(issue => {
    console.log(`  ${issue.path} (in ${issue.sitemap})`);
  });
}

if (issues.duplicates.length > 0) {
  console.log(`\nDUPLICATE URLS (${issues.duplicates.length}):`);
  issues.duplicates.forEach(issue => {
    console.log(`  ${issue.url} appears in: ${issue.sitemaps.join(', ')}`);
  });
}

// Check for files not in sitemap
console.log('\n' + '='.repeat(60));
console.log('FILES NOT IN ANY SITEMAP');
console.log('='.repeat(60));

const notInSitemap = [];
existingFiles.forEach(file => {
  if (!allSitemapUrls.has(file) && file !== '/404' && file !== '/500' && file !== '/sitemap') {
    notInSitemap.push(file);
  }
});

if (notInSitemap.length > 0) {
  console.log(`\n${notInSitemap.length} files not in sitemap:`);
  notInSitemap.slice(0, 20).forEach(f => console.log(`  ${f}`));
  if (notInSitemap.length > 20) console.log(`  ... and ${notInSitemap.length - 20} more`);
}

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total sitemap URLs: ${allSitemapUrls.size}`);
console.log(`Total HTML files: ${existingFiles.size}`);
console.log(`404 issues: ${issues.notFound.length}`);
console.log(`Duplicate URLs: ${issues.duplicates.length}`);
console.log(`Files not in sitemap: ${notInSitemap.length}`);
