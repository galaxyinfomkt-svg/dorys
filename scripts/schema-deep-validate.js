/**
 * Deep schema validation across all pages
 */

const fs = require('fs');
const path = require('path');

function findHtml(dir, results) {
  results = results || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', 'scripts', 'build', 'docs'].includes(e.name)) {
      findHtml(fp, results);
    } else if (e.name.endsWith('.html')) {
      results.push(fp);
    }
  });
  return results;
}

const rootDir = path.resolve(__dirname, '..');
const allFiles = findHtml(rootDir);

const issues = {
  invalidJson: [],
  duplicateLB: [],
  duplicateOrg: [],
  duplicateFAQ: [],
  noSchemas: [],
  emptyFields: [],
  conflictingPhones: [],
  conflictingNames: [],
  multipleAggregateRatings: [],
};

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  const ldMatches = c.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) || [];
  if (ldMatches.length === 0) {
    issues.noSchemas.push(rel);
    return;
  }

  let lbCount = 0, orgCount = 0, faqCount = 0, ratingCount = 0;
  const phones = new Set();
  const names = new Set();

  ldMatches.forEach((m, idx) => {
    const json = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      const parsed = JSON.parse(json);
      const visited = new WeakSet();
      const check = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (visited.has(obj)) return;
        visited.add(obj);
        const t = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
        if (t.includes('LocalBusiness')) lbCount++;
        if (t.includes('Organization')) orgCount++;
        if (t.includes('FAQPage')) faqCount++;
        if (obj.aggregateRating) ratingCount++;
        if (obj.telephone) phones.add(obj.telephone);
        if (obj.name && t.some(x => ['LocalBusiness','Organization','ProfessionalService'].includes(x))) {
          names.add(obj.name);
        }
        if (t.includes('LocalBusiness') || t.includes('Organization')) {
          if (!obj.name) issues.emptyFields.push(rel + ': missing name');
          if (!obj.telephone && !obj.url) issues.emptyFields.push(rel + ': missing contact');
        }
        Object.values(obj).forEach(v => {
          if (Array.isArray(v)) v.forEach(check);
          else if (typeof v === 'object') check(v);
        });
      };
      check(parsed);
    } catch (e) {
      issues.invalidJson.push(rel + ' [schema #' + (idx+1) + ']: ' + e.message.substring(0, 80));
    }
  });

  if (lbCount > 1) issues.duplicateLB.push(rel + ' (' + lbCount + ')');
  if (orgCount > 1) issues.duplicateOrg.push(rel + ' (' + orgCount + ')');
  if (faqCount > 1) issues.duplicateFAQ.push(rel + ' (' + faqCount + ')');
  if (ratingCount > 1) issues.multipleAggregateRatings.push(rel + ' (' + ratingCount + ')');
  if (phones.size > 1) issues.conflictingPhones.push(rel + ': ' + Array.from(phones).join(', '));
  if (names.size > 1) issues.conflictingNames.push(rel + ': ' + Array.from(names).join(' | '));
});

console.log('='.repeat(70));
console.log('DEEP SCHEMA VALIDATION — ' + allFiles.length + ' pages');
console.log('='.repeat(70));
console.log('');
console.log('CRITICAL ISSUES:');
console.log('  Invalid JSON-LD: ' + issues.invalidJson.length);
if (issues.invalidJson.length) issues.invalidJson.slice(0,5).forEach(p => console.log('    ' + p));
console.log('  Pages with NO schemas: ' + issues.noSchemas.length);
if (issues.noSchemas.length) issues.noSchemas.slice(0,5).forEach(p => console.log('    ' + p));
console.log('  Duplicate LocalBusiness: ' + issues.duplicateLB.length);
if (issues.duplicateLB.length) issues.duplicateLB.slice(0,5).forEach(p => console.log('    ' + p));
console.log('  Duplicate Organization: ' + issues.duplicateOrg.length);
if (issues.duplicateOrg.length) issues.duplicateOrg.slice(0,5).forEach(p => console.log('    ' + p));
console.log('  Duplicate FAQPage: ' + issues.duplicateFAQ.length);
if (issues.duplicateFAQ.length) issues.duplicateFAQ.slice(0,5).forEach(p => console.log('    ' + p));
console.log('  Multiple AggregateRating per page: ' + issues.multipleAggregateRatings.length);
if (issues.multipleAggregateRatings.length) issues.multipleAggregateRatings.slice(0,5).forEach(p => console.log('    ' + p));
console.log('  Conflicting phone numbers: ' + issues.conflictingPhones.length);
if (issues.conflictingPhones.length) issues.conflictingPhones.slice(0,3).forEach(p => console.log('    ' + p));
console.log('  Conflicting business names: ' + issues.conflictingNames.length);
if (issues.conflictingNames.length) issues.conflictingNames.slice(0,3).forEach(p => console.log('    ' + p));
console.log('  Empty schema fields: ' + issues.emptyFields.length);
