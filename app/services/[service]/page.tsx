// /services/[service] — one of the 5 category hubs (medical-office-cleaning,
// specialty-clinics, ambulatory-outpatient, rehab-nursing,
// healthcare-admin-offices). Source: data/services/{slug}/index.json.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import categories from "@/data/services-categories.json" assert { type: "json" }

type Data = {
  slug: string
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

async function load(slug: string): Promise<Data | null> {
  try {
    const file = path.join(process.cwd(), "data", "services", slug, "index.json")
    return JSON.parse(await fs.readFile(file, "utf-8")) as Data
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  return (categories as string[]).map((s) => ({ service: s }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> }
): Promise<Metadata> {
  const { service } = await params
  const d = await load(service)
  if (!d) return { title: "Service Not Found" }
  const indexable = !d.robots.toLowerCase().includes("noindex")
  return {
    title: d.title,
    description: d.description,
    keywords: d.keywords,
    robots: { index: indexable, follow: true },
    alternates: { canonical: d.canonical || `/services/${d.slug}` },
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

export default async function ServiceHubPage(
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params
  const d = await load(service)
  if (!d) notFound()
  return (
    <>
      <Header />
      {d.schemas.map((schema, i) => (
        <Script
          key={`ld-${i}`}
          id={`ld-${d.slug}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main id="main-content" dangerouslySetInnerHTML={{ __html: d.mainHtml }} />
      <Footer />
    </>
  )
}
