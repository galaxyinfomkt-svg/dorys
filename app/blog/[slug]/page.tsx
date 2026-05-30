// /blog/[slug] — 20 blog posts. Article schema, headline + author
// metadata, dateModified — all preserved from data/blog/{slug}.json.

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import slugs from "@/data/blog-index.json" assert { type: "json" }

type Data = {
  slug: string
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

async function load(slug: string): Promise<Data | null> {
  try {
    const file = path.join(process.cwd(), "data", "blog", `${slug}.json`)
    return JSON.parse(await fs.readFile(file, "utf-8")) as Data
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  return (slugs as string[]).map((s) => ({ slug: s }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const d = await load(slug)
  if (!d) return { title: "Article Not Found" }
  const indexable = !d.robots.toLowerCase().includes("noindex")
  return {
    title: d.title,
    description: d.description,
    keywords: d.keywords,
    robots: { index: indexable, follow: true },
    alternates: { canonical: d.canonical || `/blog/${d.slug}` },
    openGraph: {
      type: "article",
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

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const d = await load(slug)
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
