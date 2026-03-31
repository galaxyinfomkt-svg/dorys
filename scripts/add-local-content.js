/**
 * Dorys Cleaning Services - Add Local Content to Service+City Pages
 *
 * This script updates existing service+city pages to add localized content:
 * 1. Localized introduction with neighborhoods/landmarks
 * 2. Custom FAQs per city/service combination
 * 3. "About the City" section
 * 4. Local client count
 * 5. Updated benefits with local references
 *
 * Usage: node scripts/add-local-content.js
 * Test:  node scripts/add-local-content.js --test deep-cleaning boston
 */

const fs = require('fs');
const path = require('path');
const { CITY_LOCAL_DATA, DEFAULT_CITY_DATA } = require('./city-local-data.js');

// Service name mapping for display
const SERVICE_NAMES = {
  'deep-cleaning': 'Deep Cleaning',
  'carpet-cleaning': 'Carpet Cleaning',
  'janitorial-service': 'Janitorial Service',
  'general-housekeeping': 'Housekeeping',
  'upholstery-cleaning': 'Upholstery Cleaning'
};

// Get city key from slug (e.g., 'boston-ma' -> 'boston')
function getCityKey(slug) {
  return slug.replace('-ma', '').replace('.html', '');
}

// Get city data (specific or default)
function getCityData(cityKey, cityName) {
  const specific = CITY_LOCAL_DATA[cityKey];
  if (specific) {
    return specific;
  }

  // Return default with city name filled in
  const defaultData = JSON.parse(JSON.stringify(DEFAULT_CITY_DATA));
  defaultData.name = cityName;
  defaultData.neighborhoods = [];
  defaultData.landmarks = [];
  defaultData.nearbyAreas = [];

  // Fill in city name in FAQs
  for (const service in defaultData.customFaqs) {
    defaultData.customFaqs[service] = defaultData.customFaqs[service].map(faq => ({
      q: faq.q.replace(/\{\{city\}\}/g, cityName),
      a: faq.a.replace(/\{\{city\}\}/g, cityName)
    }));
  }

  return defaultData;
}

// Generate the "About This City" section HTML
function generateAboutCitySection(cityData, service) {
  const serviceName = SERVICE_NAMES[service] || service;

  let neighborhoodsText = '';
  if (cityData.neighborhoods && cityData.neighborhoods.length > 0) {
    const listed = cityData.neighborhoods.slice(0, 4).join(', ');
    neighborhoodsText = `We proudly serve all ${cityData.name} neighborhoods including ${listed}, and surrounding areas.`;
  }

  let propertyText = '';
  if (cityData.propertyTypes && cityData.propertyTypes.length > 0) {
    const types = cityData.propertyTypes.slice(0, 3).join(', ');
    propertyText = `Our team is experienced with ${types} common in the ${cityData.name} area.`;
  }

  let nearbyText = '';
  if (cityData.nearbyAreas && cityData.nearbyAreas.length > 0) {
    const areas = cityData.nearbyAreas.join(', ');
    nearbyText = `We also serve nearby communities including ${areas}.`;
  }

  return `
    <!-- About This City Section -->
    <section class="section section--about-city">
      <div class="container">
        <div class="about-city-content">
          <h2>Professional ${serviceName} Serving ${cityData.name}, Massachusetts</h2>
          <p>${cityData.localFact || `${cityData.name} is a wonderful Massachusetts community with diverse cleaning needs.`}</p>
          ${neighborhoodsText ? `<p>${neighborhoodsText}</p>` : ''}
          ${propertyText ? `<p>${propertyText}</p>` : ''}
          ${nearbyText ? `<p>${nearbyText}</p>` : ''}
          <p class="about-city-stats"><strong>${cityData.satisfiedClients || '30+'} satisfied clients</strong> in ${cityData.name} trust Dorys for their ${serviceName.toLowerCase()} needs.</p>
        </div>
      </div>
    </section>`;
}

// Generate custom FAQ HTML for city/service
function generateCustomFaqHtml(cityData, service) {
  const faqs = cityData.customFaqs?.[service];
  if (!faqs || faqs.length === 0) return null;

  const faqItems = faqs.map(faq => `
          <div class="accordion__item">
            <button class="accordion__header" aria-expanded="false">
              ${faq.q}
              <svg class="accordion__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div class="accordion__content">
              <div class="accordion__body">
                <p>${faq.a}</p>
              </div>
            </div>
          </div>`).join('');

  return faqItems;
}

