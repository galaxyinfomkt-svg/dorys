// Source: data/pages/supplier-diversity.json
// Mirrors the other root page routes (see app/about/page.tsx). Renders the
// MBE/WBE supplier-diversity landing page for procurement / supplier-diversity
// teams at health systems.

import type { Metadata } from "next"
import Script from "next/script"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const SLUG = "supplier-diversity"

type Data = {
  title: string
  description: string
  aiSummary: string
  keywords: string
  robots: string
  canonical: string
  ogType: string
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

async function load(): Promise<Data | null> {
  try {
    const file = path.join(process.cwd(), "data", "pages", `${SLUG}.json`)
    return JSON.parse(await fs.readFile(file, "utf-8")) as Data
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const d = await load()
  if (!d) return { title: SLUG }
  const indexable = !d.robots.toLowerCase().includes("noindex")
  return {
    title: d.title,
    description: d.description,
    keywords: d.keywords,
    robots: { index: indexable, follow: true },
    alternates: { canonical: d.canonical || `/${SLUG}` },
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

export default async function Page() {
  const d = await load()
  if (!d) {
    return (
      <>
        <Header />
        <main id="main-content">
          <section className="section" style={{ padding: "6rem 0", textAlign: "center" }}>
            <h1>{SLUG}</h1>
          </section>
        </main>
        <Footer />
      </>
    )
  }
  return (
    <>
      <Header />
      {d.schemas.map((schema, i) => (
        <Script
          key={`ld-${i}`}
          id={`ld-${SLUG}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main id="main-content" dangerouslySetInnerHTML={{ __html: d.mainHtml }} />
      <Footer />
    </>
  )
}
