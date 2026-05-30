/* Strip every emoji / decorative symbol from all migrated page JSON
   (mainHtml + meta fields) and tidy the empty wrappers/whitespace left
   behind, so nothing is left crooked. Writes files in place.
   Run: node scripts/emoji-clean.js        (dry run, reports only)
        node scripts/emoji-clean.js --write (applies changes) */
const fs = require("fs");
const path = require("path");

const WRITE = process.argv.includes("--write");
const ROOT = path.join(__dirname, "..", "data");

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{2190}-\u{21FF}\u{FE0F}\u{20E3}\u{2122}\u{2139}\u{2705}\u{2713}\u{2714}\u{2716}\u{2728}\u{2764}]/gu;

const SKIP = new Set(["cities.json", "services.json", "services-categories.json",
  "services-cities.json", "blog-index.json", "locations-index.json",
  "pages-index.json"]);
const META = ["title", "description", "aiSummary", "keywords", "ogTitle",
  "ogDescription", "twitterTitle", "twitterDescription"];

function tidy(html) {
  let s = html.replace(EMOJI, "");
  // remove inline/icon wrappers that now hold only whitespace (the decorative
  // icon <div>/<span> that used to contain only an emoji)
  let prev;
  do {
    prev = s;
    s = s.replace(/<(span|div|i|em|strong|p)\b[^>]*>(\s*)<\/\1>/gi, "");
  } while (s !== prev);
  // collapse horizontal double-spaces (keep newlines/indentation intact)
  s = s.replace(/[ \t]{2,}/g, " ");
  // trim a space left dangling before a closing tag ("in Abington →" -> ...)
  s = s.replace(/ +(<\/(?:a|li|p|span|h[1-6]|strong|em|div)>)/gi, "$1");
  return s;
}

function tidyText(t) {
  return t.replace(EMOJI, "").replace(/\s{2,}/g, " ").replace(/^[\s|–—-]+/, "").trim();
}

function listJson(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "schema") out = out.concat(listJson(p)); }
    else if (e.name.endsWith(".json") && !SKIP.has(e.name)) out.push(p);
  }
  return out;
}

let touched = 0, fields = 0, bodyRemoved = 0, metaRemoved = 0;
for (const file of listJson(ROOT)) {
  const raw = fs.readFileSync(file, "utf8");
  const d = JSON.parse(raw);
  let changed = false;

  if (typeof d.mainHtml === "string") {
    const before = (d.mainHtml.match(EMOJI) || []).length;
    if (before) {
      d.mainHtml = tidy(d.mainHtml);
      bodyRemoved += before; fields++; changed = true;
    }
  }
  for (const k of META) {
    if (typeof d[k] === "string") {
      const before = (d[k].match(EMOJI) || []).length;
      if (before) { d[k] = tidyText(d[k]); metaRemoved += before; fields++; changed = true; }
    }
  }
  if (changed) {
    touched++;
    if (WRITE) fs.writeFileSync(file, JSON.stringify(d) + "\n");
  }
}

console.log(WRITE ? "APPLIED" : "DRY RUN (no files written; pass --write to apply)");
console.log("files touched   :", touched);
console.log("fields cleaned  :", fields);
console.log("emoji removed   : body=" + bodyRemoved + "  meta=" + metaRemoved + "  total=" + (bodyRemoved + metaRemoved));
