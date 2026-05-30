// Playwright full-page capture in readable viewport slices (scrolls down,
// shoots each ~1000px band). Passes the Vercel bot-challenge (runs JS).
// Usage: node scripts/shoot.js <url> <prefix> [maxSlices]
const { chromium } = require("playwright");

(async () => {
  const url = process.argv[2] || "https://doryscleaningservices.com/";
  const prefix = process.argv[3] || "shot";
  const maxSlices = parseInt(process.argv[4] || "8", 10);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  try { await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }); }
  catch (e) { await page.waitForTimeout(2000); }
  await page.waitForTimeout(3500);
  console.log("title:", await page.title());

  const total = await page.evaluate(() => document.body.scrollHeight);
  const vh = 1000;
  const slices = Math.min(maxSlices, Math.ceil(total / vh));
  console.log("page height:", total, "| slices:", slices);
  for (let i = 0; i < slices; i++) {
    await page.evaluate(y => window.scrollTo(0, y), i * vh);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `_pw_${prefix}_${String(i).padStart(2, "0")}.png` });
  }
  await browser.close();
  console.log("done");
})().catch(e => { console.error("ERR:", e.message); process.exit(1); });
