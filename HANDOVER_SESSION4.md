# HANDOVER: Samba Jarju Portfolio & ABM System — Session 4

> **For the AI:** Read this ENTIRE document before making ANY changes. Do NOT hallucinate fixes. If you are unsure about something, ask Samba for clarification or a screenshot.

---

## PROJECT OVERVIEW

Personal portfolio + Account-Based Marketing (ABM) outreach system for Samba Jarju.

**Live URL:** https://sambajarju.com
**Repo:** https://github.com/sambajarju2-png/sambajarju.git
**Branch:** main (auto-deploys to Vercel on push)
**GitHub Token:** (see previous handover or Vercel env — do NOT commit tokens)

---

## TECH STACK

| Tech | Version | Purpose |
|---|---|---|
| Next.js | 16.2.2 | App Router, SSR, API routes |
| React | 19 | UI |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 4.2.2 | Styling (`@import "tailwindcss"` syntax) |
| Framer Motion | 12.38+ | Animations |
| next-intl | latest | Bilingual NL/EN |
| next-themes | latest | Dark/light/system mode |
| Supabase | latest | Auth (Google), DB (ABM data) |
| Sanity CMS | v3 | Content management (embedded at /studio) |
| YakPDF | API | PDF CV generation (via RapidAPI) |
| Mailgun | EU API | Email sending + receiving |
| colorthief | latest | Brand color extraction from logos |
| Logo.dev | CDN | Company logo fetching |

---

## ENVIRONMENT VARIABLES (Vercel)

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude Sonnet (chatbot) + Haiku (personalization) |
| `LOGO_DEV_TOKEN` | Logo.dev (server-side) |
| `NEXT_PUBLIC_LOGO_DEV_TOKEN` | Logo.dev (client-side) |
| `LOGO_DEV_SECRET` | Logo.dev secret |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `ncaxnx1f` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Editor token |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://znktohqimzhwoujxzkds.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-side) |
| `MAILGUN_API_KEY` | Mailgun sending API key |
| `MAILGUN_DOMAIN` | `sambajarju.com` |
| `MAILGUN_WEBHOOK_SIGNING_KEY` | Mailgun webhook signing key |
| `YAKPDF_API_KEY` | YakPDF RapidAPI key for PDF generation |
| `CV_PHOTO_URL` | (optional) Override photo URL for CV PDF |

---

## WHAT WAS DONE IN SESSION 4

