/**
 * Fix ALL internal links across the entire site
 * Remove .html extensions for clean URLs
 */

const fs = require('fs');
const path = require('path');

// Get all HTML files recursively
function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'scripts') {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Fix all internal links in content
function fixInternalLinks(content) {
  // Fix location links with .html
  content = content.replace(/href="(\.\.\/)*locations\/([a-z-]+)-ma\.html"/g, 'href="/locations/$2-ma"');
  content = content.replace(/href="locations\/([a-z-]+)-ma\.html"/g, 'href="/locations/$1-ma"');

  // Fix service links with .html
  content = content.replace(/href="(\.\.\/)*services\/([a-z-]+)\/([a-z-]+)-ma\.html"/g, 'href="/services/$2/$3-ma"');
  content = content.replace(/href="services\/([a-z-]+)\/([a-z-]+)-ma\.html"/g, 'href="/services/$1/$2-ma"');

  // Fix main page links
  content = content.replace(/href="(\.\.\/)*about\.html"/g, 'href="/about"');
  content = content.replace(/href="(\.\.\/)*contact\.html"/g, 'href="/contact"');
  content = content.replace(/href="(\.\.\/)*reviews\.html"/g, 'href="/reviews"');
  content = content.replace(/href="(\.\.\/)*privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="(\.\.\/)*terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="(\.\.\/)*sitemap\.html"/g, 'href="/sitemap"');
  content = content.replace(/href="(\.\.\/)*index\.html"/g, 'href="/"');

  // Fix relative paths to absolute for main pages
  content = content.replace(/href="about\.html"/g, 'href="/about"');
  content = content.replace(/href="contact\.html"/g, 'href="/contact"');
  content = content.replace(/href="reviews\.html"/g, 'href="/reviews"');
  content = content.replace(/href="privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="sitemap\.html"/g, 'href="/sitemap"');

  // Fix index.html references
  content = content.replace(/href="(\.\.\/)*services\/index\.html"/g, 'href="/services"');
  content = content.replace(/href="(\.\.\/)*locations\/index\.html"/g, 'href="/locations"');
  content = content.replace(/href="services\/index\.html"/g, 'href="/services"');
  content = content.replace(/href="locations\/index\.html"/g, 'href="/locations"');

  // Fix service index pages
  content = content.replace(/href="(\.\.\/)*services\/janitorial-service\/index\.html"/g, 'href="/services/janitorial-service"');
  content = content.replace(/href="(\.\.\/)*services\/deep-cleaning\/index\.html"/g, 'href="/services/deep-cleaning"');
  content = content.replace(/href="(\.\.\/)*services\/carpet-cleaning\/index\.html"/g, 'href="/services/carpet-cleaning"');
  content = content.replace(/href="(\.\.\/)*services\/general-housekeeping\/index\.html"/g, 'href="/services/general-housekeeping"');
  content = content.replace(/href="(\.\.\/)*services\/upholstery-cleaning\/index\.html"/g, 'href="/services/upholstery-cleaning"');

  // Fix remaining relative service links with trailing slash
  content = content.replace(/href="services\/janitorial-service\/"/g, 'href="/services/janitorial-service"');
  content = content.replace(/href="services\/deep-cleaning\/"/g, 'href="/services/deep-cleaning"');
  content = content.replace(/href="services\/carpet-cleaning\/"/g, 'href="/services/carpet-cleaning"');
  content = content.replace(/href="services\/general-housekeeping\/"/g, 'href="/services/general-housekeeping"');
  content = content.replace(/href="services\/upholstery-cleaning\/"/g, 'href="/services/upholstery-cleaning"');
  content = content.replace(/href="services\/"/g, 'href="/services"');
  content = content.replace(/href="locations\/"/g, 'href="/locations"');

  // Fix canonical URLs
  content = content.replace(/rel="canonical" href="([^"]+)\.html"/g, 'rel="canonical" href="$1"');

  // Fix og:url
  content = content.replace(/property="og:url" content="([^"]+)\.html"/g, 'property="og:url" content="$1"');

  // Fix schema.org URLs
  content = content.replace(/"url": "([^"]+)\.html"/g, '"url": "$1"');
  content = content.replace(/"item": "([^"]+)\.html"/g, '"item": "$1"');

  return content;
}

// Process a single file
function processFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const fixedContent = fixInternalLinks(originalContent);

  if (originalContent !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    return true;
  }
  return false;
}

// Main function
function main() {
  const baseDir = path.join(__dirname, '..');
  const files = getAllHtmlFiles(baseDir);

  console.log('='.repeat(60));
  console.log('Fixing ALL Internal Links - Clean URLs');
  console.log('='.repeat(60));
  console.log(`Found ${files.length} HTML files\n`);

  let modified = 0;
  let errors = 0;

  for (const file of files) {
    try {
      if (processFile(file)) {
        modified++;
        const relativePath = path.relative(baseDir, file);
        console.log(`  Modified: ${relativePath}`);
      }
    } catch (e) {
      console.error(`  Error: ${file} - ${e.message}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total files: ${files.length}`);
  console.log(`Modified: ${modified}`);
  console.log(`Errors: ${errors}`);
}

main();
