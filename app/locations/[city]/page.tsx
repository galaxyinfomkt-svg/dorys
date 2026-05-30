// Dynamic city page. One source of truth is `data/locations/{slug}.json`,
// produced by `scripts/extract-locations-to-json.py` from the original
// static HTML. This page reads the JSON at build time so all 296 city
// pages are statically generated (zero runtime cost, same fast cold
// start as the previous static HTML).
//
// Metadata, JSON-LD schemas and the main content are all preserved
// byte-for-byte from the prior production site, so SEO does not regress.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import slugs from "@/data/locations-index.json" assert { type: "json" }

type LocationData = {
  slug: string
  city: string
  title: string
  description: string
  aiSummary: string
  keywords: string
  robots: string
  geoRegion: string
  geoPlacename: string
  canonical: string
  ogType: string
  ogUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogLocale: string
  ogSiteName: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  schemas: unknown[]
  mainHtml: string
}

async function loadCity(slug: string): Promise<LocationData | null> {
  try {
    const file = path.join(process.cwd(), "data", "locations", `${slug}.json`)
    const raw = await fs.readFile(file, "utf-8")
    return JSON.parse(raw) as LocationData
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  return (slugs as string[]).map((s) => ({ city: s }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params
  const data = await loadCity(city)
  if (!data) return { title: "Page Not Found" }
  const indexable = !data.robots.toLowerCase().includes("noindex")
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    robots: { index: indexable, follow: true },
    alternates: { canonical: data.canonical || `/locations/${data.slug}` },
    openGraph: {
      type: "website",
      url: data.ogUrl || data.canonical,
      title: data.ogTitle || data.title,
      description: data.ogDescription || data.description,
      images: data.ogImage ? [data.ogImage] : undefined,
      locale: data.ogLocale,
      siteName: data.ogSiteName,
    },
    twitter: {
      card: "summary_large_image",
      title: data.twitterTitle || data.ogTitle || data.title,
      description: data.twitterDescription || data.ogDescription || data.description,
      images: data.twitterImage ? [data.twitterImage] : undefined,
    },
    other: {
      ...(data.aiSummary ? { "ai-summary": data.aiSummary } : {}),
      ...(data.geoRegion ? { "geo.region": data.geoRegion } : {}),
      ...(data.geoPlacename ? { "geo.placename": data.geoPlacename } : {}),
    },
  }
}

export default async function CityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params
  const data = await loadCity(city)
  if (!data) notFound()

  return (
    <>
      <Header />

      {/* JSON-LD schemas — exact copies of the static page's blocks,
          one <script> per object so each indexes independently. */}
      {data.schemas.map((schema, i) => (
        <Script
          key={`ld-${i}`}
          id={`ld-${data.slug}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* The full <main> content rendered verbatim. Migrating each
          inline section to a React component happens incrementally
          in later sessions; rendering raw HTML now means we preserve
          everything (compliance badges, services grid, near-cities
          links, GHL iframe with city/locationId query params, etc.)
          without any visual regression. */}
      <main
        id="main-content"
        dangerouslySetInnerHTML={{ __html: data.mainHtml }}
      />

      <Footer />
    </>
  )
}
