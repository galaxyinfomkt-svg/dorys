/**
 * Fix remaining ultra-audit issues
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

let ogLocaleFixed = 0;
let ogSiteNameFixed = 0;
let iframeTitleFixed = 0;
let preconnectFixed = 0;

allFiles.forEach(filePath => {
  let c = fs.readFileSync(filePath, 'utf8');
  const orig = c;

  // ============================================================
  // 1. ADD og:locale to all pages with og tags
  // ============================================================
  if (c.includes('og:title') && !c.includes('og:locale')) {
    const ogTitleMatch = c.match(/(<meta\s+property="og:title"[^>]*>)/);
    if (ogTitleMatch) {
      const localeTag = '\n  <meta property="og:locale" content="en_US">';
      c = c.replace(ogTitleMatch[1], ogTitleMatch[1] + localeTag);
      ogLocaleFixed++;
    }
  }

  // ============================================================
  // 2. ADD og:site_name to all pages with og tags
  // ============================================================
  if (c.includes('og:title') && !c.includes('og:site_name')) {
    const ogTitleMatch = c.match(/(<meta\s+property="og:title"[^>]*>)/);
    if (ogTitleMatch) {
      const siteNameTag = '\n  <meta property="og:site_name" content="Dory\'s Cleaning Services">';
      c = c.replace(ogTitleMatch[1], ogTitleMatch[1] + siteNameTag);
      ogSiteNameFixed++;
    }
  }

  // ============================================================
  // 3. ADD title to iframes that don't have one
  // ============================================================
  c = c.replace(/<iframe([^>]*)>/g, (match, attrs) => {
    if (attrs.includes('title=')) return match;
    // Generic but useful title
    let title = 'Embedded content';
    if (attrs.includes('leadconnector') || attrs.includes('form')) title = 'Contact form';
    if (attrs.includes('maps') || attrs.includes('google.com/maps')) title = 'Location map';
    if (attrs.includes('youtube')) title = 'Video player';
    iframeTitleFixed++;
    return '<iframe title="' + title + '"' + attrs + '>';
  });

  // ============================================================
  // 4. ADD preconnect to pages without it
  // ============================================================
  if (!c.includes('rel="preconnect"') && c.includes('fonts.googleapis')) {
    const linkPattern = c.match(/(<link[^>]*fonts\.googleapis[^>]*>)/);
    if (linkPattern) {
      const preconnect = '\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
      c = c.replace(linkPattern[1], preconnect + '\n  ' + linkPattern[1]);
      preconnectFixed++;
    }
  }

  if (c !== orig) {
    fs.writeFileSync(filePath, c);
  }
});

console.log('og:locale added: ' + ogLocaleFixed);
console.log('og:site_name added: ' + ogSiteNameFixed);
console.log('iframe titles added: ' + iframeTitleFixed);
console.log('preconnect added: ' + preconnectFixed);