// Generate FAQ schema for custom FAQs
function generateFaqSchema(cityData, service) {
  const faqs = cityData.customFaqs?.[service];
  if (!faqs || faqs.length === 0) return null;

  const schemaItems = faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }));

  return schemaItems;
}

// Update the hero subtitle with local info
function generateLocalizedSubtitle(cityData, service) {
  const serviceName = SERVICE_NAMES[service] || service;

  let subtitle = `Transform your space with our comprehensive ${serviceName.toLowerCase()} service.`;

  if (cityData.neighborhoods && cityData.neighborhoods.length > 0) {
    const areas = cityData.neighborhoods.slice(0, 2).join(' and ');
    subtitle += ` Serving ${areas} and all ${cityData.name} neighborhoods.`;
  }

  if (cityData.propertyTypes && cityData.propertyTypes.length > 0) {
    const types = cityData.propertyTypes.slice(0, 2).join(' and ');
    subtitle += ` Expert care for ${types}.`;
  }

  return subtitle;
}

// Process a single HTML file
function processFile(filePath, service) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.html');
    const cityKey = getCityKey(fileName);

    // Extract city name from the page
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    let cityName = cityKey.charAt(0).toUpperCase() + cityKey.slice(1).replace(/-/g, ' ');
    if (titleMatch) {
      const match = titleMatch[1].match(/in ([^,]+),? MA/i);
      if (match) cityName = match[1].trim();
    }

    const cityData = getCityData(cityKey, cityName);

    // Track changes
    let changes = [];

    // 1. Add About City section before Final CTA
    const aboutCitySection = generateAboutCitySection(cityData, service);
    if (!html.includes('section--about-city') && html.includes('section--cta')) {
      html = html.replace(
        /(\s*<!-- Final CTA Section -->)/,
        `${aboutCitySection}\n\n$1`
      );
      changes.push('Added About City section');
    }

    // 2. Add custom FAQs to existing FAQ section
    const customFaqs = generateCustomFaqHtml(cityData, service);
    if (customFaqs && html.includes('class="accordion"')) {
      // Add custom FAQs after existing accordion items
      const accordionEndMatch = html.match(/(<\/div>\s*<\/div>\s*<\/section>\s*<!-- Service Areas Section -->)/);
      if (accordionEndMatch) {
        // Insert custom FAQs before closing the accordion
        html = html.replace(
          /(<div class="accordion">[\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- Service Areas Section -->)/,
          (match, before, after) => {
            // Check if custom FAQs already added
            if (match.includes(cityData.customFaqs?.[service]?.[0]?.q)) {
              return match;
            }
            // Find last accordion item and add after it
            const lastItemMatch = before.match(/([\s\S]*<\/div>\s*<\/div>\s*)$/);
            if (lastItemMatch) {
              return before + customFaqs + after;
            }
            return match;
          }
        );
        changes.push('Added custom FAQs');
      }
    }

    // 3. Update FAQ schema with custom FAQs
    const customFaqSchema = generateFaqSchema(cityData, service);
    if (customFaqSchema && html.includes('"@type": "FAQPage"')) {
      // Parse existing FAQ schema and add custom ones
      const faqSchemaMatch = html.match(/<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"FAQPage"[\s\S]*?\}\s*<\/script>/);
      if (faqSchemaMatch) {
        try {
          const schemaStr = faqSchemaMatch[0]
            .replace(/<script type="application\/ld\+json">\s*/, '')
            .replace(/<\/script>$/, '');
          const schema = JSON.parse(schemaStr);

          // Check if custom FAQs already in schema
          const existingQuestions = schema.mainEntity.map(e => e.name);
          const newFaqs = customFaqSchema.filter(f => !existingQuestions.includes(f.name));

          if (newFaqs.length > 0) {
            schema.mainEntity = [...schema.mainEntity, ...newFaqs];
            const newSchemaHtml = `<script type="application/ld+json">\n  ${JSON.stringify(schema, null, 2).split('\n').join('\n  ')}\n  </script>`;
            html = html.replace(faqSchemaMatch[0], newSchemaHtml);
            changes.push('Updated FAQ schema');
          }
        } catch (e) {
          // Skip schema update if parsing fails
        }
      }
    }

    // 4. Update hero subtitle with local info (only if has specific city data)
    if (CITY_LOCAL_DATA[cityKey]) {
      const newSubtitle = generateLocalizedSubtitle(cityData, service);
      // Match hero subtitle pattern
      const subtitleMatch = html.match(/(<p class="hero__subtitle">)([\s\S]*?)(<\/p>)/);
      if (subtitleMatch && !subtitleMatch[2].includes(cityData.neighborhoods?.[0])) {
        html = html.replace(subtitleMatch[0], `${subtitleMatch[1]}${newSubtitle}${subtitleMatch[3]}`);
        changes.push('Updated hero subtitle');
      }
    }

    // Save file if changes were made
    if (changes.length > 0) {
      fs.writeFileSync(filePath, html, 'utf8');
      return { success: true, changes };
    }

    return { success: true, changes: ['No updates needed'] };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Process all service+city pages
