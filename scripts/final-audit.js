/**
 * Final deep audit - check edge cases
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
  brokenAnchors: [],
  inlineStyles: [],
  missingArticleAuthor: [],
  missingArticleHeadline: [],
  weirdPhoneFormat: [],
  noFooterContact: [],
  brokenAccordion: [],
  notMobileFriendly: [],
  missingFavicon: [],
  jsErrors: [],
  weirdEmoji: [],
  duplicateH2: [],
  excessiveInlineStyle: [],
};

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  // ===== BROKEN ANCHOR LINKS (#section) =====
  // Find all href="#xxx" and check if the id="xxx" exists in same page
  const anchorRefs = c.match(/href="#([a-zA-Z][^"]*)"/g) || [];
  anchorRefs.forEach(ref => {
    const anchorMatch = ref.match(/href="#([^"]+)"/);
    if (!anchorMatch) return;
    const anchor = anchorMatch[1];
    if (anchor === 'main-content') return; // skip
    const idRegex = new RegExp('id="' + anchor + '"');
    if (!idRegex.test(c)) {
      issues.brokenAnchors.push(rel + ': #' + anchor);
    }
  });

  // ===== ARTICLE SCHEMA COMPLETENESS (blog posts) =====
  if (rel.startsWith('blog/') && !rel.endsWith('index.html')) {
    if (!c.includes('"author"')) issues.missingArticleAuthor.push(rel);
    if (!c.includes('"headline"')) issues.missingArticleHeadline.push(rel);
  }

  // ===== PHONE NUMBER FORMAT IN BODY (visible content) =====
  const visibleText = c.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  // Look for phone formats other than (978) 307-8107
  const weirdPhones = visibleText.match(/(?<!\d)978[ -.]?307[ -.]?8107(?!\d)/g) || [];
  weirdPhones.forEach(p => {
    if (p !== '978-307-8107' && p !== '(978) 307-8107' && p !== '9783078107') {
      // Check if it's standalone (not in tel: link)
      const idx = visibleText.indexOf(p);
      const before = visibleText.substring(Math.max(0, idx - 30), idx);
      if (!before.includes('tel:') && p !== '(978) 307-8107') {
        issues.weirdPhoneFormat.push(rel + ': ' + p);
      }
    }
  });

  // ===== EXCESSIVE INLINE STYLES =====
  const inlineStyleMatches = c.match(/style="[^"]{200,}"/g) || [];
  if (inlineStyleMatches.length > 5) {
    issues.excessiveInlineStyle.push(rel + ': ' + inlineStyleMatches.length + ' large inline styles');
  }

  // ===== FOOTER CONTACT =====
  const hasFooter = /<footer/.test(c);
  if (hasFooter && !c.match(/footer[\s\S]*?\(?978\)?[ -]?307[ -]?8107/i) && !c.match(/footer[\s\S]*?contact@doryscleaning/i)) {
    issues.noFooterContact.push(rel);
  }

  // ===== DUPLICATE H2 IN SAME PAGE =====
  const h2Matches = c.match(/<h2[^>]*>([\s\S]*?)<\/h2>/g) || [];
  const h2Texts = h2Matches.map(h => h.replace(/<[^>]+>/g, '').trim());
  const seen = {};
  h2Texts.forEach(t => {
    if (t && seen[t]) {
      issues.duplicateH2.push(rel + ': "' + t.substring(0, 50) + '"');
    }
    seen[t] = true;
  });

  // ===== ACCORDION CHECK =====
  if (c.includes('accordion__header') && !c.includes('accordion__content')) {
    issues.brokenAccordion.push(rel + ': has header but no content');
  }
});

console.log('='.repeat(70));
console.log('FINAL DEEP AUDIT — ' + allFiles.length + ' pages');
console.log('='.repeat(70));

const report = (label, list, max) => {
  console.log('\n' + label + ': ' + list.length);
  list.slice(0, max || 5).forEach(p => console.log('  ' + p));
};

report('Broken anchor links (#section)', issues.brokenAnchors);
report('Articles missing "author" schema', issues.missingArticleAuthor);
report('Articles missing "headline" schema', issues.missingArticleHeadline);
report('Inconsistent phone format in body', issues.weirdPhoneFormat);
report('Pages without footer contact info', issues.noFooterContact);
report('Pages with duplicate H2 text', issues.duplicateH2);
report('Pages with excessive inline styles', issues.excessiveInlineStyle);
report('Broken accordions', issues.brokenAccordion);
