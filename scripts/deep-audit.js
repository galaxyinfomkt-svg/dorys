/**
 * DEEP SITE AUDIT
 * Checks every possible SEO/AEO/HTML issue across all pages
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
  // SEO Critical
  noTitle: [],
  emptyTitle: [],
  titleOver60: [],
  titleUnder30: [],
  duplicateTitle: {},
  noDesc: [],
  emptyDesc: [],
  descOver160: [],
  descUnder100: [],
  duplicateDesc: {},
  noCanonical: [],
  brokenCanonical: [],
  multiH1: [],
  noH1: [],
  emptyH1: [],
  noLang: [],
  noViewport: [],
  noRobots: [],

  // Schema Issues
  brokenSchema: [],
  multiLocalBusiness: [],
  multiOrganization: [],
  missingSchema: [],
  noFaqSchema: [],
  noBreadcrumb: [],
  noAggregateRating: [],

  // Open Graph / Twitter
  noOgImage: [],
  noOgTitle: [],
  noTwitterCard: [],

  // Performance
  inlineJsLarge: [],
  noLazyImages: [],
  imagesNoAlt: [],
  imagesEmptyAlt: [],
  noWidthHeight: [],

  // Content Issues
  thinContent: [],
  duplicateContent: {},
  brokenLinks: [],
  internalLinkDead: [],

  // Mobile
  noMobileMeta: [],

  // Geo / Local SEO
  noGeoMeta: [],
  noHreflang: [],
  inconsistentBrand: [],

  // Errors
  unclosedTags: [],
  invalidHtml: [],

  // Keyword stuffing residual
  envSanitation: [],
  doubleWords: [],
};

const titleMap = {};
const descMap = {};

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  // ===== TITLE =====
  const titleMatch = c.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch) {
    issues.noTitle.push(rel);
  } else {
    const title = titleMatch[1].replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&#x27;/g, "'");
    if (!title.trim()) issues.emptyTitle.push(rel);
    if (title.length > 60) issues.titleOver60.push(rel + ' (' + title.length + 'ch)');
    if (title.length < 30 && title.length > 0) issues.titleUnder30.push(rel + ' (' + title.length + 'ch)');
    if (titleMap[title]) titleMap[title].push(rel); else titleMap[title] = [rel];
  }

  // ===== DESCRIPTION =====
  const descMatch = c.match(/name="description"\s+content="([^"]*)"/);
  if (!descMatch) {
    issues.noDesc.push(rel);
  } else {
    const desc = descMatch[1].replace(/&amp;/g, '&');
    if (!desc.trim()) issues.emptyDesc.push(rel);
    if (desc.length > 160) issues.descOver160.push(rel + ' (' + desc.length + 'ch)');
    if (desc.length < 100 && desc.length > 0) issues.descUnder100.push(rel + ' (' + desc.length + 'ch)');
    if (descMap[desc]) descMap[desc].push(rel); else descMap[desc] = [rel];
  }

  // ===== CANONICAL =====
  if (!/rel="canonical"/.test(c)) issues.noCanonical.push(rel);
  const canonicalMatch = c.match(/rel="canonical"\s+href="([^"]*)"/);
  if (canonicalMatch && !canonicalMatch[1].startsWith('https://doryscleaningservices.com')) {
    issues.brokenCanonical.push(rel + ': ' + canonicalMatch[1]);
  }

  // ===== H1 =====
  const h1Matches = c.match(/<h1[\s>][^<]*<\/h1>/g) || [];
  if (h1Matches.length === 0) issues.noH1.push(rel);
  if (h1Matches.length > 1) issues.multiH1.push(rel + ' (' + h1Matches.length + ' H1s)');
  h1Matches.forEach(h => {
    const text = h.replace(/<[^>]+>/g, '').trim();
    if (!text) issues.emptyH1.push(rel);
  });

  // ===== HTML BASICS =====
  if (!/<html\s+lang=/.test(c)) issues.noLang.push(rel);
  if (!/name="viewport"/.test(c)) issues.noViewport.push(rel);
  if (!/name="robots"/.test(c)) issues.noRobots.push(rel);

  // ===== SCHEMA =====
  const ldMatches = c.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) || [];
  let lbCount = 0, orgCount = 0, hasFaq = false, hasBreadcrumb = false, hasRating = false;
  ldMatches.forEach(m => {
    const json = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      const parsed = JSON.parse(json);
      const checkType = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        const t = obj['@type'];
        if (t === 'LocalBusiness') lbCount++;
        if (t === 'Organization') orgCount++;
        if (t === 'FAQPage') hasFaq = true;
        if (t === 'BreadcrumbList') hasBreadcrumb = true;
        if (obj.aggregateRating) hasRating = true;
      };
      if (Array.isArray(parsed)) parsed.forEach(checkType);
      else checkType(parsed);
    } catch (e) {
      issues.brokenSchema.push(rel + ': ' + e.message.substring(0, 60));
    }
  });
  if (lbCount > 1) issues.multiLocalBusiness.push(rel + ' (' + lbCount + ')');
  if (orgCount > 1) issues.multiOrganization.push(rel + ' (' + orgCount + ')');
  if (ldMatches.length === 0) issues.missingSchema.push(rel);
  if (!hasFaq && !rel.includes('privacy') && !rel.includes('terms') && !rel.includes('sitemap.html') && !rel.includes('404') && !rel.includes('500')) {
    issues.noFaqSchema.push(rel);
  }
  if (!hasBreadcrumb && rel !== 'index.html' && !rel.includes('404') && !rel.includes('500') && !rel.includes('privacy') && !rel.includes('terms')) {
    issues.noBreadcrumb.push(rel);
  }
  if (!hasRating && !rel.includes('privacy') && !rel.includes('terms') && !rel.includes('sitemap.html') && !rel.includes('404') && !rel.includes('500')) {
    issues.noAggregateRating.push(rel);
  }

  // ===== OPEN GRAPH =====
  if (!/og:image/.test(c)) issues.noOgImage.push(rel);
  if (!/og:title/.test(c)) issues.noOgTitle.push(rel);
  if (!/twitter:card/.test(c)) issues.noTwitterCard.push(rel);

  // ===== IMAGES =====
  const imgMatches = c.match(/<img[^>]*>/g) || [];
  imgMatches.forEach(img => {
    if (!/alt=/.test(img)) issues.imagesNoAlt.push(rel);
    else if (/alt=""/.test(img) && !img.includes('decorative')) issues.imagesEmptyAlt.push(rel);
    if (!/width=/.test(img) || !/height=/.test(img)) issues.noWidthHeight.push(rel);
  });

  // ===== HREFLANG =====
  if (!/hreflang/.test(c) && !rel.includes('404') && !rel.includes('500')) {
    issues.noHreflang.push(rel);
  }

  // ===== KEYWORD STUFFING RESIDUAL =====
  if (/Environmental Sanitation/i.test(c)) {
    const matches = c.match(/Environmental Sanitation/gi);
    if (matches && matches.length > 0) {
      issues.envSanitation.push(rel + ' (' + matches.length + ')');
    }
  }

  // Double word patterns
  ['Healthcare Healthcare', 'Cleaning Cleaning', 'Medical Medical', 'Service Service', 'Sanitation Sanitation'].forEach(pattern => {
    if (c.includes(pattern)) {
      issues.doubleWords.push(rel + ': ' + pattern);
    }
  });

  // ===== THIN CONTENT =====
  // Strip HTML and check word count
  const textContent = c
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(/\s+/).length;
  if (wordCount < 300 && !rel.includes('404') && !rel.includes('500') && !rel.includes('privacy') && !rel.includes('terms')) {
    issues.thinContent.push(rel + ' (' + wordCount + ' words)');
  }

  // ===== INCONSISTENT BRAND =====
  if (c.includes("Dory's") && c.includes("Dorys ") && !c.includes("Dorys%20") && !c.includes("Dorys.com")) {
    issues.inconsistentBrand.push(rel);
  }
});

// Find duplicate titles and descriptions
Object.keys(titleMap).forEach(title => {
  if (titleMap[title].length > 1) {
    issues.duplicateTitle[title] = titleMap[title];
  }
});
Object.keys(descMap).forEach(desc => {
  if (descMap[desc].length > 1) {
    issues.duplicateDesc[desc] = descMap[desc];
  }
});

// ===== REPORT =====
console.log('='.repeat(70));
console.log('DEEP SITE AUDIT — ' + allFiles.length + ' pages scanned');
console.log('='.repeat(70));

const report = (label, list, severity) => {
  const count = Array.isArray(list) ? list.length : Object.keys(list).length;
  if (count === 0) return;
  console.log('');
  const tag = severity === 'critical' ? '[CRITICAL]' : severity === 'warning' ? '[WARN]' : '[INFO]';
  console.log(tag + ' ' + label + ': ' + count);
  if (Array.isArray(list) && count > 0) {
    list.slice(0, 5).forEach(item => console.log('   ' + item));
    if (count > 5) console.log('   ... and ' + (count - 5) + ' more');
  } else if (typeof list === 'object') {
    let i = 0;
    for (const k in list) {
      if (i++ >= 3) break;
      console.log('   "' + k.substring(0, 50) + '..." used in ' + list[k].length + ' pages');
    }
    if (Object.keys(list).length > 3) console.log('   ... and ' + (Object.keys(list).length - 3) + ' more duplicates');
  }
};

console.log('\n--- TITLE ISSUES ---');
report('No <title> tag', issues.noTitle, 'critical');
report('Empty <title>', issues.emptyTitle, 'critical');
report('Title over 60 chars (truncated)', issues.titleOver60, 'critical');
report('Title under 30 chars (too short)', issues.titleUnder30, 'warning');
report('Duplicate titles', issues.duplicateTitle, 'critical');

console.log('\n--- DESCRIPTION ISSUES ---');
report('No meta description', issues.noDesc, 'critical');
report('Empty description', issues.emptyDesc, 'critical');
report('Description over 160 chars', issues.descOver160, 'warning');
report('Description under 100 chars', issues.descUnder100, 'warning');
report('Duplicate descriptions', issues.duplicateDesc, 'critical');

console.log('\n--- HEADING ISSUES ---');
report('No H1', issues.noH1, 'critical');
report('Multiple H1s', issues.multiH1, 'warning');
report('Empty H1', issues.emptyH1, 'critical');

console.log('\n--- HTML BASICS ---');
report('No lang attribute', issues.noLang, 'critical');
report('No viewport meta', issues.noViewport, 'critical');
report('No robots meta', issues.noRobots, 'warning');
report('Broken canonical', issues.brokenCanonical, 'critical');
report('No canonical', issues.noCanonical, 'critical');

console.log('\n--- SCHEMA ---');
report('Broken JSON-LD', issues.brokenSchema, 'critical');
report('Multiple LocalBusiness', issues.multiLocalBusiness, 'critical');
report('Multiple Organization', issues.multiOrganization, 'critical');
report('No schema at all', issues.missingSchema, 'critical');
report('No FAQ schema', issues.noFaqSchema, 'warning');
report('No BreadcrumbList', issues.noBreadcrumb, 'warning');
report('No AggregateRating', issues.noAggregateRating, 'warning');

console.log('\n--- OPEN GRAPH ---');
report('No og:image', issues.noOgImage, 'warning');
report('No og:title', issues.noOgTitle, 'warning');
report('No twitter:card', issues.noTwitterCard, 'warning');

console.log('\n--- IMAGES ---');
report('Images without alt', issues.imagesNoAlt, 'critical');
report('Images with empty alt', issues.imagesEmptyAlt, 'warning');
report('Images without width/height', issues.noWidthHeight, 'warning');

console.log('\n--- INTERNATIONALIZATION ---');
report('No hreflang', issues.noHreflang, 'warning');

console.log('\n--- CONTENT QUALITY ---');
report('Thin content (<300 words)', issues.thinContent, 'warning');
report('Inconsistent brand (Dory\'s vs Dorys)', issues.inconsistentBrand, 'warning');
report('Environmental Sanitation residual', issues.envSanitation, 'critical');
report('Double word patterns', issues.doubleWords, 'critical');

// Save full report
fs.writeFileSync(path.join(rootDir, 'audit-report.json'), JSON.stringify(issues, null, 2));
console.log('\n\nFull report saved to: audit-report.json');
