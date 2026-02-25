#!/usr/bin/env node

/**
 * standardize-header-footer.js
 *
 * Ensures header navigation, footer structure, and branding across ALL non-homepage
 * HTML pages match the homepage's healthcare branding.
 *
 * Does targeted string replacements (not full header/footer replacement) to preserve
 * page-specific breadcrumbs, active nav states, etc.
 *
 * Processes: root HTML files, services/index.html, blog/, locations/, services/ subdirs
 * Skips: index.html (homepage), build/, scripts/, docs/, node_modules/, .git/
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ============================================================
// Configuration: files and directories to process
// ============================================================

const ROOT_HTML_FILES = [
  'about.html',
  'contact.html',
  'reviews.html',
  'privacy.html',
  'terms.html',
  'sitemap.html',
  '404.html',
  '500.html',
];

const DIRECTORIES_TO_SCAN = [
  'blog',
  'locations',
];

// Also scan services/index.html and all services subdirectories
const SERVICES_INDEX = 'services/index.html';

// ============================================================
// All targeted replacement pairs
// ============================================================

const REPLACEMENTS = [
  // ---- 1. Logo alt text standardization ----
  { from: 'alt="Dorys Janitorial"', to: 'alt="Dorys Healthcare Environmental Services"' },
  { from: 'alt="Dorys Cleaning"', to: 'alt="Dorys Healthcare Environmental Services"' },
  { from: 'alt="Dorys Janitorial Cleaning Services"', to: 'alt="Dorys Healthcare Environmental Services"' },

  // ---- 2. Header CTA standardization ----
  { from: '>Free Quote</a>', to: '>Healthcare Assessment</a>' },
  { from: '>Get a Free Quote</a>', to: '>Healthcare Assessment</a>' },
  { from: '>Get Free Quote</a>', to: '>Healthcare Assessment</a>' },

  // ---- 3. Old service URL replacements ----
  { from: '/services/janitorial-service', to: '/services/medical-office-cleaning' },
  { from: '/services/deep-cleaning', to: '/services/clinic-outpatient-sanitation' },
  { from: '/services/carpet-cleaning', to: '/services/infection-control-disinfection' },
  { from: '/services/upholstery-cleaning', to: '/services/assisted-living-senior-care' },
  { from: '/services/general-housekeeping', to: '/services/compliance-scheduled-sanitation' },

  // ---- 4. Old service name replacements in links ----
  { from: '>Janitorial Service</a>', to: '>Medical Office Cleaning</a>' },
  { from: '>Deep Cleaning</a>', to: '>Clinic & Outpatient Sanitation</a>' },
  { from: '>Carpet Cleaning</a>', to: '>Infection Control & Disinfection</a>' },
  { from: '>Upholstery Cleaning</a>', to: '>Assisted Living & Senior Care</a>' },
  { from: '>General Housekeeping</a>', to: '>Compliance & Scheduled Sanitation</a>' },

  // ---- 5. Footer branding ----
  { from: 'Dorys Janitorial Cleaning Services Inc.', to: 'Dorys Healthcare Environmental Services Inc.' },
  { from: '&copy; 2024', to: '&copy; 2026' },
  { from: '&copy; 2025', to: '&copy; 2026' },
  { from: '21+ years', to: '22 years' },
  { from: '21 years', to: '22 years' },
  { from: 'Professional janitorial and cleaning services', to: 'Healthcare-focused environmental services' },

  // ---- 6. Old service image updates ----
  // With leading slash
  { from: 'src="/assets/images/services/janitorial-service.jpg"', to: 'src="/assets/images/services/medical-office-cleaning.jpg"' },
  { from: 'src="/assets/images/services/deep-cleaning.jpg"', to: 'src="/assets/images/services/clinic-outpatient-sanitation.jpg"' },
  { from: 'src="/assets/images/services/carpet-cleaning.jpg"', to: 'src="/assets/images/services/infection-control-disinfection.jpg"' },
  { from: 'src="/assets/images/services/upholstery-cleaning.jpg"', to: 'src="/assets/images/services/assisted-living-senior-care.jpg"' },
  { from: 'src="/assets/images/services/general-housekeeping.jpg"', to: 'src="/assets/images/services/compliance-scheduled-sanitation.jpg"' },

  // Without leading slash (relative paths)
  { from: 'src="assets/images/services/janitorial-service.jpg"', to: 'src="assets/images/services/medical-office-cleaning.jpg"' },
  { from: 'src="assets/images/services/deep-cleaning.jpg"', to: 'src="assets/images/services/clinic-outpatient-sanitation.jpg"' },
  { from: 'src="assets/images/services/carpet-cleaning.jpg"', to: 'src="assets/images/services/infection-control-disinfection.jpg"' },
  { from: 'src="assets/images/services/upholstery-cleaning.jpg"', to: 'src="assets/images/services/assisted-living-senior-care.jpg"' },
  { from: 'src="assets/images/services/general-housekeeping.jpg"', to: 'src="assets/images/services/compliance-scheduled-sanitation.jpg"' },

  // With ../assets/ prefix (for deeply nested pages)
  { from: 'src="../assets/images/services/janitorial-service.jpg"', to: 'src="../assets/images/services/medical-office-cleaning.jpg"' },
  { from: 'src="../assets/images/services/deep-cleaning.jpg"', to: 'src="../assets/images/services/clinic-outpatient-sanitation.jpg"' },
  { from: 'src="../assets/images/services/carpet-cleaning.jpg"', to: 'src="../assets/images/services/infection-control-disinfection.jpg"' },
  { from: 'src="../assets/images/services/upholstery-cleaning.jpg"', to: 'src="../assets/images/services/assisted-living-senior-care.jpg"' },
  { from: 'src="../assets/images/services/general-housekeeping.jpg"', to: 'src="../assets/images/services/compliance-scheduled-sanitation.jpg"' },

  // With ../../assets/ prefix (for doubly nested pages like services/medical-office-cleaning/city.html)
  { from: 'src="../../assets/images/services/janitorial-service.jpg"', to: 'src="../../assets/images/services/medical-office-cleaning.jpg"' },
  { from: 'src="../../assets/images/services/deep-cleaning.jpg"', to: 'src="../../assets/images/services/clinic-outpatient-sanitation.jpg"' },
  { from: 'src="../../assets/images/services/carpet-cleaning.jpg"', to: 'src="../../assets/images/services/infection-control-disinfection.jpg"' },
  { from: 'src="../../assets/images/services/upholstery-cleaning.jpg"', to: 'src="../../assets/images/services/assisted-living-senior-care.jpg"' },
  { from: 'src="../../assets/images/services/general-housekeeping.jpg"', to: 'src="../../assets/images/services/compliance-scheduled-sanitation.jpg"' },

  // Also handle og:image and other content= attributes with full URLs
  { from: 'content="https://doryscleaningservices.com/assets/images/services/janitorial-service.jpg"', to: 'content="https://doryscleaningservices.com/assets/images/services/medical-office-cleaning.jpg"' },
  { from: 'content="https://doryscleaningservices.com/assets/images/services/deep-cleaning.jpg"', to: 'content="https://doryscleaningservices.com/assets/images/services/clinic-outpatient-sanitation.jpg"' },
  { from: 'content="https://doryscleaningservices.com/assets/images/services/carpet-cleaning.jpg"', to: 'content="https://doryscleaningservices.com/assets/images/services/infection-control-disinfection.jpg"' },
  { from: 'content="https://doryscleaningservices.com/assets/images/services/upholstery-cleaning.jpg"', to: 'content="https://doryscleaningservices.com/assets/images/services/assisted-living-senior-care.jpg"' },
  { from: 'content="https://doryscleaningservices.com/assets/images/services/general-housekeeping.jpg"', to: 'content="https://doryscleaningservices.com/assets/images/services/compliance-scheduled-sanitation.jpg"' },

  // Handle "url" values in JSON-LD schema for images
  { from: '"https://doryscleaningservices.com/assets/images/services/janitorial-service.jpg"', to: '"https://doryscleaningservices.com/assets/images/services/medical-office-cleaning.jpg"' },
  { from: '"https://doryscleaningservices.com/assets/images/services/deep-cleaning.jpg"', to: '"https://doryscleaningservices.com/assets/images/services/clinic-outpatient-sanitation.jpg"' },
  { from: '"https://doryscleaningservices.com/assets/images/services/carpet-cleaning.jpg"', to: '"https://doryscleaningservices.com/assets/images/services/infection-control-disinfection.jpg"' },
  { from: '"https://doryscleaningservices.com/assets/images/services/upholstery-cleaning.jpg"', to: '"https://doryscleaningservices.com/assets/images/services/assisted-living-senior-care.jpg"' },
  { from: '"https://doryscleaningservices.com/assets/images/services/general-housekeeping.jpg"', to: '"https://doryscleaningservices.com/assets/images/services/compliance-scheduled-sanitation.jpg"' },
];

// ============================================================
// Helpers
// ============================================================

/**
 * Recursively collect all .html files from a directory
 */
function collectHtmlFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Collect all service subdirectory HTML files (e.g., services/medical-office-cleaning/*.html)
 */
function collectServiceSubdirFiles() {
  const servicesDir = path.join(ROOT, 'services');
  if (!fs.existsSync(servicesDir)) return [];

  const results = [];
  const entries = fs.readdirSync(servicesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(servicesDir, entry.name);
      results.push(...collectHtmlFiles(subDir));
    }
  }
  return results;
}

// ============================================================
// Main processing
// ============================================================

function main() {
  console.log('='.repeat(70));
  console.log('  Dorys Healthcare - Header/Footer Standardization Script');
  console.log('='.repeat(70));
  console.log('');

  // Gather all files to process
  const filesToProcess = [];

  // 1. Root HTML files
  for (const filename of ROOT_HTML_FILES) {
    const fullPath = path.join(ROOT, filename);
    if (fs.existsSync(fullPath)) {
      filesToProcess.push(fullPath);
    } else {
      console.log(`  [SKIP] Root file not found: ${filename}`);
    }
  }

  // 2. services/index.html
  const servicesIndex = path.join(ROOT, SERVICES_INDEX);
  if (fs.existsSync(servicesIndex)) {
    filesToProcess.push(servicesIndex);
  } else {
    console.log(`  [SKIP] Not found: ${SERVICES_INDEX}`);
  }

  // 3. Blog directory
  const blogFiles = collectHtmlFiles(path.join(ROOT, 'blog'));
  filesToProcess.push(...blogFiles);

  // 4. Locations directory
  const locationFiles = collectHtmlFiles(path.join(ROOT, 'locations'));
  filesToProcess.push(...locationFiles);

  // 5. Services subdirectories
  const serviceSubFiles = collectServiceSubdirFiles();
  filesToProcess.push(...serviceSubFiles);

  // Remove duplicates (shouldn't happen, but just in case)
  const uniqueFiles = [...new Set(filesToProcess)];

  // Make sure we don't process the homepage
  const homepage = path.join(ROOT, 'index.html');
  const filteredFiles = uniqueFiles.filter(f => path.resolve(f) !== path.resolve(homepage));

  console.log(`  Total HTML files to process: ${filteredFiles.length}`);
  console.log(`  Replacement rules: ${REPLACEMENTS.length}`);
  console.log('');
  console.log('-'.repeat(70));
  console.log('  PROCESSING FILES');
  console.log('-'.repeat(70));
  console.log('');

  let totalReplacements = 0;
  let filesModified = 0;
  let filesUnchanged = 0;
  const perFileStats = [];

  for (const filePath of filteredFiles) {
    const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');
    let content = fs.readFileSync(filePath, 'utf-8');
    let fileReplacements = 0;
    const fileChanges = [];

    for (const rule of REPLACEMENTS) {
      if (content.includes(rule.from)) {
        // Count occurrences
        const count = content.split(rule.from).length - 1;
        content = content.split(rule.from).join(rule.to);
        fileReplacements += count;
        fileChanges.push({ rule: `"${rule.from}" -> "${rule.to}"`, count });
      }
    }

    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf-8');
      filesModified++;
      totalReplacements += fileReplacements;
      console.log(`  [UPDATED] ${relativePath} (${fileReplacements} replacement${fileReplacements > 1 ? 's' : ''})`);
      for (const change of fileChanges) {
        // Truncate rule display for readability
        const ruleDisplay = change.rule.length > 100
          ? change.rule.substring(0, 97) + '...'
          : change.rule;
        console.log(`            -> ${change.count}x ${ruleDisplay}`);
      }
      perFileStats.push({ file: relativePath, replacements: fileReplacements });
    } else {
      filesUnchanged++;
      // Only log unchanged for non-service-subdir files to reduce noise
      if (!relativePath.startsWith('services/') || relativePath === 'services/index.html') {
        console.log(`  [OK]      ${relativePath} (no changes needed)`);
      }
    }
  }

  // Summary of unchanged service subdirectory files
  if (filesUnchanged > 0) {
    const unchangedServiceFiles = filteredFiles.filter(f => {
      const rel = path.relative(ROOT, f).replace(/\\/g, '/');
      return rel.startsWith('services/') && rel !== 'services/index.html';
    }).length;
    const unchangedServiceFilesNoChange = filteredFiles.filter(f => {
      const rel = path.relative(ROOT, f).replace(/\\/g, '/');
      return rel.startsWith('services/') && rel !== 'services/index.html' && !perFileStats.find(s => s.file === rel);
    }).length;
    if (unchangedServiceFilesNoChange > 0) {
      console.log(`  [OK]      ... and ${unchangedServiceFilesNoChange} service subdir files with no changes needed`);
    }
  }

  console.log('');
  console.log('-'.repeat(70));
  console.log('  SUMMARY');
  console.log('-'.repeat(70));
  console.log(`  Files processed:    ${filteredFiles.length}`);
  console.log(`  Files modified:     ${filesModified}`);
  console.log(`  Files unchanged:    ${filesUnchanged}`);
  console.log(`  Total replacements: ${totalReplacements}`);
  console.log('');

  // ============================================================
  // VERIFICATION PASS
  // ============================================================
  console.log('-'.repeat(70));
  console.log('  VERIFICATION PASS - Checking for remaining old references');
  console.log('-'.repeat(70));
  console.log('');

  const OLD_PATTERNS = [
    { pattern: 'alt="Dorys Janitorial"', label: 'Old alt text: Dorys Janitorial' },
    { pattern: 'alt="Dorys Cleaning"', label: 'Old alt text: Dorys Cleaning' },
    { pattern: 'alt="Dorys Janitorial Cleaning Services"', label: 'Old alt text: Dorys Janitorial Cleaning Services' },
    { pattern: '>Free Quote</a>', label: 'Old CTA: Free Quote' },
    { pattern: '>Get a Free Quote</a>', label: 'Old CTA: Get a Free Quote' },
    { pattern: '>Get Free Quote</a>', label: 'Old CTA: Get Free Quote' },
    { pattern: '/services/janitorial-service', label: 'Old URL: janitorial-service' },
    { pattern: '/services/deep-cleaning', label: 'Old URL: deep-cleaning' },
    { pattern: '/services/carpet-cleaning', label: 'Old URL: carpet-cleaning' },
    { pattern: '/services/upholstery-cleaning', label: 'Old URL: upholstery-cleaning' },
    { pattern: '/services/general-housekeeping', label: 'Old URL: general-housekeeping' },
    { pattern: '>Janitorial Service</a>', label: 'Old link text: Janitorial Service' },
    { pattern: '>Deep Cleaning</a>', label: 'Old link text: Deep Cleaning' },
    { pattern: '>Carpet Cleaning</a>', label: 'Old link text: Carpet Cleaning' },
    { pattern: '>Upholstery Cleaning</a>', label: 'Old link text: Upholstery Cleaning' },
    { pattern: '>General Housekeeping</a>', label: 'Old link text: General Housekeeping' },
    { pattern: 'Dorys Janitorial Cleaning Services Inc.', label: 'Old company name' },
    { pattern: '&copy; 2025', label: 'Old copyright year 2025' },
    { pattern: '&copy; 2024', label: 'Old copyright year 2024' },
    { pattern: 'Professional janitorial and cleaning services', label: 'Old footer description' },
    { pattern: 'janitorial-service.jpg', label: 'Old image: janitorial-service.jpg' },
    { pattern: 'deep-cleaning.jpg', label: 'Old image: deep-cleaning.jpg' },
    { pattern: 'carpet-cleaning.jpg', label: 'Old image: carpet-cleaning.jpg' },
    { pattern: 'upholstery-cleaning.jpg', label: 'Old image: upholstery-cleaning.jpg' },
    { pattern: 'general-housekeeping.jpg', label: 'Old image: general-housekeeping.jpg' },
  ];

  let issuesFound = 0;

  for (const filePath of filteredFiles) {
    const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileIssues = [];

    for (const check of OLD_PATTERNS) {
      if (content.includes(check.pattern)) {
        const count = content.split(check.pattern).length - 1;
        fileIssues.push({ label: check.label, count });
        issuesFound += count;
      }
    }

    if (fileIssues.length > 0) {
      console.log(`  [WARNING] ${relativePath}:`);
      for (const issue of fileIssues) {
        console.log(`            -> ${issue.count}x ${issue.label}`);
      }
    }
  }

  if (issuesFound === 0) {
    console.log('  [PASS] No remaining old references found in any processed HTML files!');
  } else {
    console.log('');
    console.log(`  [ATTENTION] ${issuesFound} remaining old reference(s) found.`);
    console.log('  These may need manual review or additional replacement rules.');
  }

  console.log('');
  console.log('='.repeat(70));
  console.log('  Standardization complete!');
  console.log('='.repeat(70));
}

main();
