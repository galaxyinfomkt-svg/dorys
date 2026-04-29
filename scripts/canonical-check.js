/**
 * Verify canonical URLs match the actual page URL
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
  wrongCanonical: [],
  multipleCanonicals: [],
  hreflangMismatch: [],
  duplicateLinks: [],
};

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  // Expected canonical based on file path
  let expected;
  if (rel === 'index.html') expected = 'https://doryscleaningservices.com/';
  else if (rel.endsWith('/index.html')) expected = 'https://doryscleaningservices.com/' + rel.replace('/index.html', '');
  else expected = 'https://doryscleaningservices.com/' + rel.replace('.html', '');

  // Check canonical matches
  const canonicalMatches = c.match(/rel="canonical"\s+href="([^"]+)"/g) || [];
  if (canonicalMatches.length > 1) issues.multipleCanonicals.push(rel + ': ' + canonicalMatches.length);

  if (canonicalMatches.length > 0) {
    const actualMatch = canonicalMatches[0].match(/href="([^"]+)"/);
    if (actualMatch && actualMatch[1] !== expected) {
      issues.wrongCanonical.push(rel + ' expected:' + expected + ' actual:' + actualMatch[1]);
    }
  }

  // Check hreflang matches canonical
  const hreflangMatch = c.match(/rel="alternate"\s+hreflang="[^"]+"\s+href="([^"]+)"/);
  if (hreflangMatch && canonicalMatches.length > 0) {
    const canonicalUrl = canonicalMatches[0].match(/href="([^"]+)"/)[1];
    if (hreflangMatch[1] !== canonicalUrl) {
      issues.hreflangMismatch.push(rel + ': hreflang=' + hreflangMatch[1] + ', canonical=' + canonicalUrl);
    }
  }
});

console.log('CANONICAL VALIDATION — ' + allFiles.length + ' pages');
console.log('');
console.log('Wrong canonical URL: ' + issues.wrongCanonical.length);
issues.wrongCanonical.slice(0, 5).forEach(p => console.log('  ' + p));
console.log('');
console.log('Multiple canonical tags: ' + issues.multipleCanonicals.length);
issues.multipleCanonicals.slice(0, 5).forEach(p => console.log('  ' + p));
console.log('');
console.log('Hreflang/canonical mismatch: ' + issues.hreflangMismatch.length);
issues.hreflangMismatch.slice(0, 5).forEach(p => console.log('  ' + p));
