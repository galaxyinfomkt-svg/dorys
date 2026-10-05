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
      { source: "/pricing", destination: "/contact", permanent: true },
      { source: "/pricing.html", destination: "/contact", permanent: true },
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
          // CSP de base. O Lighthouse reclamava de "no CSP found"; isto fecha os
          // vetores que da para fechar sem risco: plugins (object-src), reescrita
          // de URL base (base-uri), embedding por terceiros (frame-ancestors) e
          // qualquer recurso servido em http.
          //
          // script-src fica com 'unsafe-inline' e https: DE PROPOSITO. Uma
          // politica estrita de verdade exige nonce por requisicao, e nonce exige
          // renderizacao dinamica — o que mataria a geracao estatica das 872
          // paginas de servico x cidade. Alem disso o formulario do GoHighLevel
          // injeta script proprio, e quebra-lo significa parar a captacao de
          // leads (ver data/company.json .ghl._loadingNote). Endurecer isto e
          // trabalho separado, com teste de formulario em producao.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              "frame-src 'self' https:",
              "connect-src 'self' https:",
              "media-src 'self' https:",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https:",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
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
