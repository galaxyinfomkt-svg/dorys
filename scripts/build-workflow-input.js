/* Build the enriched input for the location-uniqueness workflow:
   one entry per rewrite target with {slug,name,county,nearby[],angle}. */
const fs = require("fs");

const targets = JSON.parse(fs.readFileSync("scripts/location-targets.json", "utf8"));
const cityArr = JSON.parse(fs.readFileSync("data/cities.json", "utf8")).cities || [];
const bySlug = new Map(cityArr.map(c => [c.slug, c]));

// Authoritative per-page enrichment from the location body itself.
function fromPage(slug) {
  let html = "";
  try { html = JSON.parse(fs.readFileSync("data/locations/" + slug + ".json", "utf8")).mainHtml || ""; }
  catch { return {}; }
  const county = (html.match(/part of ([A-Z][a-z]+) County/) || [])[1];
  // nearby cities: links under the "Nearby Cities" section
  const ci = html.indexOf("near-cities__list");
  let nearby = [];
  if (ci >= 0) {
    const seg = html.slice(ci, ci + 1600);
    nearby = [...seg.matchAll(/\/locations\/([a-z0-9-]+)-ma"/g)]
      .map(m => m[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    nearby = [...new Set(nearby)].slice(0, 5);
  }
  const name = (html.match(/<h1[^>]*>Healthcare Cleaning Services in ([^,<]+)/) || [])[1];
  return { county, nearby, name };
}

const ANGLES = [
  "compliance-first: lead with audit/OSHA/infection-control stakes for local facilities",
  "county-context: lead with the county's healthcare landscape and character",
  "nearby-region: lead with proximity and rapid response across neighboring towns",
  "facility-mix: lead with the specific mix of facility types served locally",
  "continuity-accountability: lead with documentation, reliability, administrator peace-of-mind",
  "demographics-shift: lead with aging population and the shift to outpatient/ambulatory care",
];

const out = targets.map((slug, i) => {
  const c = bySlug.get(slug) || {};
  const p = fromPage(slug);
  const name = p.name || c.name || slug.replace(/-ma$/, "").replace(/\b\w/g, m => m.toUpperCase()).replace(/-/g, " ");
  const nearby = (p.nearby && p.nearby.length ? p.nearby : (c.nearby || [])).slice(0, 4);
  return {
    slug,
    name,
    county: p.county || c.county || "Massachusetts",
    nearby,
    angle: ANGLES[i % ANGLES.length],
  };
});
const missing = out.filter(o => o.county === "Massachusetts" || !o.nearby.length);
console.log("entries missing county/nearby:", missing.length, missing.slice(0, 5).map(m => m.slug).join(", "));

fs.writeFileSync("scripts/location-workflow-input.json", JSON.stringify(out));
console.log("targets:", out.length);
console.log("sample:", JSON.stringify(out[0]), "\n       ", JSON.stringify(out[1]));
console.log("bytes:", fs.statSync("scripts/location-workflow-input.json").size);
