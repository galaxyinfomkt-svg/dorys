import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Page Not Found (404)",
  description: "The page you were looking for could not be found. Browse our healthcare cleaning services and Massachusetts service areas.",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="section" style={{ padding: "6rem 0", textAlign: "center" }}>
          <div className="container container--narrow">
            <h1 className="hero__title" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Page Not Found</h1>
            <p style={{ fontSize: "1.125rem", color: "#475569", marginBottom: "2rem" }}>
              The page you were looking for could not be found. Try one of these instead:
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/" className="btn btn--primary btn--lg">Home</Link>
              <Link href="/services" className="btn btn--outline btn--lg">All Services</Link>
              <Link href="/locations" className="btn btn--outline btn--lg">Service Areas</Link>
              <a href="tel:+19783078107" className="btn btn--accent btn--lg">Call (978) 307-8107</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
