/* Regroup a hub's flat .cities-grid (296 city links) into per-county sections
   so no single element has 296 children (fixes perf/dom-size "Element with 296
   children") and the directory becomes scannable by region. Real county data
   from scripts/county-map.json. Run: node scripts/group-hub-cities.js [--write] */
const fs = require("fs");
const path = require("path");

const WRITE = process.argv.includes("--write");
const county = JSON.parse(fs.readFileSync("scripts/county-map.json", "utf8")); // slug(no -ma)->County
// county-map keys are slugs WITHOUT path; values like "Worcester"
function countyOf(slug) {
  return county[slug] || county[slug.replace(/-ma$/, "")] || "Other Massachusetts";
}
// stable county order: by size desc then name
const COUNTY_ORDER = ["Worcester", "Middlesex", "Essex", "Norfolk", "Plymouth", "Bristol", "Hampden", "Hampshire", "Suffolk", "Franklin"];

const HUBS = [
  "data/services/ambulatory-outpatient/index.json",
  "data/services/healthcare-admin-offices/index.json",
  "data/services/medical-office-cleaning/index.json",
  "data/services/rehab-nursing/index.json",
  "data/services/specialty-clinics/index.json",
  "data/locations/index.json",
];

function regroup(html) {
  const re = /<div class="cities-grid">([\s\S]*?)<\/div>/;
  const m = html.match(re);
  if (!m) return { html, changed: false, count: 0 };
  const inner = m[1];
  const links = [...inner.matchAll(/<a\s+href="\/(?:services\/[a-z-]+|locations)\/([a-z0-9-]+)"[\s\S]*?<\/a>/g)];
  if (links.length < 50) return { html, changed: false, count: links.length }; // not the big directory
  const groups = {};
  for (const lk of links) {
    const c = countyOf(lk[1]);
    (groups[c] = groups[c] || []).push(lk[0]);
  }
  const order = [...COUNTY_ORDER.filter(c => groups[c]), ...Object.keys(groups).filter(c => !COUNTY_ORDER.includes(c)).sort()];
  const sections = order.map(c =>
    `<div class="county-group">\n <h3 class="county-heading">${c} County <span class="county-count">(${groups[c].length})</span></h3>\n <div class="cities-grid">\n ${groups[c].join("\n ")}\n </div>\n </div>`
  ).join("\n");
  const replacement = `<div class="cities-by-county">\n ${sections}\n </div>`;
  return { html: html.replace(re, replacement), changed: true, count: links.length, counties: order.length };
}

for (const f of HUBS) {
  if (!fs.existsSync(f)) { console.log("skip (missing):", f); continue; }
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  const r = regroup(d.mainHtml || "");
  if (r.changed) {
    d.mainHtml = r.html;
    if (WRITE) fs.writeFileSync(f, JSON.stringify(d) + "\n");
    console.log((WRITE ? "GROUPED" : "would group"), path.relative("data", f), "->", r.count, "links in", r.counties, "counties");
  } else {
    console.log("no big cities-grid in", path.relative("data", f), "(links:", r.count + ")");
  }
}
