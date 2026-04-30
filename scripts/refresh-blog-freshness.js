/**
 * Atualiza dateModified dos posts de blog pra hoje (2026-04-30)
 * pra emitir sinal de freshness pro Google.
 */
const fs = require('fs');
const path = require('path');

const blogDir = path.resolve(__dirname, '../blog');
const today = '2026-04-30';

let updated = 0;

fs.readdirSync(blogDir).forEach(file => {
  if (!file.endsWith('.html') || file === 'index.html') return;
  const fp = path.join(blogDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;

  // Atualiza "dateModified": "..." JSON-LD field
  html = html.replace(/"dateModified":\s*"[^"]+"/, '"dateModified": "' + today + '"');

  if (html !== orig) {
    fs.writeFileSync(fp, html);
    updated++;
  }
});

// Atualiza RSS feed lastBuildDate
const feedPath = path.resolve(__dirname, '../feed.xml');
if (fs.existsSync(feedPath)) {
  let feed = fs.readFileSync(feedPath, 'utf8');
  const now = new Date('2026-04-30T15:30:00Z').toUTCString();
  feed = feed.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>/, '<lastBuildDate>' + now + '</lastBuildDate>');
  fs.writeFileSync(feedPath, feed);
  console.log('RSS feed lastBuildDate atualizado');
}

console.log('Blog freshness atualizado em ' + updated + ' posts');
