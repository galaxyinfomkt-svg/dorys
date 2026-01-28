const fs = require('fs');
const path = require('path');

// CTR Optimization Script for Dorys Cleaning Services
// Applies New England-focused, high-CTR titles and descriptions

// City categories for personalized messaging
const luxuryCities = ['newton', 'wellesley', 'weston', 'dover', 'sherborn', 'lincoln', 'carlisle', 'sudbury', 'wayland', 'needham', 'brookline', 'chestnut-hill', 'wellesley-hills', 'babson-park'];
const historicCities = ['concord', 'lexington', 'harvard', 'groton', 'carlisle', 'lincoln', 'acton'];
const commercialCities = ['waltham', 'worcester', 'framingham', 'marlborough', 'leominster', 'milford', 'natick'];
const hqCity = 'marlborough';

// Service display names and seasonal hooks
const serviceConfig = {
  'janitorial-service': { name: 'Janitorial', hook: 'Office & Commercial', seasonal: 'Book This Week!' },
  'deep-cleaning': { name: 'Deep Cleaning', hook: 'Move-In/Out Experts', seasonal: '50% Off 1st!' },
  'carpet-cleaning': { name: 'Carpet Cleaning', hook: 'Winter Salt Experts', seasonal: 'Book Today!' },
  'general-housekeeping': { name: 'Housekeeping', hook: 'Trusted Since 2004', seasonal: '50% Off!' },
  'upholstery-cleaning': { name: 'Upholstery', hook: 'Sofa & Couch Experts', seasonal: 'Book Now!' }
};

// Get city type for personalized messaging
function getCityType(slug) {
  const citySlug = slug.replace('-ma', '').toLowerCase();
  if (citySlug === hqCity) return 'hq';
  if (luxuryCities.some(c => citySlug.includes(c))) return 'luxury';
  if (historicCities.some(c => citySlug.includes(c))) return 'historic';
  if (commercialCities.some(c => citySlug.includes(c))) return 'commercial';
  return 'standard';
}

// Generate location page title and description
function getLocationMeta(cityName, citySlug) {
  const type = getCityType(citySlug);

  const templates = {
    hq: {
      title: `${cityName} Cleaning | ⭐ LOCAL HQ - We're Your Neighbors!`,
      desc: `📍 Based RIGHT HERE in ${cityName}! Your local cleaning team since 2004. Fast response, $2M insured. ✅ Same-day. Neighbors get 50% off! (978) 307-8107`
    },
    luxury: {
      title: `${cityName} House Cleaning | ⭐ Luxury Home Experts - Book Today!`,
      desc: `🏡 ${cityName}'s premium cleaners! Trusted by luxury homeowners. Since 2004, white-glove service. ✅ Same-day. LIMITED slots! (978) 307-8107`
    },
    historic: {
      title: `${cityName} House Cleaning | ⭐ Historic Home Experts - 50% Off!`,
      desc: `🏛️ ${cityName}'s trusted cleaners! Experts in historic New England homes. Since 2004, $2M insured. ✅ Same-day. 50% off 1st! (978) 307-8107`
    },
    commercial: {
      title: `${cityName} Office & Home Cleaning | ⭐ Since 2004 - 50% Off!`,
      desc: `🏢 ${cityName}'s commercial & residential experts! Office, home, carpet cleaning. Since 2004. ✅ FREE estimate. 50% off 1st! (978) 307-8107`
    },
    standard: {
      title: `${cityName} Cleaning Services | ⭐ Local Since 2004 - 50% Off!`,
      desc: `🏠 ${cityName}'s trusted cleaners! Your neighbors use us. Family-owned since 2004. ✅ Same-day booking. LIMITED: 50% off 1st! (978) 307-8107`
    }
  };

  return templates[type];
}

