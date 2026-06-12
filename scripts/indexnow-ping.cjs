#!/usr/bin/env node
/**
 * indexnow-ping.cjs — push URLs to IndexNow (Bing / Copilot / Yandex) so new or
 * updated pages get indexed fast, which helps them surface in AI answers sooner.
 *
 * Key file lives at /public/<KEY>.txt and must stay deployed.
 *
 * Usage:
 *   node scripts/indexnow-ping.cjs https://doryscleaningservices.com/ https://doryscleaningservices.com/healthcare-cleaning-massachusetts-guide
 *   node scripts/indexnow-ping.cjs --sitemap        # submit every <loc> in sitemap-pages.xml
 */
const fs = require("fs")
const path = require("path")
const https = require("https")

const HOST = "doryscleaningservices.com"
const KEY = "17ec18da2d5a82ed639574a69c5424da"
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

function fromSitemap() {
  const candidates = ["public/sitemap-pages.xml", "public/sitemap.xml"]
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const xml = fs.readFileSync(c, "utf8")
      return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])
    }
  }
  return []
}

let urls = process.argv.slice(2).filter((a) => !a.startsWith("--"))
if (process.argv.includes("--sitemap")) urls = fromSitemap()
if (!urls.length) {
  console.error("No URLs. Pass URLs as args or use --sitemap.")
  process.exit(1)
}
// IndexNow accepts up to 10,000 URLs per request.
urls = urls.slice(0, 10000)

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls })
const req = https.request(
  {
    host: "api.indexnow.org",
    path: "/indexnow",
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body) },
  },
  (res) => {
    let data = ""
    res.on("data", (d) => (data += d))
    res.on("end", () => console.log(`IndexNow HTTP ${res.statusCode} — submitted ${urls.length} URL(s). ${data || "(202 = accepted)"}`))
  }
)
req.on("error", (e) => { console.error("IndexNow error:", e.message); process.exit(1) })
req.write(body)
req.end()
