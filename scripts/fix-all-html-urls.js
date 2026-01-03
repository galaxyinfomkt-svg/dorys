/**
 * Fix ALL .html URLs across the entire site
 * This script removes .html from all internal links
 */

const fs = require('fs');
const path = require('path');

// Get all HTML files recursively
function getAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Fix all URLs in content
function fixAllUrls(content) {
  // Fix relative paths with .html
  // ../about.html -> /about
  content = content.replace(/href="\.\.\/about\.html"/g, 'href="/about"');
  content = content.replace(/href="\.\.\/contact\.html"/g, 'href="/contact"');
  content = content.replace(/href="\.\.\/reviews\.html"/g, 'href="/reviews"');
  content = content.replace(/href="\.\.\/privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="\.\.\/terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="\.\.\/sitemap\.html"/g, 'href="/sitemap"');
  content = content.replace(/href="\.\.\/index\.html"/g, 'href="/"');

  // Fix absolute paths with .html
  content = content.replace(/href="\/about\.html"/g, 'href="/about"');
  content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');
  content = content.replace(/href="\/reviews\.html"/g, 'href="/reviews"');
  content = content.replace(/href="\/privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="\/terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="\/sitemap\.html"/g, 'href="/sitemap"');
  content = content.replace(/href="\/index\.html"/g, 'href="/"');

  // Fix location page links (relative)
  // marlborough-ma.html -> /locations/marlborough-ma
  content = content.replace(/href="([a-z-]+)-ma\.html"/g, 'href="/locations/$1-ma"');

  // Fix relative service links
  // ../services/deep-cleaning/hudson-ma.html -> /services/deep-cleaning/hudson-ma
  content = content.replace(/href="\.\.\/services\/([^/]+)\/([^"]+)\.html"/g, 'href="/services/$1/$2"');

  // Fix absolute location links
  content = content.replace(/href="\/locations\/([^"]+)\.html"/g, 'href="/locations/$1"');

  // Fix absolute service links
  content = content.replace(/href="\/services\/([^/]+)\/([^"]+)\.html"/g, 'href="/services/$1/$2"');

  // Fix canonical URLs
  content = content.replace(/rel="canonical" href="([^"]+)\.html"/g, 'rel="canonical" href="$1"');

  // Fix og:url
  content = content.replace(/property="og:url" content="([^"]+)\.html"/g, 'property="og:url" content="$1"');

  // Fix schema.org URLs
  content = content.replace(/"url": "([^"]+)\.html"/g, '"url": "$1"');
  content = content.replace(/"item": "([^"]+)\.html"/g, '"item": "$1"');

  return content;
}

// Main function
function main() {
  const baseDir = path.join(__dirname, '..');
  const files = getAllHtmlFiles(baseDir);

  console.log('='.repeat(60));
  console.log('Fixing ALL .html URLs');
  console.log('='.repeat(60));
  console.log(`Found ${files.length} HTML files\n`);

  let processed = 0;
  let modified = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const originalContent = fs.readFileSync(file, 'utf8');
      const fixedContent = fixAllUrls(originalContent);

      if (originalContent !== fixedContent) {
        fs.writeFileSync(file, fixedContent, 'utf8');
        modified++;
        const relativePath = path.relative(baseDir, file);
        console.log(`  Modified: ${relativePath}`);
      }

      processed++;
    } catch (e) {
      console.error(`  Error: ${file} - ${e.message}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Processed: ${processed} files`);
  console.log(`Modified: ${modified} files`);
  console.log(`Errors: ${errors}`);
}

main();
