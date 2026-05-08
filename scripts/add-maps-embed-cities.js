/**
 * C05 — Adiciona Google Maps embed (lazy-loaded) em todas as city pages.
 * Usa "q=" search sem API key. Iframe com loading="lazy" pra não impactar LCP.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const locDir = path.join(rootDir, 'locations');

function slugToName(slug) {
  return slug.split('-').filter(p => p !== 'ma').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

function buildMapSection(cityName) {
  const q = encodeURIComponent(cityName + ', Massachusetts');
  return `
        <section class="section" style="padding:3rem 0;background:#f8fafc;">
          <div class="container">
            <h2 class="section__title text-center mb-lg" style="margin-bottom:1.5rem;">Service Area: ${cityName}, MA</h2>
            <p class="text-center" style="max-width:720px;margin:0 auto 1.5rem;color:#475569;">Dory's Cleaning Services proudly serves healthcare facilities throughout ${cityName} and surrounding Massachusetts communities. Free facility assessment within 24 hours — call (978) 307-8107.</p>
            <div style="position:relative;width:100%;max-width:960px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);aspect-ratio:16/9;">
              <iframe loading="lazy" src="https://www.google.com/maps?q=${q}&output=embed" style="border:0;width:100%;height:100%;" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="${cityName}, MA service area map"></iframe>
            </div>
          </div>
        </section>`;
}

function processFile(fp) {
  const file = path.basename(fp);
  if (file === 'index.html') return false;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('output=embed')) return false; // já tem
  if (!html.includes('</main>')) return false;

  const slug = file.replace('.html', '');
  const cityName = slugToName(slug);

  const section = buildMapSection(cityName);
  // Inserir antes de </main>
  html = html.replace('</main>', section + '\n </main>');

  fs.writeFileSync(fp, html);
  return true;
}

let updated = 0;

// 1. /locations/*.html
fs.readdirSync(locDir).forEach(f => {
  if (!f.endsWith('.html')) return;
  if (processFile(path.join(locDir, f))) updated++;
});

console.log('Maps embed adicionado em ' + updated + ' city pages (locations/)');

// 2. /services/<svc>/<city>.html
const serviceDirs = [
  'services/medical-office-cleaning',
  'services/specialty-clinics',
  'services/ambulatory-outpatient',
  'services/rehab-nursing',
  'services/healthcare-admin-offices',
];

let updatedSvc = 0;
serviceDirs.forEach(svc => {
  const sd = path.join(rootDir, svc);
  if (!fs.existsSync(sd)) return;
  fs.readdirSync(sd).forEach(f => {
    if (!f.endsWith('.html') || f === 'index.html') return;
    if (processFile(path.join(sd, f))) updatedSvc++;
  });
});

console.log('Maps embed adicionado em ' + updatedSvc + ' service+city pages');
console.log('Total city-related pages with Maps: ' + (updated + updatedSvc));
