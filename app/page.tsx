// Home page (/). Reads the full body content from data/home.json which
// was extracted from the original index.html, preserving 100% of the
// hero, compliance badges, services grid, process steps, reviews
// widget, FAQ accordion and the GHL form embed.

import type { Metadata } from "next"
import { ldJson } from "@/lib/ld-json"
import fs from "node:fs/promises"
import path from "node:path"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import GalleryEnhancer from "@/components/GalleryEnhancer"

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
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  schemas: unknown[]
  mainHtml: string
}

async function load(): Promise<Data | null> {
  try {
    const file = path.join(process.cwd(), "data", "home.json")
    return JSON.parse(await fs.readFile(file, "utf-8")) as Data
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const d = await load()
  if (!d) return { title: "Dory's Cleaning Services" }
  return {
    title: d.title,
    description: d.description,
    keywords: d.keywords,
    alternates: { canonical: d.canonical || "/" },
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

export default async function HomePage() {
  const d = await load()
  if (!d) {
    return (
      <>
        <Header />
        <main id="main-content">
          <section className="section" style={{ padding: "6rem 0", textAlign: "center" }}>
            <h1>Dory&apos;s Cleaning Services</h1>
          </section>
        </main>
        <Footer />
      </>
    )
  }
  return (
    <>
      {/* Preload da imagem de LCP.
          Sem isto, o navegador so descobre o <img> do hero depois de baixar e
          aplicar os 36,8 KiB de CSS bloqueante — em Slow 4G isso atrasa o LCP o
          bastante para o PageSpeed fechar o trace antes de registra-lo e
          devolver NO_LCP (que invalida tambem o TBT e zera a categoria toda).
          Com o preload, a imagem desce em paralelo com o CSS.
          imagesrcset/imagesizes repetem exatamente o que a tag <img> declara —
          se divergirem, o navegador baixa duas variantes em vez de uma. */}
      <link
        rel="preload"
        as="image"
        href="/assets/images/hero/surgery-room-hero.webp"
        imageSrcSet="/assets/images/hero/surgery-room-hero-400w.webp 400w, /assets/images/hero/surgery-room-hero-600w.webp 600w, /assets/images/hero/surgery-room-hero.webp 800w"
        imageSizes="(max-width: 600px) 400px, (max-width: 900px) 600px, 800px"
        fetchPriority="high"
      />
      <Header />
      {d.schemas.map((schema, i) => (
        <script
          key={`ld-${i}`}
          id={`ld-home-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldJson(schema) }}
        />
      ))}
      <main id="main-content" dangerouslySetInnerHTML={{ __html: d.mainHtml }} />
      <GalleryEnhancer />
      <Footer />
    </>
  )
}
