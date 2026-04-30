/**
 * Add 4 new vertical pages to the footer's "Our Services" section
 * across all HTML files in the repo.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

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

const newLinks = [
  '<li><a href="/cardiology-clinic-cleaning">Cardiology Clinics</a></li>',
  '<li><a href="/urgent-care-cleaning">Urgent Care</a></li>',
  '<li><a href="/dialysis-clinic-cleaning">Dialysis Clinics</a></li>',
  '<li><a href="/surgery-center-cleaning">Surgery Centers</a></li>',
].join('\n           ');

// Anchor: existing last "Our Services" link in footer
const anchor = '<li><a href="/services/healthcare-admin-offices">Healthcare Admin Offices</a></li>';
const replacement = anchor + '\n           ' + newLinks;

let updated = 0;
const files = findHtml(rootDir);
files.forEach(fp => {
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes(anchor)) return;
  if (html.includes('/cardiology-clinic-cleaning')) return; // already done
  const out = html.replace(anchor, replacement);
  if (out !== html) {
    fs.writeFileSync(fp, out);
    updated++;
  }
});

console.log('Footer Quick Links updated on ' + updated + ' files');
