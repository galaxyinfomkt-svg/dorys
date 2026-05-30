/* Convert lazy `data-src` iframes (GHL form + reputationhub reviews widget)
   to native `src` + loading="lazy". The legacy JS lazy-loader (main.js) that
   swapped data-src->src does not fire reliably under Next.js, so the iframes
   never loaded — leaving big empty white boxes (hero form + testimonials).
   Native src + loading="lazy" loads them without JS; fixed heights keep CLS.
   Run: node scripts/fix-iframe-load.js [--write] */
const fs = require("fs");
const path = require("path");
const WRITE = process.argv.includes("--write");

function fixIframes(html) {
  let n = 0;
  const out = html.replace(/<iframe\b([^>]*?)>/g, (full, attrs) => {
    let a = attrs;
    if (/\sdata-src=/.test(a) && !/\ssrc=/.test(a)) { a = a.replace(/\sdata-src=/, " src="); n++; }
    if (!/\sloading=/.test(a)) a = ' loading="lazy"' + a;
    return "<iframe" + a + ">";
  });
  return { out, n };
}

let files = 0, iframes = 0;
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== "schema") walk(p); }
    else if (e.name.endsWith(".json")) {
      let j; try { j = JSON.parse(fs.readFileSync(p, "utf8")); } catch { continue; }
      if (!j.mainHtml || !j.mainHtml.includes("data-src")) continue;
      const r = fixIframes(j.mainHtml);
      if (r.n) { files++; iframes += r.n; j.mainHtml = r.out; if (WRITE) fs.writeFileSync(p, JSON.stringify(j) + "\n"); }
    }
  }
}
walk("data");
console.log(WRITE ? "APPLIED" : "DRY RUN (pass --write)");
console.log("files:", files, "| iframes converted (data-src->src):", iframes);
