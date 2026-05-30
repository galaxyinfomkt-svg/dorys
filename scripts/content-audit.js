/* One-off content audit across every migrated page (data/**.json).
   Reports: (1) emoji usage, (2) quality artifacts, (3) content
   uniqueness for templated sets. Read-only — prints a report. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..", "data");

// --- emoji / decorative-symbol detector -----------------------------------
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{2190}-\u{21FF}\u{FE0F}\u{20E3}\u{2122}\u{2139}\u{2705}\u{2714}\u{2716}\u{2728}\u{2764}]/gu;

function emojisIn(str) {
  if (!str) return [];
  const m = str.match(EMOJI);
  return m || [];
}

// --- collect every page ----------------------------------------------------
function listJson(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(listJson(p));
    else if (e.name.endsWith(".json")) out.push(p);
  }
  return out;
}

// Page-content files only (skip *-index.json, cities.json, services.json, schema/)
const SKIP = new Set(["cities.json", "services.json", "services-categories.json",
  "services-cities.json", "blog-index.json", "locations-index.json",
  "pages-index.json", "index.json"]);

function pageType(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (rel === "home.json") return "home";
  if (rel.startsWith("locations/")) return "location";
  if (rel.startsWith("services/")) return "service:" + rel.split("/")[1];
  if (rel.startsWith("pages/")) return "root-page";
  if (rel.startsWith("blog/")) return "blog";
  return null;
}

const files = listJson(ROOT).filter(f => {
  const base = path.basename(f);
  if (SKIP.has(base)) return false;
  if (f.replace(/\\/g, "/").includes("/schema/")) return false;
  return pageType(f) !== null;
});

// --- audit ------------------------------------------------------------------
const META_FIELDS = ["title", "description", "ogTitle", "ogDescription",
  "twitterTitle", "twitterDescription", "aiSummary"];

const byType = {};            // type -> stats
const emojiCharCount = {};    // char -> count
const emojiPages = [];        // {file,type,inBody,inMeta,sample}
const artifactPages = [];     // {file,issues:[]}
const skeletons = {};         // type -> Map(skeletonHash -> [files])
const emptyBody = [];

function bump(type) {
  byType[type] = byType[type] || { pages: 0, emojiBody: 0, emojiMeta: 0, artifacts: 0 };
  return byType[type];
}

for (const file of files) {
  const type = pageType(file);
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const st = bump(type);
  st.pages++;

  const body = d.mainHtml || "";
  // emoji in body
  const bodyEmojis = emojisIn(body);
  // emoji in meta
  let metaEmojis = [];
  for (const f of META_FIELDS) metaEmojis = metaEmojis.concat(emojisIn(d[f] || ""));

  if (bodyEmojis.length) st.emojiBody++;
  if (metaEmojis.length) st.emojiMeta++;
  [...bodyEmojis, ...metaEmojis].forEach(c => emojiCharCount[c] = (emojiCharCount[c] || 0) + 1);
  if (bodyEmojis.length || metaEmojis.length) {
    emojiPages.push({
      file: path.relative(ROOT, file),
      type, body: bodyEmojis.length, meta: metaEmojis.length,
      sample: [...new Set([...bodyEmojis, ...metaEmojis])].slice(0, 12).join(" "),
    });
  }

  // quality artifacts
  const issues = [];
  if (!body || body.trim().length < 200) issues.push("body<200chars");
  for (const tok of ["{{", "}}", "undefined", "NaN", "[object Object]", "{city}", "{{city}}", "Lorem ipsum"]) {
    // }} is legit only inside <script ld+json>; strip those first
    const stripped = body.replace(/<script[^>]*ld\+json[^>]*>[\s\S]*?<\/script>/gi, "");
    const n = stripped.split(tok).length - 1;
    if (n) issues.push(`${tok}x${n}`);
  }
  if (issues.length) { st.artifacts++; artifactPages.push({ file: path.relative(ROOT, file), issues }); }

  if (!body || body.trim().length < 200) emptyBody.push(path.relative(ROOT, file));

  // --- uniqueness skeleton ---
  // strip HTML tags, lowercase, remove the city name + state, collapse digits & ws
  const city = (d.city || "").toLowerCase();
  let text = body.replace(/<script[\s\S]*?<\/script>/gi, " ")
                 .replace(/<style[\s\S]*?<\/style>/gi, " ")
                 .replace(/<[^>]+>/g, " ")
                 .toLowerCase();
  if (city) text = text.split(city).join("§");          // remove city token
  text = text.replace(/\bma\b/g, "§")                    // state
             .replace(/[0-9]+/g, "#")
             .replace(/[^a-z§#]+/g, " ")
             .replace(/\s+/g, " ").trim();
  const hash = crypto.createHash("md5").update(text).digest("hex");
  skeletons[type] = skeletons[type] || new Map();
  if (!skeletons[type].has(hash)) skeletons[type].set(hash, []);
  skeletons[type].get(hash).push(path.relative(ROOT, file));
}

// --- report -----------------------------------------------------------------
const L = (...a) => console.log(...a);
L("================ CONTENT AUDIT ================");
L("total page files:", files.length);
L("");
L("---- EMOJI / DECORATIVE SYMBOLS ----");
L("distinct symbols found:", Object.keys(emojiCharCount).length);
Object.entries(emojiCharCount).sort((a, b) => b[1] - a[1]).forEach(([c, n]) =>
  L(`   ${c}  U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}  x${n}`));
L("");
L("pages with emoji, by type (body = visible on page, meta = title/og/desc):");
Object.entries(byType).sort().forEach(([t, s]) =>
  L(`   ${t.padEnd(28)} pages:${String(s.pages).padStart(5)}  emojiBody:${String(s.emojiBody).padStart(5)}  emojiMeta:${String(s.emojiMeta).padStart(5)}`));
L("");
L("---- QUALITY ARTIFACTS ----");
L("pages with artifacts:", artifactPages.length);
artifactPages.slice(0, 25).forEach(p => L(`   ${p.file}: ${p.issues.join(", ")}`));
if (artifactPages.length > 25) L(`   …+${artifactPages.length - 25} more`);
L("empty/thin body (<200 chars):", emptyBody.length);
emptyBody.slice(0, 15).forEach(f => L("   " + f));
L("");
L("---- CONTENT UNIQUENESS (templated sets) ----");
L("'distinct skeletons' = unique page structures after removing city/state/digits.");
L("If a 296-page set has only 1 skeleton, every page is the SAME text with the city swapped.");
Object.entries(skeletons).sort().forEach(([t, map]) => {
  const total = [...map.values()].reduce((a, v) => a + v.length, 0);
  const distinct = map.size;
  const biggest = Math.max(...[...map.values()].map(v => v.length));
  L(`   ${t.padEnd(28)} pages:${String(total).padStart(5)}  distinctSkeletons:${String(distinct).padStart(5)}  largestCluster:${String(biggest).padStart(5)}`);
});
L("");
L("Interpretation: distinctSkeletons ≈ pages  → highly unique.");
L("                distinctSkeletons = 1       → pure slug-swap (duplicate content).");
