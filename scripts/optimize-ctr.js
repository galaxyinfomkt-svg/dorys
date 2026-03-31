const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let totalFixed = 0;

// ============================================
// CTR OPTIMIZATION FOR ALL SERVICE CITY PAGES
// ============================================

const services = {
  'medical-office-cleaning': {
    shortTitle: 'Medical Office Sanitation',
    metaDesc: (city) => `Medical office sanitation in ${city}, MA. HIPAA-aware cleaning, exam room disinfection, CDC protocols. 22-year clinical pro, $2M insured. Free assessment: (978) 307-8107.`,
    keywords: (city) => `medical office cleaning ${city} MA, doctor office sanitation ${city}, healthcare cleaning ${city}, exam room disinfection ${city} Massachusetts, HIPAA cleaning ${city}`,
  },
  'specialty-clinics': {
    shortTitle: 'Specialty Clinic Sanitation',
    metaDesc: (city) => `Specialty clinic sanitation in ${city}, MA. Terminal cleaning, between-patient protocols, CDC/OSHA compliant. 22-year clinical pro, $2M insured. Call (978) 307-8107.`,
    keywords: (city) => `specialty clinic cleaning ${city} MA, clinic sanitation ${city}, urgent care cleaning ${city}, outpatient clinic disinfection ${city} Massachusetts, healthcare cleaning ${city}`,
  },
  'ambulatory-outpatient': {
    shortTitle: 'Ambulatory & Outpatient Sanitation',
    metaDesc: (city) => `Ambulatory &amp; outpatient facility sanitation in ${city}, MA. Fast-turnaround procedure room disinfection, recovery area cleaning. 22-year clinical pro, $2M insured. (978) 307-8107.`,
    keywords: (city) => `ambulatory surgery center cleaning ${city} MA, outpatient clinic sanitation ${city}, procedure room disinfection ${city}, same-day surgery cleaning ${city} Massachusetts`,
  },
  'rehab-nursing': {
    shortTitle: 'Rehab & Nursing Facility Sanitation',
    metaDesc: (city) => `Rehab &amp; nursing facility sanitation in ${city}, MA. Patient room cleaning, therapy area disinfection, CDC protocols. 22-year clinical pro, $2M insured. Call (978) 307-8107.`,
    keywords: (city) => `rehab facility cleaning ${city} MA, nursing facility sanitation ${city}, skilled nursing cleaning ${city}, patient room disinfection ${city} Massachusetts, long-term care cleaning ${city}`,
  },
  'healthcare-admin-offices': {
    shortTitle: 'Healthcare Admin Office Sanitation',
    metaDesc: (city) => `Healthcare admin office sanitation in ${city}, MA. HIPAA-aware workspace cleaning, conference room disinfection. 22-year clinical pro, $2M insured. Call (978) 307-8107.`,
    keywords: (city) => `healthcare office cleaning ${city} MA, medical admin office sanitation ${city}, HIPAA compliant cleaning ${city}, healthcare workspace cleaning ${city} Massachusetts`,
  },
};

Object.entries(services).forEach(([serviceSlug, config]) => {
  const dir = path.join(root, 'services', serviceSlug);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
  let serviceFixed = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Extract city name
    const geoMatch = content.match(/geo\.placename" content="([^,]+)/);
    const cityName = geoMatch ? geoMatch[1].trim() : file.replace(/-ma\.html$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Build optimized title (under 60 chars)
    const newTitle = `${config.shortTitle} ${cityName}, MA | Dorys Cleaning`;

    // Replace title tag (match any existing title)
    content = content.replace(/<title>[^<]+<\/title>/, `<title>${newTitle}</title>`);

    // Replace og:title
    content = content.replace(/og:title" content="[^"]+"/, `og:title" content="${newTitle}"`);

    // Replace meta description
    const newDesc = config.metaDesc(cityName);
    content = content.replace(/name="description" content="[^"]+"/, `name="description" content="${newDesc}"`);

    // Replace og:description
    content = content.replace(/og:description" content="[^"]+"/, `og:description" content="${newDesc}"`);

    // Replace keywords with service-appropriate ones
    const newKeywords = config.keywords(cityName);
    content = content.replace(/name="keywords" content="[^"]+"/, `name="keywords" content="${newKeywords}"`);

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      serviceFixed++;
    }
  });

  console.log(`${serviceSlug}: optimized ${serviceFixed} city pages`);
  totalFixed += serviceFixed;
});

// ============================================
// OPTIMIZE MAIN PAGE TITLES FOR CTR
// ============================================
console.log('\n=== Optimizing main page titles ===');

// Homepage - already good but ensure it's optimal
const indexPath = path.join(root, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
const currentTitle = indexContent.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`Homepage title: "${currentTitle}" (${currentTitle?.length} chars)`);

// About page
const aboutPath = path.join(root, 'about.html');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');
const aboutTitle = aboutContent.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`About title: "${aboutTitle}" (${aboutTitle?.length} chars)`);

// Contact page
const contactPath = path.join(root, 'contact.html');
let contactContent = fs.readFileSync(contactPath, 'utf8');
const contactTitle = contactContent.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`Contact title: "${contactTitle}" (${contactTitle?.length} chars)`);

// Services hub
const servicesPath = path.join(root, 'services', 'index.html');
let servicesContent = fs.readFileSync(servicesPath, 'utf8');
const servicesTitle = servicesContent.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`Services title: "${servicesTitle}" (${servicesTitle?.length} chars)`);

// Healthcare facilities
const hfPath = path.join(root, 'healthcare-facilities.html');
let hfContent = fs.readFileSync(hfPath, 'utf8');
const hfTitle = hfContent.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`HC Facilities title: "${hfTitle}" (${hfTitle?.length} chars)`);

// Reviews
const reviewsPath = path.join(root, 'reviews.html');
let reviewsContent = fs.readFileSync(reviewsPath, 'utf8');
const reviewsTitle = reviewsContent.match(/<title>([^<]+)<\/title>/)?.[1];
console.log(`Reviews title: "${reviewsTitle}" (${reviewsTitle?.length} chars)`);

console.log(`\n=== TOTAL: ${totalFixed} service city pages CTR-optimized ===`);
