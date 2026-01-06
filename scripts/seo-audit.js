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

  // Remove .html extension
  if (relativePath === 'index.html') {
    return '/';
  }
  if (relativePath.endsWith('/index.html')) {
    return '/' + relativePath.replace('/index.html', '');
  }
  return '/' + relativePath.replace('.html', '');
}

// Parse sitemap and extract URLs
function parseSitemap(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// Check if HTML file has canonical tag
function checkCanonical(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  return canonicalMatch ? canonicalMatch[1] : null;
}

// Check if HTML file has robots meta tag
function checkRobots(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const robotsMatch = content.match(/<meta\s+name="robots"\s+content="([^"]+)"/);
  return robotsMatch ? robotsMatch[1] : null;
}

// Main audit
function runAudit() {
  console.log('=' .repeat(70));
  console.log('SEO AUDIT - Dorys Cleaning Services');
  console.log('=' .repeat(70));

  // 1. Get all HTML files
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`\nTotal HTML files: ${htmlFiles.length}`);

  // 2. Build map of existing pages
  const existingPages = new Map();
  for (const file of htmlFiles) {
    const cleanUrl = getCleanUrl(file);
    const fullUrl = DOMAIN + cleanUrl;
    existingPages.set(fullUrl, file);
    existingPages.set(cleanUrl, file);
  }

  // 3. Parse all sitemaps
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
  const urlSources = new Map();

  for (const sitemap of sitemapFiles) {
    const sitemapPath = path.join(ROOT_DIR, sitemap);
    if (fs.existsSync(sitemapPath)) {
      const urls = parseSitemap(sitemapPath);
      for (const url of urls) {
        if (sitemapUrls.has(url)) {
          if (!urlSources.has(url)) urlSources.set(url, []);
          urlSources.get(url).push(sitemap);
        }
        sitemapUrls.add(url);
        if (!urlSources.has(url)) urlSources.set(url, []);
        urlSources.get(url).push(sitemap);
      }
    }
  }

  console.log(`Total URLs in sitemaps: ${sitemapUrls.size}`);

  // 4. Check for 404s (URLs in sitemap but no matching file)
  console.log('\n' + '-'.repeat(70));
  console.log('POTENTIAL 404s (URLs in sitemap without matching files):');
  console.log('-'.repeat(70));

  let notFoundCount = 0;
  for (const url of sitemapUrls) {
    const cleanPath = url.replace(DOMAIN, '');
    if (!existingPages.has(url) && !existingPages.has(cleanPath)) {
      console.log(`  404: ${url}`);
      notFoundCount++;
    }
  }
  console.log(`Total: ${notFoundCount}`);

  // 5. Check for duplicates in sitemaps
  console.log('\n' + '-'.repeat(70));
  console.log('DUPLICATE URLs (appearing in multiple sitemaps):');
  console.log('-'.repeat(70));

  let duplicateCount = 0;
  for (const [url, sources] of urlSources) {
    if (sources.length > 1) {
      console.log(`  ${url}`);
      console.log(`    Found in: ${sources.join(', ')}`);
      duplicateCount++;
    }
  }
  console.log(`Total duplicates: ${duplicateCount}`);

  // 6. Check canonical tags
  console.log('\n' + '-'.repeat(70));
  console.log('CANONICAL TAG ISSUES:');
  console.log('-'.repeat(70));

  let missingCanonical = 0;
  let wrongCanonical = 0;
  let trailingSlashIssues = 0;

  for (const file of htmlFiles) {
    const cleanUrl = getCleanUrl(file);
    const expectedCanonical = DOMAIN + cleanUrl;
    const actualCanonical = checkCanonical(file);

    // Skip 404/500 pages
    if (file.includes('404.html') || file.includes('500.html')) continue;

    if (!actualCanonical) {
      console.log(`  MISSING: ${cleanUrl}`);
      missingCanonical++;
    } else {
      // Check for trailing slash issues
      if (actualCanonical.endsWith('/') && cleanUrl !== '/') {
        console.log(`  TRAILING SLASH: ${cleanUrl}`);
        console.log(`    Has: ${actualCanonical}`);
        console.log(`    Expected: ${expectedCanonical}`);
        trailingSlashIssues++;
      } else if (actualCanonical !== expectedCanonical && !actualCanonical.endsWith('/')) {
        console.log(`  MISMATCH: ${cleanUrl}`);
        console.log(`    Has: ${actualCanonical}`);
        console.log(`    Expected: ${expectedCanonical}`);
        wrongCanonical++;
      }
    }
  }
  console.log(`\nMissing canonical: ${missingCanonical}`);
  console.log(`Wrong canonical: ${wrongCanonical}`);
  console.log(`Trailing slash issues: ${trailingSlashIssues}`);

  // 7. Check for pages with .html in URLs (redirect candidates)
  console.log('\n' + '-'.repeat(70));
  console.log('REDIRECT CANDIDATES (.html URLs in sitemaps):');
  console.log('-'.repeat(70));

  let htmlExtensionCount = 0;
  for (const url of sitemapUrls) {
    if (url.includes('.html')) {
      console.log(`  ${url}`);
      htmlExtensionCount++;
    }
  }
  console.log(`Total: ${htmlExtensionCount}`);

  // 8. Check robots meta tags (noindex pages)
  console.log('\n' + '-'.repeat(70));
  console.log('NOINDEX PAGES (should not be in sitemap):');
  console.log('-'.repeat(70));

  let noindexCount = 0;
  for (const file of htmlFiles) {
    const robots = checkRobots(file);
    if (robots && robots.includes('noindex')) {
      const cleanUrl = getCleanUrl(file);
      const fullUrl = DOMAIN + cleanUrl;
      console.log(`  ${cleanUrl}`);
      if (sitemapUrls.has(fullUrl)) {
        console.log(`    WARNING: This noindex page IS in sitemap!`);
      }
      noindexCount++;
    }
  }
  console.log(`Total noindex pages: ${noindexCount}`);

  // 9. Summary
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`HTML files: ${htmlFiles.length}`);
  console.log(`Sitemap URLs: ${sitemapUrls.size}`);
  console.log(`Potential 404s: ${notFoundCount}`);
  console.log(`Duplicate URLs: ${duplicateCount}`);
  console.log(`Missing canonical: ${missingCanonical}`);
  console.log(`Wrong canonical: ${wrongCanonical}`);
  console.log(`Trailing slash issues: ${trailingSlashIssues}`);
  console.log(`URLs with .html: ${htmlExtensionCount}`);
  console.log(`Noindex pages: ${noindexCount}`);
}

runAudit();
