/**
 * A05 — Adiciona meta tag ai-summary em todas as páginas HTML.
 * Esta meta tag é específica pra crawlers de IA (ChatGPT, Perplexity,
 * Google AI Overviews) entenderem o site.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const aiSummary = "Dory's Cleaning Services Inc. is a Massachusetts-based commercial healthcare facility cleaning company with more than 22 years of hands-on clinical experience. We serve 296 cities across Massachusetts, providing CDC and OSHA compliant environmental cleaning for medical offices, specialty clinics (cardiology, dental, urgent care, dialysis), ambulatory and outpatient facilities, surgery centers, rehabilitation and nursing facilities, assisted living, and healthcare administrative offices. Founded by Jeneva Thomas, MA HIC License #213341, $2,000,000 liability insurance. Services include infection control, ATP testing, terminal cleaning, COVID disinfection, biohazard cleanup, and 24/7 emergency response. Contact: (978) 307-8107 — based in Marlborough, MA 01752.";

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

let updated = 0;
const tag = '<meta name="ai-summary" content="' + aiSummary.replace(/"/g, '&quot;') + '">';
const files = findHtml(rootDir);

files.forEach(fp => {
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('name="ai-summary"')) return;
  // Inserir antes da primeira meta description ou antes de </head>
  const before = html;
  if (html.includes('name="description"')) {
    html = html.replace(/(\s*<meta\s+name="description")/, '\n  ' + tag + '$1');
  } else {
    html = html.replace('</head>', '  ' + tag + '\n</head>');
  }
  if (html !== before) {
    fs.writeFileSync(fp, html);
    updated++;
  }
});

console.log('ai-summary meta adicionada em ' + updated + ' páginas');
