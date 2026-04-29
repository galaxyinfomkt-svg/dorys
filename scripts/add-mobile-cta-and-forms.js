/**
 * Add:
 * 1. Sticky mobile CTA bar (call now button always visible on mobile)
 * 2. Lead form to high-traffic pages that lack forms
 * 3. Improved above-the-fold conversion elements
 */

const fs = require('fs');
const path = require('path');

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

const rootDir = path.resolve(__dirname, '..');

// ============================================================
// 1. STICKY MOBILE CTA BAR — Adds call-now button always visible on mobile
// ============================================================

const stickyMobileCSS = `
<style>
/* Mobile Sticky CTA Bar - Always visible call/contact on mobile */
.mobile-sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: linear-gradient(135deg, #1a5bc4 0%, #2b70e4 100%);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
  padding: 0.625rem 0.75rem;
  display: none;
}
.mobile-sticky-cta__inner {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
  max-width: 600px;
  margin: 0 auto;
}
.mobile-sticky-cta__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.7rem 0.5rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
  min-height: 44px;
  white-space: nowrap;
}
.mobile-sticky-cta__btn--call {
  background: #f59e0b;
  color: #fff;
}
.mobile-sticky-cta__btn--call:hover { background: #d97706; }
.mobile-sticky-cta__btn--quote {
  background: #fff;
  color: #1a5bc4;
}
.mobile-sticky-cta__btn--quote:hover { background: #f1f5f9; }
.mobile-sticky-cta__btn svg { width: 18px; height: 18px; flex-shrink: 0; }
@media (max-width: 768px) {
  .mobile-sticky-cta { display: block; }
  body { padding-bottom: 70px; }
}
</style>`;

const stickyMobileHTML = `
<!-- Mobile Sticky CTA Bar -->
<div class="mobile-sticky-cta">
  <div class="mobile-sticky-cta__inner">
    <a href="tel:+19783078107" class="mobile-sticky-cta__btn mobile-sticky-cta__btn--call" data-track="cta-mobile-sticky-call" aria-label="Call (978) 307-8107">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
      Call Now
    </a>
    <a href="/contact" class="mobile-sticky-cta__btn mobile-sticky-cta__btn--quote" data-track="cta-mobile-sticky-quote">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
      Free Quote
    </a>
  </div>
</div>`;

// ============================================================
// 2. ADD STICKY CTA TO ALL PAGES (except 404, 500, privacy, terms)
// ============================================================

const allFiles = findHtml(rootDir);
let stickyAdded = 0;

allFiles.forEach(filePath => {
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');
  if (['404.html', '500.html', 'privacy.html', 'terms.html'].includes(rel)) return;

  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('mobile-sticky-cta')) return; // already added

  // Inject CSS in head and HTML before </body>
  c = c.replace('</head>', stickyMobileCSS + '\n</head>');
  c = c.replace('</body>', stickyMobileHTML + '\n</body>');

  fs.writeFileSync(filePath, c);
  stickyAdded++;
});

console.log('Mobile sticky CTA added to: ' + stickyAdded + ' pages');

// ============================================================
// 3. ADD INLINE LEAD FORM TO PAGES WITHOUT FORMS
// ============================================================

const leadFormHTML = `
<!-- Inline Lead Form for Conversion -->
<section class="section" style="background:#f8fafc;border-top:3px solid #2b70e4;">
  <div class="container container--narrow">
    <div style="background:#fff;border-radius:12px;padding:2rem;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <span style="display:inline-block;background:#f59e0b;color:#fff;padding:0.4rem 1rem;border-radius:999px;font-weight:700;font-size:0.8125rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem;">FREE Facility Assessment</span>
        <h2 style="font-size:1.75rem;color:#1e293b;margin-bottom:0.5rem;">Get Your Free Quote in 24 Hours</h2>
        <p style="color:#475569;margin:0;">22+ years clinical experience. CDC/OSHA compliant. $2M insured.</p>
      </div>
      <iframe data-src="https://api.leadconnectorhq.com/widget/form/oaN0aNeRAK8fPG4AnIzl"
        style="width:100%;height:580px;border:none;border-radius:8px;"
        id="inline-form-secondary"
        data-layout='{"id":"INLINE"}'
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Inline Lead Form"
        data-layout-iframe-id="inline-form-secondary"
        data-form-id="oaN0aNeRAK8fPG4AnIzl"
        title="Healthcare facility cleaning quote request form"></iframe>
    </div>
  </div>
</section>`;

let formsAdded = 0;
const targetPages = [
  'about.html',
  'healthcare-facilities.html',
];

// Also add to all 296 location pages
const locDir = path.join(rootDir, 'locations');
fs.readdirSync(locDir).forEach(f => {
  if (f.endsWith('.html') && f !== 'index.html') {
    targetPages.push('locations/' + f);
  }
});

targetPages.forEach(rel => {
  const filePath = path.join(rootDir, rel);
  if (!fs.existsSync(filePath)) return;

  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('inline-form-secondary')) return; // already added
  if (c.includes('leadconnectorhq.com/widget/form/oaN0aNeRAK8fPG4AnIzl') && c.includes('iframe')) {
    // Already has the main form, skip
    return;
  }

  // Insert before primary CTA section or before footer
  const insertBefore = c.indexOf('<section class="section section--primary">');
  if (insertBefore > 0) {
    c = c.substring(0, insertBefore) + leadFormHTML + '\n        ' + c.substring(insertBefore);
  } else {
    // Fallback: insert before footer
    c = c.replace('<footer', leadFormHTML + '\n<footer');
  }

  fs.writeFileSync(filePath, c);
  formsAdded++;
});

console.log('Inline lead forms added to: ' + formsAdded + ' pages');