// Generate service+location page title and description
function getServiceLocationMeta(cityName, citySlug, serviceSlug) {
  const config = serviceConfig[serviceSlug];
  if (!config) return null;

  const type = getCityType(citySlug);

  // Special seasonal hooks for carpet cleaning (winter salt)
  const isWinterService = serviceSlug === 'carpet-cleaning';

  let title, desc;

  if (isWinterService) {
    title = `${cityName} ${config.name} | ⭐ Winter Salt Experts - ${config.seasonal}`;
    desc = `❄️ ${cityName}'s #1 carpet cleaners! Remove winter salt & stains. Since 2004, eco-safe. ✅ Same-day available. LIMITED: 50% off! (978) 307-8107`;
  } else if (type === 'luxury') {
    title = `${cityName} ${config.name} | ⭐ Premium Service - ${config.seasonal}`;
    desc = `🏡 ${cityName}'s premium ${config.name.toLowerCase()} pros! White-glove service since 2004. ✅ Same-day slots. LIMITED spots! (978) 307-8107`;
  } else if (type === 'commercial' && serviceSlug === 'janitorial-service') {
    title = `${cityName} ${config.name} | ⭐ ${config.hook} - ${config.seasonal}`;
    desc = `🏢 ${cityName} commercial cleaning experts! Offices, warehouses, medical. Since 2004. ✅ FREE walkthrough. LIMITED slots! (978) 307-8107`;
  } else {
    title = `${cityName} ${config.name} | ⭐ ${config.hook} - ${config.seasonal}`;
    desc = `🏠 ${cityName}'s trusted ${config.name.toLowerCase()} pros! Family-owned since 2004, $2M insured. ✅ Same-day. 50% off 1st! (978) 307-8107`;
  }

  return { title, desc };
}

// Update HTML file with new meta tags
function updateHtmlFile(filePath, newTitle, newDesc) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Update title tag
    content = content.replace(
      /<title>[^<]*<\/title>/,
      `<title>${newTitle}</title>`
    );

    // Update meta description
    content = content.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${newDesc}">`
    );

    // Update OG title
    content = content.replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${newTitle}">`
    );

    // Update OG description (shorter version without emoji for OG)
    const ogDesc = newDesc.replace(/[🏠🏡🏢🏛️📍❄️✅]/g, '').replace(/\s+/g, ' ').trim();
    content = content.replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${ogDesc}">`
    );

    // Update Twitter title if exists
    content = content.replace(
      /<meta name="twitter:title" content="[^"]*">/,
      `<meta name="twitter:title" content="${newTitle}">`
    );

    // Update Twitter description if exists
    content = content.replace(
      /<meta name="twitter:description" content="[^"]*">/,
      `<meta name="twitter:description" content="${ogDesc}">`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    console.error(`Error updating ${filePath}:`, err.message);
    return false;
  }
}

// Extract city name from filename
function getCityNameFromSlug(slug) {
  return slug
    .replace('-ma', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Main execution
function main() {
  const baseDir = path.join(__dirname, '..');
  let updatedCount = 0;
  let errorCount = 0;

  console.log('🚀 Starting CTR optimization for all pages...\n');

  // 1. Update location pages
  console.log('📍 Updating location pages...');
  const locationsDir = path.join(baseDir, 'locations');
  const locationFiles = fs.readdirSync(locationsDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  locationFiles.forEach(file => {
    const slug = file.replace('.html', '');
    const cityName = getCityNameFromSlug(slug);
    const meta = getLocationMeta(cityName, slug);
    const filePath = path.join(locationsDir, file);

    if (updateHtmlFile(filePath, meta.title, meta.desc)) {
      updatedCount++;
      console.log(`  ✅ ${cityName}`);
    } else {
      errorCount++;
    }
  });

  console.log(`\n📍 Location pages: ${updatedCount} updated\n`);

  // 2. Update service+location pages
  console.log('🧹 Updating service+location pages...');
  const servicesDir = path.join(baseDir, 'services');
  const services = Object.keys(serviceConfig);

  services.forEach(serviceSlug => {
    const serviceDir = path.join(servicesDir, serviceSlug);
    if (!fs.existsSync(serviceDir)) return;

    const serviceFiles = fs.readdirSync(serviceDir).filter(f => f.endsWith('.html') && f !== 'index.html');
    let serviceCount = 0;

    serviceFiles.forEach(file => {
      const slug = file.replace('.html', '');
      const cityName = getCityNameFromSlug(slug);
      const meta = getServiceLocationMeta(cityName, slug, serviceSlug);

      if (meta) {
        const filePath = path.join(serviceDir, file);
        if (updateHtmlFile(filePath, meta.title, meta.desc)) {
          serviceCount++;
        } else {
          errorCount++;
        }
      }
    });

    console.log(`  ✅ ${serviceConfig[serviceSlug].name}: ${serviceCount} pages`);
    updatedCount += serviceCount;
  });

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 CTR optimization complete!`);
  console.log(`   Total pages updated: ${updatedCount}`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount}`);
  }
  console.log('='.repeat(50));
}

main();
