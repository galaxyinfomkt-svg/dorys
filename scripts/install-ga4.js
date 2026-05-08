/**
 * Instala GA4 (G-2MP9G52LW7) em todas as páginas HTML.
 * - index.html: descomenta o bloco existente + troca placeholder
 * - outras páginas: insere o snippet GA4 antes de </head>
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const GA_ID = 'G-2MP9G52LW7';

const ga4Snippet = `<!-- Google Analytics 4 -->
 <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
 <script>
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('js', new Date());
   gtag('config', '${GA_ID}');
 </script>`;

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
let alreadyHad = 0;

const files = findHtml(rootDir);

files.forEach(fp => {
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;
  const isHome = path.relative(rootDir, fp) === 'index.html';

  // Caso 1: já tem GA ID real configurado (não placeholder)
  if (html.includes(GA_ID) && !html.includes('G-XXXXXXXXXX')) {
    alreadyHad++;
    return;
  }

  // Caso 2: home com bloco comentado — descomenta e troca placeholder
  if (isHome && html.includes('G-XXXXXXXXXX')) {
    // Substitui o bloco comentado pelo snippet ativo
    const commentedBlock = /<!-- Google Analytics 4[\s\S]*?-->\s*<!--\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-XXXXXXXXXX">[\s\S]*?-->/;
    if (commentedBlock.test(html)) {
      html = html.replace(commentedBlock, ga4Snippet);
    } else {
      // Fallback: troca apenas o placeholder
      html = html.replace(/G-XXXXXXXXXX/g, GA_ID);
    }
  } else {
    // Caso 3: páginas sem GA4 — inserir antes de </head>
    if (!html.includes('</head>')) return;
    html = html.replace('</head>', '  ' + ga4Snippet + '\n</head>');
  }

  if (html !== orig) {
    fs.writeFileSync(fp, html);
    updated++;
  }
});

console.log('GA4 (' + GA_ID + ') instalado em ' + updated + ' páginas');
console.log('Páginas que já tinham GA4 ativo: ' + alreadyHad);
