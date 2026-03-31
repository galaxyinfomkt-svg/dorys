/**
 * Optimize All Pages - Complete SEO/AEO Enhancement
 * - Remove .html from all internal URLs
 * - Fix meta titles/descriptions with keywords
 * - Add urgency CTAs
 * - Optimize image alt text
 * - Fix footer logo
 */

const fs = require('fs');
const path = require('path');

// Directories to process
const SERVICE_DIRS = [
  'services/deep-cleaning',
  'services/carpet-cleaning',
  'services/janitorial-service',
  'services/general-housekeeping',
  'services/upholstery-cleaning'
];

const MAIN_PAGES = [
  'index.html',
  'about.html',
  'contact.html',
  'reviews.html',
  'privacy.html',
  'terms.html',
  'sitemap.html'
];

// Service-specific keywords for SEO
const SERVICE_KEYWORDS = {
  'deep-cleaning': {
    primary: 'deep cleaning',
    secondary: ['move-out cleaning', 'move-in cleaning', 'one-time cleaning', 'spring cleaning'],
    type: ['residential', 'commercial']
  },
  'carpet-cleaning': {
    primary: 'carpet cleaning',
    secondary: ['rug cleaning', 'carpet shampooing', 'stain removal', 'pet odor removal'],
    type: ['residential', 'commercial']
  },
  'janitorial-service': {
    primary: 'janitorial services',
    secondary: ['office cleaning', 'commercial cleaning', 'building maintenance', 'night cleaning'],
    type: ['commercial', 'industrial']
  },
  'general-housekeeping': {
    primary: 'housekeeping',
    secondary: ['maid service', 'house cleaning', 'home cleaning', 'recurring cleaning'],
    type: ['residential']
  },
  'upholstery-cleaning': {
    primary: 'upholstery cleaning',
    secondary: ['furniture cleaning', 'couch cleaning', 'sofa cleaning', 'fabric cleaning'],
    type: ['residential', 'commercial']
  }
};

// Urgency CTAs to replace generic ones
const URGENCY_CTAS = [
  'Get Your Free Quote in 24 Hours',
  'Book Now - Same Week Availability',
  'Schedule Today, Spotless Tomorrow',
  'Get Your Spotless Space in 48 Hours',
  'Limited Slots Available - Book Now'
];

// Fix all URLs - remove .html extension
function fixAllUrls(content) {
  // Fix location links
  content = content.replace(/href="\/locations\/([^"]+)\.html"/g, 'href="/locations/$1"');

  // Fix service links
  content = content.replace(/href="\/services\/([^\/]+)\/([^"]+)\.html"/g, 'href="/services/$1/$2"');

  // Fix main page links
  content = content.replace(/href="\/about\.html"/g, 'href="/about"');
  content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');
  content = content.replace(/href="\/reviews\.html"/g, 'href="/reviews"');
  content = content.replace(/href="\/privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="\/terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="\/sitemap\.html"/g, 'href="/sitemap"');

  // Fix canonical URLs
  content = content.replace(/rel="canonical" href="([^"]+)\.html"/g, 'rel="canonical" href="$1"');

  // Fix og:url
  content = content.replace(/property="og:url" content="([^"]+)\.html"/g, 'property="og:url" content="$1"');

  // Fix schema.org URLs
  content = content.replace(/"url": "([^"]+)\.html"/g, '"url": "$1"');
  content = content.replace(/"item": "([^"]+)\.html"/g, '"item": "$1"');

  return content;
}

