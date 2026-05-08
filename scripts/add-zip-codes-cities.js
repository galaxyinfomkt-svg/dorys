/**
 * C02 — Adiciona zip codes específicos nas top 50 city pages MA.
 * Insere uma frase contextual mencionando os ZIPs que servem na cidade,
 * boost grande em Local SEO + NAP signal.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Zip codes principais por cidade (top MA cities). Lista curada pra precisão.
const cityZips = {
  'boston': '02108-02136',
  'cambridge': '02138-02142',
  'worcester': '01601-01610',
  'springfield': '01101-01199',
  'lowell': '01850-01854',
  'brockton': '02301-02305',
  'new-bedford': '02740-02746',
  'quincy': '02169-02171',
  'lynn': '01901-01910',
  'fall-river': '02720-02724',
  'newton': '02458-02468',
  'somerville': '02143-02145',
  'lawrence': '01840-01843',
  'framingham': '01701-01704',
  'haverhill': '01830-01835',
  'waltham': '02451-02454',
  'malden': '02148',
  'medford': '02153-02155',
  'taunton': '02780-02783',
  'chicopee': '01013-01022',
  'weymouth': '02188-02191',
  'revere': '02151',
  'peabody': '01960',
  'methuen': '01844',
  'barnstable': '02601-02635',
  'pittsfield': '01201-01203',
  'attleboro': '02703',
  'arlington': '02474-02476',
  'everett': '02149',
  'salem': '01970',
  'westfield': '01085-01086',
  'leominster': '01453',
  'fitchburg': '01420',
  'beverly': '01915',
  'holyoke': '01040-01041',
  'marlborough': '01752',
  'woburn': '01801',
  'amherst': '01002-01003',
  'braintree': '02184-02185',
  'shrewsbury': '01545',
  'chelsea': '02150',
  'andover': '01810',
  'natick': '01760',
  'randolph': '02368',
  'watertown': '02472',
  'franklin': '02038',
  'gloucester': '01930',
  'north-attleborough': '02760-02763',
  'agawam': '01001',
  'milford': '01757',
  'needham': '02492-02494',
  'wellesley': '02481-02482',
  'norwood': '02062',
  'dedham': '02026-02027',
  'lexington': '02420-02421',
  'belmont': '02478',
  'plymouth': '02360-02362',
  'westborough': '01581-01582',
  'hopkinton': '01748',
  'concord': '01742',
  'sudbury': '01776',
};

const locDir = path.join(rootDir, 'locations');

let updated = 0;

Object.entries(cityZips).forEach(([slug, zips]) => {
  const fp = path.join(locDir, slug + '-ma.html');
  if (!fs.existsSync(fp)) return;

  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('ZIP code')) return; // já tem

  const cityName = slug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  // Inserir um bloco com info ZIP/local antes da seção Maps (que sempre tem `Service Area:`)
  const block = `        <section class="section" style="padding:2rem 0;background:#fff;">
          <div class="container">
            <div style="max-width:800px;margin:0 auto;background:#f0f4ff;border-left:4px solid #2b70e4;padding:1.25rem 1.5rem;border-radius:0 8px 8px 0;">
              <p style="margin:0;color:#1a365d;line-height:1.7;"><strong>Local Service Coverage:</strong> Dory's Cleaning Services covers all healthcare facilities in ${cityName}, MA — including ZIP code${zips.includes('-') ? 's' : ''} <strong>${zips}</strong>. From medical offices on Main Street to specialty clinics in surrounding neighborhoods, our team responds within 24 hours for free assessments. Call <a href="tel:+19783078107" style="color:#2b70e4;font-weight:600;">(978) 307-8107</a>.</p>
            </div>
          </div>
        </section>
`;

  // Inserir antes da seção "Service Area: ..." (Maps embed)
  if (html.includes('Service Area:')) {
    html = html.replace(/(\s*<section[^>]*>\s*<div class="container">\s*<h2[^>]*>Service Area:)/, block + '$1');
  } else {
    // Fallback: inserir antes de </main>
    html = html.replace('</main>', block + ' </main>');
  }

  fs.writeFileSync(fp, html);
  updated++;
});

console.log('Zip codes adicionados em ' + updated + ' city pages (top MA cities)');
