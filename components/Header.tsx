// Site header — top bar + main nav. Markup mirrors the existing
// static HTML pages so visual identity and a11y are preserved.

import Link from "next/link"

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

      <div className="top-bar">
        <div className="container">
          <div className="top-bar__contact">
            <a href="tel:+19783078107" className="top-bar__item" data-track="phone-topbar">
              <svg className="top-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>(978) 307-8107</span>
            </a>
            <a href="mailto:contact@doryscleaningservices.com" className="top-bar__item" data-track="email-topbar">
              <svg className="top-bar__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>contact@doryscleaningservices.com</span>
            </a>
          </div>
          <div className="top-bar__social">
            <a href="https://www.facebook.com/cleanersservicesMA" target="_blank" rel="noopener noreferrer" className="top-bar__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/doryscleaningservices/" target="_blank" rel="noopener noreferrer" className="top-bar__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/dorys-cleaning-services-inc/" target="_blank" rel="noopener noreferrer" className="top-bar__social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Trust strip — quiet, healthcare-appropriate proof (no fake urgency) */}
      <div className="trust-strip">
        <div className="container trust-strip__inner">
          {[
            "Licensed & $2M Insured",
            "CDC / OSHA Compliant",
            "22+ Years Clinical Experience",
            "Serving 296 MA Cities",
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
            <img src="/assets/images/logo/logo-80.webp" alt="Dory's Cleaning Services Logo" width={180} height={60} />
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
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
              <li className="nav-item"><Link href="/pricing" className="nav-link">Pricing</Link></li>
              <li className="nav-item"><Link href="/about" className="nav-link">About Us</Link></li>
              <li className="nav-item"><Link href="/blog" className="nav-link">Blog</Link></li>
              <li className="nav-item"><Link href="/reviews" className="nav-link">Reviews</Link></li>
              <li className="nav-item"><Link href="/contact" className="nav-link">Contact</Link></li>
            </ul>
          </nav>

          <a href="tel:+19783078107" className="btn btn--primary header__cta hide-mobile" data-track="cta-header-call">(978) 307-8107</a>
        </div>
      </header>
    </>
  )
}