// Optimize meta tags for SEO
function optimizeMetaTags(content, serviceSlug, cityName) {
  if (!serviceSlug || !cityName) return content;

  const service = SERVICE_KEYWORDS[serviceSlug];
  if (!service) return content;

  const cityFormatted = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const typeStr = service.type.join(' & ');

  // Build optimized title
  const newTitle = `Best ${service.primary.charAt(0).toUpperCase() + service.primary.slice(1)} in ${cityFormatted}, MA | Dorys Cleaning Services`;

  // Build optimized description
  const newDescription = `Top-rated ${typeStr} ${service.primary} in ${cityFormatted}, Massachusetts. ${service.secondary[0].charAt(0).toUpperCase() + service.secondary[0].slice(1)}, ${service.secondary[1]}, and more. 21+ years experience. Free quotes. Call (508) 820-9299.`;

  // Replace title
  content = content.replace(/<title>[^<]+<\/title>/, `<title>${newTitle}</title>`);

  // Replace meta description
  content = content.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${newDescription}">`
  );

  // Replace og:title
  content = content.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${newTitle}">`
  );

  // Replace og:description
  content = content.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${newDescription}">`
  );

  return content;
}

// Add urgency CTAs throughout the page
function addUrgencyCTAs(content) {
  // Replace generic "Request Free Quote" with urgency versions
  const ctaReplacements = [
    {
      old: />Request Free Quote</g,
      new: '>Get Your Free Quote Today<'
    },
    {
      old: />Get Free Quote</g,
      new: '>Get Your Spotless Space in 48 Hours<'
    },
    {
      old: />Request a Quote</g,
      new: '>Book Now - Same Week Availability<'
    }
  ];

  ctaReplacements.forEach(rep => {
    content = content.replace(rep.old, rep.new);
  });

  return content;
}

// Optimize image alt text for SEO
function optimizeAltText(content, serviceSlug, cityName) {
  if (!serviceSlug || !cityName) return content;

  const service = SERVICE_KEYWORDS[serviceSlug];
  if (!service) return content;

  const cityFormatted = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  // Improve generic alt texts
  content = content.replace(
    /alt="Professional cleaning"/gi,
    `alt="Professional ${service.primary} service in ${cityFormatted} MA"`
  );

  content = content.replace(
    /alt="Cleaning service"/gi,
    `alt="${service.primary.charAt(0).toUpperCase() + service.primary.slice(1)} by Dorys in ${cityFormatted}"`
  );

  content = content.replace(
    /alt="Before and after"/gi,
    `alt="Before and after ${service.primary} results in ${cityFormatted} MA"`
  );

  content = content.replace(
    /alt="Our team"/gi,
    `alt="Dorys ${service.primary} team serving ${cityFormatted} Massachusetts"`
  );

  // Add descriptive alt to hero images
  content = content.replace(
    /alt="Hero background"/gi,
    `alt="Professional ${service.primary} services in ${cityFormatted} MA - Dorys Cleaning"`
  );

  return content;
}

// Fix footer logo - ensure it's visible and clickable
function fixFooterLogo(content) {
  // Make sure logo links to home
  content = content.replace(
    /<a[^>]*class="footer__logo"[^>]*>/g,
    '<a href="/" class="footer__logo" aria-label="Dorys Cleaning Services - Home">'
  );

  // Ensure logo image has proper attributes
  content = content.replace(
    /<img([^>]*class="footer__logo-img"[^>]*)>/g,
    (match, attrs) => {
      if (!attrs.includes('alt=')) {
        attrs += ' alt="Dorys Cleaning Services Logo"';
      }
      return `<img${attrs}>`;
    }
  );

  return content;
}

