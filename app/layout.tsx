import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import ScrollReveal from "@/components/ScrollReveal"

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
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v24/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/poppins/v23/pxiByp8kv8JHgFVrLCz7Z11lFd2JQEl8qw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=optional"
        />

        {/* Legacy stylesheets — every page-body class (.hero-premium,
            .container, .nav-link, .footer__grid, .card, .btn, .top-bar,
            etc.) is defined here. Keep loading them site-wide while we
            incrementally port styles to Tailwind. */}
        <link rel="stylesheet" href="/assets/css/critical.min.css" />
        <link rel="stylesheet" href="/assets/css/premium.css" />
        {/* service-pages.css sizes benefit/highlight card icons, benefits/
            related grids, cta-boxes, faq items, etc. The static site loaded it
            on service pages; the migration omitted it, so those icons rendered
            unsized (giant black shapes) and grids lost their layout. */}
        <link rel="stylesheet" href="/assets/css/service-pages.css" />
        <link rel="stylesheet" href="/assets/css/footer.css" />
        <link rel="stylesheet" href="/assets/css/animations.css" />
        <link rel="stylesheet" href="/assets/css/lightbox.css" />
        <link rel="stylesheet" href="/assets/css/aeo.css?v=20260531e" />
        {/* elevate.css — site-wide premium polish; loads after the legacy
            sheets so it wins on equal specificity, before mobile-fixes.
            The ?v= query is a cache-buster: bump it whenever we edit these
            custom sheets so browsers/CDN are forced to refetch instead of
            serving a stale copy (the gallery looked unstyled to users whose
            browser had cached the pre-gallery elevate.css). */}
        <link rel="stylesheet" href="/assets/css/elevate.css?v=20260531e" />
        {/* mobile-fixes.css must load LAST so its !important rules
            (phone-number visibility, services-grid lock, floating
            phone CTA) win the cascade. */}
        <link rel="stylesheet" href="/assets/css/mobile-fixes.css?v=20260531e" />
      </head>
      <body className="is-loaded">
        {children}
        <ScrollReveal />

        {/* Legacy JS — main.js + navigation.js inject the floating
            phone CTA, sticky header, back-to-top, accordion, lightbox,
            click tracking. analytics.js wires GA4 events. */}
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <Script src="/assets/js/navigation.js" strategy="afterInteractive" />
        <Script src="/assets/js/header.js" strategy="afterInteractive" />
        <Script src="/assets/js/analytics.js" strategy="afterInteractive" />

        {/* GHL / LeadConnector chat widget (bottom-right bubble) */}
        <Script
          src="https://beta.leadconnectorhq.com/loader.js"
          data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="6a1b542f7645b2ba9a1194ac"
          strategy="afterInteractive"
        />

        {/* GA4 — same property ID we've been using site-wide */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2MP9G52LW7"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2MP9G52LW7');
        `}</Script>
      </body>
    </html>
  )
}
