# Dory's Cleaning — SEO Review (local · entity · programmatic)
*Produced by running the `local-seo`, `entity-seo`, and `programmatic-seo` skills against the live site + data.*

## Scoreboard (from squirrelscan audit)
Core SEO **93** · Content **93** · Local SEO **100** · Crawlability **98** · URL Structure **100** · E-E-A-T **77**.
Foundation is strong; gains below are incremental, not rescue.

## local-seo
- ✅ **NAP consistent** sitewide: "Dory's Cleaning Services" / (978) 307-8107 / footer address.
- ✅ Real **Google Business presence** (home maps embed → *Dory's Cleaning Services Inc*, place ID `0x89e38cd4ac7b49e5:0xed4ddde42d1825ee`).
- 🔲 **Footer has no "Find us on Google" link** → add a GBP/Maps link (needs the GBP *share* URL).
- 🔲 GBP optimization (off-site, owner action): categories, services, photos, weekly posts, review velocity. Accurate NAP across 40+ directories ≈ +19% Maps visibility.

## entity-seo
- ✅ Rich entity graph on home: `Organization`, `Person` (Jeneva Thomas, founder), `WebSite`+`SearchAction`, `ContactPoint`, `AggregateRating`, `EducationalOccupationalCredential`.
- ✅ `sameAs` → Facebook, Instagram, LinkedIn.
- 🔲 **Add GBP URL to `Organization.sameAs`** (links the brand entity to its Knowledge Graph node) — needs the GBP share URL.
- 🔲 **LocalBusiness gap:** only **2 / 296** location pages carry `LocalBusiness` (rest are `WebPage`+`Service`). Service-city pages already have it.

## programmatic-seo
- ✅ **Selective indexation** (correct): 296 location `index,follow`; 1,480 service-city `noindex,follow`; 5 hubs `index`.
- ✅ **Self-canonicals** correct on every type.
- ✅ **Differentiation:** 296/296 location bodies unique (no slug-swap).
- ✅ Internal linking present (e.g. framingham → 10 service-city + 13 location links).
- ⚠️ Hub pages (`/locations`) emit 296 link children (~4.8k DOM nodes) — audit flagged; consider grouping by county.

## 🎯 Top actionable win — LocalBusiness on all 296 location pages
**What:** inject a `LocalBusiness` node into each location page's JSON-LD using the company's **real, existing NAP** (name, address, phone, geo — already in the home `Organization`/`PostalAddress`/`GeoCoordinates`) plus `areaServed: <City>, MA`. No invented data — the address is the company's real one; areaServed is the real city the page targets.
**Why:** strengthens local + entity signals on the *indexed* pages; aligns them with the service-city pages that already have it.
**Risk:** bulk schema change across 296 files → must emit valid JSON-LD and verify (GSC has flagged schema bugs here before). **Confirm before running.**

## Priority order
1. **LocalBusiness on 296 location pages** (scalable, real-data) — *needs go-ahead (bulk + SEO-sensitive)*.
2. **GBP link in footer + Organization.sameAs** — *needs the GBP share URL from you*.
3. Group `/locations` links by county (DOM/UX).
4. Specific internal-link anchor text (replace generic "learn more").
