import type { Metadata } from "next"
import Script from "next/script"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroForm from "@/components/HeroForm"

// Per-page SEO metadata — preserves the exact title/description/OG strings
// the static HTML home page was already serving in production.
export const metadata: Metadata = {
  title: "Healthcare Cleaning MA | Free Facility Assessment 24h",
  description:
    "#1 healthcare facility cleaning in Massachusetts. 22+ yrs clinical exp, $2M insured, CDC compliant. Get free quote in 24 hours: (978) 307-8107",
  keywords: [
    "healthcare facility environmental cleaning Massachusetts",
    "medical office environmental services",
    "clinical cleaning contractor MA",
    "infection control environmental cleaning service",
    "assisted living facility sanitation",
    "OSHA compliance cleaning healthcare",
    "medical practice cleaning services",
    "commercial healthcare cleaning",
  ].join(", "),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Healthcare Cleaning MA | Free Facility Assessment 24h",
    description:
      "#1 healthcare facility cleaning in Massachusetts. 22+ yrs clinical exp, $2M insured, CDC compliant. Get free quote in 24 hours: (978) 307-8107",
    url: "https://doryscleaningservices.com/",
    images: ["https://doryscleaningservices.com/assets/images/hero/surgery-room-hero.jpg"],
  },
  twitter: {
    title: "Healthcare Cleaning MA | Free Facility Assessment 24h",
    description:
      "#1 healthcare facility cleaning in Massachusetts. 22+ yrs clinical exp, $2M insured, CDC compliant. Get free quote in 24 hours: (978) 307-8107",
    images: ["https://doryscleaningservices.com/assets/images/hero/surgery-room-hero.jpg"],
  },
}

// The complete @graph schema we shipped earlier today (wave 1 authority stack)
// is imported from JSON so the page stays readable. Same content, byte-identical
// when serialized — Google sees no difference vs the static HTML version.
import homeGraph from "@/data/schema/home-graph.json"
import faqSchema from "@/data/schema/home-faq.json"
import howtoSchema from "@/data/schema/home-howto.json"

export default function HomePage() {
  return (
    <>
      <Header />

      {/* JSON-LD blocks — exact same structures as the static markup,
          rendered through next/script so they're preserved in build output. */}
      <Script
        id="ld-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeGraph) }}
      />
      <Script
        id="ld-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoSchema) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content">
        <section className="hero-premium">
          <div className="hero-premium__background">
            <picture>
              <source
                srcSet="/assets/images/hero/surgery-room-hero-400w.webp 400w, /assets/images/hero/surgery-room-hero-600w.webp 600w, /assets/images/hero/surgery-room-hero.webp 800w"
                sizes="(max-width: 600px) 400px, (max-width: 900px) 600px, 800px"
                type="image/webp"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/hero/surgery-room-hero.webp"
                width={800}
                height={443}
                alt="Clinical-grade healthcare facility cleaning services in Massachusetts"
                fetchPriority="high"
              />
            </picture>
            <div className="hero-premium__overlay" />
          </div>
          <div className="container">
            <div className="hero-premium__grid">
              <div className="hero-premium__content">
                <span className="hero-premium__badge">
                  Exclusively Serving Licensed Healthcare Facilities — 22 Years Clinical Experience
                </span>
                <h1 className="hero-premium__title">
                  Hospital-Grade <span>Cleaning</span><br />
                  for Massachusetts Healthcare Facilities
                </h1>
                <p className="hero-premium__subtitle">
                  Medical offices, specialty clinics, ambulatory facilities, rehab centers, and healthcare admin offices across 296 Massachusetts cities. CDC, OSHA, and EPA compliant — written compliance documentation included.
                </p>
                <div className="hero-premium__ctas">
                  <a href="#contact" className="btn btn--accent btn--xl" data-track="cta-hero-assessment">
                    Request a Free Facility Assessment
                  </a>
                  <a href="tel:+19783078107" className="btn btn--outline-light btn--xl" data-track="cta-hero-call">
                    Call (978) 307-8107
                  </a>
                </div>
              </div>

              <HeroForm />
            </div>
          </div>
        </section>

        {/* For the first migration pass we render a placeholder for the
            rest of the home page sections. The full sections (compliance
            badges, services grid, reviews, FAQ accordion, footer CTA) will
            be migrated as React components in the next session. The static
            HTML version remains live at the current production domain
            while this Next.js build serves a Vercel preview URL. */}
        <section className="section" style={{ padding: "3rem 0", background: "#f8fafc", textAlign: "center" }}>
          <div className="container">
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
              <strong>This is the Next.js + Tailwind v4 migration preview.</strong> Visit{" "}
              <a href="https://doryscleaningservices.com/" style={{ color: "#2b70e4" }}>
                doryscleaningservices.com
              </a>{" "}
              for the full production site (currently still static HTML; the remaining 1,800 pages migrate batch-by-batch in subsequent commits).
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
