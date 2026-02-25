/**
 * update-blog-pages.js
 *
 * Batch update script to rebrand all existing blog HTML files for
 * healthcare branding. Skips index.html and the 5 new healthcare posts
 * that are already properly branded.
 *
 * Uses string split/join for exact replacements.
 */

const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'blog');

// Files to SKIP - already properly branded or handled separately
const SKIP_FILES = new Set([
  'index.html',
  'infection-control-best-practices-medical-offices.html',
  'choosing-healthcare-cleaning-service-massachusetts.html',
  'cdc-compliance-environmental-sanitation-clinics.html',
  'infection-prevention-assisted-living-facilities.html',
  'scheduled-sanitation-program-healthcare-facilities.html',
]);

// ─── All replacements ───────────────────────────────────────────────────────
// Order matters: more specific strings MUST come before less specific ones
// to avoid partial matches.

const replacements = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Schema/meta - company names
  // ═══════════════════════════════════════════════════════════════════════════
  ['Dorys Janitorial Cleaning Services Inc.', 'Dorys Healthcare Environmental Services Inc.'],
  // "Dorys Janitorial" but NOT inside URLs like @DorysJanitorial or /dorysjanitorial
  // We handle this carefully by targeting specific patterns:
  ['| Dorys Janitorial', '| Dorys Healthcare'],
  // Alt text variants
  ['alt="Dorys Cleaning"', 'alt="Dorys Healthcare Environmental Services"'],

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Nav service links - replace old service names and URLs
  // ═══════════════════════════════════════════════════════════════════════════
  ['>Janitorial Service<', '>Medical Office Cleaning<'],
  ['>Deep Cleaning<', '>Clinic & Outpatient Sanitation<'],
  ['>Carpet Cleaning<', '>Infection Control & Disinfection<'],
  ['>Upholstery Cleaning<', '>Assisted Living & Senior Care<'],
  ['>General Housekeeping<', '>Compliance & Scheduled Sanitation<'],
  ['/services/janitorial-service', '/services/medical-office-cleaning'],
  ['/services/deep-cleaning', '/services/clinic-outpatient-sanitation'],
  ['/services/carpet-cleaning', '/services/infection-control-disinfection'],
  ['/services/upholstery-cleaning', '/services/assisted-living-senior-care'],
  ['/services/general-housekeeping', '/services/compliance-scheduled-sanitation'],

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Header CTA
  // ═══════════════════════════════════════════════════════════════════════════
  ['>Free Quote</a>', '>Healthcare Assessment</a>'],
  ['>Get a Free Quote</a>', '>Healthcare Assessment</a>'],

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Footer
  // ═══════════════════════════════════════════════════════════════════════════
  // Footer logo alt (already covered by alt="Dorys Cleaning" above, also handle Inc. variant)
  ['alt="Dorys Cleaning"', 'alt="Dorys Healthcare Environmental Services"'],

  // Footer description - the exact string found in the files
  ['Professional janitorial and cleaning services in Massachusetts since 2004.',
   'Healthcare-focused environmental services in Massachusetts since 2004. Precision sanitation for medical offices, clinics, and assisted living facilities.'],

  // Footer CTA text - the exact string found in the remaining files
  ['Professional cleaning services with 21+ years of experience. Licensed, insured, and ready to make your space shine.',
   'Healthcare-focused environmental services with 22 years of excellence. Licensed, insured, and committed to precision sanitation for healthcare facilities.'],

  // Footer CTA button - "Get Your Free Quote Today" (this is the footer CTA button, not blog-cta)
  // Already different text: "Get Your Free Quote Today" vs ">Get a Free Quote</a>"
  // The >Get a Free Quote</a> replacement above handles the blog-cta links
  // For the footer CTA specifically, the button text is "Get Your Free Quote Today" - wrap:
  ['>Get Your Free Quote Today</a>', '>Schedule a Healthcare Facility Assessment</a>'],

  // Footer CTA title
  ['Get Your Free Quote Today!', 'Schedule Your Healthcare Facility Assessment!'],

  // Footer copyright - various year patterns
  ['&copy; 2025 Dorys Janitorial Cleaning Services Inc.', '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],
  ['&copy; 2024 Dorys Janitorial Cleaning Services Inc.', '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],
  // In case the company name was already partially updated but year wasn't
  ['&copy; 2025 Dorys Healthcare Environmental Services Inc.', '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],
  ['&copy; 2024 Dorys Healthcare Environmental Services Inc.', '&copy; 2026 Dorys Healthcare Environmental Services Inc.'],

  // Footer credentials "21+ Years" -> "22 Years"
  ['<span>21+ Years</span>', '<span>22 Years</span>'],
  ['<span>21+ years</span>', '<span>22 years</span>'],
  ['<span>21 years</span>', '<span>22 years</span>'],

  // Footer aria-label
  ['aria-label="Dorys Cleaning Services - Home"', 'aria-label="Dorys Healthcare Environmental Services - Home"'],

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Blog CTA section
  // ═══════════════════════════════════════════════════════════════════════════
  ['Need Professional Cleaning Help?', 'Need Professional Healthcare Sanitation?'],
  ['over 21 years', 'over 22 years'],

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. Additional "Dorys Cleaning" references in body/title text
  //    (careful not to break social media URLs)
  // ═══════════════════════════════════════════════════════════════════════════
  // Title tags: "| Dorys Cleaning" at end of titles
  ['| Dorys Cleaning</title>', '| Dorys Healthcare</title>'],

  // Body text references like "Dorys Cleaning has been helping" or "Dorys Cleaning provides"
  ['Dorys Cleaning has been', 'Dorys Healthcare has been'],
  ['Dorys Cleaning provides', 'Dorys Healthcare provides'],

  // Blog CTA text that mentions years of experience
  ['21+ years of experience cleaning Massachusetts homes.',
   '22 years of experience serving Massachusetts healthcare facilities.'],

  // Sidebar widget title "Get a Free Quote"
  ['class="sidebar-widget__title">Get a Free Quote</h3>',
   'class="sidebar-widget__title">Healthcare Assessment</h3>'],

  // Sidebar widget description under "Get a Free Quote"
  ['Professional cleaning services for your Massachusetts home or business.',
   'Professional healthcare environmental services for your Massachusetts facility.'],
];


// ─── Helper: apply replacements using split/join ────────────────────────────

function applyReplacements(content, repls) {
  let result = content;
  const counts = {};
  for (const [oldStr, newStr] of repls) {
    if (oldStr === newStr) continue; // skip no-op replacements
    const parts = result.split(oldStr);
    const count = parts.length - 1;
    if (count > 0) {
      result = parts.join(newStr);
      const key = oldStr.length > 70 ? oldStr.substring(0, 67) + '...' : oldStr;
      counts[key] = (counts[key] || 0) + count;
    }
  }
  return { result, counts };
}


// ─── Main execution ─────────────────────────────────────────────────────────

console.log('='.repeat(70));
console.log('  Blog Healthcare Branding Update Script');
console.log('='.repeat(70));
console.log('');

// Get all .html files in blog/
const allFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html'))
  .sort();

const targetFiles = allFiles.filter(f => !SKIP_FILES.has(f));
const skippedFiles = allFiles.filter(f => SKIP_FILES.has(f));

console.log(`Total HTML files in blog/: ${allFiles.length}`);
console.log(`Files to process: ${targetFiles.length}`);
console.log(`Files to skip: ${skippedFiles.length} (${skippedFiles.join(', ')})`);
console.log('');
console.log('-'.repeat(70));

let totalFilesChanged = 0;
let totalFilesUnchanged = 0;
let totalReplacements = 0;

for (const file of targetFiles) {
  const filePath = path.join(blogDir, file);
  const original = fs.readFileSync(filePath, 'utf8');

  const { result, counts } = applyReplacements(original, replacements);

  const fileReplacementCount = Object.values(counts).reduce((a, b) => a + b, 0);

  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
    totalFilesChanged++;
    totalReplacements += fileReplacementCount;
    console.log(`[UPDATED] ${file} (${fileReplacementCount} replacements)`);
    for (const [pattern, count] of Object.entries(counts)) {
      console.log(`          ${count}x  "${pattern}"`);
    }
  } else {
    totalFilesUnchanged++;
    console.log(`[NO CHANGE] ${file}`);
  }
}

console.log('');
console.log('='.repeat(70));
console.log(`  RESULTS: ${totalFilesChanged} files updated, ${totalFilesUnchanged} unchanged`);
console.log(`  Total replacements: ${totalReplacements}`);
console.log('='.repeat(70));

// ─── Verification pass ──────────────────────────────────────────────────────

console.log('');
console.log('='.repeat(70));
console.log('  VERIFICATION: Checking for remaining old references...');
console.log('='.repeat(70));
console.log('');

const oldPatterns = [
  'Dorys Janitorial Cleaning Services',
  '>Janitorial Service<',
  '>Deep Cleaning</a>',
  '>Carpet Cleaning</a>',
  '>Upholstery Cleaning</a>',
  '>General Housekeeping</a>',
  '/services/janitorial-service',
  '/services/deep-cleaning',
  '/services/carpet-cleaning',
  '/services/upholstery-cleaning',
  '/services/general-housekeeping',
  '>Free Quote</a>',
  '>Get a Free Quote</a>',
  'Need Professional Cleaning Help?',
  'Professional janitorial and cleaning services',
  '&copy; 2025 Dorys',
  '&copy; 2024 Dorys',
  '21+ years',
  '21+ Years',
  'over 21 years',
  'Professional cleaning services with 21+',
];

let issuesFound = 0;

for (const file of targetFiles) {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const fileIssues = [];

  for (const pattern of oldPatterns) {
    const parts = content.split(pattern);
    const count = parts.length - 1;
    if (count > 0) {
      fileIssues.push(`  ${count}x  "${pattern}"`);
      issuesFound += count;
    }
  }

  if (fileIssues.length > 0) {
    console.log(`[WARNING] ${file}:`);
    fileIssues.forEach(issue => console.log(issue));
  }
}

if (issuesFound === 0) {
  console.log('All clear! No remaining old references found in processed files.');
} else {
  console.log('');
  console.log(`Total remaining old references: ${issuesFound}`);
}

console.log('');
console.log('Done.');
