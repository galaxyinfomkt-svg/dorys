/**
 * Critical SEO Fixes Script
 * 1. Fix phone number inconsistency (NAP)
 * 2. Add defer to JS files
 * 3. Fix duplicate words in alt tags
 * 4. Add Service schema to service+city pages
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Stats
let stats = {
  phoneFixed: 0,
  jsDeferred: 0,
  altFixed: 0,
  schemaAdded: 0,
  filesProcessed: 0
};

// Correct phone number
const WRONG_PHONE = '(508) 820-9299';
const CORRECT_PHONE = '(978) 307-8107';

// Service definitions for schema
const services = {
  'janitorial-service': {
    name: 'Janitorial Service',
    description: 'Professional commercial janitorial and office cleaning services including daily maintenance, restroom sanitation, and floor care.'
  },
  'deep-cleaning': {
    name: 'Deep Cleaning',
    description: 'Comprehensive deep cleaning services for homes and businesses including sanitization, degreasing, and detailed surface cleaning.'
  },
  'carpet-cleaning': {
    name: 'Carpet Cleaning',
    description: 'Professional carpet and rug cleaning using hot water extraction and eco-friendly solutions for stain removal and odor elimination.'
  },
  'general-housekeeping': {
    name: 'General Housekeeping',
    description: 'Regular housekeeping and maid services including dusting, vacuuming, mopping, and general home maintenance.'
  },
  'upholstery-cleaning': {
    name: 'Upholstery Cleaning',
    description: 'Professional furniture and upholstery cleaning for sofas, chairs, and fabric surfaces using safe cleaning methods.'
  }
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const fileName = path.basename(filePath);
  const dirName = path.basename(path.dirname(filePath));

  // 1. Fix phone number
  if (content.includes(WRONG_PHONE)) {
    content = content.replace(new RegExp(WRONG_PHONE.replace(/[()]/g, '\\$&'), 'g'), CORRECT_PHONE);
    stats.phoneFixed++;
    modified = true;
  }

  // 2. Add defer to JS scripts (if not already present)
  const jsPatterns = [
    { from: '<script src="/assets/js/main.js"></script>', to: '<script src="/assets/js/main.js" defer></script>' },
    { from: '<script src="/assets/js/header.js"></script>', to: '<script src="/assets/js/header.js" defer></script>' },
    { from: '<script src="/assets/js/animations.js"></script>', to: '<script src="/assets/js/animations.js" defer></script>' },
    { from: '<script src="/assets/js/navigation.js"></script>', to: '<script src="/assets/js/navigation.js" defer></script>' },
    { from: '<script src="/assets/js/lightbox.js"></script>', to: '<script src="/assets/js/lightbox.js" defer></script>' },
    { from: '<script src="/assets/js/form-handler.js"></script>', to: '<script src="/assets/js/form-handler.js" defer></script>' }
  ];

  for (const pattern of jsPatterns) {
    if (content.includes(pattern.from) && !content.includes(pattern.to)) {
      content = content.replace(pattern.from, pattern.to);
      stats.jsDeferred++;
      modified = true;
    }
  }

  // 3. Fix duplicate words in alt tags
  const duplicateAltPatterns = [
    { from: /alt="([^"]*)\s+service\s+service([^"]*)"/gi, to: 'alt="$1 service$2"' },
    { from: /alt="([^"]*)\s+cleaning\s+cleaning([^"]*)"/gi, to: 'alt="$1 cleaning$2"' }
  ];

  for (const pattern of duplicateAltPatterns) {
    if (pattern.from.test(content)) {
      content = content.replace(pattern.from, pattern.to);
      stats.altFixed++;
      modified = true;
    }
  }

  // 4. Add Service schema to service+city pages (if missing)
  const isServiceCityPage = filePath.includes('services') &&
                            fileName.endsWith('-ma.html') &&
                            !fileName.includes('index');

  if (isServiceCityPage && !content.includes('"@type": "Service"') && services[dirName]) {
    const service = services[dirName];
    const cityMatch = fileName.match(/^(.+)-ma\.html$/);
    if (cityMatch) {
      const citySlug = cityMatch[1];
      const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const serviceSchema = `
  <!-- Schema.org Service -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "${service.name} in ${cityName}, MA",
    "description": "${service.description}",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Dorys Janitorial Cleaning Services Inc.",
      "telephone": "+1-978-307-8107"
    },
    "areaServed": {
      "@type": "City",
      "name": "${cityName}",
      "containedInPlace": {"@type": "State", "name": "Massachusetts"}
    },
    "serviceType": "${service.name}"
  }
  </script>`;

      // Insert before </head>
      content = content.replace('</head>', serviceSchema + '\n</head>');
      stats.schemaAdded++;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    stats.filesProcessed++;
  }

  return modified;
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, assets
      if (!['node_modules', '.git', 'assets', 'scripts'].includes(item)) {
        processDirectory(fullPath);
      }
    } else if (item.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

console.log('Starting critical SEO fixes...\n');
processDirectory(ROOT_DIR);

console.log('\n=== CRITICAL SEO FIXES COMPLETE ===');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Phone numbers fixed: ${stats.phoneFixed}`);
console.log(`JS files deferred: ${stats.jsDeferred}`);
console.log(`Alt tags fixed: ${stats.altFixed}`);
console.log(`Service schemas added: ${stats.schemaAdded}`);
