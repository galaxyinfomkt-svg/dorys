/**
 * Advanced site audit
 * Checks: accessibility, semantic HTML, anchor text, dates, etc.
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
  // Accessibility
  noAriaLabel: [],
  imageGenericAlt: [],
  imageEmptyAlt: [],
  imageRedundantAlt: [],
  noLanguageAttr: [],

  // Heading hierarchy
  brokenHeadingHierarchy: [],
  h1AfterH2: [],

  // SEO content
  noSpecificAlt: [],
  metaKeywordBloat: [],
  externalNoRel: [],
  externalNoOpen: [],

  // Article freshness
  noDatePublished: [],
  noDateModified: [],
  oldDate: [],

  // Semantic HTML
  noSemanticTags: [],
  divSoupRatio: [],

  // Other
  redundantSpaces: [],
  emptyElements: [],
  weirdSpaceFormat: [],
};

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  // ===== HEADING HIERARCHY =====
  const headings = [];
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g;
  let hm;
  while ((hm = headingRegex.exec(c)) !== null) {
    headings.push({ level: parseInt(hm[1]), text: hm[2].replace(/<[^>]+>/g, '').trim().substring(0, 50) });
  }

  // Check hierarchy doesn't skip levels (e.g. h1 -> h3 without h2)
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level - headings[i-1].level > 1) {
      issues.brokenHeadingHierarchy.push(rel + ': h' + headings[i-1].level + ' followed by h' + headings[i].level + ' ("' + headings[i].text + '")');
      break;
    }
  }

  // ===== EXTERNAL LINKS WITHOUT REL ATTRIBUTES =====
  const externalLinks = c.match(/<a[^>]*href="https?:\/\/(?!doryscleaningservices\.com)[^"]+"[^>]*>/g) || [];
  externalLinks.forEach(link => {
    if (!link.includes('rel=')) {
      issues.externalNoRel.push(rel + ': ' + link.substring(0, 80));
    } else if (!link.match(/rel="[^"]*noopener/)) {
      issues.externalNoOpen.push(rel + ': missing noopener');
    }
  });

  // ===== META KEYWORDS BLOAT =====
  const kwMatch = c.match(/name="keywords"\s+content="([^"]*)"/);
  if (kwMatch) {
    const keywords = kwMatch[1].split(',').map(k => k.trim()).filter(k => k);
    if (keywords.length > 10) issues.metaKeywordBloat.push(rel + ': ' + keywords.length + ' keywords');
  }

  // ===== IMAGE ALT QUALITY =====
  const imgs = c.match(/<img[^>]*>/g) || [];
  imgs.forEach(img => {
    const altMatch = img.match(/alt="([^"]*)"/);
    if (!altMatch) return;
    const alt = altMatch[1].toLowerCase();
    if (!alt) {
      issues.imageEmptyAlt.push(rel);
    } else if (/^(image|photo|picture|img|icon|graphic|logo)$/i.test(alt.trim())) {
      issues.imageGenericAlt.push(rel + ': "' + alt + '"');
    } else if (alt.startsWith('image of') || alt.startsWith('picture of') || alt.startsWith('photo of')) {
      issues.imageRedundantAlt.push(rel + ': "' + alt.substring(0, 40) + '"');
    }
  });

  // ===== ARTICLE DATES =====
  if (rel.startsWith('blog/') && !rel.endsWith('index.html')) {
    if (!c.includes('"datePublished"')) issues.noDatePublished.push(rel);
    if (!c.includes('"dateModified"')) issues.noDateModified.push(rel);

    // Check date is recent (within last 12 months)
    const dateMatch = c.match(/"datePublished":\s*"([^"]+)"/);
    if (dateMatch) {
      const pubDate = new Date(dateMatch[1]);
      const now = new Date('2026-04-29');
      const monthsOld = (now - pubDate) / (1000 * 60 * 60 * 24 * 30);
      if (monthsOld > 18) issues.oldDate.push(rel + ': ' + dateMatch[1]);
    }
  }

  // ===== SEMANTIC HTML =====
  const hasMain = c.includes('<main') || c.includes('role="main"');
  const hasNav = c.includes('<nav');
  const hasFooter = c.includes('<footer');
  const hasHeader = c.includes('<header');
  const hasArticle = c.includes('<article');
  const hasSection = c.includes('<section');
  if (!hasMain && rel !== '404.html' && rel !== '500.html') {
    issues.noSemanticTags.push(rel + ': no <main>');
  }

  // ===== EMPTY HEADINGS =====
  const emptyH = c.match(/<h\d[^>]*>\s*<\/h\d>/g);
  if (emptyH) issues.emptyElements.push(rel + ': empty <h>');

  // Empty paragraphs
  const emptyP = c.match(/<p[^>]*>\s*<\/p>/g);
  if (emptyP && emptyP.length > 2) issues.emptyElements.push(rel + ': ' + emptyP.length + ' empty <p>');
});

console.log('='.repeat(70));
console.log('ADVANCED AUDIT — ' + allFiles.length + ' pages');
console.log('='.repeat(70));

const report = (label, list, max) => {
  console.log('\n' + label + ': ' + list.length);
  list.slice(0, max || 5).forEach(p => console.log('  ' + p));
};

report('Heading hierarchy skips (H1->H3, etc)', issues.brokenHeadingHierarchy);
report('External links WITHOUT rel attribute', issues.externalNoRel);
report('External links missing noopener', issues.externalNoOpen);
report('Meta keywords bloat (>10 keywords)', issues.metaKeywordBloat);
report('Images with generic alt (image/photo/icon)', issues.imageGenericAlt);
report('Images with empty alt', issues.imageEmptyAlt);
report('Images with redundant alt ("image of...")', issues.imageRedundantAlt);
report('Blog posts without datePublished', issues.noDatePublished);
report('Blog posts without dateModified', issues.noDateModified);
report('Blog posts with date >18 months old', issues.oldDate);
report('Pages without semantic <main>', issues.noSemanticTags);
report('Pages with empty headings/paragraphs', issues.emptyElements);
