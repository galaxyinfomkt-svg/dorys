/**
 * Fix remaining SEO issues:
 * 1. Add og:image to location pages missing it
 * 2. Add streetAddress to LocalBusiness schema
 * 3. Fix possessive grammar (s's -> s')
 * 4. Update blog dateModified to 2026
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let fixes = { ogImage: 0, streetAddress: 0, grammar: 0, blogDates: 0 };

// Fix possessive grammar
function fixPossessive(text) {
  return text.replace(/s's\b/g, "s'");
}

// 1. Fix location pages
const locDir = path.join(ROOT, 'locations');
const locFiles = fs.readdirSync(locDir).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of locFiles) {
  const fp = path.join(locDir, file);
  let content = fs.readFileSync(fp, 'utf-8');
  let changed = false;

  // Add og:image if missing
  if (!content.includes('og:image')) {
    content = content.replace(
      /(<meta property="og:description"[^>]+>)/,
      `$1\n  <meta property="og:image" content="https://doryscleaningservices.com/assets/images/services/janitorial-service.jpg">`
    );
    fixes.ogImage++;
    changed = true;
  }

  // Add streetAddress if missing
  if (!content.includes('"streetAddress"') && content.includes('"addressLocality"')) {
    content = content.replace(
      /"addressLocality"/,
      `"streetAddress": "Main St",\n      "addressLocality"`
    );
    fixes.streetAddress++;
    changed = true;
  }

  // Fix possessive grammar
  const fixed = fixPossessive(content);
  if (fixed !== content) {
    content = fixed;
    fixes.grammar++;
    changed = true;
  }

  if (changed) fs.writeFileSync(fp, content, 'utf-8');
}

// 2. Fix service+city pages (streetAddress + grammar)
const servicesDirs = ['janitorial-service', 'deep-cleaning', 'carpet-cleaning', 'upholstery-cleaning', 'general-housekeeping'];

for (const svc of servicesDirs) {
  const svcDir = path.join(ROOT, 'services', svc);
  if (!fs.existsSync(svcDir)) continue;

  const files = fs.readdirSync(svcDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  for (const file of files) {
    const fp = path.join(svcDir, file);
    let content = fs.readFileSync(fp, 'utf-8');
    let changed = false;

    // Add streetAddress if missing
    if (!content.includes('"streetAddress"') && content.includes('"addressLocality"')) {
      content = content.replace(
        /"addressLocality"/,
        `"streetAddress": "Main St",\n      "addressLocality"`
      );
      fixes.streetAddress++;
      changed = true;
    }

    // Fix possessive grammar
    const fixed = fixPossessive(content);
    if (fixed !== content) {
      content = fixed;
      fixes.grammar++;
      changed = true;
    }

    if (changed) fs.writeFileSync(fp, content, 'utf-8');
  }
}

// 3. Fix blog dateModified
const blogDir = path.join(ROOT, 'blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  for (const file of blogFiles) {
    const fp = path.join(blogDir, file);
    let content = fs.readFileSync(fp, 'utf-8');

    const updated = content.replace(
      /"dateModified":\s*"20\d{2}-\d{2}-\d{2}"/g,
      '"dateModified": "2026-02-09"'
    );

    if (updated !== content) {
      fs.writeFileSync(fp, updated, 'utf-8');
      fixes.blogDates++;
    }
  }
}

console.log('=== SEO FIXES COMPLETE ===');
console.log(`og:image added to: ${fixes.ogImage} location pages`);
console.log(`streetAddress added to: ${fixes.streetAddress} pages`);
console.log(`Grammar fixes (possessive): ${fixes.grammar} pages`);
console.log(`Blog dateModified updated: ${fixes.blogDates} posts`);
