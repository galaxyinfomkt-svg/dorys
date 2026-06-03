// Preview of the native QuoteForm (components/QuoteForm.tsx) in Dory's colours.
// Lets us see the form live while the home/location pages keep the working GHL
// iframe. noindex — this is a staging/preview URL, not a real landing page.
// Once GHL_PIT is set in Vercel and a test lead confirms delivery, the form
// replaces the iframe on the home and inner pages.

import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import QuoteForm from "@/components/QuoteForm"

export const metadata: Metadata = {
  title: "Quote Form Preview",
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="section section--alt" style={{ padding: "3rem 0" }}>
          <div className="container container--narrow">
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "2.5rem 2.25rem",
                maxWidth: 640,
                margin: "0 auto",
                boxShadow: "0 24px 60px -20px rgba(15,39,69,0.28), 0 4px 12px rgba(15,39,69,0.06)",
                border: "1px solid #eaf0f7",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 5,
                  background: "linear-gradient(90deg,#2b70e4 0%,#f59e0b 100%)",
                }}
              />
              <QuoteForm heading="Get Your Free Quote" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
