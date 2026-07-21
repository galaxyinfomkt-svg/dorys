import { NextResponse, type NextRequest } from "next/server"
import pruned from "@/data/redirects-pruned-cities.json"

/**
 * Legacy URL consolidation.
 *
 * Two things happen here, both 301:
 *
 *  1. The 187 pruned place names. 31 of them were villages or neighbourhoods of
 *     a municipality we do serve (Nonantum -> Newton, Waverley -> Belmont), and
 *     those redirect to the parent page because the content is genuinely
 *     equivalent. The rest were towns outside the operating radius; they go to
 *     /locations. Google may score those as soft 404s, which is the honest
 *     outcome — the content is gone, not moved — and the visitor still lands on
 *     the real service area rather than an error.
 *
 *  2. Service pages that lived at the site root. Every service now lives under
 *     /services/, so there is one hierarchy and one breadcrumb shape.
 *
 * A Map lookup rather than ~1,100 entries in next.config: literal rules that
 * numerous bloat the routing table and are checked on every request.
 */

type Rule = { source: string; destination: string }

const MAP = new Map<string, string>()
for (const r of pruned as Rule[]) MAP.set(r.source, r.destination)

/** Legacy service pages that still live at the site root (app/{slug}/page.tsx).
 *
 * Only THESE THREE were rebuilt as /services/{slug} hubs (data/services/{slug}/
 * index.json exists), so the root duplicate 301s to the canonical hub. */
const ROOT_TO_HUB = [
  "dental-office-cleaning",
  "urgent-care-cleaning",
  "assisted-living-cleaning",
]
for (const s of ROOT_TO_HUB) MAP.set(`/${s}`, `/services/${s}`)

/** These have NO /services/{slug} hub — the root page is their only real page.
 * We must NOT redirect the root away (doing so sent a live page into a 404).
 * Instead, the /services/{slug} URL that a visitor or a stale Google result
 * might try is redirected ONTO the real root page. */
const ROOT_ONLY = [
  "cardiology-clinic-cleaning",
  "dialysis-clinic-cleaning",
  "surgery-center-cleaning",
  "covid-disinfection",
  "emergency-cleaning",
]
for (const s of ROOT_ONLY) MAP.set(`/services/${s}`, `/${s}`)

export function middleware(req: NextRequest) {
  // Normalise a trailing slash before lookup; the site is trailingSlash: false,
  // so /locations/foo-ma/ and /locations/foo-ma are the same intent.
  let pathname = req.nextUrl.pathname
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1)

  const destination = MAP.get(pathname)
  if (destination) {
    return NextResponse.redirect(new URL(destination, req.url), 301)
  }

  // Two legacy category slugs have hub pages but never got per-city pages:
  // rehab-nursing was split into skilled-nursing + rehabilitation-clinics, and
  // healthcare-admin-offices has no city tier. The /locations directory still
  // cross-links ~590 of their /{city} URLs, which 404. Map each onto the
  // closest service that actually has that city page.
  const deadCity = pathname.match(
    /^\/services\/(rehab-nursing|healthcare-admin-offices)\/(.+)$/
  )
  if (deadCity) {
    const to = deadCity[1] === "rehab-nursing" ? "skilled-nursing" : "medical-office-cleaning"
    return NextResponse.redirect(new URL(`/services/${to}/${deadCity[2]}`, req.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/|api/|assets/|.*\\.[a-zA-Z0-9]+$).*)"],
}
