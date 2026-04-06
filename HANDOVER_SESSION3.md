# HANDOVER: Samba Jarju Portfolio & ABM System — Session 3

> **For the AI:** Read this ENTIRE document before making ANY changes.

---

## PROJECT OVERVIEW

Personal portfolio + Account-Based Marketing (ABM) outreach system for Samba Jarju.

**Live URL:** https://sambajarju.com
**Repo:** https://github.com/sambajarju2-png/sambajarju.git
**Branch:** main (auto-deploys to Vercel on push)
**GitHub Token:** (see Claude chat history or Vercel env)

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
| Puppeteer | latest | PDF CV generation |
| @sparticuz/chromium | latest | Chromium for Vercel serverless |
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
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-side, bypasses RLS) |
| `MAILGUN_API_KEY` | Mailgun sending API key |
| `MAILGUN_DOMAIN` | `sambajarju.com` |
| `MAILGUN_WEBHOOK_SIGNING_KEY` | Mailgun webhook signing key |

---

## SUPABASE (Project: znktohqimzhwoujxzkds)

### Tables:
- `companies` — domain, name, logo_url, brand_color_primary, brand_color_secondary
- `contacts` — company_id (FK), first_name, last_name, email, role
- `outreach_logs` — contact_id, company_id, message_id, subject, status, timestamps
- `page_views` — company_id, contact_id, path, referrer, user_agent
- `email_threads` — direction (inbound/outbound), from_email, to_email, subject, body_plain, body_html, message_id, in_reply_to

### RLS: Enabled on all tables. Authenticated users get full access. Public can INSERT page_views. Service role bypasses RLS for API routes.

### Auth: Google OAuth enabled. Admin restricted to `sambajarju2@gmail.com`.

---

## MAILGUN SETUP

- **Sending domain:** sambajarju.com
- **From address:** `samba@sambajarju.com`
- **Tracking hostname:** `track` (CNAME `track.sambajarju.com → eu.mailgun.org`)
- **Tracking:** Click tracking and Open tracking need to be ENABLED in Mailgun dashboard (currently OFF)
- **Inbound:** MX records point to `mxa.eu.mailgun.org` and `mxb.eu.mailgun.org`
- **Inbound route:** Match `samba@sambajarju.com` → forward to `sambajarju2@gmail.com` + store/notify `https://sambajarju.com/api/webhooks/mailgun/inbound`
- **Outbound webhook:** All events → `https://sambajarju.com/api/webhooks/mailgun`

---

## SANITY CMS (Project: ncaxnx1f)

### Schemas:
- `heroSettings` (singleton) — photo, greeting, title, subtitle, CTAs, companies
- `about` (singleton) — photos, bio, highlights
- `project` (multiple) — title, slug, description, image, techStack, url
- `experience` (multiple) — company, role, period, description
- `testimonial` (multiple) — name, role, company, quote
- `faq` (multiple) — question, answer
- `tool` (multiple) — name, slug, color, category, description

### All schemas have NL/EN fields for bilingual support.
### Embedded Studio at `/studio` route.
### CORS: `https://sambajarju.com` added.

---

## FILE STRUCTURE

```
src/
├── app/
│   ├── globals.css              # Design tokens, CSS vars, hero CTA classes
│   ├── layout.tsx               # Root layout
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale layout (header, footer, chatbot, theme)
│   │   ├── page.tsx             # Main portfolio page
│   │   ├── landing/page.tsx     # ABM branded landing page (?company=&contactname=)
│   │   ├── playground/page.tsx  # Interactive demos
│   │   ├── for/page.tsx         # Company personalization demo
│   │   └── test/page.tsx        # Brand API comparison
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout (no locale, no header)
│   │   └── page.tsx             # ABM dashboard (Google auth, stats, send form, inbox)
│   ├── studio/[[...tool]]/page.tsx  # Embedded Sanity Studio
│   └── api/
│       ├── chat/route.ts        # Claude Sonnet chatbot
│       ├── personalize/route.ts # Logo.dev + Color Thief + Claude Haiku
│       ├── cv/generate/route.ts # Puppeteer PDF CV generator
│       ├── outreach/send/route.ts  # Send branded email via Mailgun
│       ├── admin/stats/route.ts # Dashboard stats from Supabase
│       ├── landing/track/route.ts  # Page view tracking
│       └── webhooks/mailgun/
│           ├── route.ts         # Outbound event tracking (opens, clicks)
│           └── inbound/route.ts # Inbound email storage
├── components/
│   ├── layout/ (header, footer)
│   ├── sections/ (hero, about, projects, tool-stack-float, experience, testimonials, faq, contact, playground)
│   ├── playground/ (8 interactive demos including Snowflake SQL builder)
│   └── ui/ (chatbot, command-menu, motion, scroll-progress, theme-toggle, language-toggle)
├── lib/
│   ├── sanity.ts               # Sanity client + image URL builder
│   └── supabase/
│       ├── client.ts           # Browser client (publishable key)
│       └── server.ts           # Admin client (service role, bypasses RLS)
├── sanity/schemas/             # All 7 Sanity schemas
├── i18n/ (routing.ts, request.ts)
├── middleware.ts               # next-intl middleware
sanity.config.ts                # Embedded Sanity Studio config
messages/ (en.json, nl.json)    # Translations
```

