/* Inject a LocalBusiness JSON-LD node into every location page that lacks one,
   using the company's REAL, existing NAP (from the home Organization schema)
   + areaServed = the page's city. No invented data. Skips pages that already
   have LocalBusiness (framingham/hudson). Run: node scripts/add-localbusiness.js [--write] */
const fs = require("fs");
const path = require("path");

const WRITE = process.argv.includes("--write");
const DIR = "data/locations";

// Real business facts (verbatim from data/home.json Organization)
const NAP = {
  name: "Dory's Cleaning Services Inc.",
  image: "https://doryscleaningservices.com/assets/images/services/medical-office-new.webp",
  telephone: "+1-978-307-8107",
  email: "contact@doryscleaningservices.com",
  priceRange: "$",
  address: { "@type": "PostalAddress", addressLocality: "Marlborough", addressRegion: "MA", postalCode: "01752", addressCountry: "US" },
  geo: { "@type": "GeoCoordinates", latitude: 42.3459, longitude: -71.5523 },
  hours: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "05:00", closes: "19:00" },
};

function hasType(o, t) {
  const ty = o && o["@type"];
  return ty === t || (Array.isArray(ty) && ty.includes(t));
}

function buildLB(city, canonical) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": canonical + "#business",
    name: NAP.name,
    image: NAP.image,
    url: canonical,
    telephone: NAP.telephone,
    email: NAP.email,
    priceRange: NAP.priceRange,
    address: NAP.address,
    geo: NAP.geo,
    areaServed: { "@type": "City", name: city + ", MA" },
    openingHoursSpecification: NAP.hours,
  };
}

let added = 0, skipped = 0, bad = [];
for (const fn of fs.readdirSync(DIR)) {
  if (!fn.endsWith(".json") || fn === "index.json") continue;
  const fp = path.join(DIR, fn);
  const d = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (!Array.isArray(d.schemas)) { bad.push(fn + "(no schemas[])"); continue; }
  if (d.schemas.some(o => hasType(o, "LocalBusiness"))) { skipped++; continue; }
  const city = d.city || fn.replace(/-ma\.json$/, "").replace(/-/g, " ");
  const canonical = d.canonical || ("https://doryscleaningservices.com/locations/" + fn.replace(/\.json$/, ""));
  d.schemas.push(buildLB(city, canonical));
  if (WRITE) fs.writeFileSync(fp, JSON.stringify(d) + "\n");
  added++;
}

console.log(WRITE ? "APPLIED" : "DRY RUN (pass --write)");
console.log("LocalBusiness added:", added, "| already had it (skipped):", skipped, "| total:", added + skipped);
if (bad.length) console.log("issues:", bad.join(", "));
// validate one sample
const sample = JSON.parse(fs.readFileSync(path.join(DIR, "abington-ma.json"), "utf8"));
const lb = sample.schemas.find(o => hasType(o, "LocalBusiness"));
console.log("sample (abington) LocalBusiness present:", !!lb, lb ? "| areaServed=" + JSON.stringify(lb.areaServed) : "");