function processAllPages() {
  const servicesDir = path.join(__dirname, '..', 'services');
  const services = ['deep-cleaning', 'carpet-cleaning', 'janitorial-service', 'general-housekeeping', 'upholstery-cleaning'];

  let totalProcessed = 0;
  let totalUpdated = 0;
  let errors = [];

  console.log('='.repeat(60));
  console.log('Dorys Cleaning - Add Local Content to Service+City Pages');
  console.log('='.repeat(60));

  for (const service of services) {
    const serviceDir = path.join(servicesDir, service);
    if (!fs.existsSync(serviceDir)) {
      console.log(`\nSkipping ${service} - directory not found`);
      continue;
    }

    console.log(`\nProcessing ${service}...`);

    const files = fs.readdirSync(serviceDir).filter(f =>
      f.endsWith('.html') &&
      f !== 'index.html' &&
      f.includes('-ma')
    );

    let serviceUpdated = 0;

    for (const file of files) {
      const filePath = path.join(serviceDir, file);
      const result = processFile(filePath, service);
      totalProcessed++;

      if (result.success) {
        if (result.changes.length > 0 && result.changes[0] !== 'No updates needed') {
          serviceUpdated++;
          totalUpdated++;
        }
      } else {
        errors.push({ file: `${service}/${file}`, error: result.error });
      }
    }

    console.log(`  Processed ${files.length} files, updated ${serviceUpdated}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${totalProcessed}`);
  console.log(`Total files updated: ${totalUpdated}`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    errors.slice(0, 10).forEach(e => console.log(`  - ${e.file}: ${e.error}`));
    if (errors.length > 10) console.log(`  ... and ${errors.length - 10} more`);
  }
}

// Test single file
function testSingleFile(service, citySlug) {
  const filePath = path.join(__dirname, '..', 'services', service, `${citySlug}-ma.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  console.log(`Testing: ${service}/${citySlug}-ma.html`);
  console.log('-'.repeat(40));

  const cityKey = citySlug;
  const cityData = getCityData(cityKey, citySlug.charAt(0).toUpperCase() + citySlug.slice(1));

  console.log('\nCity Data:');
  console.log(`  Name: ${cityData.name}`);
  console.log(`  Neighborhoods: ${cityData.neighborhoods?.join(', ') || 'N/A'}`);
  console.log(`  Property Types: ${cityData.propertyTypes?.join(', ') || 'N/A'}`);
  console.log(`  Satisfied Clients: ${cityData.satisfiedClients}`);

  console.log('\nGenerated About Section:');
  console.log(generateAboutCitySection(cityData, service));

  console.log('\nCustom FAQs:');
  const faqs = cityData.customFaqs?.[service];
  if (faqs) {
    faqs.forEach((faq, i) => {
      console.log(`  ${i + 1}. Q: ${faq.q}`);
      console.log(`     A: ${faq.a.substring(0, 100)}...`);
    });
  } else {
    console.log('  No custom FAQs for this service');
  }

  console.log('\nLocalized Subtitle:');
  console.log(`  ${generateLocalizedSubtitle(cityData, service)}`);

  console.log('\n' + '-'.repeat(40));
  console.log('Run without --test to apply changes');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Dorys Cleaning - Add Local Content to Service+City Pages

Usage:
  node add-local-content.js              Process all pages
  node add-local-content.js --test SERVICE CITY   Preview changes for one page
  node add-local-content.js --help       Show this help

Examples:
  node add-local-content.js
  node add-local-content.js --test deep-cleaning boston
  node add-local-content.js --test janitorial-service worcester
`);
} else if (args.includes('--test')) {
  const testIndex = args.indexOf('--test');
  const service = args[testIndex + 1];
  const city = args[testIndex + 2];

  if (!service || !city) {
    console.error('Usage: node add-local-content.js --test SERVICE CITY');
    console.error('Example: node add-local-content.js --test deep-cleaning boston');
  } else {
    testSingleFile(service, city);
  }
} else {
  processAllPages();
}