// Add structured data enhancements for AEO
function enhanceStructuredData(content, serviceSlug, cityName) {
  if (!serviceSlug || !cityName) return content;

  const service = SERVICE_KEYWORDS[serviceSlug];
  if (!service) return content;

  // Check if there's already a HowTo schema, if not add one
  if (!content.includes('"@type": "HowTo"') && !content.includes('"@type":"HowTo"')) {
    const howToSchema = {
      "@type": "HowTo",
      "name": `How to Get Professional ${service.primary} in ${cityName}`,
      "description": `Easy steps to book ${service.primary} services with Dorys Cleaning in ${cityName}, MA`,
      "step": [
        {
          "@type": "HowToStep",
          "name": "Request a Quote",
          "text": "Call us at (508) 820-9299 or fill out our online form for a free estimate."
        },
        {
          "@type": "HowToStep",
          "name": "Schedule Your Service",
          "text": "Choose a convenient date and time for your cleaning service."
        },
        {
          "@type": "HowToStep",
          "name": "Enjoy Your Clean Space",
          "text": "Our professional team arrives and transforms your space."
        }
      ]
    };

    // Insert before closing </script> of existing schema
    const schemaEnd = '</script>\n  </head>';
    if (content.includes(schemaEnd)) {
      const howToScriptTag = `</script>\n  <script type="application/ld+json">\n${JSON.stringify(howToSchema, null, 2)}\n  </script>\n  </head>`;
      content = content.replace(schemaEnd, howToScriptTag);
    }
  }

  return content;
}

// Process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Get service slug and city name from path
  const pathParts = filePath.split(path.sep);
  const fileName = pathParts[pathParts.length - 1];
  let serviceSlug = null;
  let cityName = null;

  if (filePath.includes('services')) {
    serviceSlug = pathParts[pathParts.length - 2];
    cityName = fileName.replace('.html', '').replace(/-ma$/, '').replace(/-/g, ' ');
  }

  // Apply all optimizations
  content = fixAllUrls(content);
  content = optimizeMetaTags(content, serviceSlug, cityName);
  content = addUrgencyCTAs(content);
  content = optimizeAltText(content, serviceSlug, cityName);
  content = fixFooterLogo(content);

  // Only add enhanced schema if not already present
  if (serviceSlug && cityName) {
    content = enhanceStructuredData(content, serviceSlug, cityName);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// Main function
function main() {
  const baseDir = path.join(__dirname, '..');
  let processed = 0;
  let errors = 0;

  console.log('='.repeat(60));
  console.log('Complete Page Optimization');
  console.log('='.repeat(60));
  console.log('');
  console.log('Optimizations:');
  console.log('  - Remove .html from all URLs');
  console.log('  - Optimize meta titles/descriptions');
  console.log('  - Add urgency CTAs');
  console.log('  - Optimize image alt text');
  console.log('  - Fix footer logo');
  console.log('  - Enhance structured data');
  console.log('');

  // Process service directories
  SERVICE_DIRS.forEach(dir => {
    const fullDir = path.join(baseDir, dir);
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.html'));
      console.log(`Processing ${dir} (${files.length} files)`);

      files.forEach(file => {
        try {
          processFile(path.join(fullDir, file));
          processed++;
        } catch (e) {
          console.error(`  Error: ${file} - ${e.message}`);
          errors++;
        }
      });
    }
  });

  // Process location pages
  const locationsDir = path.join(baseDir, 'locations');
  if (fs.existsSync(locationsDir)) {
    const files = fs.readdirSync(locationsDir).filter(f => f.endsWith('.html'));
    console.log(`Processing locations (${files.length} files)`);

    files.forEach(file => {
      try {
        let content = fs.readFileSync(path.join(locationsDir, file), 'utf8');
        content = fixAllUrls(content);
        content = addUrgencyCTAs(content);
        content = fixFooterLogo(content);
        fs.writeFileSync(path.join(locationsDir, file), content, 'utf8');
        processed++;
      } catch (e) {
        console.error(`  Error: ${file} - ${e.message}`);
        errors++;
      }
    });
  }

  // Process main pages
  console.log('Processing main pages');
  MAIN_PAGES.forEach(page => {
    const filePath = path.join(baseDir, page);
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = fixAllUrls(content);
        content = addUrgencyCTAs(content);
        content = fixFooterLogo(content);
        fs.writeFileSync(filePath, content, 'utf8');
        processed++;
        console.log(`  Updated: ${page}`);
      } catch (e) {
        console.error(`  Error: ${page} - ${e.message}`);
        errors++;
      }
    }
  });

  console.log('');
  console.log('='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Processed: ${processed} files`);
  console.log(`Errors: ${errors}`);
}

main();
