/* Map the location-page body: list section headings, and measure which
   prose blocks are byte-identical across cities (those are the duplicated
   copy to uniquify). Also emit the list of 232 duplicate target slugs. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = "data/locations";
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".json") && f !== "index.json");

// 1) Heading outline of one page
const sample = JSON.parse(fs.readFileSync(path.join(DIR, "marlborough-ma.json"), "utf8"));
const heads = [...sample.mainHtml.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/g)]
  .map(m => `${m[1]}: ${m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()}`);
console.log("=== LOCATION BODY OUTLINE (marlborough) ===");
heads.forEach(h => console.log("  " + h));

// 2) Split each page body into <p> paragraphs; hash each (city-stripped) and
//    count how many cities share it -> high count = templated/duplicated prose.
const paraCount = new Map();   // hash -> {count, sample}
const allCityNames = files.map(f => f.replace(/\.json$/, "").replace(/-ma$/, "").replace(/-/g, " "));
const cityRe = new RegExp("\\b(" + allCityNames.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + "|ma)\\b", "gi");

for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  const paras = [...(d.mainHtml || "").matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map(m => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()).filter(p => p.length > 40);
  for (const p of paras) {
    const norm = p.toLowerCase().replace(cityRe, "§").replace(/[0-9]+/g, "#").replace(/[^a-z§#]+/g, " ").replace(/\s+/g, " ").trim();
    const h = crypto.createHash("md5").update(norm).digest("hex");
    if (!paraCount.has(h)) paraCount.set(h, { count: 0, sample: p.slice(0, 90) });
    paraCount.get(h).count++;
  }
}
console.log("\n=== MOST-DUPLICATED PARAGRAPHS (shared across N cities) ===");
[...paraCount.values()].sort((a, b) => b.count - a.count).slice(0, 12)
  .forEach(v => console.log(`  x${String(v.count).padStart(3)}  "${v.sample}…"`));

// 3) identify duplicate targets: cluster by full city-stripped body, keep 1 per cluster
const clusters = new Map();
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  let t = (d.mainHtml || "").replace(/<[^>]+>/g, " ").toLowerCase().replace(cityRe, "§").replace(/[0-9]+/g, "#").replace(/[^a-z§#]+/g, " ").replace(/\s+/g, " ").trim();
  const h = crypto.createHash("md5").update(t).digest("hex");
  if (!clusters.has(h)) clusters.set(h, []);
  clusters.get(h).push(f.replace(/\.json$/, ""));
}
const targets = [];
for (const members of clusters.values()) {
  members.sort();
  targets.push(...members.slice(1)); // keep first as representative, rewrite the rest
}
console.log("\n=== TARGETS ===");
console.log("clusters:", clusters.size, "| total pages:", files.length, "| rewrite targets:", targets.length);
fs.writeFileSync("scripts/location-targets.json", JSON.stringify(targets, null, 0));
console.log("wrote scripts/location-targets.json (" + targets.length + " slugs)");
