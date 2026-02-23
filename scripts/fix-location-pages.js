const fs = require('fs');
const path = require('path');

const locationsDir = path.join(__dirname, '..', 'locations');
const allFiles = fs.readdirSync(locationsDir).filter(f => f.endsWith('.html'));

console.log(`Found ${allFiles.length} location pages to fix`);

let updated = 0;

// String replacements for footer service link TEXT (URLs already correct)
const stringReplacements = [
  // Footer service links - URLs were already updated, but text is still old
  ['>Janitorial Service</a>', '>Medical Office Cleaning</a>'],
  ['>Deep Cleaning</a>', '>Clinic & Outpatient Sanitation</a>'],
  ['>Carpet Cleaning</a>', '>Infection Control & Disinfection</a>'],
  ['>Upholstery Cleaning</a>', '>Assisted Living & Senior Care</a>'],
  ['>General Housekeeping</a>', '>Compliance & Scheduled Sanitation</a>'],

  // Fix "Expert Cleaning Services" H1 pattern (28 pages)
  ['Expert Cleaning Services |', 'Healthcare Sanitation Services |'],

  // Fix remaining "Professional Cleaning" in OG descriptions
  ['Professional Cleaning', 'Healthcare Sanitation'],
];

const regexReplacements = [
  // Fix spacing bug: "Healthcare Sanitation Services CityMA" → "Healthcare Sanitation Services City, MA"
  [/Healthcare Sanitation Services (\w+)MA \| Dorys Healthcare/g, 'Healthcare Sanitation Services $1, MA | Dorys Healthcare'],

  // Fix old title format: "Professional Cleaning {City} | Since 2004" → "Healthcare Sanitation {City}, MA | Dorys Healthcare"
  [/<title>Professional Cleaning ([^<]+) \| Since 2004<\/title>/g, '<title>Healthcare Sanitation $1, MA | Dorys Healthcare</title>'],

  // Fix OG title with old format
  [/content="Professional Cleaning ([^"]+) \| Since 2004"/g, 'content="Healthcare Sanitation $1, MA | Dorys Healthcare"'],

  // Fix old meta descriptions that still reference general cleaning
  [/content="([A-Z][a-z]+(?:\s[A-Z][a-z]+)*) cleaning services you can trust\. Home, office, move-in\/out\. Licensed MA #213341, \$2M insured\. Call for same-day quote!"/g,
   'content="Healthcare environmental sanitation services in $1, MA. Medical office cleaning, clinic sanitation, infection control & more. Licensed, $2M insured. Call (978) 307-8107."'],

  // Fix meta description without content= prefix (the <meta name="description"> version)
  [/"([A-Z][a-z]+(?:\s[A-Z][a-z]+)*) cleaning services you can trust\. Home, office, move-in\/out\. Licensed MA #213341, \$2M insured\. Call for same-day quote!"/g,
   '"Healthcare environmental sanitation services in $1, MA. Medical office cleaning, clinic sanitation, infection control & more. Licensed, $2M insured. Call (978) 307-8107."'],

  // Fix remaining "cleaning services" in general text
  [/professional cleaning services/gi, 'healthcare environmental services'],
  [/cleaning services/gi, 'healthcare sanitation services'],
];

for (const file of allFiles) {
  const filePath = path.join(locationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Apply string replacements
  for (const [search, replace] of stringReplacements) {
    content = content.split(search).join(replace);
  }

  // Apply regex replacements
  for (const [regex, replace] of regexReplacements) {
    content = content.replace(regex, replace);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
  } else {
    console.log(`  No changes needed: ${file}`);
  }
}

console.log(`\nDone! Fixed ${updated} files.`);

// Verify: check for remaining old references
console.log('\n--- Verification ---');
let remaining = 0;
for (const file of allFiles) {
  const filePath = path.join(locationsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  if (content.includes('>Janitorial Service<')) issues.push('footer link text "Janitorial Service"');
  if (content.includes('>Deep Cleaning<')) issues.push('footer link text "Deep Cleaning"');
  if (content.includes('>Carpet Cleaning<')) issues.push('footer link text "Carpet Cleaning"');
  if (content.includes('>Upholstery Cleaning<')) issues.push('footer link text "Upholstery Cleaning"');
  if (content.includes('>General Housekeeping<')) issues.push('footer link text "General Housekeeping"');
  if (content.includes('Professional Cleaning')) issues.push('"Professional Cleaning"');
  if (content.includes('Expert Cleaning')) issues.push('"Expert Cleaning"');
  if (/Healthcare Sanitation Services \w+MA /.test(content)) issues.push('spacing bug CityMA');
  if (content.includes('same-day quote')) issues.push('old meta description');

  if (issues.length > 0) {
    console.log(`  ${file}: ${issues.join(', ')}`);
    remaining++;
  }
}

if (remaining === 0) {
  console.log('  All clean! No remaining issues found.');
} else {
  console.log(`\n  ${remaining} files still have issues.`);
}
