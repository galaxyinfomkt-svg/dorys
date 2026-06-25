import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import ScrollReveal from "@/components/ScrollReveal"
import LazyEmbeds from "@/components/LazyEmbeds"

// Site-wide metadata defaults; per-page metadata is exported from each page.tsx
// and merged. Title template wraps non-home titles with the brand suffix.
export const metadata: Metadata = {
  metadataBase: new URL("https://doryscleaningservices.com"),
  title: {
    default: "Healthcare Cleaning MA | Free Facility Assessment 24h",
    // Pass page titles through unchanged: they already carry brand/keywords
    // and the old " | Dory's Cleaning Services" suffix pushed 149 pages over
    // the ~60-char limit (and doubled brand on pages already ending "| Dory's").
    template: "%s",
  },
  description:
    "#1 healthcare facility cleaning in Massachusetts. 22+ yrs clinical exp, $2M insured, CDC compliant. Get free quote in 24 hours: (978) 307-8107",
  applicationName: "Dory's Cleaning Services",
  authors: [{ name: "Dory's Cleaning Services Inc." }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Dory's Cleaning Services",
    locale: "en_US",
    url: "https://doryscleaningservices.com/",
  },
  twitter: { card: "summary_large_image" },
  other: {
    "geo.region": "US-MA",
    "geo.placename": "Marlborough, Massachusetts",
    "geo.position": "42.3459;-71.5523",
    ICBM: "42.3459, -71.5523",
    classification: "Commercial Healthcare Environmental Services",
  },
}

export const viewport: Viewport = {
  themeColor: "#2b70e4",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/logo/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.leadconnectorhq.com" crossOrigin="" />

        {/* Critical, above-the-fold CSS — render-blocking on purpose so the
            hero/nav/layout paint without a flash. Everything else is deferred
            below to keep FCP/LCP low.
            NOTE: do NOT hardcode-preload specific gstatic woff2 URLs — Google
            rotates those hashed filenames, so the old ones 404 on every page. */}
        <link rel="stylesheet" href="/assets/css/critical.min.css" />
        <link rel="stylesheet" href="/assets/css/premium.css" />
        {/* service-pages.css sizes benefit/highlight card icons, benefits/
            related grids, cta-boxes, faq items, etc. */}
        <link rel="stylesheet" href="/assets/css/service-pages.css" />
        {/* elevate.css — site-wide premium polish; wins on equal specificity.
            Bump the ?v= cache-buster whenever these custom sheets change. */}
        <link rel="stylesheet" href="/assets/css/elevate.css?v=20260612h" />
        {/* mobile-fixes.css must load before deferred sheets so its !important
            rules (phone visibility, services-grid lock, floating CTA) win. */}
        <link rel="stylesheet" href="/assets/css/mobile-fixes.css?v=20260531g" />

        {/* Non-critical CSS + web fonts — injected as async (media=print →
            all on load) so they don't block first paint. Fonts use
            display=optional, so fallback text shows immediately. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var s=['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=optional','/assets/css/footer.css','/assets/css/animations.css','/assets/css/lightbox.css','/assets/css/aeo.css?v=20260531g'];for(var i=0;i<s.length;i++){var l=document.createElement('link');l.rel='stylesheet';l.href=s[i];l.media='print';l.onload=function(){this.media='all'};document.head.appendChild(l);}})();",
          }}
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=optional" />
          <link rel="stylesheet" href="/assets/css/footer.css" />
          <link rel="stylesheet" href="/assets/css/animations.css" />
          <link rel="stylesheet" href="/assets/css/lightbox.css" />
          <link rel="stylesheet" href="/assets/css/aeo.css?v=20260531g" />
        </noscript>

        {/* GA4 stub — define gtag + queue config immediately so analytics
            events captured before gtag.js loads aren't lost. The gtag.js
            library itself is loaded lazily (see LazyEmbeds). */}
        <Script id="ga4-stub" strategy="beforeInteractive">{`
          window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','G-2MP9G52LW7');
        `}</Script>
      </head>
      <body className="is-loaded">
        {children}
        <ScrollReveal />
        {/* Defers GHL form iframes, the chat widget and GA4 gtag.js until the
            visitor interacts or after a short idle — keeps initial load light. */}
        <LazyEmbeds />

        {/* Legacy JS — main.js + navigation.js inject the floating
            phone CTA, sticky header, back-to-top, accordion, lightbox,
            click tracking. analytics.js wires GA4 events. */}
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <Script src="/assets/js/navigation.js" strategy="afterInteractive" />
        <Script src="/assets/js/header.js" strategy="afterInteractive" />
        <Script src="/assets/js/analytics.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
