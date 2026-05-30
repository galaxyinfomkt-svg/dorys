# Next.js + Tailwind v4 Migration Status

This document tracks the migration of doryscleaningservices.com from
1,800+ static HTML files to Next.js 15 (App Router) with Tailwind v4.

The migration runs on the `next-migration` git branch. The `main`
branch continues to serve the static HTML site in production until
the migration is finished and validated.

## Architecture

- **Next.js 15** App Router, React 19
- **Tailwind v4** with CSS-based theme tokens (`app/globals.css`)
- **TypeScript** strict mode
- **Server-side form submission** to GHL via `/api/submit-lead` using
  a Private Integration Token stored in Vercel env vars
- **Existing static CSS preserved** so the visual identity stays
  byte-identical during migration — the previous `critical.min.css`,
  `premium.css`, `mobile-fixes.css` are still loaded from
  `/assets/css/` and Tailwind composes on top.

## Done in this session

- [x] `package.json` with Next.js 15 + React 19 + Tailwind v4 + TS
- [x] `next.config.mjs` — redirects mirror existing `vercel.json`
- [x] `tsconfig.json` with `@/*` path alias (excludes legacy dirs)
- [x] `postcss.config.mjs` for Tailwind v4 PostCSS plugin
- [x] `app/globals.css` — Tailwind v4 `@theme` tokens matching brand
- [x] `app/layout.tsx` — root layout with metadata defaults + GA4
- [x] `app/page.tsx` — home with metadata export, JSON-LD schemas
      from `data/schema/*.json`, header, hero, form, footer
- [x] `app/api/submit-lead/route.ts` — POST endpoint that creates
      a GHL contact using `GHL_PIT` env var
- [x] `app/not-found.tsx` — 404 with header/footer
- [x] `components/Header.tsx` — top-bar + main nav (extracted markup)
- [x] `components/Footer.tsx` — site footer (extracted markup)
- [x] `components/HeroForm.tsx` — service picker + GHL iframe (client)
- [x] `data/schema/home-graph.json` — Organization/LocalBusiness
      @graph (wave 1 schema preserved)
- [x] `data/schema/home-faq.json` — FAQPage
- [x] `data/schema/home-howto.json` — HowTo facility assessment steps
- [x] `.env.local.example` documenting required env vars
- [x] `.gitignore` updated to block `.env`, `node_modules`, `.next`

## Pending (next sessions)

- [ ] Migrate remaining root pages: about, contact, pricing, reviews,
      privacy, terms, sitemap, faq, press, healthcare-facilities,
      service-specific landing pages (atp-assessment,
      cardiology-clinic-cleaning, dental-office-cleaning, etc.)
- [ ] Dynamic route `app/locations/[city]/page.tsx` + `generateStaticParams`
      that yields all 295 cities from `data/cities.json`. Each page reads
      its content from `data/locations/{city}.json` extracted from the
      existing static HTML.
- [ ] Dynamic route `app/services/[service]/page.tsx` (5 hubs).
- [ ] Dynamic route `app/services/[service]/[city]/page.tsx` (1,481
      noindexed service-city pages).
- [ ] Dynamic route `app/blog/[slug]/page.tsx` (20 posts).
- [ ] Run `scripts/extract-html-to-json.py` (to be written) that
      walks every static HTML file and produces a corresponding JSON
      data file with `{ title, description, canonical, schemas[],
      mainContentHtml }` so the Next.js pages can render it via
      `dangerouslySetInnerHTML` until each section is properly
      componentized.
- [ ] Migrate the inline `mobile-fixes.css` floating phone CTA, sticky
      mobile CTA bar, and near-cities widget into React components.
- [ ] Wire up Vercel env vars (`GHL_PIT`, `GHL_LOCATION_ID`).
- [ ] Test build with `npm run build` on a clean checkout.
- [ ] Push branch and review Vercel preview before merging to main.

## Env vars required in Vercel (production)

```
GHL_PIT=pit-<rotate-after-chat-exposure>
GHL_LOCATION_ID=BQd0L6DeFvVbjKS8VYZ9
```

`GHL_PIT` is server-side only. Never commit it. Set in
Vercel → Project → Settings → Environment Variables, mark as
encrypted, scope to Production + Preview.

## What was preserved from the static site

- Brand palette and typography (Inter + Poppins with size-adjust
  fallbacks for zero CLS during font swap)
- All `<meta>` tags including `geo.*`, `ICBM`, `ai-summary`, etc.
- The full Organization/LocalBusiness `@graph` with 8
  `alternateName` variants, ContactPoint array, Person founder,
  WebSite SearchAction, openingHoursSpecification, etc.
- FAQPage + HowTo schemas verbatim
- The exact iframe form ID `oaN0aNeRAK8fPG4AnIzl` and location ID
  `BQd0L6DeFvVbjKS8VYZ9` so existing GHL workflows continue to fire
- The service picker UX and ?service= URL parameter pattern
- GA4 measurement ID `G-2MP9G52LW7`
- The static `/assets/` directory is still loaded so all images and
  the existing CSS files (`critical.min.css`, `premium.css`,
  `mobile-fixes.css`, `footer.css`, etc.) keep working unchanged.

## Production stays live during migration

`main` branch = static HTML, currently in production at
doryscleaningservices.com — untouched until we merge.

`next-migration` branch = Next.js work-in-progress. Vercel auto-deploys
this branch to a preview URL like
`dorys-next-migration-<hash>.vercel.app` for QA. Production only
switches when we explicitly merge to main.
