const fs = require('fs');
const path = require('path');

// Pattern A: 'House & Office Cleaning [City] | Licensed'
const patternAFiles = [
  'auburndale-ma', 'ayer-ma', 'babson-park-ma', 'boylston-ma', 'chelmsford-ma',
  'cherry-valley-ma', 'franklin-ma', 'groton-ma', 'hanscom-afb-ma', 'harvard-ma',
  'hopedale-ma', 'leominster-ma', 'lunenburg-ma', 'milford-ma', 'millbury-ma',
  'needham-ma', 'newton-lower-falls-ma', 'newton-ma', 'newton-upper-falls-ma',
  'shrewsbury-ma', 'village-of-nagog-woods-ma'
];

// Pattern B: '[City] MA Cleaners | Same Day Quotes'
const patternBFiles = [
  'arlington-heights-ma', 'clinton-ma', 'concord-ma', 'holliston-ma', 'lincoln-ma',
  'littleton-ma', 'medfield-ma', 'newton-center-ma', 'newton-highlands-ma',
  'nonantum-ma', 'north-waltham-ma', 'nutting-lake-ma', 'stow-ma', 'sudbury-ma',
  'wellesley-ma'
];

function getCityName(slug) {
  return slug.replace(/-ma$/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

let fixed = 0;

// Fix Pattern A files
for (const slug of patternAFiles) {
  const filePath = path.join('locations', slug + '.html');
  if (!fs.existsSync(filePath)) { console.log('MISSING: ' + filePath); continue; }
  let html = fs.readFileSync(filePath, 'utf8');
  const city = getCityName(slug);

  // Fix title
  html = html.replace(/<title>House & Office Cleaning [^<]+<\/title>/,
    `<title>Healthcare Environmental Services in ${city}, MA | Dorys Healthcare</title>`);

  // Fix meta description
  html = html.replace(/<meta name="description" content="Looking for cleaners[^"]+">/,
    `<meta name="description" content="Professional healthcare environmental services in ${city}, MA. Medical office cleaning, infection control, clinic sanitation. 22 years experience. Licensed, $2M insured. Schedule a facility assessment.">`);

  // Fix og:title
  html = html.replace(/<meta property="og:title" content="House & Office Cleaning[^"]+">/,
    `<meta property="og:title" content="Healthcare Environmental Services in ${city}, MA | Dorys Healthcare">`);

  // Fix og:description
  html = html.replace(/<meta property="og:description" content="Looking for cleaners[^"]+">/,
    `<meta property="og:description" content="Professional healthcare environmental services in ${city}, MA. Medical office cleaning, infection control, clinic sanitation. 22 years experience.">`);

  fs.writeFileSync(filePath, html, 'utf8');
  fixed++;
  console.log(`Fixed Pattern A: ${city}`);
}

// Fix Pattern B files
for (const slug of patternBFiles) {
  const filePath = path.join('locations', slug + '.html');
  if (!fs.existsSync(filePath)) { console.log('MISSING: ' + filePath); continue; }
  let html = fs.readFileSync(filePath, 'utf8');
  const city = getCityName(slug);

  // Fix title
  html = html.replace(/<title>[^<]+ MA Cleaners \| Same Day Quotes<\/title>/,
    `<title>Healthcare Environmental Services in ${city}, MA | Dorys Healthcare</title>`);

  // Fix meta description
  html = html.replace(/<meta name="description" content="Top-rated cleaning pros[^"]+">/,
    `<meta name="description" content="Professional healthcare environmental services in ${city}, MA. Medical office cleaning, infection control, clinic sanitation. 22 years experience. Licensed, $2M insured. Schedule a facility assessment.">`);

  // Fix og:title
  html = html.replace(/<meta property="og:title" content="[^"]+ MA Cleaners \| Same Day Quotes">/,
    `<meta property="og:title" content="Healthcare Environmental Services in ${city}, MA | Dorys Healthcare">`);

  // Fix og:description
  html = html.replace(/<meta property="og:description" content="Top-rated cleaning pros[^"]+">/,
    `<meta property="og:description" content="Professional healthcare environmental services in ${city}, MA. Medical office cleaning, infection control, clinic sanitation. 22 years experience.">`);

  fs.writeFileSync(filePath, html, 'utf8');
  fixed++;
  console.log(`Fixed Pattern B: ${city}`);
}

console.log(`\nTotal fixed: ${fixed} location pages`);
