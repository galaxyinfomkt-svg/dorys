/**
 * Mobile mini-fix: adicionar loading="lazy" + decoding="async" nas
 * imagens de rodapé/secundárias (mantém hero como eager+high-priority).
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

let updated = 0;
const files = findHtml(rootDir);

files.forEach(fp => {
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;

  // Footer logo: adicionar lazy + async se ainda não tiver
  // Padrão: <img src="/assets/images/logo/logo-80.webp" alt="..." class="footer__logo-img" ...>
  html = html.replace(
    /<img\s+src="\/assets\/images\/logo\/logo-80\.webp"\s+alt="[^"]*"\s+class="footer__logo-img"([^>]*?)>/g,
    (match) => {
      if (match.includes('loading=')) return match; // já feito
      return match.replace('class="footer__logo-img"', 'class="footer__logo-img" loading="lazy" decoding="async"');
    }
  );

  if (html !== orig) {
    fs.writeFileSync(fp, html);
    updated++;
  }
});

console.log('Loading=lazy adicionado em footer logos de ' + updated + ' páginas');
