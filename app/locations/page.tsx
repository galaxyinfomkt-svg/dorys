// Service-areas hub page. Same JSON pipeline as individual cities —
// reads data/locations/index.json so the existing hero, schemas and
// the directory of 296 cities all render unchanged.

import type { Metadata } from "next"
import Script from "next/script"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

type LocationData = {
  title: string
  description: string
  aiSummary: string
  keywords: string
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

async function loadHub(): Promise<LocationData | null> {
  try {
    const file = path.join(process.cwd(), "data", "locations", "index.json")
    return JSON.parse(await fs.readFile(file, "utf-8")) as LocationData
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadHub()
  if (!data) return { title: "Service Areas" }
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: data.canonical || "/locations" },
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
      title: data.twitterTitle || data.title,
      description: data.twitterDescription || data.description,
      images: data.twitterImage ? [data.twitterImage] : undefined,
    },
    other: data.aiSummary ? { "ai-summary": data.aiSummary } : undefined,
  }
}

export default async function LocationsHubPage() {
  const data = await loadHub()
  if (!data) {
    return (
      <>
        <Header />
        <main id="main-content">
          <section className="section" style={{ padding: "6rem 0", textAlign: "center" }}>
            <h1>Service Areas</h1>
            <p>Loading...</p>
          </section>
        </main>
        <Footer />
      </>
    )
  }
  return (
    <>
      <Header />
      {data.schemas.map((schema, i) => (
        <Script
          key={`ld-${i}`}
          id={`ld-locations-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main id="main-content" dangerouslySetInnerHTML={{ __html: data.mainHtml }} />
      <Footer />
    </>
  )
}
