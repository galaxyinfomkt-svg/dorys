/**
 * CTR Optimization Script for All 700+ Pages
 * Rewrites titles, descriptions, H1s, and above-fold content
 * Anti-cannibalization through semantic differentiation
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Load data
const cities = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/cities.json'), 'utf-8')).cities;
const services = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services.json'), 'utf-8')).services;

// Helper function to truncate text
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 3).trim() + '...';
}

// Helper function to truncate descriptions smartly
function truncateDesc(text, maxLen = 155) {
  if (text.length <= maxLen) return text;
  // Try to cut at a sentence boundary
  const truncated = text.substring(0, maxLen - 3);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclaim = truncated.lastIndexOf('!');
  const lastBreak = Math.max(lastPeriod, lastExclaim);
  if (lastBreak > maxLen - 40) {
    return text.substring(0, lastBreak + 1);
  }
  return truncated.trim() + '...';
}

// CTR Triggers by service (rotated to avoid duplicates)
const SERVICE_CTR_CONFIG = {
  'janitorial-service': {
    shortName: 'Janitorial',
    triggers: ['Same Day Service', 'Licensed & Insured', '5★ Rated', 'Free Estimate', 'Trusted Since 2004'],
    titlePatterns: [
      (city) => truncate(`Janitorial Service ${city} MA | Same Day Quotes`, 58),
      (city) => truncate(`${city} Janitorial Cleaning | 5★ Licensed Pros`, 58),
      (city) => truncate(`Office Cleaning ${city} MA | Free Quotes`, 58),
      (city) => truncate(`Commercial Janitorial ${city} | 21+ Yrs Exp`, 58),
      (city) => truncate(`${city} MA Janitorial | Insured & Bonded`, 58)
    ],
    descPatterns: [
      (city) => truncateDesc(`Top-rated janitorial service in ${city}, MA. Licensed, insured, 21+ years exp. Same day quotes. Call (978) 307-8107 for free estimate.`),
      (city) => truncateDesc(`Professional office & commercial cleaning in ${city}. 5-star rated, background-checked staff. Get your free quote today!`),
      (city) => truncateDesc(`${city}'s trusted janitorial pros since 2004. Daily/weekly cleaning, floor care, restroom sanitation. $2M insured. Book now.`),
      (city) => truncateDesc(`Need reliable janitorial service in ${city}, MA? Licensed pros, flexible schedules, competitive rates. Call now!`),
      (city) => truncateDesc(`Commercial cleaning experts serving ${city} businesses. Evening & weekend availability. Free quotes. MA License #213341.`)
    ],
    h1Patterns: [
      (city) => `#1 Janitorial Service in ${city}, MA`,
      (city) => `${city}'s Most Trusted Janitorial Company`,
      (city) => `Professional Office Cleaning in ${city}`,
      (city) => `Commercial Janitorial Experts | ${city}, MA`,
      (city) => `Licensed Janitorial Service Near ${city}`
    ],
    heroSubtitles: [
      (city, nearby) => `${city}'s premier janitorial team. Serving local businesses in ${nearby.slice(0,2).join(', ')} & surrounding areas. Background-checked staff, eco-friendly products.`,
      (city, nearby) => `Transform your ${city} workspace. 21+ years keeping Massachusetts businesses spotless. Free estimates for ${city}, ${nearby[0]} & beyond.`,
      (city, nearby) => `Reliable commercial cleaning for ${city} offices & facilities. Flexible scheduling, competitive pricing. Also serving ${nearby.slice(0,2).join(' & ')}.`,
      (city, nearby) => `Your ${city} business deserves a 5-star clean. Licensed, insured pros ready to serve ${city} and ${nearby[0]} area companies.`,
      (city, nearby) => `${city}'s go-to janitorial experts since 2004. From daily office cleaning to specialized floor care. Proudly serving ${nearby.slice(0,3).join(', ')}.`
    ]
  },
  'deep-cleaning': {
    shortName: 'Deep Clean',
    triggers: ['Move In/Out Ready', 'Top to Bottom', 'Same Week Booking', 'Satisfaction Guaranteed', 'Eco-Friendly'],
    titlePatterns: [
      (city) => `Deep Cleaning ${city} MA | Move In/Out Specials`,
      (city) => `${city} Deep Clean Service | Book This Week`,
      (city) => `Top-to-Bottom Cleaning ${city} | 5★ Reviews`,
      (city) => `${city} MA Deep Cleaning Pros | Free Quotes`,
      (city) => `Professional Deep Clean ${city} | Same Week`
    ],
    descPatterns: [
      (city) => truncateDesc(`Deep cleaning specialists in ${city}, MA. Move-in/move-out ready. Every corner scrubbed. Call (978) 307-8107.`),
      (city) => truncateDesc(`${city}'s top-rated deep cleaning service. Kitchens, bathrooms, baseboards - we do it all. 21+ years exp. Free estimates!`),
      (city) => truncateDesc(`Need a serious clean in ${city}? Our deep cleaning removes years of buildup. Eco-friendly products, licensed pros.`),
      (city) => truncateDesc(`Transform your ${city} home with deep cleaning. Spring cleaning, post-construction, move-outs. Satisfaction guaranteed!`),
      (city) => truncateDesc(`Professional deep cleaning in ${city}, MA. Behind appliances, inside cabinets, grout & more. $2M insured. Free quote!`)
    ],
    h1Patterns: [
      (city) => `Deep Cleaning Service in ${city}, MA`,
      (city) => `${city}'s Top-Rated Deep Cleaning Pros`,
      (city) => `Professional Deep Clean | ${city}, MA`,
      (city) => `Move-In/Move-Out Deep Cleaning ${city}`,
      (city) => `Expert Deep Cleaning Near ${city}`
    ],
    heroSubtitles: [
      (city, nearby) => `Complete top-to-bottom cleaning for ${city} homes & businesses. We reach every corner others miss. Serving ${nearby.slice(0,2).join(', ')} too.`,
      (city, nearby) => `${city}'s deep cleaning experts since 2004. Move-in/move-out specialists. Book your transformation for ${city} or ${nearby[0]} today.`,
      (city, nearby) => `Beyond regular cleaning - we restore ${city} properties to like-new condition. Eco-friendly products, thorough results.`,
      (city, nearby) => `Spring cleaning, post-reno, or just overdue? ${city}'s trusted deep clean team is ready. Also available in ${nearby.slice(0,2).join(' & ')}.`,
      (city, nearby) => `Your ${city} home deserves a fresh start. Our deep cleaning tackles grout, baseboards, appliances & more. Free estimates!`
    ]
  },
  'carpet-cleaning': {
    shortName: 'Carpet',
    triggers: ['Pet Stain Experts', 'Fast Drying', 'Steam & Dry Clean', 'Stain Removal', 'Allergy Relief'],
    titlePatterns: [
      (city) => `Carpet Cleaning ${city} MA | Pet Stain Experts`,
      (city) => `${city} Carpet Cleaners | Fast Dry, 5★ Rated`,
      (city) => `Steam Carpet Cleaning ${city} | Free Quotes`,
      (city) => `${city} MA Carpet Stain Removal | Same Day`,
      (city) => `Professional Carpet Clean ${city} | Licensed`
    ],
    descPatterns: [
      (city) => truncateDesc(`Expert carpet cleaning in ${city}, MA. Pet stains, odors, deep dirt - gone! Fast-drying methods. Call (978) 307-8107.`),
      (city) => truncateDesc(`${city}'s carpet cleaning specialists. Steam cleaning, stain removal, deodorizing. Carpets dry in 6-12 hours. Book now!`),
      (city) => truncateDesc(`Remove allergens & stains from your ${city} carpets. Pro equipment, eco-safe solutions. 21+ years exp. Free estimate!`),
      (city) => truncateDesc(`Pet owners in ${city} trust us! Enzyme treatments for stains & odors. Carpet protection included. Licensed pros.`),
      (city) => truncateDesc(`Revive your ${city} carpets today. Commercial & residential cleaning. High-traffic specialists. Guaranteed!`)
    ],
    h1Patterns: [
      (city) => `Carpet Cleaning in ${city}, MA`,
      (city) => `${city}'s Pet Stain & Odor Experts`,
      (city) => `Professional Carpet Cleaners | ${city}`,
      (city) => `Steam Carpet Cleaning Near ${city}, MA`,
      (city) => `Expert Carpet Stain Removal ${city}`
    ],
    heroSubtitles: [
      (city, nearby) => `${city}'s carpet cleaning experts. Pet stains, deep dirt, odors - we eliminate them all. Serving ${nearby.slice(0,2).join(', ')} & beyond.`,
      (city, nearby) => `Professional steam cleaning for ${city} homes & offices. Fast-drying methods, eco-friendly solutions. Free estimates for ${city} area.`,
      (city, nearby) => `Allergy relief starts with clean carpets. ${city}'s trusted pros remove dust mites, allergens & bacteria. Book today!`,
      (city, nearby) => `From high-traffic areas to delicate rugs - ${city}'s carpet specialists do it all. Also serving ${nearby[0]} & ${nearby[1]}.`,
      (city, nearby) => `Your ${city} carpets deserve expert care. 21+ years of professional cleaning experience. Pet-friendly, family-safe products.`
    ]
  },
  'upholstery-cleaning': {
    shortName: 'Upholstery',
    triggers: ['Fabric Experts', 'Pet-Safe', 'Stain Protection', 'All Fabrics', 'Fast Service'],
    titlePatterns: [
      (city) => `Upholstery Cleaning ${city} MA | All Fabrics`,
      (city) => `${city} Sofa Cleaning | Pet Stain Experts`,
      (city) => `Furniture Cleaning ${city} | Free Estimates`,
      (city) => `${city} MA Upholstery Pros | Fabric Safe`,
      (city) => `Couch Cleaning ${city} | 5★ Service`
    ],
    descPatterns: [
      (city) => truncateDesc(`Professional upholstery cleaning in ${city}, MA. Sofas, chairs, all fabrics. Pet stain & odor removal. Call (978) 307-8107.`),
      (city) => truncateDesc(`${city}'s furniture cleaning specialists. Leather, microfiber, velvet - we clean it all. Fabric protection available!`),
      (city) => truncateDesc(`Revive your ${city} furniture! Expert stain removal, deodorizing, fabric protection. 21+ years exp. Free estimates.`),
      (city) => truncateDesc(`Pet owners in ${city} love us! Upholstery cleaning removes pet hair, stains & odors. Safe for all fabrics. Call now!`),
      (city) => truncateDesc(`Extend furniture life with professional cleaning in ${city}. Eco-friendly, fast-drying. Satisfaction guaranteed!`)
    ],
    h1Patterns: [
      (city) => `Upholstery Cleaning in ${city}, MA`,
      (city) => `${city}'s Sofa & Furniture Cleaners`,
      (city) => `Professional Upholstery Care | ${city}`,
      (city) => `Expert Furniture Cleaning Near ${city}`,
      (city) => `Couch & Chair Cleaning ${city}, MA`
    ],
    heroSubtitles: [
      (city, nearby) => `Expert upholstery cleaning for ${city} homes. Sofas, chairs, sectionals - all fabrics welcome. Serving ${nearby.slice(0,2).join(', ')} too.`,
      (city, nearby) => `${city}'s furniture cleaning pros since 2004. Remove stains, odors & allergens. Protect your investment. Free quotes!`,
      (city, nearby) => `Pet-safe, kid-safe upholstery cleaning in ${city}. We use eco-friendly products that work. Also available in ${nearby[0]}.`,
      (city, nearby) => `Don't replace - restore! ${city}'s upholstery experts bring furniture back to life. Leather, fabric, velvet specialists.`,
      (city, nearby) => `Your ${city} furniture deserves professional care. Fast-drying, fabric-safe cleaning. Serving the greater ${city} area.`
    ]
  },
  'general-housekeeping': {
    shortName: 'Housekeeping',
    triggers: ['Weekly/Biweekly', 'Recurring Service', 'Trusted Maids', 'Background Checked', 'Flexible Schedule'],
    titlePatterns: [
      (city) => `House Cleaning ${city} MA | Trusted Maids`,
      (city) => `${city} Housekeeping | Weekly Service Avail`,
      (city) => `Maid Service ${city} | Background Checked`,
      (city) => `${city} MA Home Cleaning | Free Estimate`,
      (city) => `Recurring House Clean ${city} | 5★ Rated`
    ],
    descPatterns: [
      (city) => truncateDesc(`Reliable housekeeping in ${city}, MA. Weekly, biweekly, monthly options. Background-checked staff. Call (978) 307-8107.`),
      (city) => truncateDesc(`${city}'s trusted home cleaning service. Consistent quality, flexible scheduling. 21+ years keeping homes spotless!`),
      (city) => truncateDesc(`Let us handle cleaning in ${city}! Professional housekeeping for busy families. Customized plans, reliable maids.`),
      (city) => truncateDesc(`Reclaim your weekends in ${city}. Our housekeeping pros handle dusting, mopping, bathrooms & more. Book today!`),
      (city) => truncateDesc(`${city} families trust us since 2004. Thorough housekeeping, eco-friendly products, satisfaction guaranteed!`)
    ],
    h1Patterns: [
      (city) => `Housekeeping Service in ${city}, MA`,
      (city) => `${city}'s Trusted Home Cleaning Team`,
      (city) => `Professional Maid Service | ${city}`,
      (city) => `Recurring House Cleaning Near ${city}`,
      (city) => `Expert Housekeeping ${city}, MA`
    ],
    heroSubtitles: [
      (city, nearby) => `${city}'s trusted housekeeping team. Weekly, biweekly, or monthly - you choose. Serving ${nearby.slice(0,2).join(', ')} & beyond.`,
      (city, nearby) => `Professional home cleaning for busy ${city} families. Background-checked staff, consistent quality. Free estimates!`,
      (city, nearby) => `Reclaim your time with ${city}'s top-rated housekeepers. We handle the mess so you can relax. Book today!`,
      (city, nearby) => `Reliable, thorough housekeeping in ${city}. Same cleaner each visit, customized checklists. Also serving ${nearby[0]} area.`,
      (city, nearby) => `Your ${city} home deserves regular TLC. Our housekeeping pros deliver consistent results every visit. Free consultation!`
    ]
  }
};

// City-specific differentiators based on characteristics
function getCityDifferentiator(city, county) {
  const cityLower = city.toLowerCase();

  // Premium/affluent areas
  if (['wellesley', 'weston', 'dover', 'lexington', 'concord', 'newton', 'needham', 'sherborn', 'lincoln'].some(c => cityLower.includes(c))) {
    return { type: 'premium', modifier: 'Premium', audience: 'discerning homeowners' };
  }

  // Business/commercial hubs
  if (['worcester', 'framingham', 'marlborough', 'waltham', 'leominster'].some(c => cityLower.includes(c))) {
    return { type: 'commercial', modifier: 'Commercial', audience: 'businesses & offices' };
  }

  // Family communities
  if (['hudson', 'shrewsbury', 'grafton', 'milford', 'franklin', 'ashland', 'holliston', 'hopkinton'].some(c => cityLower.includes(c))) {
    return { type: 'family', modifier: 'Family-Trusted', audience: 'busy families' };
  }

  // Historic areas
  if (['concord', 'lexington', 'harvard', 'lancaster', 'sterling'].some(c => cityLower.includes(c))) {
    return { type: 'historic', modifier: 'Historic Home', audience: 'historic property owners' };
  }

  return { type: 'local', modifier: 'Local', audience: 'residents & businesses' };
}

// Get pattern index based on city to ensure variety
function getPatternIndex(citySlug, maxPatterns) {
  let hash = 0;
  for (let i = 0; i < citySlug.length; i++) {
    hash = ((hash << 5) - hash) + citySlug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % maxPatterns;
}

// Process a single service+city page
function processServiceCityPage(filePath, service, city) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const config = SERVICE_CTR_CONFIG[service.slug];

  if (!config) {
    console.log(`  Skipping ${service.slug} - no config`);
    return false;
  }

  const cityData = cities.find(c => c.slug === city.slug);
  const nearby = cityData?.nearby || ['nearby areas'];
  const patternIdx = getPatternIndex(city.slug, 5);
  const differentiator = getCityDifferentiator(city.name, cityData?.county);

  // Generate unique title (max 58 chars)
  const newTitle = config.titlePatterns[patternIdx](city.name);
  if (newTitle.length > 58) {
    console.log(`  Warning: Title too long (${newTitle.length}): ${newTitle}`);
  }

  // Generate unique description (max 155 chars)
  const newDesc = config.descPatterns[patternIdx](city.name);
  if (newDesc.length > 155) {
    console.log(`  Warning: Desc too long (${newDesc.length}): ${newDesc.substring(0, 50)}...`);
  }

  // Generate unique H1
  const newH1 = config.h1Patterns[patternIdx](city.name);

  // Generate hero subtitle
  const newHeroSubtitle = config.heroSubtitles[patternIdx](city.name, nearby);

  // Replace title
  content = content.replace(
    /<title>[^<]+<\/title>/,
    `<title>${newTitle}</title>`
  );

  // Replace meta description
  content = content.replace(
    /<meta name="description" content="[^"]+"/,
    `<meta name="description" content="${newDesc}"`
  );

  // Replace og:title
  content = content.replace(
    /<meta property="og:title" content="[^"]+"/,
    `<meta property="og:title" content="${newTitle}"`
  );

  // Replace og:description
  content = content.replace(
    /<meta property="og:description" content="[^"]+"/,
    `<meta property="og:description" content="${newDesc}"`
  );

  // Replace twitter:title
  content = content.replace(
    /<meta name="twitter:title" content="[^"]+"/,
    `<meta name="twitter:title" content="${newTitle}"`
  );

  // Replace twitter:description
  content = content.replace(
    /<meta name="twitter:description" content="[^"]+"/,
    `<meta name="twitter:description" content="${newDesc}"`
  );

  // Replace H1 in hero section
  content = content.replace(
    /<h1 class="hero__title">[^<]+<\/h1>/,
    `<h1 class="hero__title">${newH1}</h1>`
  );

  // Replace hero subtitle
  content = content.replace(
    /<p class="hero__subtitle">[^<]+<\/p>/,
    `<p class="hero__subtitle">${newHeroSubtitle}</p>`
  );

  // Update hero badge with differentiator
  const trigger = config.triggers[patternIdx];
  content = content.replace(
    /<span class="hero__badge">[^<]+<\/span>/,
    `<span class="hero__badge">${trigger} in ${city.name}</span>`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// Process location pages
function processLocationPage(filePath, city) {
  let content = fs.readFileSync(filePath, 'utf-8');

  const cityData = cities.find(c => c.slug === city.slug);
  const nearby = cityData?.nearby || ['nearby areas'];
  const county = cityData?.county || 'Massachusetts';
  const differentiator = getCityDifferentiator(city.name, county);

  const patternIdx = getPatternIndex(city.slug, 5);

  // Location page specific titles
  const locationTitles = [
    `Cleaning Services ${city.name} MA | Free Estimates`,
    `${city.name} Cleaning Company | 5★ Local Pros`,
    `House & Office Cleaning ${city.name} | Licensed`,
    `${city.name} MA Cleaners | Same Day Quotes`,
    `Professional Cleaning ${city.name} | Since 2004`
  ];

  const locationDescs = [
    `Professional cleaning services in ${city.name}, MA. House cleaning, office janitorial, deep cleaning & more. Licensed, insured. Call (978) 307-8107.`,
    `${city.name}'s trusted cleaning company since 2004. Residential & commercial services. 5-star rated, background-checked staff. Free quotes!`,
    `Looking for cleaners in ${city.name}? We offer housekeeping, janitorial, carpet & deep cleaning. Serving ${county} County. Book today!`,
    `Top-rated cleaning pros serving ${city.name}, MA. Flexible scheduling, eco-friendly products. 21+ years exp. Get your free estimate now!`,
    `${city.name} cleaning services you can trust. Home, office, move-in/out. Licensed MA #213341, $2M insured. Call for same-day quote!`
  ];

  const locationH1s = [
    `Cleaning Services in ${city.name}, MA`,
    `${city.name}'s Trusted Cleaning Company`,
    `Professional Cleaners Near ${city.name}`,
    `Top-Rated Cleaning in ${city.name}, MA`,
    `Expert Cleaning Services | ${city.name}`
  ];

  const newTitle = locationTitles[patternIdx];
  const newDesc = locationDescs[patternIdx];
  const newH1 = locationH1s[patternIdx];

  // Replace title
  content = content.replace(
    /<title>[^<]+<\/title>/,
    `<title>${newTitle}</title>`
  );

  // Replace meta description
  content = content.replace(
    /<meta name="description" content="[^"]+"/,
    `<meta name="description" content="${newDesc}"`
  );

  // Replace og:title and og:description
  content = content.replace(
    /<meta property="og:title" content="[^"]+"/,
    `<meta property="og:title" content="${newTitle}"`
  );
  content = content.replace(
    /<meta property="og:description" content="[^"]+"/,
    `<meta property="og:description" content="${newDesc}"`
  );

  // Replace twitter meta
  content = content.replace(
    /<meta name="twitter:title" content="[^"]+"/,
    `<meta name="twitter:title" content="${newTitle}"`
  );
  content = content.replace(
    /<meta name="twitter:description" content="[^"]+"/,
    `<meta name="twitter:description" content="${newDesc}"`
  );

  // Replace H1
  content = content.replace(
    /<h1[^>]*class="[^"]*hero__title[^"]*"[^>]*>[^<]+<\/h1>/,
    `<h1 class="hero__title">${newH1}</h1>`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// Main execution
console.log('=== CTR OPTIMIZATION SCRIPT ===\n');
console.log('Processing all service+city pages...\n');

let processedCount = 0;
let errorCount = 0;

// Process service+city pages
for (const service of services) {
  const serviceDir = path.join(ROOT, 'services', service.slug);

  if (!fs.existsSync(serviceDir)) {
    console.log(`Service dir not found: ${serviceDir}`);
    continue;
  }

  console.log(`\nProcessing ${service.name}...`);

  const files = fs.readdirSync(serviceDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  for (const file of files) {
    const citySlug = file.replace('.html', '');
    const cityData = cities.find(c => c.slug === citySlug);

    if (!cityData) {
      console.log(`  City not found for: ${citySlug}`);
      errorCount++;
      continue;
    }

    const filePath = path.join(serviceDir, file);

    try {
      if (processServiceCityPage(filePath, service, cityData)) {
        processedCount++;
      }
    } catch (err) {
      console.log(`  Error processing ${file}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`  Processed ${files.length} pages`);
}

// Process location pages
console.log('\n\nProcessing location pages...');

const locationsDir = path.join(ROOT, 'locations');
const locationFiles = fs.readdirSync(locationsDir).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of locationFiles) {
  const citySlug = file.replace('.html', '');
  const cityData = cities.find(c => c.slug === citySlug);

  if (!cityData) {
    console.log(`  City not found: ${citySlug}`);
    errorCount++;
    continue;
  }

  const filePath = path.join(locationsDir, file);

  try {
    if (processLocationPage(filePath, cityData)) {
      processedCount++;
    }
  } catch (err) {
    console.log(`  Error processing ${file}: ${err.message}`);
    errorCount++;
  }
}

console.log(`\n=== COMPLETE ===`);
console.log(`Pages processed: ${processedCount}`);
console.log(`Errors: ${errorCount}`);
console.log(`\nAll titles, descriptions, H1s and hero content updated for CTR optimization.`);