---

## LOCALE ROUTING (Current State)

- `localePrefix: 'as-needed'` — Dutch is root `/`, English at `/en`
- **PENDING:** User wants option B — remove `/en` prefix entirely, translate in-place without URL change (like PayWatch). This is a significant refactor of next-intl.
- Middleware excludes: `/api`, `/studio`, `/admin`, `/_next`, static files

---

## KNOWN BUGS / PENDING WORK

### HIGH PRIORITY:
1. **Hero CTA buttons invisible on mobile** — PERSISTENT issue through many attempts. Every `<a>` tag approach failed due to Tailwind CSS v4 OKLCH color system on Safari. Current approach uses `<button>` with 100% inline styles. Status: may still be broken — needs mobile testing.
2. **Language toggle** — User wants to remove `/en` prefix and use in-place translation (like PayWatch). Not yet implemented.
3. **CV PDF build** — Uses Puppeteer + @sparticuz/chromium. Last build had TypeScript error with `Buffer.from(pdf) as unknown as BodyInit` — may need further fix.

### MEDIUM PRIORITY:
4. **Sanity CMS not wired to components** — Schemas exist, Studio works at /studio, but no components fetch data from Sanity yet. All content is still hardcoded or in translation files.
5. **Hero photo** — Placeholder on desktop, hidden on mobile. User wants to upload via Sanity and show on mobile too.
6. **Mailgun tracking** — Track CNAME added, but Click/Open tracking still OFF in Mailgun dashboard. User needs to enable them.

### LOWER PRIORITY:
7. **SQL Playground** — PayWatch debt dataset added. Could add more real-life marketing scenarios.
8. **Hero gradient transition** — Removed bottom gradient to fix overlay issues. Now has a hard 1px border between hero and next section. Could be smoother.
9. **@react-pdf/renderer** still installed but unused (replaced by Puppeteer). Can be removed to save bundle size.

---

## DESIGN DIRECTION

### Colors (DO NOT CHANGE):
```
Primary dark:    #023047  (deep navy — hero, dark sections)
Accent pink:     #EF476F  (CTAs, highlights)
Light teal:      #A7DADC  (secondary, accents)
White:           #FFFFFF  (cards, surfaces)
```

### Style:
- Stripe.com-inspired SaaS aesthetic for a MARKETER
- Hero: dark navy gradient with magnetic filings effect (desktop)
- Body: alternating light backgrounds
- Glassmorphism cards, spring physics animations
- Font: Geist (loaded locally)

### CRITICAL: Tailwind CSS v4 color issues on Safari
- `text-white` generates `color: oklch(1 0 0)` which older Safari drops
- ALL hero text uses inline `style={{ color: '#ffffff' }}` to bypass
- Hero CTAs use `<button>` elements (not `<a>`) because Safari anchor styling breaks
- This is a Tailwind v4 framework issue, not a code bug

---

## ABM SYSTEM FLOW

```
Admin (/admin)
  → Enter company domain + contact info
  → API: /api/personalize (Logo.dev + Color Thief + Claude Haiku)
  → API: /api/outreach/send
    → Upsert company + contact in Supabase
    → Generate branded HTML email (company colors + logo)
    → Send via Mailgun (from: samba@sambajarju.com)
    → Log in outreach_logs + email_threads
  → Recipient receives email
    → Clicks CTA → /landing?company=X&contactname=Y (tracked)
    → Clicks CV link → /api/cv/generate?company=X&contactname=Y (branded PDF)
  → Mailgun webhook tracks opens/clicks → updates outreach_logs
  → Reply → Mailgun inbound → forwarded to Gmail + stored in email_threads
  → Admin dashboard shows all stats, outreach table, inbox
```

---

## HOW TO PUSH

```bash
cd /home/claude/sambajarju
git add -A
git commit -m "your message"
git push origin main --force
```

Vercel auto-deploys on push to main.

---

## IMPORTANT NOTES

- **Tailwind CSS 4** uses `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
- **Framer Motion** imported from `framer-motion` (not `motion/react`)
- **next-intl** translations in `/messages/en.json` and `/messages/nl.json`
- **Supabase key naming:** Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (new Supabase naming, not `ANON_KEY`)
- **Mailgun API:** Uses EU endpoint `https://api.eu.mailgun.net/v3/`
- **@sparticuz/chromium:** Latest version removed `defaultViewport` export — use explicit viewport in puppeteer.launch()
- **NextResponse with Buffer:** TypeScript in Next.js 16 doesn't accept `Buffer` or `Uint8Array` as `BodyInit` — cast with `as unknown as BodyInit`
