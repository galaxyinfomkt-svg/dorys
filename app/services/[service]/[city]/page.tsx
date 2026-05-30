// /services/[service]/[city] — 1,480 service-city pages. These were
// marked noindex,follow during the de-duplication work (Wave 2), and
// the JSON we extracted carries that robots value forward so the
// Next.js page emits the same directive verbatim.
//
// Source: data/services/{service}/{city}.json
// Build:  generateStaticParams enumerates every category x city pair
//         from data/services-cities.json so all 1,480 pages are
//         statically generated at build time, no SSR fan-out.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import cityIndex from "@/data/services-cities.json" assert { type: "json" }

type Data = {
  slug: string
  city: string
  category: string
  categoryLabel: string
  title: string
  description: string
  aiSummary: string
  keywords: string
  robots: string
  canonical: string
  ogUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogLocale: string
  ogSiteName: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  schemas: unknown[]
  mainHtml: string
}

type CityIndex = Record<string, string[]>

async function load(service: string, city: string): Promise<Data | null> {
  try {
    const file = path.join(
      process.cwd(), "data", "services", service, `${city}.json`
    )
    return JSON.parse(await fs.readFile(file, "utf-8")) as Data
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const idx = cityIndex as CityIndex
  const out: { service: string; city: string }[] = []
  for (const service of Object.keys(idx)) {
    for (const city of idx[service]) {
      out.push({ service, city })
    }
  }
  return out
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string; city: string }> }
): Promise<Metadata> {
  const { service, city } = await params
  const d = await load(service, city)
  if (!d) return { title: "Page Not Found" }
  const indexable = !d.robots.toLowerCase().includes("noindex")
  return {
    title: d.title,
    description: d.description,
    keywords: d.keywords,
    robots: { index: indexable, follow: true },
    alternates: { canonical: d.canonical || `/services/${service}/${city}` },
    openGraph: {
      type: "website",
      url: d.ogUrl || d.canonical,
      title: d.ogTitle || d.title,
      description: d.ogDescription || d.description,
      images: d.ogImage ? [d.ogImage] : undefined,
      locale: d.ogLocale,
      siteName: d.ogSiteName,
    },
    twitter: {
      card: "summary_large_image",
      title: d.twitterTitle || d.title,
      description: d.twitterDescription || d.description,
      images: d.twitterImage ? [d.twitterImage] : undefined,
    },
    other: d.aiSummary ? { "ai-summary": d.aiSummary } : undefined,
  }
}

export default async function ServiceCityPage(
  { params }: { params: Promise<{ service: string; city: string }> }
) {
  const { service, city } = await params
  const d = await load(service, city)
  if (!d) notFound()
  return (
    <>
      <Header />
      {d.schemas.map((schema, i) => (
        <Script
          key={`ld-${i}`}
          id={`ld-${d.category}-${d.slug}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main id="main-content" dangerouslySetInnerHTML={{ __html: d.mainHtml }} />
      <Footer />
    </>
  )
}
