/**
 * Audit internal links + content uniqueness + path consistency
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

// Build set of valid local paths
const validPaths = new Set();
allFiles.forEach(f => {
  const rel = '/' + path.relative(rootDir, f).split(path.sep).join('/');
  validPaths.add(rel);
  validPaths.add(rel.replace('.html', ''));
  validPaths.add(rel.replace('.html', '/'));
  if (rel.endsWith('/index.html')) {
    validPaths.add(rel.replace('/index.html', ''));
    validPaths.add(rel.replace('/index.html', '/'));
  }
});
validPaths.add('/');

// Issues
const brokenLinks = {};
const titleMap = {};
const descMap = {};
const orphanPages = [];
const linkedPages = new Set();
const mixedPaths = []; // pages mixing absolute and relative paths
const breadcrumbInconsistent = [];

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = '/' + path.relative(rootDir, filePath).split(path.sep).join('/');

  // Check links
  const hrefRegex = /href="([^"]+)"/g;
  let m;
  while ((m = hrefRegex.exec(c)) !== null) {
    const href = m[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:') || href === '/') continue;
    if (href.startsWith('/assets/')) continue;
    if (href.startsWith('//')) continue;

    // Check if internal link target exists
    let normalizedHref = href.split('?')[0].split('#')[0];

    // Track where this link points
    linkedPages.add(normalizedHref.replace(/\/$/, ''));
    linkedPages.add(normalizedHref + (normalizedHref.endsWith('/') ? '' : '/'));
    linkedPages.add(normalizedHref + (normalizedHref.endsWith('.html') ? '' : '.html'));

    // Resolve to actual files
    const candidates = [
      normalizedHref + '.html',
      normalizedHref + '/index.html',
      normalizedHref,
    ];
    const exists = candidates.some(c => validPaths.has(c));
    if (!exists && normalizedHref.startsWith('/')) {
      if (!brokenLinks[normalizedHref]) brokenLinks[normalizedHref] = [];
      if (brokenLinks[normalizedHref].length < 3) brokenLinks[normalizedHref].push(rel);
    }
  }

  // Check title uniqueness
  const tm = c.match(/<title>([^<]*)<\/title>/);
  if (tm) {
    const t = tm[1].trim();
    if (!titleMap[t]) titleMap[t] = [];
    titleMap[t].push(rel);
  }

  // Check description uniqueness
  const dm = c.match(/name="description"\s+content="([^"]*)"/);
  if (dm) {
    const d = dm[1].trim();
    if (!descMap[d]) descMap[d] = [];
    descMap[d].push(rel);
  }

  // Check breadcrumb in HTML matches schema
  const bcSchema = c.match(/"@type":"BreadcrumbList"[^<]*itemListElement[^<]*/);
  const bcHtml = c.match(/<nav[^>]*breadcrumb[^<]*<\/nav>|<ol[^>]*breadcrumb[\s\S]*?<\/ol>/);
  if (bcSchema && !bcHtml) breadcrumbInconsistent.push(rel + ': schema but no HTML');
  if (!bcSchema && bcHtml && !rel.includes('404') && !rel.includes('500')) {
    breadcrumbInconsistent.push(rel + ': HTML but no schema');
  }

  // Mixed absolute/relative paths in same page (e.g. /assets/ AND assets/)
  const hasAbsAssets = c.match(/href="\/assets\//) || c.match(/src="\/assets\//);
  const hasRelAssets = c.match(/href="assets\//) || c.match(/src="assets\//);
  if (hasAbsAssets && hasRelAssets) {
    mixedPaths.push(rel);
  }
});

// Find orphan pages (not linked from anywhere)
allFiles.forEach(filePath => {
  const rel = '/' + path.relative(rootDir, filePath).split(path.sep).join('/');
  const noExt = rel.replace('.html', '');
  const isOrphan = !linkedPages.has(rel) && !linkedPages.has(noExt) && !linkedPages.has(rel.replace('/index.html', ''));
  // Skip the obvious utility pages
  if (rel === '/index.html' || rel === '/404.html' || rel === '/500.html' || rel.endsWith('/index.html')) return;
  if (isOrphan) orphanPages.push(rel);
});

// Report
console.log('='.repeat(70));
console.log('LINK + CONTENT AUDIT');
console.log('='.repeat(70));
console.log('');
console.log('TOTAL PAGES: ' + allFiles.length);
console.log('');
console.log('BROKEN INTERNAL LINKS: ' + Object.keys(brokenLinks).length);
Object.keys(brokenLinks).slice(0, 10).forEach(href => {
  console.log('  404: ' + href + ' (referenced by ' + brokenLinks[href].length + ' page(s))');
  brokenLinks[href].slice(0, 2).forEach(p => console.log('       <- ' + p));
});

console.log('');
console.log('DUPLICATE TITLES: ' + Object.keys(titleMap).filter(t => titleMap[t].length > 1).length);
Object.keys(titleMap).filter(t => titleMap[t].length > 1).slice(0, 5).forEach(t => {
  console.log('  "' + t.substring(0, 60) + '..." used in ' + titleMap[t].length + ' pages');
});

console.log('');
console.log('DUPLICATE DESCRIPTIONS: ' + Object.keys(descMap).filter(d => descMap[d].length > 1).length);
Object.keys(descMap).filter(d => descMap[d].length > 1).slice(0, 5).forEach(d => {
  console.log('  "' + d.substring(0, 60) + '..." used in ' + descMap[d].length + ' pages');
});

console.log('');
console.log('ORPHAN PAGES (no incoming links): ' + orphanPages.length);
orphanPages.slice(0, 10).forEach(p => console.log('  ' + p));

console.log('');
console.log('MIXED ABSOLUTE/RELATIVE PATHS: ' + mixedPaths.length);
mixedPaths.slice(0, 5).forEach(p => console.log('  ' + p));

console.log('');
console.log('BREADCRUMB INCONSISTENCY: ' + breadcrumbInconsistent.length);
breadcrumbInconsistent.slice(0, 10).forEach(p => console.log('  ' + p));
