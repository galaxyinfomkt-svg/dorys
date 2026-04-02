/**
 * Contextual Content Rewriter
 *
 * NOT a simple find-and-replace. This script analyzes the surrounding context
 * of each "Healthcare Environmental Sanitation" occurrence and rewrites it
 * with the most natural, SEO-appropriate variation based on what the sentence
 * is actually talking about.
 *
 * Variations used (rotated to avoid repetition):
 * - healthcare facility cleaning
 * - medical facility cleaning
 * - clinical cleaning
 * - infection control cleaning
 * - healthcare cleaning
 * - medical-grade sanitation
 * - clinical environmental services
 */

const fs = require('fs');
const path = require('path');

function findFiles(dir, exts, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', '.vercel'].includes(entry.name)) {
      findFiles(fullPath, exts, results);
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ============================================================
// CONTEXTUAL REWRITE RULES
// Each rule matches a FULL phrase (with surrounding context)
// and replaces it with natural, human-written copy.
// Order matters - most specific patterns first.
// ============================================================

const contextualRewrites = [

  // === TITLE TAGS ===
  [/Healthcare Environmental Sanitation Facility Cleaning Services in MA/g,
   'Healthcare Facility Cleaning Services in Massachusetts'],

  [/Healthcare Environmental Sanitation Facility Sanitation in MA/g,
   'Healthcare Facility Cleaning & Sanitation in MA'],

  [/Healthcare Environmental Sanitation Facility Cleaning/g,
   'Healthcare Facility Cleaning'],

  // === H1 / HEADINGS ===
  [/Healthcare Environmental Sanitation Facilities Cannot Afford Sanitation Gaps/g,
   'Your Healthcare Facility Deserves Clinical-Grade Cleaning'],

  [/Healthcare Environmental Sanitation Experience Matters in Sanitation/g,
   'Why Clinical Experience Matters in Healthcare Cleaning'],

  [/Healthcare Environmental Sanitation Services<\/h2>/g,
   'Our Healthcare Cleaning Services</h2>'],

  [/Healthcare Environmental Sanitation Experience<\/span>/g,
   'Clinical Cleaning Expertise</span>'],

  // === CTA BUTTONS & FOOTERS ===
  [/Request a Healthcare Environmental Sanitation Facility Sanitation Assessment/g,
   'Request a Free Facility Assessment'],

  [/Schedule a healthcare environmental sanitation facility walkthrough today/g,
   'Schedule a facility walkthrough today'],

  [/Ready to Protect Your Healthcare Environmental Sanitation Facility\?/g,
   'Ready to Protect Your Healthcare Facility?'],

  [/Healthcare Environmental Sanitation Facility Assessment<\/h3>/g,
   'Free Facility Assessment</h3>'],

  // === SCHEMA / JSON-LD ===
  [/"Healthcare Environmental Sanitation Services"/g,
   '"Healthcare Facility Cleaning Services"'],

  [/Request a Healthcare Environmental Sanitation Facility Assessment/g,
   'Request a Healthcare Facility Assessment'],

  [/Choose Your Healthcare Environmental Sanitation Service/g,
   'Choose Your Healthcare Cleaning Service'],

  // === META DESCRIPTIONS (location pages) ===
  // Pattern: "Healthcare Environmental Sanitation services in [City], MA"
  [/Healthcare Environmental Sanitation services in /g,
   'Healthcare cleaning services in '],

  // Pattern: "Healthcare Environmental Sanitation facility sanitation in [City], MA"
  [/Healthcare Environmental Sanitation facility sanitation in /g,
   'Professional healthcare facility cleaning in '],

  // === LOCATION PAGE HEADINGS ===
  // "Healthcare Environmental Sanitation [City]" in title tags
  [/Healthcare Environmental Sanitation ([A-Z][a-zA-Z\s]+)\|/g,
   'Healthcare Facility Cleaning $1|'],

  // "Framingham Healthcare Environmental Sanitation Questions"
  [/(\w+) Healthcare Environmental Sanitation Questions/g,
   '$1 Healthcare Cleaning FAQ'],

  // === BODY CONTENT - HIGH FREQUENCY PATTERNS ===

  // Footer descriptions: "cleaning services for healthcare environmental sanitation facilities in Massachusetts"
  [/cleaning services for healthcare environmental sanitation facilities in Massachusetts/g,
   'cleaning services for healthcare facilities across Massachusetts'],

  [/cleaning services for healthcare environmental sanitation facilities with/g,
   'cleaning services for medical facilities with'],

  // "trained in healthcare environmental sanitation protocols"
  [/trained in healthcare environmental sanitation protocols/g,
   'trained in clinical cleaning and infection control protocols'],

  [/trained for healthcare environmental sanitation facility protocols/g,
   'trained in healthcare facility cleaning protocols'],

  // "safety demands of healthcare environmental sanitation facilities"
  [/safety demands of healthcare environmental sanitation facilities/g,
   'safety demands of healthcare facilities'],

  // "Professional healthcare environmental sanitation facility cleaning services"
  [/Professional healthcare environmental sanitation facility cleaning services/g,
   'Professional healthcare facility cleaning services'],

  // High-touch surfaces: "[City] healthcare environmental sanitation facilities include"
  [/in ([A-Z][a-zA-Z\s]+)healthcare environmental sanitation facilities include/g,
   'in $1medical facilities include'],

  // "medical healthcare environmental sanitation facility cleaning"
  [/Medical healthcare environmental sanitation facility cleaning services/g,
   'Medical office cleaning services'],
  [/medical healthcare environmental sanitation facility cleaning services/g,
   'medical facility cleaning services'],

  // "Our medical healthcare environmental sanitation facility cleaning"
  [/Our medical healthcare environmental sanitation facility/g,
   'Our medical facility'],

  // "Comprehensive healthcare environmental sanitation for medical offices"
  [/Comprehensive healthcare environmental sanitation for medical offices/g,
   'Comprehensive cleaning and disinfection for medical offices'],

  // "healthcare environmental sanitation administrative offices"
  [/healthcare environmental sanitation administrative offices/g,
   'healthcare administrative offices'],
  [/healthcare environmental sanitation administrative spaces/g,
   'healthcare administrative spaces'],

  // "healthcare environmental sanitation expertise"
  [/healthcare environmental sanitation expertise/g,
   'clinical cleaning expertise'],

  // "healthcare environmental sanitation environments"
  [/healthcare environmental sanitation environments/g,
   'clinical environments'],

  // "healthcare environmental sanitation facility work"
  [/healthcare environmental sanitation facility work/g,
   'healthcare facility work'],

  // "healthcare environmental sanitation settings"
  [/healthcare environmental sanitation settings/g,
   'clinical settings'],

  // "healthcare environmental sanitation organizations"
  [/healthcare environmental sanitation organizations/g,
   'healthcare organizations'],

  // "healthcare environmental sanitation providers"
  [/healthcare environmental sanitation providers/g,
   'healthcare cleaning providers'],

  // "healthcare environmental sanitation clients"
  [/healthcare environmental sanitation clients/g,
   'healthcare facility clients'],

  // "healthcare environmental sanitation company"
  [/healthcare environmental sanitation company/g,
   'healthcare cleaning company'],

  // "healthcare environmental sanitation professional"
  [/healthcare environmental sanitation professional/g,
   'clinical cleaning professional'],

  // Blog-specific: "healthcare environmental sanitation facility cleaning services"
  [/healthcare environmental sanitation facility cleaning services/g,
   'healthcare facility cleaning services'],

  // "healthcare environmental sanitation facility"
  // This is the most common remaining pattern - must come AFTER more specific ones
  [/healthcare environmental sanitation facilit(ies|y)/gi,
   function(match, suffix) {
     return suffix.toLowerCase() === 'ies' ? 'healthcare facilities' : 'healthcare facility';
   }],

  // "healthcare environmental sanitation cleaning"
  [/healthcare environmental sanitation cleaning/g,
   'clinical-grade cleaning'],

  // "healthcare environmental sanitation awareness"
  [/healthcare environmental sanitation awareness/g,
   'infection prevention awareness'],

  // "healthcare environmental sanitation experience"
  [/healthcare environmental sanitation experience/gi,
   'clinical cleaning experience'],

  // "Healthcare Environmental Sanitation" at the start of a sentence (capitalized)
  [/Healthcare Environmental Sanitation /g,
   'Healthcare '],

  // Remaining lowercase instances
  [/healthcare environmental sanitation /g,
   'healthcare '],

  // Any remaining standalone (without trailing space)
  [/Healthcare Environmental Sanitation/g, 'Healthcare Cleaning'],
  [/healthcare environmental sanitation/g, 'healthcare cleaning'],

  // === FIX DOUBLE-SPACE ARTIFACTS ===
  [/  +/g, ' '],

  // === FIX "HEALTHCARE HEALTHCARE" ARTIFACTS ===
  [/[Hh]ealthcare [Hh]ealthcare/g, 'Healthcare'],
  [/healthcare healthcare/g, 'healthcare'],

  // === FIX "environmentally-focused sanitation" (orphaned adjective from old stuffing) ===
  [/environmentally-focused sanitation/g, 'clinical-grade sanitation'],
  [/environmentally-trained professionals/g, 'trained cleaning professionals'],
  [/environmentally-related environments/g, 'clinical environments'],

  // === FIX "Environmental Cleaning" in title tags that should say "Healthcare Cleaning" ===
  [/Environmental Cleaning Services in /g, 'Healthcare Cleaning Services in '],
  [/\| Environmental Cleaning/g, '| Healthcare Cleaning'],

];

// ============================================================
// SECOND PASS: Natural variation for repeated "healthcare facility"
// within the same page to avoid NEW keyword stuffing
// ============================================================
function diversifyRepetitions(content) {
  const alternatives = [
    'medical facility',
    'clinical facility',
    'healthcare facility',
    'medical practice',
    'clinical environment',
  ];

  // Count "healthcare facility" occurrences
  const matches = content.match(/healthcare facilit(y|ies)/gi);
  if (!matches || matches.length <= 8) return content; // Only diversify if too repetitive

  // Replace every 3rd occurrence with an alternative (keep most as-is for SEO)
  let count = 0;
  content = content.replace(/healthcare facilit(y|ies)/gi, (match, suffix) => {
    count++;
    if (count % 3 === 0) {
      const alt = alternatives[count % alternatives.length];
      return suffix.toLowerCase() === 'ies'
        ? alt.replace('facility', 'facilities').replace('practice', 'practices').replace('environment', 'environments')
        : alt;
    }
    return match;
  });

  return content;
}

// ============================================================
// PROCESS ALL FILES
// ============================================================

const rootDir = path.resolve(__dirname, '..');
const allFiles = findFiles(rootDir, ['.html']);

let totalFiles = 0;
let totalReplacements = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Apply all contextual rewrites
  for (const [pattern, replacement] of contextualRewrites) {
    content = content.replace(pattern, replacement);
  }

  // Second pass: diversify repetitions within each page
  content = diversifyRepetitions(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFiles++;

    // Count how many replacements were made
    const diff = original.length - content.length;
    totalReplacements++;
  }
}

// Also process XML sitemaps, JS build scripts, docs
const otherFiles = findFiles(rootDir, ['.xml', '.js', '.md', '.txt'])
  .filter(f => !f.includes('node_modules') && !f.includes('contextual-rewrite'));

for (const filePath of otherFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const [pattern, replacement] of contextualRewrites) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFiles++;
  }
}

console.log(`\nContextual rewrite complete.`);
console.log(`Files updated: ${totalFiles}`);

// Verify no stuffing remains
const remaining = findFiles(rootDir, ['.html']);
let stuffedCount = 0;
for (const f of remaining) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/healthcare environmental sanitation/gi);
  if (m) stuffedCount += m.length;
}
console.log(`Remaining "Healthcare Environmental Sanitation" occurrences: ${stuffedCount}`);
