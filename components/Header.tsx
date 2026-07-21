// Site header — top bar + main nav. Markup mirrors the existing
// static HTML pages so visual identity and a11y are preserved.

import Link from "next/link"
import HeaderMenuToggle from "./HeaderMenuToggle"

const POPULAR_CITIES = [
  ["marlborough-ma", "Marlborough"],
  ["framingham-ma", "Framingham"],
  ["worcester-ma", "Worcester"],
  ["hudson-ma", "Hudson"],
  ["westborough-ma", "Westborough"],
  ["natick-ma", "Natick"],
  ["newton-ma", "Newton"],
  ["wellesley-ma", "Wellesley"],
] as const

const SERVICES = [
  ["medical-office-cleaning", "Medical Offices"],
  ["specialty-clinics", "Specialty Clinics"],
  ["ambulatory-outpatient", "Ambulatory & Outpatient"],
  ["rehab-nursing", "Rehab & Nursing Facilities"],
  ["healthcare-admin-offices", "Healthcare Admin Offices"],
] as const

export default function Header() {
  return (
    <>
      {/* skip-link for keyboard a11y, same as the static markup */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Consolidated top: the legacy dark contact/social top-bar was removed
          (phone lives in the header CTA; email + social live in the footer)
          so the chrome is now just trust-strip + header — 2 clean bands. */}

      {/* Trust strip — quiet, healthcare-appropriate proof (no fake urgency) */}
      <div className="trust-strip">
        <div className="container trust-strip__inner">
          {[
            // "$2M Insured" not "Licensed" — Massachusetts does not license
            // cleaning companies, so a licence claim is false. "109" not "296":
            // the service area is 109 municipalities after the prune.
            "$2M Insured",
            "CDC / OSHA Compliant",
            "22+ Years Clinical Experience",
            "Black-Owned & Women-Owned",
            "Serving 109 MA Cities",
            "Free 24-Hour Facility Assessment",
          ].flatMap((item, i, arr) => {
            const node = (
              <span key={item} className="trust-strip__item">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                {item}
              </span>
            )
            return i < arr.length - 1
              ? [node, <span key={`${item}-d`} className="trust-strip__divider" aria-hidden="true">•</span>]
              : [node]
          })}
        </div>
      </div>

      <header className="header">
        <div className="container header__wrapper">
          <Link href="/" className="header__logo" aria-label="Dory's Cleaning Services — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo/logo-80.webp" alt="Dory's Cleaning Services Logo" width={180} height={60} loading="eager" fetchPriority="high" decoding="async" />
          </Link>

          <nav id="main-navigation" className="header__nav" aria-label="Main navigation">
            <ul className="nav-list">
              <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
              <li className="nav-item has-dropdown">
                <Link href="/services" className="nav-link">Services</Link>
                <div className="nav-dropdown">
                  {SERVICES.map(([slug, label]) => (
                    <Link key={slug} href={`/services/${slug}`} className="nav-dropdown__link">{label}</Link>
                  ))}
                </div>
              </li>
              <li className="nav-item has-dropdown">
                <Link href="/locations" className="nav-link">Service Areas</Link>
                <div className="nav-dropdown nav-dropdown--mega">
                  <span className="nav-dropdown__title">Popular Cities</span>
                  <div className="nav-dropdown__grid">
                    {POPULAR_CITIES.map(([slug, label]) => (
                      <Link key={slug} href={`/locations/${slug}`} className="nav-dropdown__link">{label}</Link>
                    ))}
                    <Link href="/locations" className="nav-dropdown__link text-primary font-semibold">View All Cities →</Link>
                  </div>
                </div>
              </li>
              <li className="nav-item"><Link href="/healthcare-facilities" className="nav-link">For Healthcare Facilities</Link></li>
              <li className="nav-item"><Link href="/about" className="nav-link">About Us</Link></li>
              <li className="nav-item"><Link href="/blog" className="nav-link">Blog</Link></li>
              <li className="nav-item"><Link href="/reviews" className="nav-link">Reviews</Link></li>
              <li className="nav-item"><Link href="/contact" className="nav-link">Contact</Link></li>
            </ul>
          </nav>

          <a href="tel:+19783078107" className="btn btn--primary header__cta hide-mobile" data-track="cta-header-call">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style={{ marginRight: "0.45rem", verticalAlign: "-2px", flex: "none" }}>
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            (978) 307-8107
          </a>

          {/* Mobile hamburger — React-controlled (legacy navigation.js never
              fires under Next). Toggles .is-open on .header__nav + overlay. */}
          <HeaderMenuToggle />
        </div>
      </header>

      {/* Dim overlay behind the open mobile drawer */}
      <div className="header__overlay" aria-hidden="true"></div>
    </>
  )
}
