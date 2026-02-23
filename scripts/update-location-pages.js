const fs = require('fs');
const path = require('path');

const locationsDir = path.join(__dirname, '..', 'locations');
const files = fs.readdirSync(locationsDir).filter(f => f.endsWith('.html') && f !== 'index.html');

console.log(`Found ${files.length} location pages to update`);

let updated = 0;
let errors = 0;

const replacements = [
  // Schema
  ['"Dorys Janitorial Cleaning Services Inc."', '"Dorys Healthcare Environmental Services Inc."'],

  // Logo alt
  ['alt="Dorys Janitorial"', 'alt="Dorys Healthcare Environmental Services"'],

  // Header CTA
  ['>Free Quote</a>', '>Healthcare Assessment</a>'],

  // Hero title pattern - use regex below
  // Hero subtitle - 21+ years
  ['with 21+ years of experience. Licensed, insured, and ready to make your space shine.', 'with 22 years of healthcare sanitation expertise. Licensed, $2M insured, and trained for healthcare facility protocols.'],

  // Hero CTA
  ['>Get a Free Quote</a>', '>Schedule Facility Assessment</a>'],

  // Service cards - titles
  ['<h3 class="card__title">Janitorial Service</h3>', '<h3 class="card__title">Medical Office Cleaning</h3>'],
  ['<h3 class="card__title">Deep Cleaning</h3>', '<h3 class="card__title">Clinic & Outpatient Sanitation</h3>'],
  ['<h3 class="card__title">Upholstery Cleaning</h3>', '<h3 class="card__title">Assisted Living & Senior Care</h3>'],
  ['<h3 class="card__title">Carpet Cleaning</h3>', '<h3 class="card__title">Infection Control & Disinfection</h3>'],
  ['<h3 class="card__title">General Housekeeping</h3>', '<h3 class="card__title">Compliance & Scheduled Sanitation</h3>'],

  // Service cards - descriptions
  ['Professional commercial cleaning for offices, shops, warehouses, and corporate facilities.', 'Comprehensive environmental sanitation for medical offices, physician practices, and healthcare administrative spaces.'],
  ['Thorough top-to-bottom cleaning that reaches every corner of your home or business.', 'Specialized sanitation for outpatient clinics, urgent care centers, and ambulatory surgical centers.'],
  ['Expert cleaning for sofas, chairs, and all upholstered furniture to restore fabrics and remove stains.', 'Gentle yet thorough sanitation for assisted living facilities, memory care units, and senior care environments.'],
  ['Professional carpet cleaning using advanced steam and dry cleaning methods for spotless results.', 'Targeted high-touch surface disinfection using hospital-grade EPA-registered products and CDC-aligned protocols.'],
  ['Comprehensive home cleaning services to keep your living space fresh, clean, and comfortable.', 'Structured sanitation programs with compliance documentation, quality audits, and guaranteed scheduling.'],

  // Service card images alt text
  ['alt="Janitorial Service in', 'alt="Medical Office Cleaning in'],
  ['alt="Deep Cleaning in', 'alt="Clinic Sanitation in'],
  ['alt="Upholstery Cleaning in', 'alt="Assisted Living Cleaning in'],
  ['alt="Carpet Cleaning in', 'alt="Infection Control in'],
  ['alt="General Housekeeping in', 'alt="Compliance Sanitation in'],

  // Service card links
  ['/services/janitorial-service/', '/services/medical-office-cleaning/'],
  ['/services/deep-cleaning/', '/services/clinic-outpatient-sanitation/'],
  ['/services/upholstery-cleaning/', '/services/assisted-living-senior-care/'],
  ['/services/carpet-cleaning/', '/services/infection-control-disinfection/'],
  ['/services/general-housekeeping/', '/services/compliance-scheduled-sanitation/'],

  // CTA section
  ['Contact us today for a free quote!', 'Schedule a complimentary healthcare facility assessment today!'],
  ['>Get Your Spotless Space in 48 Hours</a>', '>Schedule a Healthcare Facility Assessment</a>'],

  // Footer CTA
  ['<h2 class="footer__cta-title">Get Your Free Quote Today!</h2>', '<h2 class="footer__cta-title">Schedule a Healthcare Facility Assessment</h2>'],
  ['Professional cleaning services with 21+ years of experience. Licensed, insured, and ready to make your space shine.', 'Healthcare environmental services with 22 years of experience. Licensed, $2M insured, and trained for healthcare sanitation protocols.'],
  ['>Get Your Free Quote Today</a>', '>Schedule a Healthcare Assessment</a>'],

  // Footer brand
  ['alt="Dorys Janitorial Cleaning Services"', 'alt="Dorys Healthcare Environmental Services"'],
  ['<span class="footer__logo-text">Dorys Janitorial</span>', '<span class="footer__logo-text">Dorys Healthcare</span>'],
  ['Professional janitorial and cleaning services in Massachusetts since 2004. We deliver exceptional results with attention to detail and clear communication.', 'Healthcare-focused environmental services in Massachusetts since 2004. Precision sanitation for medical offices, clinics, and assisted living facilities.'],

  // Footer service links
  ['<li><a href="/services/janitorial-service/">Janitorial Service</a></li>', '<li><a href="/services/medical-office-cleaning/">Medical Office Cleaning</a></li>'],
  ['<li><a href="/services/deep-cleaning/">Deep Cleaning</a></li>', '<li><a href="/services/clinic-outpatient-sanitation/">Clinic & Outpatient Sanitation</a></li>'],
  ['<li><a href="/services/carpet-cleaning/">Carpet Cleaning</a></li>', '<li><a href="/services/infection-control-disinfection/">Infection Control & Disinfection</a></li>'],
  ['<li><a href="/services/upholstery-cleaning/">Upholstery Cleaning</a></li>', '<li><a href="/services/assisted-living-senior-care/">Assisted Living & Senior Care</a></li>'],
  ['<li><a href="/services/general-housekeeping/">General Housekeeping</a></li>', '<li><a href="/services/compliance-scheduled-sanitation/">Compliance & Scheduled Sanitation</a></li>'],

  // Footer credentials
  ['2004 (21+ Years)', '2004 (22 Years Healthcare)'],

  // Footer copyright
  ['&copy; 2025 Dorys Janitorial Cleaning Services Inc.', '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],
];

// Regex replacements for city-specific patterns
const regexReplacements = [
  // Title
  [/Cleaning Services ([^|<]+) MA \| Free Estimates/g, 'Healthcare Sanitation Services $1MA | Dorys Healthcare'],
  // Meta description
  [/Professional cleaning services in ([^.]+)\. House cleaning, office janitorial, deep cleaning & more\./g, 'Healthcare environmental sanitation services in $1. Medical office cleaning, clinic sanitation, infection control & more.'],
  // OG title
  [/content="Cleaning Services ([^"]+) MA \| Free Estimates"/g, 'content="Healthcare Sanitation Services $1MA | Dorys Healthcare"'],
  // OG description (same as meta)
  [/content="Professional cleaning services in ([^.]+)\. House cleaning, office janitorial, deep cleaning & more\./g, 'content="Healthcare environmental sanitation services in $1. Medical office cleaning, clinic sanitation, infection control & more.'],
  // Hero title
  [/Cleaning Services in ([^<]+)/g, 'Healthcare Sanitation Services in $1'],
  // Hero image alt
  [/alt="Cleaning services in/g, 'alt="Healthcare sanitation services in'],
  // Services section title
  [/Our Services in ([^<]+)/g, 'Our Healthcare Services in $1'],
  // Services section subtitle
  [/Choose from our comprehensive range of professional cleaning services available in ([^,]+), Massachusetts\./g, 'Choose from our healthcare environmental sanitation services available in $1, Massachusetts.'],
  // CTA H2
  [/Need Cleaning Services in ([^?]+)\?/g, 'Need Healthcare Sanitation in $1?'],
];

for (const file of files) {
  const filePath = path.join(locationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Apply string replacements
  for (const [search, replace] of replacements) {
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
    console.log(`  No changes in: ${file}`);
  }
}

// Also update locations/index.html if it exists
const indexPath = path.join(locationsDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  const original = content;

  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  for (const [regex, replace] of regexReplacements) {
    content = content.replace(regex, replace);
  }

  if (content !== original) {
    fs.writeFileSync(indexPath, content, 'utf8');
    updated++;
    console.log('  Updated: index.html');
  }
}

console.log(`\nDone! Updated ${updated} files, ${errors} errors.`);