### PDF CV System (COMPLETED)
- **Removed** `@react-pdf/renderer` (limited CSS, font issues, boring output)
- **Removed** `puppeteer-core` + `@sparticuz/chromium` (failed on Vercel — `libnss3.so` missing, tried multiple approaches including chromium-min, full chromium, postinstall scripts, serverExternalPackages — none worked)
- **Implemented** YakPDF API (https://yakpdf.com) — simple HTTP POST with HTML, returns PDF. Free tier 200/month.
- CV is now a full HTML/CSS page with split-panel layout, skill bars, tool tags, experience cards
- **NL/EN bilingual** CV content — `?lang=nl` or `?lang=en`
- **Color contrast safety** — `safeBrandColors()` in `src/lib/color-utils.ts` ensures readable text regardless of brand colors (fixes light-colored brands like Shell)
- **Photo support** — defaults to Supabase-hosted photo, overridable via `CV_PHOTO_URL` env var
- Default photo URL: `https://znktohqimzhwoujxzkds.supabase.co/storage/v1/object/public/Profile%20pic/Zonder%20titel%20(400%20x%20400%20px).png`

### Admin Dashboard (COMPLETED)
- **Tab interface**: Single send / Bulk CSV import
- **Language toggle**: 🇳🇱 NL / 🇬🇧 EN per contact — determines email template, CV language, landing page locale
- **CSV bulk import**: Upload CSV with columns `domain, firstname, lastname, email, role, language`
- **Two actions**: "Alleen importeren" (save to Supabase) or "Import + Verstuur" (save + send emails)
- **Preview links** include language param

### Email Templates (COMPLETED)
- **Dutch template**: Dutch subject, body, CTA text, landing at `/nl/landing`
- **English template**: English subject, body, CTA text, landing at `/en/landing`
- Email includes attached PDF CV (branded per company)

### Sanity CMS (PARTIALLY COMPLETED)
- **Studio works** at `https://sambajarju.com/studio` — fixed `basePath: '/studio'` in `sanity.config.ts`
- **Schemas exist**: heroSettings, about, project, experience, testimonial, faq, tool
- **Data fetching**: `src/lib/sanity-queries.ts` has fetch functions for all content types
- **Wired to components**: Hero (photo), About (4 photos), Experience, Testimonials, FAQ
- **Image URL builder**: Updated to `createImageUrlBuilder` (named export, not deprecated default)
- **Sanity client**: `useCdn: false` for fresh data, revalidate every 30 seconds
- **⚠️ ISSUE**: About section photos uploaded in Sanity but NOT showing on the website. The Sanity API returns the image data correctly, the URL builder generates valid URLs. The issue may be caching, ISR, or a component rendering issue. **Needs debugging with actual browser DevTools** — not guessing.

### Outreach API (COMPLETED)
- `POST /api/outreach/send` — accepts `language` param, uses NL or EN email template
- `POST /api/outreach/bulk` — accepts array of contacts, imports and/or sends
- CV PDF attached to emails via YakPDF API
- Outreach logged in Supabase `outreach_logs` and `email_threads`

---

## KNOWN BUGS — ACTIVE

### CRITICAL: Hero CTA buttons invisible on mobile Safari
**Status:** UNRESOLVED after 8+ attempts across 2 sessions.
**Current state:** Buttons hidden on mobile (`hidden sm:flex`), visible on desktop only.
**Root cause (confirmed by 3 independent AI models):** Framer Motion's `initial={{ opacity: 0, y: 20 }}` on the parent `motion.div` creates a GPU-composited layer. iOS Safari has a known bug where text inside such layers fails to paint. This affects `<button>` elements specifically.

**What was tried and failed:**
1. Inline styles with `color: '#ffffff'` and `WebkitTextFillColor: '#ffffff'`
2. Custom CSS classes in globals.css with `!important` on `color` and `-webkit-text-fill-color`
3. Pure Tailwind `text-white` with `appearance-none` and `suppressHydrationWarning`
4. `<button>` instead of `<a>` tags
5. Removing `overflow-hidden` from parent section → changed to `overflow-x-hidden`
6. Adding `border-0` to strip iOS Safari default button border
7. Removing the `motion.div` wrapper entirely (plain `<div>`) — this DOES fix the text but Samba doesn't want to lose the animations
8. Adding `transform: translateZ(0)` to force GPU repaint — not tested yet

**What the working `/for` page does differently:**
- Uses `<a>` and `<Link>` tags, NOT `<button>`
- Uses hardcoded text, NOT `next-intl` translation hooks
- Buttons are NOT wrapped in a `motion.div` with opacity/transform animation
- Full code at: `src/app/[locale]/for/page.tsx`

**Suggested next steps:**
- Try `<a>` tags instead of `<button>` (the working page uses `<a>`)
- Try hardcoded text with a mounted state (render translation only after client mount)
- Try `transform: translateZ(0)` + `backface-visibility: hidden` on buttons
- Try animating only opacity (no y transform) on the wrapper
- Use actual Safari DevTools (Develop → iPhone → Web Inspector) to inspect the rendered DOM and computed styles

### About section photos not showing
**Status:** Data exists in Sanity, URLs are valid, component code looks correct.
**Needs:** Actual browser DevTools inspection to see if images are loading, blocked, or not rendered.

---

## FILE STRUCTURE (Updated)

```
src/
├── app/
│   ├── globals.css              # Design tokens, CSS vars (NO hero-cta classes anymore)
│   ├── layout.tsx               # Root layout
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale layout (header, footer, chatbot, theme)
│   │   ├── page.tsx             # Main portfolio page (async, fetches Sanity data)
│   │   ├── landing/page.tsx     # ABM branded landing page
│   │   ├── playground/page.tsx  # Interactive demos
│   │   ├── for/page.tsx         # Company personalization demo (WORKING buttons)
│   │   └── test/page.tsx        # Brand API comparison
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout (no locale, no header)
│   │   └── page.tsx             # ABM dashboard (single + bulk CSV + NL/EN toggle)
│   ├── studio/
│   │   ├── layout.tsx           # Studio layout (minimal, no header/footer)
│   │   └── [[...tool]]/page.tsx # Embedded Sanity Studio
│   └── api/
│       ├── chat/route.ts        # Claude Sonnet chatbot
│       ├── personalize/route.ts # Logo.dev + Color Thief + Claude Haiku
│       ├── cv/generate/route.ts # YakPDF-based PDF CV generator (NL/EN, branded)
│       ├── outreach/
│       │   ├── send/route.ts    # Send single branded email (NL/EN templates)
│       │   └── bulk/route.ts    # Bulk import + send from CSV
│       ├── admin/stats/route.ts # Dashboard stats
│       ├── landing/track/route.ts # Page view tracking
│       └── webhooks/mailgun/
│           ├── route.ts         # Outbound event tracking
│           └── inbound/route.ts # Inbound email storage
├── components/
│   ├── layout/ (header, footer)
│   ├── sections/ (hero, about, projects, tool-stack-float, experience, testimonials, faq, contact, playground)
│   └── ui/ (chatbot, command-menu, motion, scroll-progress, theme-toggle, language-toggle)
├── lib/
│   ├── sanity.ts               # Sanity client + createImageUrlBuilder
│   ├── sanity-queries.ts       # All Sanity fetch functions (hero, about, experience, etc.)
│   ├── generate-cv-pdf.tsx     # HTML CV template + YakPDF API call (NL/EN)
│   ├── color-utils.ts          # safeBrandColors(), contrastRatio(), isLight()
│   └── supabase/
│       ├── client.ts           # Browser client
│       └── server.ts           # Admin client (service role)
├── sanity/schemas/             # All 7 Sanity schemas
├── i18n/ (routing.ts, request.ts)
├── middleware.ts               # next-intl middleware
sanity.config.ts                # Embedded Sanity Studio config (basePath: '/studio')
messages/ (en.json, nl.json)    # Translations
```

---

## SANITY CMS STATE

- **Project ID:** ncaxnx1f
- **Dataset:** production
- **Studio URL:** https://sambajarju.com/studio
- **basePath:** `/studio` (in sanity.config.ts — required to avoid "Tool not found: studio" error)
- **Image URL builder:** Uses `createImageUrlBuilder` (named export from `@sanity/image-url`)
- **Client:** `useCdn: false` for fresh data
- **CORS:** `https://sambajarju.com` added

### Content populated:
- ✅ Hero Section — photo uploaded, greeting/title/subtitle filled
- ✅ About Section — 4 photos uploaded (same photo for all 4 currently)
- ❓ Experience — check if populated
- ❓ Projects — check if populated
- ❓ Testimonials — check if populated
- ❓ FAQ — check if populated
- ❓ Tools — check if populated

### Components wired to Sanity:
- ✅ Hero — photo from Sanity
- ✅ About — 4 photos from Sanity (but not showing — needs debug)
- ✅ Experience — company/role/description with NL/EN
- ✅ Testimonials — name/quote/role with NL/EN
- ✅ FAQ — question/answer with NL/EN
- ❌ Projects — still hardcoded
- ❌ Tool Stack — still hardcoded

All components fall back to translation files (`messages/nl.json`, `messages/en.json`) if Sanity returns no data.

---

## PDF CV SYSTEM

- **API:** `GET /api/cv/generate?company=nike.com&contactname=John&lang=en`
- **Engine:** YakPDF API (https://yakpdf.com via RapidAPI)
- **Template:** Full HTML/CSS split-panel layout in `src/lib/generate-cv-pdf.tsx`
- **Features:**
  - NL/EN bilingual content
  - Company branding (colors, logo, name) via `/api/personalize`
  - Color contrast safety via `safeBrandColors()`
  - Profile photo from Supabase storage
  - Skill bars, tool tags, experience cards with tech badges
- **Photo:** Hardcoded default URL from Supabase storage (400x400 PNG)
- **Free tier:** 200 PDFs/month (sufficient for ABM outreach volume)

---

## ABM SYSTEM FLOW

```
Admin (/admin)
  → Tab: Single send
    → Enter company domain, contact info, select NL/EN
    → API: /api/outreach/send
      → Upsert company (fetches brand via /api/personalize)
      → Upsert contact in Supabase
      → Generate NL or EN email HTML
      → Generate branded CV PDF via YakPDF
      → Send via Mailgun with PDF attachment
      → Log in outreach_logs + email_threads
  → Tab: Bulk CSV
    → Upload CSV (domain, firstname, lastname, email, role, language)
    → Preview table with language badges
    → "Alleen importeren" or "Import + Verstuur"
    → API: /api/outreach/bulk → loops through contacts
  → Recipient receives email
    → Clicks CTA → /{locale}/landing?company=X&contactname=Y
    → CV attached as PDF in email
  → Mailgun webhooks track opens/clicks
  → Replies forwarded to Gmail + stored in email_threads
```

---

## TAILWIND CSS v4 + iOS SAFARI ISSUES

This is the single biggest pain point of the project. Tailwind CSS v4 generates OKLCH color values that older Safari versions don't support. Combined with Framer Motion GPU compositing, this causes invisible text on mobile Safari.

**Known facts:**
- `text-white` in Tailwind v4 generates `color: oklch(1 0 0)` — Safari may drop this
- `-webkit-text-fill-color: #ffffff` can cause Safari to fail painting text entirely when inside a GPU-composited layer
- Framer Motion's `initial={{ opacity: 0, y: 20 }}` creates GPU layers that trigger Safari text painting bugs
- `<button>` elements are more affected than `<a>` elements
- The `/for` page (`src/app/[locale]/for/page.tsx`) has working buttons because they use `<a>`/`<Link>` tags without Framer Motion wrappers

**Current workaround:** Hero CTA buttons are hidden on mobile (`hidden sm:flex`).

---

## HOW TO PUSH

```bash
cd /home/claude/sambajarju
git add -A
git commit -m "your message"
git push origin main --force
```

Vercel auto-deploys on push to main within ~60 seconds.

---

## IMPORTANT NOTES

- **Tailwind CSS 4** uses `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
- **Framer Motion** imported from `framer-motion` (not `motion/react`)
- **next-intl** translations in `/messages/en.json` and `/messages/nl.json`
- **Supabase key naming:** Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **Mailgun API:** Uses EU endpoint `https://api.eu.mailgun.net/v3/`
- **Sanity image URL:** Use `createImageUrlBuilder` (named export), NOT default `imageUrlBuilder`
- **Sanity basePath:** Must be `/studio` in `sanity.config.ts`
- **YakPDF:** POST to `https://yakpdf.p.rapidapi.com/pdf` with `x-rapidapi-key` header
- **GitHub token** should be revoked after use at https://github.com/settings/tokens
