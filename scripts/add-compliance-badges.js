/**
 * E05 — Adiciona seção "Compliance & Credentials Badges" nas páginas
 * estratégicas (top 11 páginas comerciais). Boost grande em E-E-A-T/trust.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Páginas-alvo (não nas 1.824 — apenas as comerciais de alta intenção)
const targetPages = [
  'about.html',
  'contact.html',
  'healthcare-facilities.html',
  'pricing.html',
  'atp-assessment.html',
  'emergency-cleaning.html',
  'dental-office-cleaning.html',
  'assisted-living-cleaning.html',
  'covid-disinfection.html',
  'cardiology-clinic-cleaning.html',
  'urgent-care-cleaning.html',
  'dialysis-clinic-cleaning.html',
  'surgery-center-cleaning.html',
  'services/index.html',
];

const badgesSection = `
   <!-- Compliance & Credentials Badges (E-E-A-T trust signal) -->
   <section class="section" style="padding:3rem 0;background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
     <div class="container">
       <p style="text-align:center;font-size:.875rem;font-weight:600;letter-spacing:.1em;color:#64748b;text-transform:uppercase;margin-bottom:1.5rem;">Compliant · Licensed · Insured</p>
       <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;max-width:1100px;margin:0 auto;">
         <div style="text-align:center;padding:1.25rem .75rem;background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;">
           <div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">🏥</div>
           <div style="font-weight:700;color:#1a1a2e;font-size:.9rem;line-height:1.2;">CDC<br>Aligned</div>
           <div style="font-size:.7rem;color:#64748b;margin-top:.25rem;">Cleaning Guidelines</div>
         </div>
         <div style="text-align:center;padding:1.25rem .75rem;background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;">
           <div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">⚠️</div>
           <div style="font-weight:700;color:#1a1a2e;font-size:.9rem;line-height:1.2;">OSHA<br>Compliant</div>
           <div style="font-size:.7rem;color:#64748b;margin-top:.25rem;">29 CFR 1910.1030</div>
         </div>
         <div style="text-align:center;padding:1.25rem .75rem;background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;">
           <div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">🌿</div>
           <div style="font-weight:700;color:#1a1a2e;font-size:.9rem;line-height:1.2;">EPA<br>Registered</div>
           <div style="font-size:.7rem;color:#64748b;margin-top:.25rem;">List N Disinfectants</div>
         </div>
         <div style="text-align:center;padding:1.25rem .75rem;background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;">
           <div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">🔒</div>
           <div style="font-weight:700;color:#1a1a2e;font-size:.9rem;line-height:1.2;">HIPAA<br>Aware</div>
           <div style="font-size:.7rem;color:#64748b;margin-top:.25rem;">Privacy Protocols</div>
         </div>
         <div style="text-align:center;padding:1.25rem .75rem;background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;">
           <div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">📜</div>
           <div style="font-weight:700;color:#1a1a2e;font-size:.9rem;line-height:1.2;">MA Licensed</div>
           <div style="font-size:.7rem;color:#64748b;margin-top:.25rem;">HIC #213341</div>
         </div>
         <div style="text-align:center;padding:1.25rem .75rem;background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06);border:1px solid #e2e8f0;">
           <div style="font-size:1.75rem;margin-bottom:.25rem;" aria-hidden="true">🛡️</div>
           <div style="font-weight:700;color:#1a1a2e;font-size:.9rem;line-height:1.2;">$2M Insured</div>
           <div style="font-size:.7rem;color:#64748b;margin-top:.25rem;">Liability Coverage</div>
         </div>
       </div>
     </div>
   </section>
`;

let updated = 0;

targetPages.forEach(rel => {
  const fp = path.join(rootDir, rel);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('Compliance & Credentials Badges')) return; // já tem
  if (!html.includes('<main')) {
    // Tenta inserir antes de </main> ou no início do body
    if (html.includes('</main>')) {
      html = html.replace('</main>', badgesSection + '\n </main>');
    } else {
      return;
    }
  } else {
    // Inserir logo após o primeiro <section> dentro de <main> não funciona genericamente.
    // Estratégia: inserir antes de </main> (no fim do conteúdo).
    html = html.replace('</main>', badgesSection + '\n </main>');
  }
  fs.writeFileSync(fp, html);
  updated++;
});

console.log('Compliance badges adicionados em ' + updated + ' páginas');
