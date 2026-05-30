# Dory's Cleaning — Design Review & System
*Produced by the `designing-beautiful-websites` skill, run against the live site (doryscleaningservices.com).*

## 1. Design brief
- **Primary user:** B2B facility administrator / DON / office manager of a MA healthcare facility (medical office, specialty clinic, ambulatory/outpatient, rehab & nursing, healthcare admin).
- **Primary goal:** request a free facility assessment (lead) — phone call or form.
- **Business goal:** qualified B2B leads from MA cities; rank for "[service] cleaning [city]".
- **Success metrics:** form submits + phone clicks; organic visibility on location/service pages.
- **Brand signals:** clinical trust. Blue `#2b70e4` + gold `#f59e0b`; Inter (body) / Poppins (headings).
- **Constraints:** Next.js 15 + legacy CSS; GHL iframe form (white, fixed 500px); CLS budget (~0.05).

## 2. IA + key flows
- **Nav:** Home · Services (5) · Service Areas (296 cities) · For Healthcare Facilities · Pricing · About · Blog · Reviews · Contact.
- **Key path A (convert now):** land → hero value prop → pick facility type → submit form / call. *Optimise above-fold.*
- **Key path B (local intent):** city page → "services in [city]" → service-city page → CTA.
- **Key path C (trust-building):** home → process → social proof → FAQ → CTA.

## 3. Component inventory (key pages)
| Component | States to define |
|---|---|
| Trust strip | static (5 proofs; ≤4 on mobile) |
| Hero (split: copy+CTA / form card) | default; form loading; form loaded |
| Service card (grid 3+2) | default · hover (lift) · focus |
| Service picker pill (radiogroup) | default · hover · **selected (gold)** · focus |
| Stat counters | static |
| Process steps (4) | static |
| Trust cards (2×2) | default · hover |
| Testimonials | static |
| FAQ accordion | collapsed · expanded · focus |
| CTA band | default |
| Footer (NAP + city links) | static |

## 4. Design tokens (current → rule)
```
color.primary   #2b70e4   color.primary-dark #1a5bc4
color.gold      #f59e0b   color.gold-dark    #d97706
color.ink       #1a1a2e   color.text         #334155 / #475569
spacing scale   4 8 12 16 24 32 48 64 96 128   (pick from scale, no one-offs)
type scale      12 14 16 20 24 30 40 (+clamp for hero)   body line-height 1.6
radius          8 / 12 / 16 / 999(pill)
shadow          1 card · 2 menu · 3 sticky header · 4 modal
focus ring      0 0 0 3px rgba(43,112,228,.35)  (added in elevate.css)
hero overlay    black scrim 0.82→0.42 (no blue)
```
**Rule:** inside-group spacing < between-group spacing; weight/colour before new type sizes.

## 5. Critique — issues by severity
**P1 (fix now)**
- ✅ *Fixed:* blank white sections (scroll-reveal opacity:0 regression) — removed.
- ✅ *Fixed:* hero blue wash → black scrim.
- ✅ *Fixed:* picker a11y (radiogroup/role=radio + label-in-name).
- ✅ *Fixed:* picker pill contrast (was ~1:1) → solid dark base + gold selected.

**P2 (next iteration)**
- Hero form is a white 500px GHL iframe on a dark card — acceptable (form should stand out) but the pre-load state could show a dark skeleton instead of white flash.
- `/faq` heading order H1→H3 (skips H2) — promote question grouping or add a section H2.
- Hub pages (`/locations`) render 296 link children (4.8k DOM nodes) — consider grouping by county / lazy reveal.

**P3 (polish)**
- Generic link text ("learn more", "read more") → make city/service-specific for a11y + SEO.
- Add a Google Business Profile / Maps link in footer (NAP present; GBP link missing) for local SEO.

## 6. States & edge cases
- **Form loading:** reserve fixed height (done: 630px) so no CLS; ideally dark skeleton not white.
- **Long city names:** hero H1 uses clamp — verify wrap on small phones.
- **No-JS / unsupported anim:** content must never depend on animation (enforced — scroll-reveal removed).
- **Reduced motion:** hover transforms disabled (in elevate.css).

## 7. Glance test (10s, home)
- *What is this?* Healthcare facility cleaning in MA — clear (H1 + trust strip).
- *Primary action?* "Get Your Custom Quote" form + phone CTA — clear.
- *Navigation?* Top nav — clear.
- ✅ Passes. Remaining question-marks were the blue wash + white gaps (fixed).

## Next iteration plan
1. Dark skeleton for the GHL form pre-load (kill white flash).
2. `/faq` heading hierarchy.
3. Group `/locations` 296 links by county (DOM + UX).
4. Specific link text + GBP link in footer.
