/* Apply the workflow's unique prose into each location page's
   local-context section. Usage: node scripts/splice-uniqueness.js <results.json> [--write]
   results.json = [{slug, paras:[p1,p2,p3]}] */
const fs = require("fs");
const path = require("path");

const RESULTS = process.argv[2];
const WRITE = process.argv.includes("--write");
if (!RESULTS) { console.error("pass results json path"); process.exit(1); }

const results = JSON.parse(fs.readFileSync(RESULTS, "utf8"));
const DIR = "data/locations";
const PSTYLE = "font-size:1.0625rem;line-height:1.75;color:#475569;margin-bottom:1.5rem;";

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let ok = 0, skip = 0, bad = [];
for (const r of results) {
  if (!r || !r.slug || !Array.isArray(r.paras) || r.paras.length !== 3) { skip++; bad.push(r && r.slug); continue; }
  const file = path.join(DIR, r.slug + ".json");
  if (!fs.existsSync(file)) { skip++; bad.push(r.slug + "(missing file)"); continue; }
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const html = d.mainHtml || "";
  const re = /<section class="section local-context-section">([\s\S]*?)<\/section>/;
  const m = html.match(re);
  if (!m) { skip++; bad.push(r.slug + "(no context section)"); continue; }
  // preserve the original H2 exactly
  const h2 = (m[1].match(/<h2[\s\S]*?<\/h2>/) || [`<h2 class="section__title" style="margin-bottom:1.5rem;">${d.city} Healthcare Cleaning Context</h2>`])[0];
  const paras = r.paras.map(p => `<p style="${PSTYLE}">${esc(p.trim())}</p>`).join("\n ");
  const section = `<section class="section local-context-section">\n <div class="container container--narrow">\n ${h2}\n ${paras}\n</div>\n </section>`;
  d.mainHtml = html.replace(re, section);
  if (WRITE) fs.writeFileSync(file, JSON.stringify(d) + "\n");
  ok++;
}
console.log(WRITE ? "APPLIED" : "DRY RUN (pass --write)");
console.log("spliced:", ok, "| skipped:", skip);
if (bad.length) console.log("issues:", bad.slice(0, 20).join(", "));
