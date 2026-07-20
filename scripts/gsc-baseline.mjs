#!/usr/bin/env node
/**
 * Capture a Search Console baseline before the restructure moves the numbers.
 *
 * The whole point is provability. The site just went from 1,827 pages to 705,
 * and Google will spend the coming weeks reprocessing 1,122 redirects — so
 * impressions, indexed count and average position will all move regardless of
 * whether the work succeeded. Without a snapshot of the "before", there is no
 * way to tell recovery from noise, and no way to show a client what changed.
 *
 * Writes reports/seo-baseline.json. Re-runnable: each run appends a new
 * snapshot rather than overwriting, so the file becomes a time series.
 *
 *   node scripts/gsc-baseline.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createSign } from 'node:crypto'

const SA_PATH =
  process.env.GOOGLE_SA || 'C:/Users/RHAIDELINE/Downloads/RS DEVELOP NOVO/google-service-account.json'
const SITE = process.env.GSC_SITE || 'sc-domain:doryscleaningservices.com'
const OUT = join(process.cwd(), 'reports', 'seo-baseline.json')

const b64 = (s) =>
  Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

async function token() {
  const sa = JSON.parse(readFileSync(SA_PATH, 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const header = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = b64(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  )
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claim}`)
  const sig = signer
    .sign(sa.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${sig}`,
    }),
  })
  const j = await res.json()
  if (!j.access_token) {
    console.error('✖ token exchange failed:', JSON.stringify(j))
    process.exit(1)
  }
  return j.access_token
}

const iso = (d) => d.toISOString().slice(0, 10)
// Search Console data lags ~2 days; asking for today returns an empty window.
const end = new Date(Date.now() - 3 * 864e5)
const start28 = new Date(end.getTime() - 27 * 864e5)
const start90 = new Date(end.getTime() - 89 * 864e5)

async function query(tok, body) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  const j = await res.json()
  if (!res.ok) {
    console.error(`✖ query failed (${res.status}):`, JSON.stringify(j).slice(0, 300))
    return { rows: [] }
  }
  return j
}

const totals = (rows) =>
  rows.reduce(
    (a, r) => ({
      clicks: a.clicks + (r.clicks || 0),
      impressions: a.impressions + (r.impressions || 0),
    }),
    { clicks: 0, impressions: 0 }
  )

const tok = await token()

const [d28, d90, topQueries, topPages, byCountry] = await Promise.all([
  query(tok, { startDate: iso(start28), endDate: iso(end), dimensions: ['date'], rowLimit: 100 }),
  query(tok, { startDate: iso(start90), endDate: iso(end), dimensions: ['date'], rowLimit: 100 }),
  query(tok, { startDate: iso(start28), endDate: iso(end), dimensions: ['query'], rowLimit: 50 }),
  query(tok, { startDate: iso(start28), endDate: iso(end), dimensions: ['page'], rowLimit: 100 }),
  query(tok, { startDate: iso(start28), endDate: iso(end), dimensions: ['country'], rowLimit: 10 }),
])

const t28 = totals(d28.rows || [])
const t90 = totals(d90.rows || [])
const days28 = (d28.rows || []).length || 1

const avgPos = (rows) => {
  const imp = rows.reduce((a, r) => a + (r.impressions || 0), 0)
  if (!imp) return null
  return rows.reduce((a, r) => a + (r.position || 0) * (r.impressions || 0), 0) / imp
}

const snapshot = {
  capturedAt: new Date().toISOString(),
  site: SITE,
  note:
    'Captured immediately after the restructure shipped (1,827 -> 705 pages, 1,122 redirects). ' +
    'Numbers here describe the site as Google saw it BEFORE reprocessing those redirects. ' +
    'Expect indexed pages and impressions to fall over the following weeks — that is the pruning ' +
    'being absorbed, not a regression.',
  window28: {
    from: iso(start28),
    to: iso(end),
    clicks: t28.clicks,
    impressions: t28.impressions,
    clicksPerDay: +(t28.clicks / days28).toFixed(2),
    impressionsPerDay: +(t28.impressions / days28).toFixed(2),
    avgPosition: avgPos(d28.rows || []),
    ctr: t28.impressions ? +((t28.clicks / t28.impressions) * 100).toFixed(2) : 0,
  },
  window90: {
    from: iso(start90),
    to: iso(end),
    clicks: t90.clicks,
    impressions: t90.impressions,
  },
  topQueries: (topQueries.rows || []).slice(0, 25).map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    position: +(r.position || 0).toFixed(1),
  })),
  topPages: (topPages.rows || []).slice(0, 50).map((r) => ({
    page: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    position: +(r.position || 0).toFixed(1),
  })),
  byCountry: (byCountry.rows || []).map((r) => ({
    country: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
  })),
  daily: (d28.rows || []).map((r) => ({
    date: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    position: +(r.position || 0).toFixed(1),
  })),
}

mkdirSync(join(process.cwd(), 'reports'), { recursive: true })
const history = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { snapshots: [] }
history.snapshots.push(snapshot)
writeFileSync(OUT, JSON.stringify(history, null, 2) + '\n')

console.log(`baseline captured — ${iso(start28)} to ${iso(end)}`)
console.log(`  impressions ${t28.impressions} (${snapshot.window28.impressionsPerDay}/day)`)
console.log(`  clicks      ${t28.clicks} (${snapshot.window28.clicksPerDay}/day)`)
console.log(`  CTR         ${snapshot.window28.ctr}%`)
console.log(`  avg position ${snapshot.window28.avgPosition?.toFixed(1) ?? 'n/a'}`)
console.log(`  90-day: ${t90.impressions} impressions, ${t90.clicks} clicks`)
console.log(`  pages with impressions: ${(topPages.rows || []).length}`)
console.log(`\nwrote ${OUT} (snapshot ${history.snapshots.length})`)
