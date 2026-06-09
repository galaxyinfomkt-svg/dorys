/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Keep production-grade caching for static assets
  poweredByHeader: false,

  // Preserve the existing canonical URL strategy (no trailing slash)
  trailingSlash: false,

  // Permanent redirects mirroring vercel.json so legacy .html URLs continue working
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/reviews.html", destination: "/reviews", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
      { source: "/services/:service/:city.html", destination: "/services/:service/:city", permanent: true },
      { source: "/locations/:city.html", destination: "/locations/:city", permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          // Origin isolation (Lighthouse Best Practices). allow-popups keeps any
          // GHL/third-party popups working; COEP is intentionally omitted so the
          // cross-origin GHL form, chat, fonts and images keep loading.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      {
        source: "/assets/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
}

export default nextConfig
