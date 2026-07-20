#!/usr/bin/env node
/**
 * Submit the segmented sitemaps to Google Search Console.
 *
 * Submitting each child sitemap individually — not just the index — is the whole
 * point of segmenting them. Search Console reports discovered/indexed counts per
 * submitted sitemap, so this is what lets "Tier C at 55%" (expected: those towns
 * have almost no search demand) be told apart from "Tier A at 55%" (a real
 * technical failure). With only the index submitted you get one aggregate number
 * that cannot tell you where to invest.
 *
 * Requires the service account to be a verified owner of the property.
 *
 *   node scripts/submit-sitemaps.mjs [--list]
 */
import { readFileSync } from 'node:fs'
import { createSign } from 'node:crypto'

const SA_PATH =
  process.env.GOOGLE_SA || 'C:/Users/RHAIDELINE/Downloads/RS DEVELOP NOVO/google-service-account.json'
const SITE = process.env.GSC_SITE || 'sc-domain:doryscleaningservices.com'
const BASE = 'https://doryscleaningservices.com'
const SCOPE = 'https://www.googleapis.com/auth/webmasters'

import { readdirSync } from 'node:fs'
// Derived from what the generator actually wrote, so a renamed segment can
// never be silently left unsubmitted.
const SITEMAPS = [
  'sitemap.xml',
  ...readdirSync('public').filter((f) => /^sitemap-.*\.xml$/.test(f)).sort(),
]

const b64url = (s) =>
  Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
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

  const res = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${sig}`,
    }),
  })
  const json = await res.json()
  if (!json.access_token) {
    console.error('✖ Token exchange failed:', JSON.stringify(json))
    process.exit(1)
  }
  return json.access_token
}

const api = (path) =>
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps${path}`

async function list(token) {
  const res = await fetch(api(''), { headers: { Authorization: `Bearer ${token}` } })
  const json = await res.json()
  if (!res.ok) {
    console.error(`✖ list failed (${res.status}):`, JSON.stringify(json))
    process.exit(1)
  }
  const rows = json.sitemap || []
  if (rows.length === 0) {
    console.log('  (no sitemaps currently submitted)')
    return
  }
  for (const s of rows) {
    const counts = (s.contents || [])
      .map((c) => `${c.type} submitted=${c.submitted} indexed=${c.indexed ?? '-'}`)
      .join(', ')
    console.log(
      `  ${s.path}\n    lastSubmitted=${s.lastSubmitted || '-'} lastDownloaded=${s.lastDownloaded || '-'} ` +
        `errors=${s.errors ?? 0} warnings=${s.warnings ?? 0}${counts ? `\n    ${counts}` : ''}`
    )
  }
}

async function submit(token, file) {
  const url = `${BASE}/${file}`
  const res = await fetch(api(`/${encodeURIComponent(url)}`), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 204 || res.ok) return { ok: true }
  let body = ''
  try {
    body = JSON.stringify(await res.json())
  } catch {
    body = await res.text()
  }
  return { ok: false, status: res.status, body }
}

const sa = JSON.parse(readFileSync(SA_PATH, 'utf8'))
const token = await getAccessToken(sa)
console.log(`✓ token acquired for ${sa.client_email}`)
console.log(`  property: ${SITE}\n`)

if (process.argv.includes('--list')) {
  console.log('Currently submitted:')
  await list(token)
  process.exit(0)
}

let ok = 0
for (const file of SITEMAPS) {
  const r = await submit(token, file)
  if (r.ok) {
    ok++
    console.log(`  ✓ ${file}`)
  } else {
    console.error(`  ✖ ${file} — ${r.status} ${r.body}`)
  }
}
console.log(`\nsubmitted ${ok}/${SITEMAPS.length}`)
console.log('\nCurrently submitted:')
await list(token)
