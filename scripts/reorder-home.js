/* Reorder the home's <section> blocks into a premium landing-page flow,
   keeping every block intact (copy, GHL form, reviews widget all preserved).
   Schemas array is untouched. Reversible via git. Run: node scripts/reorder-home.js [--write] */
const fs = require("fs");
const WRITE = process.argv.includes("--write");
const fp = "data/home.json";
const d = JSON.parse(fs.readFileSync(fp, "utf8"));
const h = d.mainHtml;

// split into preamble + 16 section blocks (each block = from its <section to next <section)
const starts = [];
const re = /<section\b[^>]*>/g; let m;
while ((m = re.exec(h))) starts.push(m.index);
if (starts.length !== 16) { console.error("expected 16 sections, found", starts.length); process.exit(1); }
const preamble = h.slice(0, starts[0]);
const blocks = starts.map((s, i) => h.slice(s, i + 1 < starts.length ? starts[i + 1] : h.length));

// new landing order (0-based indices of current sections)
// 1 hero, 2 trust, 7 stats, 5 services, 10 benefits, 3 why-needs, 4 why-exp,
// 6 process, 8 about, 9 cities, 14 map, 11 reviews, 13 blog, 15 FAQ, 12 form, 16 cta
const order = [0, 1, 6, 4, 9, 2, 3, 5, 7, 8, 13, 10, 12, 14, 11, 15];
if (new Set(order).size !== 16) { console.error("order must contain all 16 indices once"); process.exit(1); }

const reordered = preamble + order.map(i => blocks[i]).join("");
// sanity: same length (no content lost), same form/schema markers
const lenOk = Math.abs(reordered.length - h.length) < 5; // only whitespace joins differ
const formsOk = (reordered.match(/leadconnector/g) || []).length === (h.match(/leadconnector/g) || []).length;
console.log("blocks:", blocks.length, "| length preserved:", lenOk, "(", h.length, "->", reordered.length, ")", "| forms preserved:", formsOk);

d.mainHtml = reordered;
if (WRITE && lenOk && formsOk) { fs.writeFileSync(fp, JSON.stringify(d) + "\n"); console.log("APPLIED"); }
else if (WRITE) console.error("ABORTED — integrity check failed");
else console.log("DRY RUN (pass --write)");
