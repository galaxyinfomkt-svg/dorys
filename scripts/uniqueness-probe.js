/* Measure TRUE text uniqueness: re-cluster service/location bodies after
   stripping EVERY MA city name (not just the page's own), so pages that
   differ only by their auto-generated "nearby cities" list collapse. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// gather all MA city names from the data we have
const names = new Set();
function addName(s) {
  if (typeof s !== "string") return;
  const n = s.toLowerCase().replace(/-ma$/, "").replace(/-/g, " ").trim();
  if (n.length > 2) names.add(n);
}
// from location filenames (authoritative list of slugs)
for (const fn of fs.readdirSync("data/locations")) {
  if (fn.endsWith(".json") && fn !== "index.json") addName(fn.replace(/\.json$/, ""));
}
const list = [...names].sort((a, b) => b.length - a.length) // longest first
  .map(c => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const cityRe = new RegExp("\\b(" + list.join("|") + ")\\b", "g");

function skel(body, own, stripAll) {
  let t = (body || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
  if (own) t = t.split(own).join(" ");
  if (stripAll) t = t.replace(cityRe, " ");
  t = t.replace(/\bma\b/g, " ").replace(/[0-9]+/g, "#")
       .replace(/[^a-z#]+/g, " ").replace(/\s+/g, " ").trim();
  return crypto.createHash("md5").update(t).digest("hex");
}

function analyze(dir, stripAll) {
  const map = new Map();
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith(".json") || fn === "index.json") continue;
    const d = JSON.parse(fs.readFileSync(path.join(dir, fn), "utf8"));
    const h = skel(d.mainHtml, (d.city || "").toLowerCase(), stripAll);
    map.set(h, (map.get(h) || 0) + 1);
  }
  const sizes = [...map.values()];
  return { distinct: map.size, total: sizes.reduce((a, b) => a + b, 0), max: Math.max(...sizes) };
}

console.log("MA city names loaded for stripping:", names.size);
const sets = ["medical-office-cleaning", "ambulatory-outpatient", "rehab-nursing",
  "specialty-clinics", "healthcare-admin-offices"].map(c => ["data/services/" + c, c]);
sets.push(["data/locations", "locations"]);

for (const [dir, label] of sets) {
  const a = analyze(dir, false);
  const b = analyze(dir, true);
  console.log("\n" + label);
  console.log("   own-city stripped : " + String(a.distinct).padStart(4) + " distinct / " + a.total + " (largest cluster " + a.max + ")");
  console.log("   ALL cities stripped: " + String(b.distinct).padStart(4) + " distinct / " + b.total + " (largest cluster " + b.max + ")  <- TRUE unique copy");
  console.log("   => " + (b.total - b.distinct) + " pages are duplicate copy of another (only city/nearby-list differs)");
}
