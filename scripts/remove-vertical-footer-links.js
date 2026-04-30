/**
 * Reverter: remover os 4 links de páginas verticais do rodapé.
 * Mantém as páginas existindo, mas sem link no rodapé/menu.
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

const linksToRemove = [
  '<li><a href="/cardiology-clinic-cleaning">Cardiology Clinics</a></li>',
  '<li><a href="/urgent-care-cleaning">Urgent Care</a></li>',
  '<li><a href="/dialysis-clinic-cleaning">Dialysis Clinics</a></li>',
  '<li><a href="/surgery-center-cleaning">Surgery Centers</a></li>',
];

let updated = 0;
const files = findHtml(rootDir);

files.forEach(fp => {
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;

  // Remove the block: anchor + 4 new links (with surrounding whitespace)
  // Pattern: each <li>...</li> with leading whitespace
  linksToRemove.forEach(link => {
    // Remove line including trailing newline + leading whitespace
    const re = new RegExp('\\s*' + link.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&'), 'g');
    html = html.replace(re, '');
  });

  if (html !== orig) {
    fs.writeFileSync(fp, html);
    updated++;
  }
});

console.log('Removed vertical links from footer on ' + updated + ' files');
