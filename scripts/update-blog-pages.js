/**
 * update-blog-pages.js
 *
 * Batch update script to rebrand all blog HTML files from
 * "Dorys Janitorial Cleaning Services" to "Dorys Healthcare Environmental Services".
 *
 * Targets all .html files in the /blog directory (22 blog posts + index.html).
 */

const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// ─── Replacements applied to ALL blog .html files ───────────────────────────

const globalReplacements = [

  // 2. Logo alt text variants (MUST run before generic company name replacement)
  ['alt="Dorys Janitorial Cleaning Services Logo"', 'alt="Dorys Healthcare Environmental Services"'],
  ['alt="Dorys Janitorial Cleaning Services"', 'alt="Dorys Healthcare Environmental Services"'],
  ['alt="Dorys Cleaning"', 'alt="Dorys Healthcare Environmental Services"'],

  // 1. Schema/meta - company name variants
  // "Inc." variant first (more specific), then without "Inc."
  ['Dorys Janitorial Cleaning Services Inc.', 'Dorys Healthcare Environmental Services Inc.'],
  ['Dorys Janitorial Cleaning Services', 'Dorys Healthcare Environmental Services Inc.'],

  // 3. Nav dropdown service links - URLs
  ['href="/services/janitorial-service"', 'href="/services/medical-office-cleaning"'],
  ['href="/services/deep-cleaning"', 'href="/services/clinic-outpatient-sanitation"'],
  ['href="/services/carpet-cleaning"', 'href="/services/infection-control-disinfection"'],
  ['href="/services/upholstery-cleaning"', 'href="/services/assisted-living-senior-care"'],
  ['href="/services/general-housekeeping"', 'href="/services/compliance-scheduled-sanitation"'],

  // 3. Nav dropdown service links - link text
  ['>Janitorial Service</a>', '>Medical Office Cleaning</a>'],
  ['>Deep Cleaning</a>', '>Clinic & Outpatient Sanitation</a>'],
  ['>Carpet Cleaning</a>', '>Infection Control & Disinfection</a>'],
  ['>Upholstery Cleaning</a>', '>Assisted Living & Senior Care</a>'],
  ['>General Housekeeping</a>', '>Compliance & Scheduled Sanitation</a>'],

  // 4. Header CTA - change phone number to Healthcare Assessment + link to /contact
  // The header CTA has a specific class structure we can target precisely
  ['<a href="tel:+19783078107" class="btn btn--primary header__cta hide-mobile">(978) 307-8107</a>',
   '<a href="/contact" class="btn btn--primary header__cta hide-mobile">Healthcare Assessment</a>'],

  // 5. Footer service links (these have already been handled by the URL + text replacements above,
  //    but we need to add trailing slashes to footer service links specifically)
  //    Since the URL replacement above already changed /services/janitorial-service to /services/medical-office-cleaning,
  //    we now add the trailing slash for footer links that appear as full <a> tags with specific text.
  //    Actually, the URL replacement (#3) already handles both nav AND footer.
  //    The footer links will have text like ">Medical Office Cleaning</a>" after the text replacement.
  //    But the user wants trailing slashes on footer service URLs. Let's add those:
  ['<a href="/services/medical-office-cleaning">Medical Office Cleaning</a>',
   '<a href="/services/medical-office-cleaning/">Medical Office Cleaning</a>'],
  ['<a href="/services/clinic-outpatient-sanitation">Clinic & Outpatient Sanitation</a>',
   '<a href="/services/clinic-outpatient-sanitation/">Clinic & Outpatient Sanitation</a>'],
  ['<a href="/services/infection-control-disinfection">Infection Control & Disinfection</a>',
   '<a href="/services/infection-control-disinfection/">Infection Control & Disinfection</a>'],
  ['<a href="/services/assisted-living-senior-care">Assisted Living & Senior Care</a>',
   '<a href="/services/assisted-living-senior-care/">Assisted Living & Senior Care</a>'],
  ['<a href="/services/compliance-scheduled-sanitation">Compliance & Scheduled Sanitation</a>',
   '<a href="/services/compliance-scheduled-sanitation/">Compliance & Scheduled Sanitation</a>'],

  // 6. Footer brand description (two variants found in the files)
  ['Professional janitorial and cleaning services in Massachusetts since 2004. We deliver exceptional results with attention to detail.',
   'Healthcare-focused environmental services in Massachusetts since 2004.'],
  ['Professional janitorial and cleaning services in Massachusetts since 2004.',
   'Healthcare-focused environmental services in Massachusetts since 2004.'],

  // 7. Footer copyright
  ['&copy; 2025 Dorys Janitorial Cleaning Services Inc.',
   '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],
  // After the Inc. replacement above already ran, catch the updated version too in case ordering matters
  ['&copy; 2025 Dorys Healthcare Environmental Services Inc.',
   '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],
];


// ─── Replacements applied ONLY to blog/index.html ───────────────────────────

const indexOnlyReplacements = [

  // 8. Blog CTA section
  ['Need Professional Cleaning Help?', 'Need Healthcare Environmental Services?'],
  ['over 21 years', '22 years of healthcare expertise'],
  ['>Get a Free Quote</a>', '>Schedule a Healthcare Assessment</a>'],

  // 9. Blog index hero (use class-qualified string to avoid matching blog card titles)
  ['class="blog-hero__title">Cleaning Tips for Massachusetts Homes</h1>',
   'class="blog-hero__title">Healthcare Environmental Services Blog</h1>'],
  ['Expert guides, seasonal cleaning tips, and local insights to help you maintain a spotless home in New England\'s unique climate and historic neighborhoods.',
   'Expert guides on healthcare facility sanitation, infection control, compliance, and environmental services for Massachusetts healthcare providers.'],

  // 10. Blog index title/meta
  ['<title>Cleaning Tips & Guides for Massachusetts Homes | Dorys Cleaning Blog</title>',
   '<title>Healthcare Environmental Services Blog | Dorys Healthcare</title>'],
  // Meta description
  ['content="Expert cleaning tips, seasonal guides, and local insights for Massachusetts homeowners. Learn how New England weather, historic homes, and local conditions affect your cleaning needs."',
   'content="Expert guides on healthcare facility sanitation, infection control, compliance, and environmental services for Massachusetts healthcare providers."'],
  // Schema Blog name
  ['"Dorys Cleaning Blog"', '"Dorys Healthcare Blog"'],
];


// ─── Main execution ─────────────────────────────────────────────────────────

function applyReplacements(content, replacements) {
  let result = content;
  const counts = {};
  for (const [oldStr, newStr] of replacements) {
    const parts = result.split(oldStr);
    const count = parts.length - 1;
    if (count > 0) {
      result = parts.join(newStr);
      counts[oldStr.substring(0, 60) + (oldStr.length > 60 ? '...' : '')] = count;
    }
  }
  return { result, counts };
}

// Get all .html files in blog/
const files = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html'))
  .sort();

console.log(`Found ${files.length} HTML files in blog/\n`);

let totalFilesChanged = 0;
let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const original = fs.readFileSync(filePath, 'utf8');

  // Apply global replacements
  let { result, counts } = applyReplacements(original, globalReplacements);

  // Apply index-only replacements if this is blog/index.html
  if (file === 'index.html') {
    const indexResult = applyReplacements(result, indexOnlyReplacements);
    result = indexResult.result;
    Object.assign(counts, indexResult.counts);
  }

  // Count total replacements for this file
  const fileReplacementCount = Object.values(counts).reduce((a, b) => a + b, 0);

  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
    totalFilesChanged++;
    totalReplacements += fileReplacementCount;
    console.log(`[UPDATED] ${file} - ${fileReplacementCount} replacements:`);
    for (const [pattern, count] of Object.entries(counts)) {
      console.log(`    ${count}x  ${pattern}`);
    }
  } else {
    console.log(`[NO CHANGE] ${file}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`DONE: ${totalFilesChanged}/${files.length} files updated, ${totalReplacements} total replacements applied.`);
