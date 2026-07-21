// Site footer — extracted from the static markup. Same classes so all
// existing CSS continues to style it without changes.

import Link from "next/link"
import citiesList from "@/data/cities-list.json"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <Link href="/" className="footer__logo" aria-label="Dory's Cleaning Services — Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/logo/logo-80.webp"
                alt="Dory's Cleaning Services"
                className="footer__logo-img"
                loading="lazy"
                decoding="async"
                width={180}
                height={60}
              />
            </Link>
            <p className="footer__cta-text">
              Clinical-grade environmental cleaning for licensed healthcare facilities across Massachusetts. 22 years of clinical experience, CDC/OSHA compliant, $2M insured, compliance documentation included.
            </p>
            <div className="footer__contact-item"><strong>PHONE</strong> <a href="tel:+19783078107" className="footer__contact-value">(978) 307-8107</a></div>
            <div className="footer__contact-item"><strong>EMAIL</strong> <a href="mailto:contact@doryscleaningservices.com" className="footer__contact-value">contact@doryscleaningservices.com</a></div>
            <div className="footer__contact-item"><strong>HOURS</strong> Mon–Sat: 5:00 AM – 7:00 PM</div>
            <div className="footer__contact-item"><strong>SERVICE AREA</strong> Healthcare facilities across Massachusetts</div>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Services</h3>
            <ul className="footer__links">
              <li><Link href="/services/medical-office-cleaning">Medical Offices</Link></li>
              <li><Link href="/services/specialty-clinics">Specialty Clinics</Link></li>
              <li><Link href="/services/ambulatory-outpatient">Ambulatory & Outpatient</Link></li>
              <li><Link href="/services/rehab-nursing">Rehab & Nursing Facilities</Link></li>
              <li><Link href="/services/healthcare-admin-offices">Healthcare Admin Offices</Link></li>
              <li><Link href="/atp-assessment">Free ATP Test</Link></li>
              <li><Link href="/emergency-cleaning">24/7 Emergency</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Specialized Cleaning</h3>
            <ul className="footer__links">
              <li><Link href="/dental-office-cleaning">Dental Office Cleaning</Link></li>
              <li><Link href="/cardiology-clinic-cleaning">Cardiology Clinic Cleaning</Link></li>
              <li><Link href="/dialysis-clinic-cleaning">Dialysis Clinic Cleaning</Link></li>
              <li><Link href="/urgent-care-cleaning">Urgent Care Cleaning</Link></li>
              <li><Link href="/surgery-center-cleaning">Surgery Center Cleaning</Link></li>
              <li><Link href="/assisted-living-cleaning">Assisted Living Cleaning</Link></li>
              <li><Link href="/healthcare-cleaning-massachusetts-guide">MA Healthcare Cleaning Guide</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Popular Cities</h3>
            <ul className="footer__links">
              <li><Link href="/locations/marlborough-ma">Marlborough</Link></li>
              <li><Link href="/locations/framingham-ma">Framingham</Link></li>
              <li><Link href="/locations/worcester-ma">Worcester</Link></li>
              <li><Link href="/locations/hudson-ma">Hudson</Link></li>
              <li><Link href="/locations/newton-ma">Newton</Link></li>
              <li><Link href="/locations/natick-ma">Natick</Link></li>
              <li><Link href="/locations/wellesley-ma">Wellesley</Link></li>
              <li><Link href="/locations/westborough-ma">Westborough</Link></li>
              <li><Link href="/locations">View All 109 Cities →</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Company</h3>
            <ul className="footer__links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/healthcare-facilities">For Healthcare Facilities</Link></li>
              <li><Link href="/supplier-diversity">Supplier Diversity (MBE/WBE)</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/press">Press & Media</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service-area directory — RS-style inline city band (sitewide footer
          internal linking to the indexed location pages). Replaces the big
          mid-page city blocks the hubs used to carry. */}
      <div className="footer__areas">
        <div className="container">
          <h3 className="footer__areas-title">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
            Serving 109 Cities &amp; Towns Across Massachusetts
          </h3>
          <p className="footer__areas-list">
            {/* A sitewide footer that links all 109 cities is the recognised
                doorway pattern and spreads internal link equity evenly, so
                nothing is signalled as important. Discovery is the sitemap's
                job; here we surface the largest markets and link the rest. */}
            {citiesList
              .filter((c) =>
                [
                  "worcester-ma", "cambridge-ma", "quincy-ma", "lynn-ma", "newton-ma",
                  "somerville-ma", "framingham-ma", "waltham-ma", "marlborough-ma",
                  "salem-ma", "peabody-ma", "fitchburg-ma",
                ].includes(c.s)
              )
              .map((c, i, arr) => (
                <span key={c.s}>
                  <Link href={`/locations/${c.s}`}>{c.n}</Link>
                  {i < arr.length - 1 ? <span className="footer__areas-sep"> · </span> : null}
                </span>
              ))}
            <span className="footer__areas-sep"> · </span>
            <Link href="/locations"><strong>all 109 cities &amp; towns →</strong></Link>
          </p>
        </div>
      </div>

      <nav className="footer__legal" aria-label="Legal navigation">
        <div className="container footer__legal-row">
          <span>© {new Date().getFullYear()} Dory&apos;s Cleaning Services Inc. All rights reserved.</span>
          <div className="footer__legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap">Sitemap</Link>
          </div>
        </div>
      </nav>
    </footer>
  )
}
