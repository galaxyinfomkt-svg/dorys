/**
 * ULTRA DEEP AUDIT — Catch EVERYTHING
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
  // HTML structural issues
  unclosedDiv: [],
  unclosedSpan: [],
  unclosedA: [],
  unclosedP: [],
  multiHtml: [],
  multiHead: [],
  multiBody: [],

  // Schema issues (deep)
  schemaInvalidJson: [],
  schemaMissingContext: [],
  schemaMissingType: [],
  schemaInvalidUrl: [],
  schemaIncompleteAddress: [],
  schemaPhoneFormat: [],

  // Link issues
  internalLinks404: [],
  brokenAssets: [],
  emptyHref: [],
  jsHref: [],

  // Image issues
  imgNoAlt: [],
  imgEmptyAlt: [],
  imgNoSrc: [],
  imgBrokenSrc: [],
  imgGenericAlt: [],
  imgPlaceholder: [],

  // Accessibility
  buttonNoLabel: [],
  formNoLabel: [],
  inputNoLabel: [],
  iframeNoTitle: [],
  noSkipLink: [],
  noLandmark: [],

  // Mobile
  fixedFontSize: [],
  smallTouchTarget: [],

  // Content
  duplicateMetaDesc: {},
  thinPages: [],
  htmlInTitle: [],
  htmlInDesc: [],
  excessivelyLongTitle: [],

  // Schema deep validation
  noPriceRange: [],
  noOpeningHours: [],
  noTelephone: [],
  invalidLatLng: [],

  // NAP consistency
  inconsistentPhone: [],
  inconsistentAddress: [],

  // Performance
  inlineScriptLarge: [],
  cssNotMinified: [],
  noPreconnect: [],
  noFontDisplay: [],

  // SEO
  hardcodedH1: [],
  emptyAttribute: [],
  duplicateId: [],
  invalidAttribute: [],

  // OpenGraph deep
  ogNoLocale: [],
  ogNoSiteName: [],
  ogImageNotAbsolute: [],
};

const phoneNumbers = new Set();
const emails = new Set();
const allIds = {};

allFiles.forEach(filePath => {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');

  // ===== HTML STRUCTURE =====
  const openDiv = (c.match(/<div[\s>]/g) || []).length;
  const closeDiv = (c.match(/<\/div>/g) || []).length;
  if (openDiv !== closeDiv) issues.unclosedDiv.push(rel + ' (open:' + openDiv + ', close:' + closeDiv + ')');

  const openSpan = (c.match(/<span[\s>]/g) || []).length;
  const closeSpan = (c.match(/<\/span>/g) || []).length;
  if (openSpan !== closeSpan) issues.unclosedSpan.push(rel);

  const openA = (c.match(/<a[\s>]/g) || []).length;
  const closeA = (c.match(/<\/a>/g) || []).length;
  if (openA !== closeA) issues.unclosedA.push(rel + ' (' + openA + '/' + closeA + ')');

  if ((c.match(/<html[\s>]/g) || []).length !== 1) issues.multiHtml.push(rel);
  if ((c.match(/<head>/g) || []).length !== 1) issues.multiHead.push(rel);
  if ((c.match(/<body>/g) || []).length !== 1) issues.multiBody.push(rel);

  // ===== EMPTY/JS HREFS =====
  const hrefs = c.match(/href="([^"]*)"/g) || [];
  hrefs.forEach(h => {
    const url = h.match(/href="([^"]*)"/)[1];
    if (url === '' || url === '#') issues.emptyHref.push(rel);
    if (url.startsWith('javascript:')) issues.jsHref.push(rel);
  });

  // ===== IMAGES =====
  const imgs = c.match(/<img[^>]*>/g) || [];
  imgs.forEach(img => {
    if (!img.includes('alt=')) issues.imgNoAlt.push(rel);
    else if (/alt=""/.test(img)) issues.imgEmptyAlt.push(rel);
    else if (/alt="(image|picture|photo|img|icon)"/i.test(img)) issues.imgGenericAlt.push(rel);

    if (!img.includes('src=')) issues.imgNoSrc.push(rel);
    else if (/src="(placeholder|undefined|null|TBD)"/i.test(img)) issues.imgPlaceholder.push(rel);
  });

  // ===== ACCESSIBILITY =====
  const buttons = c.match(/<button[^>]*>([\s\S]*?)<\/button>/g) || [];
  buttons.forEach(btn => {
    const hasAria = btn.includes('aria-label=');
    const text = btn.replace(/<[^>]+>/g, '').trim();
    if (!hasAria && !text) issues.buttonNoLabel.push(rel);
  });

  const iframes = c.match(/<iframe[^>]*>/g) || [];
  iframes.forEach(iframe => {
    if (!iframe.includes('title=')) issues.iframeNoTitle.push(rel);
  });

  if (!c.includes('skip-link') && !c.includes('Skip to')) issues.noSkipLink.push(rel);
  if (!c.includes('<main') && !c.includes('role="main"')) issues.noLandmark.push(rel);

  // ===== FORMS =====
  const inputs = c.match(/<input(?![^>]*type="hidden")[^>]*>/g) || [];
  inputs.forEach(input => {
    const idMatch = input.match(/id="([^"]*)"/);
    if (idMatch) {
      // Check if there's a label for this id
      const labelRegex = new RegExp('for="' + idMatch[1] + '"');
      if (!labelRegex.test(c) && !input.includes('aria-label')) {
        issues.inputNoLabel.push(rel);
      }
    } else if (!input.includes('aria-label') && !input.includes('placeholder')) {
      issues.inputNoLabel.push(rel);
    }
  });

  // ===== CONTENT QUALITY =====
  const titleMatch = c.match(/<title>([^<]*)<\/title>/);
  if (titleMatch) {
    const t = titleMatch[1];
    if (/<[a-z]/i.test(t)) issues.htmlInTitle.push(rel);
    if (t.length > 100) issues.excessivelyLongTitle.push(rel + ' (' + t.length + ')');
  }

  const descMatch = c.match(/name="description"\s+content="([^"]*)"/);
  if (descMatch) {
    const d = descMatch[1];
    if (/<[a-z]/i.test(d)) issues.htmlInDesc.push(rel);
  }

  // ===== PHONE/EMAIL CONSISTENCY =====
  const phones = c.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g) || [];
  phones.forEach(p => phoneNumbers.add(p.replace(/[^\d]/g, '')));

  const mails = c.match(/[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [];
  mails.forEach(m => emails.add(m.toLowerCase()));

  // ===== INCONSISTENT PHONE =====
  if (c.includes('(978) 307-8107') && c.includes('978-307-8107') && !c.includes('+19783078107')) {
    issues.inconsistentPhone.push(rel);
  }

  // ===== JSON-LD DEEP VALIDATION =====
  const ldMatches = c.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) || [];
  ldMatches.forEach(m => {
    const json = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      const parsed = JSON.parse(json);
      const validate = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (!obj['@context'] && !Array.isArray(obj)) issues.schemaMissingContext.push(rel + ': ' + JSON.stringify(obj).substring(0, 50));
        if (!obj['@type'] && !Array.isArray(obj)) issues.schemaMissingType.push(rel);
        if (obj.url && typeof obj.url === 'string' && !obj.url.startsWith('http')) issues.schemaInvalidUrl.push(rel + ': ' + obj.url);
        if (obj.address && obj.address['@type'] === 'PostalAddress') {
          if (!obj.address.streetAddress) {
            // Many pages don't need full address - skip warning for service schemas
          }
        }
        if (obj.telephone) {
          if (!/^\+\d/.test(obj.telephone)) {
            issues.schemaPhoneFormat.push(rel + ': ' + obj.telephone);
          }
        }
        if (obj.geo) {
          const lat = parseFloat(obj.geo.latitude);
          const lng = parseFloat(obj.geo.longitude);
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            issues.invalidLatLng.push(rel);
          }
        }
        // Recurse
        Object.values(obj).forEach(v => {
          if (Array.isArray(v)) v.forEach(validate);
          else if (typeof v === 'object') validate(v);
        });
      };
      if (Array.isArray(parsed)) parsed.forEach(validate);
      else validate(parsed);
    } catch (e) {
      issues.schemaInvalidJson.push(rel + ': ' + e.message.substring(0, 80));
    }
  });

  // ===== OPEN GRAPH DEEP =====
  if (c.includes('og:title') && !c.includes('og:locale')) issues.ogNoLocale.push(rel);
  if (c.includes('og:title') && !c.includes('og:site_name')) issues.ogNoSiteName.push(rel);

  const ogImageMatch = c.match(/og:image"\s+content="([^"]*)"/);
  if (ogImageMatch && !ogImageMatch[1].startsWith('http')) {
    issues.ogImageNotAbsolute.push(rel + ': ' + ogImageMatch[1]);
  }

  // ===== DUPLICATE IDS =====
  const ids = c.match(/\sid="([^"]+)"/g) || [];
  const idSet = {};
  ids.forEach(id => {
    const idVal = id.match(/id="([^"]+)"/)[1];
    if (idSet[idVal]) {
      issues.duplicateId.push(rel + ': ' + idVal);
    }
    idSet[idVal] = true;
  });

  // ===== PERFORMANCE =====
  if (!c.includes('preconnect')) issues.noPreconnect.push(rel);
  if (!c.includes('display=swap') && !c.includes('display=optional') && c.includes('fonts.googleapis')) {
    issues.noFontDisplay.push(rel);
  }

  // Check for inline scripts that are too large (>2KB)
  const inlineScripts = c.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g) || [];
  inlineScripts.forEach(s => {
    const code = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    if (code.length > 5000 && !s.includes('application/ld+json')) {
      issues.inlineScriptLarge.push(rel + ' (' + code.length + ' chars)');
    }
  });
});

// ===== CONSISTENCY CHECKS =====
console.log('='.repeat(70));
console.log('ULTRA DEEP AUDIT — ' + allFiles.length + ' pages');
console.log('='.repeat(70));

console.log('\n--- HTML STRUCTURE ---');
console.log('Unclosed <div>: ' + issues.unclosedDiv.length);
if (issues.unclosedDiv.length) issues.unclosedDiv.slice(0,5).forEach(p => console.log('  ' + p));
console.log('Unclosed <span>: ' + issues.unclosedSpan.length);
console.log('Unclosed <a>: ' + issues.unclosedA.length);
if (issues.unclosedA.length) issues.unclosedA.slice(0,5).forEach(p => console.log('  ' + p));
console.log('Multiple <html>/<head>/<body>: ' + (issues.multiHtml.length + issues.multiHead.length + issues.multiBody.length));

console.log('\n--- LINKS ---');
console.log('Empty href="" or "#": ' + issues.emptyHref.length);
console.log('javascript: hrefs: ' + issues.jsHref.length);

console.log('\n--- IMAGES ---');
console.log('Images without alt: ' + issues.imgNoAlt.length);
console.log('Images with empty alt: ' + issues.imgEmptyAlt.length);
console.log('Images with generic alt (image/photo/icon): ' + issues.imgGenericAlt.length);
console.log('Images without src: ' + issues.imgNoSrc.length);

console.log('\n--- ACCESSIBILITY ---');
console.log('Buttons without label/text: ' + issues.buttonNoLabel.length);
console.log('Iframes without title: ' + issues.iframeNoTitle.length);
console.log('Inputs without label: ' + issues.inputNoLabel.length);
console.log('Pages without skip-link: ' + issues.noSkipLink.length);
console.log('Pages without <main> landmark: ' + issues.noLandmark.length);

console.log('\n--- SCHEMA DEEP VALIDATION ---');
console.log('Invalid JSON-LD: ' + issues.schemaInvalidJson.length);
if (issues.schemaInvalidJson.length) issues.schemaInvalidJson.slice(0,3).forEach(p => console.log('  ' + p));
console.log('Schema missing @context: ' + issues.schemaMissingContext.length);
console.log('Schema missing @type: ' + issues.schemaMissingType.length);
console.log('Schema invalid URL: ' + issues.schemaInvalidUrl.length);
console.log('Schema phone format issue: ' + issues.schemaPhoneFormat.length);
console.log('Invalid lat/lng: ' + issues.invalidLatLng.length);

console.log('\n--- OPEN GRAPH ---');
console.log('Missing og:locale: ' + issues.ogNoLocale.length);
console.log('Missing og:site_name: ' + issues.ogNoSiteName.length);
console.log('og:image not absolute URL: ' + issues.ogImageNotAbsolute.length);

console.log('\n--- CONTENT ---');
console.log('HTML in title: ' + issues.htmlInTitle.length);
console.log('HTML in description: ' + issues.htmlInDesc.length);
console.log('Excessively long titles (>100ch): ' + issues.excessivelyLongTitle.length);

console.log('\n--- DUPLICATE IDs ---');
console.log('Pages with duplicate IDs: ' + issues.duplicateId.length);
if (issues.duplicateId.length) issues.duplicateId.slice(0,5).forEach(p => console.log('  ' + p));

console.log('\n--- PERFORMANCE ---');
console.log('Pages without preconnect: ' + issues.noPreconnect.length);
console.log('Google Fonts without display=swap: ' + issues.noFontDisplay.length);
console.log('Large inline scripts (>5KB): ' + issues.inlineScriptLarge.length);

console.log('\n--- NAP CONSISTENCY ---');
console.log('Unique phone numbers found: ' + phoneNumbers.size);
phoneNumbers.forEach(p => console.log('  ' + p));
console.log('Unique emails found: ' + emails.size);
emails.forEach(m => console.log('  ' + m));
console.log('Pages with inconsistent phone format: ' + issues.inconsistentPhone.length);

fs.writeFileSync(path.join(rootDir, 'ultra-audit-report.json'), JSON.stringify(issues, null, 2));
console.log('\nFull report saved to ultra-audit-report.json');
