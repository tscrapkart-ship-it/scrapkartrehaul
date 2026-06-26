# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## How This Project Is Being Built

The user is **vibe coding** this entire project — building it end-to-end through AI-assisted development. There is no separate dev team. Claude Code is the primary coding collaborator throughout the full lifecycle.

**What this means in practice:**
- Proactively explain decisions, not just write code. The user learns as we build.
- When multiple valid approaches exist, state the tradeoff and recommend one — don't ask the user to decide on technical details they shouldn't need to worry about.
- During **Supabase integration** (auth, database schema, RLS, storage, realtime), take the lead: write the SQL, generate the migration files, set up the client utilities, and walk the user through what to do in the Supabase dashboard step-by-step.
- Keep momentum. Prefer completing a feature end-to-end rather than stopping to ask about every small detail.
- If something is a V1 placeholder (see below), say so clearly rather than over-engineering it.

**Working preferences (durable — confirmed across multiple sessions):**
- **Backend stays untouched unless explicitly authorized.** If a frontend task requires a schema, RLS, or trigger change, surface it as a separate question first — don't quietly apply migrations.
- **Test locally before pushing.** Default flow is: build → user views localhost → user explicitly says "push" → then commit + push. Never run `git push` proactively at the end of a task.
- **Commit messages omit Claude co-author trailers.** Use the user's name only. Do NOT append `Co-Authored-By: Claude ...` lines.
- **When the user signals confusion or overwhelm ("a bit confused", "revert", "wait")**, drop multi-step lists and serve one step at a time. Wait for "done" before the next step.
- **B2B aesthetic must look professional, not like B2C-sibling.** The founder rejected an earlier attempt at B2C-style playfulness. Refined Premium (paper / forest / Fraunces italic) is the locked direction.

---

## Project Status

**All phases complete including admin dashboard and seed data. App is live on Vercel.** Full product context, domain model, user journeys, and feature scope are documented in `SCRAPKART.md`.

### 🚧 ACTIVE: Business-Flow Rehaul (Phase 20 — in progress, NOT yet finalized)
A major rebuild of the B2B business flow is the current focus. The live site (`b2b.scrapkart.app`) still reflects the OLD flow — full identity exposure, free-text messaging. **Source-of-truth (team-approved direction):** `business decision.md` at the b2b side root. Read it first.

Two parallel workstreams:

**A. Disintermediation / platform lock-in (founder-confirmed: commission model).**
The problem: buyers + sellers currently see each other's company name + email and can free-text contacts, so they meet once via us then deal directly. We want Upwork-style stickiness. Key insight: scrap is physical (they meet at pickup), so identity-masking only protects the *first* deal — the durable lock-in is economic (money + deal record flow through ScrapKart). Four stacking pathways, lightest → strongest:
1. **Masked Marketplace** (build first; no payments needed) — alias + verified badge + rating instead of company name; structured bids (no free-text message box); first-names + fixed pickup time-slots + canned messages (no open chat) after acceptance; money still direct.
2. **Commission on every deal** — platform charges a fee on close (needs basic payments).
3. **Escrow** — buyer prepays into ScrapKart, released to seller on OTP-verified pickup, commission skimmed (needs full payments + KYC).
4. **Managed pickup** — ScrapKart arranges logistics so parties may never meet (long-term, heavy ops).
Trust substitute while names are hidden: ScrapKart-verified badge (GST/licence/KYC) + rating/deal history.

**B. Service-type dimension** (separate workstream, from a recycler's feedback via Muzammil; not built yet): seller picks intended service per listing — **Recycle / Refurbish / Resell** (refurbishers quote higher); buyers carry a capability and filter the marketplace by service type so e.g. a pure recycler quotes only on non-refurbish items. Note `recycler_profiles.processing_types` already exists in schema (includes "Refurbishment") as partial scaffolding.

**Current code touchpoints the rehaul will change (verify before editing — code evolves):**
- Identity leaks today: `transactions/[id]/page.tsx:~320` (counterpart name + email in plaintext) · `/transactions/[id]/chat` (free chat) · `submit-bid-dialog.tsx` (free-text bid `message`) · `seller_response_message` (free-text seller reply) · `(public-browse)/marketplace/[id]/page.tsx` + company profile (company name public).
- Service-type: new field on `scraps` (backend) + posting form `(seller)/scraps/new` + `marketplace-filters.tsx` + buyer capability (`recycler_profiles.processing_types` / onboarding).

**Status & decisions still open** (in `business decision.md`): how far to go (mask-only → escrow → managed), commission % and who pays, whether to hide the company name (and whether to show a UID/seller code). **Flow is NOT finalized** — do not start implementation until the direction is locked. Both workstreams require **backend changes** (RLS, new columns, possibly new tables) → must be authorized per the backend-untouched rule before applying.

### What's been built
| Phase | Scope | Status |
|---|---|---|
| 1 | Project init, Tailwind design tokens, initial fonts, root layout (fonts later replaced — see Phase 12) | ✅ Done |
| 2 | Supabase client/server setup, TypeScript domain types, middleware auth guard | ✅ Done |
| 3 | Auth flows — login, signup, role selection (`(auth)/`) | ✅ Done |
| 4 | Seller dashboard — company profile CRUD, scrap listing CRUD, image upload | ✅ Done |
| 5 | Buyer marketplace — browse listings, category filter, company profiles, booking creation | ✅ Done |
| 6 | Post-booking chat — Supabase Realtime messaging per booking thread | ✅ Done |
| 7 | Landing page — hero, stats, how-it-works, categories, features, testimonials, CTA, footer | ✅ Done |
| Supabase | Schema + RLS + storage buckets applied to live project via MCP | ✅ Done |
| UI/UX (v1) | Full frontend overhaul — dark theme, emerald palette, Plus Jakarta Sans. **Superseded by Phase 12** | ⚠️ Replaced |
| 8 | PWA (`@ducanh2912/next-pwa`, `manifest.json`, icons) + Vercel deploy | ✅ Done |
| 9 | Admin dashboard — `/admin/*` route, all 5 pages, admin role + RLS | ✅ Done |
| 10 | Seed/test data — 5 test accounts live in Supabase with companies, listings, bookings, messages | ✅ Done |
| 11 | Google OAuth — Sign in/up with Google on login + signup pages, DB trigger, smart callback routing | ✅ Done |
| 12 | **Refined Premium UI overhaul** — full repaint from dark theme → light paper/forest/mint palette across all 35+ screens. Fraunces serif accents, Inter Tight body, hand-crafted shadows | ✅ Done |
| 13 | **Landing image pass** — hybrid bg-image approach across hero / how-it-works / categories / why / cta sections (`herobg`, `hiwbg`, `categoriesbg`, `whybg`, `ctabg`) | ✅ Done |
| 14 | **Marketing nav redesign** — floating glass pill on scroll, edge-to-edge transparent at top, scroll progress bar, animated mint underlines, IntersectionObserver-driven active section highlighting, hover lift on logo | ✅ Done |
| 15 | **Logo + brand refresh** — user re-cropped white/black logos to 6.5:1 banner aspect. All 4 navs (marketing/admin/buyer/seller), OG card generator, and PWA icon generator updated to match | ✅ Done |
| 16 | **Two-repo split** — landing page (`scrapkart.app`) extracted to its own repo as plain HTML/CSS/JS. This Next.js app is now B2B-only and deploys to `b2b.scrapkart.app` | ✅ Done |
| 17 | **Marketing nav live-ticker** — dark Bloomberg-style strip above the nav with realtime stats (live listings, today delta, trending categories, last bid time). 30s polling via `/api/live-stats`. Hides on scroll; small `● N LIVE` chip stays in the floating pill. See spec `docs/superpowers/specs/2026-05-17-marketing-nav-live-ticker-design.md` | ✅ Done |
| 18 | **Bid accept/decline overhaul** — built `/seller-bookings/[id]` as a real seller bid-detail page (was a dead redirect). Confirmation dialog with optional 280-char response message. Buyer sees the producer's note on their bid view. Backed by new `listing_bids.seller_response_message` column | ✅ Done |
| 19 | **Public marketplace** — `/marketplace` and `/companies` (including detail routes) moved out of `(buyer)/` into a new `(public-browse)/` route group with a role-aware layout. Anonymous visitors can browse; bid action still gated behind sign-in. Added two RLS policies: `"Public can view live scraps"` and `"Public can view companies"` | ✅ Done |

### GitHub & Deployment
- **GitHub (B2B app, this repo):** `https://github.com/tscrapkart-ship-it/scrapkartb2b.git` (branch: `master`)
- **GitHub (umbrella landing, sister repo):** `https://github.com/tscrapkart-ship-it/scrapkartlandingpage.git` — lives in `../main page/`, plain HTML/CSS/JS, owns `scrapkart.app`
- **Deployed:** Vercel (connected to GitHub repo — auto-deploys on push to `master`)
- **Production domain:** `https://b2b.scrapkart.app` (B2B subdomain). The umbrella `https://scrapkart.app` is a separate Vercel project serving the landing site.
- **Supabase Auth allow-list** includes `https://scrapkart.app`, `https://*.scrapkart.app/auth/callback` (covers `b2b.` and future subdomains), the Vercel preview pattern `https://*-tscrapkart-ship-it.vercel.app/auth/callback`, and `http://localhost:3000/auth/callback` for local dev.
- **Build command:** `next build --webpack` (required for `next-pwa` service worker generation — Turbopack is incompatible with PWA webpack plugins)

### What's next
**Launch-blocking:**
1. **OTP security hole on transactions** — `src/app/transactions/[id]/page.tsx:132` compares the recycler-supplied OTP to `tx.pickup_otp` which is returned in the same client query. A recycler can read the OTP from DevTools and bypass pickup verification entirely. Needs a server action that compares without leaking the value. **Must fix before public launch.**
2. **Google OAuth — publish consent screen** — currently in test mode (only added test users can sign in via Google). Before public launch, go to Google Cloud Console → OAuth consent screen → Publish App.

**Industry-grade polish (queued from 2026-05-17 launch-readiness audit):**
3. **`is_approved` gate decision** — column exists on `users`, admin "Approve" button writes to it, but middleware never reads it. Either wire it into middleware to gate access for unapproved sellers, or remove the column + UI entirely. Currently purely cosmetic.
4. **`/transactions/[id]` has no nav shell** — `src/app/transactions/layout.tsx` only renders auth checks and the page itself, no `BuyerNav`/`SellerNav`. Sellers get stuck there after accepting a bid with no way back to their dashboard except browser back button.
5. **Transaction history polish** — the `/transactions` route already lists deals (linked as "Deals" in both buyer + seller navs). The user asked for proper "history/review" framing — may want better empty states, filters, or grouping.
6. **Admin: suspend/activate users** — the users table has no `suspended` column yet; admin users page shows all users but the suspend action is not yet wired up.
7. **Compress `whybg.jpg`** — currently ~14.5 MB on disk. Should down-sample to ~500 KB without visible quality loss.

**Audit findings still pending (lower priority):**
8. **`role === "both"` onboarding flow** is fragile — if a user navigates away mid-flow, middleware could loop them. Happy path works. (`src/app/onboarding/producer/page.tsx:125-129`)
9. **No seller profile edit page** — buyer has `/profile`, seller has only `/company/edit`. Can't update name/phone of the auth account as a seller.
10. **Admin approve button** doesn't `router.refresh()` after action — Status column stays stale until manual refresh. (`src/app/admin/users/approve-user-button.tsx`)
11. **Contact form** silently swallows errors — no user feedback if Supabase insert fails. (`src/app/contact/contact-form.tsx:36-38`)
12. **User-chip dropdowns** in BuyerNav/SellerNav show a ChevronDown but do nothing on click — implies a menu that doesn't exist.
13. **Search** is `ilike` on title only — no full-text index, no search on description/company name.
14. **Dead routes** — several `[id]/page.tsx` files are pure redirect stubs (`/bookings/[id]`, `/seller-bookings/[id]/chat`, `/bookings/[id]/chat`). Safe to delete.

### Installed Animation Libraries (current)
- `framer-motion` — auth page transitions (login, signup, role-select) and various reveal components in `src/components/shared/reveal.tsx`, `motion.tsx`, `parallax-image.tsx`
- `lenis` (`^1.3`) — page-wide smooth scroll, wired in `src/components/shared/lenis-provider.tsx` and mounted in `layout.tsx`. Respects `prefers-reduced-motion`. Lenis **does** dispatch native scroll events, so `window.scrollY` listeners still work (this matters for the marketing nav's pill-on-scroll behavior).
- `nextjs-toploader` — thin 2px forest-color progress bar at top during route transitions. Configured with `color="#0F4D2A" height={2} showSpinner={false}` in `layout.tsx`. Note: this is a **different** bar from the marketing nav's scroll progress bar — toploader fires on navigation, the nav bar tracks scroll position.
- `sonner` — wired into root layout via `<Toaster />`
- **`gsap` removed** — was used in earlier dark-theme version; the Refined Premium overhaul replaced GSAP animations with CSS + Framer Motion. Do not reintroduce unless required.

### Refined Premium UI Overhaul — Active Aesthetic (2026-05)
**The earlier dark-theme overhaul (2026-04-03) has been fully replaced.** Don't re-introduce the dark `#0A0A0A` / `#10B981` emerald palette. The current direction is "Refined Premium" — light paper surfaces, deep forest brand, Fraunces serif italic accents, hand-crafted shadows. Reference spec: `docs/superpowers/specs/2026-04-29-refined-premium-foundation-design.md`.

**Global changes:**
- `src/app/globals.css` — full token re-write (see Design Tokens table below). Surfaces are paper `#FAFAF7`, ink is near-black, brand is deep forest `#0F4D2A`, mint accent `#34D399` reserved for hover/active hairlines
- `src/app/layout.tsx` — three Google fonts: **Inter Tight** (body/display), **Fraunces** (serif italic, used for accent words like "_real weight_" or "_Repeat._"), **JetBrains Mono** (eyebrow captions, badges). NextTopLoader + LenisProvider mounted at root
- `Toaster` from sonner wired in root layout

**Landing page (`src/app/page.tsx` + `src/components/landing/*`):**
- **Hero** — full-bleed `/herobg.jpg` (aerial forest road) with low-opacity paper gradient overlay (left-heavy: 0.82 → 0.16), plus a paper fade strip at bottom. "Trade scrap. Build a _greener_ industry." with Fraunces italic accent. Live marketplace panel sits on the right.
- **How It Works** — split layout: 2×2 step grid on the left, sticky `/hiwbg.jpg` image card (`aspect-[4/5]`) on the right. Section ID `how-it-works` is what the marketing nav's IntersectionObserver watches.
- **Categories Grid** — banner image strip on top (`/categoriesbg.jpg`), then cards. Icons live as faded right-side watermarks (`opacity-[0.10]`, `size-[150px]`), not top-left.
- **Why Section** — full-bleed `/whybg.jpg` with dark forest gradient overlay (`rgba(8,43,25,0.72) → rgba(15,77,42,0.78)`). White heading with `#34D399` mint italic accent. Three paper cards inside hold the actual copy (the image bg was too busy for direct text).
- **CTA Band** — intentionally plain: white bg, centered, asymmetric padding (`pt-40 pb-16 md:pt-52 md:pb-20`) to vertically position the content. "Ready to _trade?_". The image bg version was tried and rejected.

**Marketing nav (`src/components/shared/marketing-nav.tsx` + `marketing-nav-client.tsx` + `live-ticker-strip.tsx`):**
- **Structure (Phase 17):** `marketing-nav.tsx` is a server component that calls `getLiveStats()` and renders `<MarketingNavClient initialStats={…}/>`. The client component mounts the ticker strip + the existing pill behavior. This is why all 5 consumers (`page.tsx`, `contact/page.tsx`, `blogs/page.tsx`, `blogs/[slug]/page.tsx`, `not-found.tsx`) work without code changes: they all import `<MarketingNav />` (the server wrapper).
- **Live ticker strip:** dark ink-colored strip above the nav row with `● LIVE`, `N LISTINGS · +M TODAY`, top trending categories with `▲`, and `LAST BID Xm AGO`. Polls `/api/live-stats` every 30s and pauses on tab hidden. Uses the `.ticker-pulse-dot` CSS class (NOT `.pulse-dot` — that's already used by `live-marketplace-panel.tsx`).
- **Contact page exception (`src/app/contact/page.tsx` + `contact-form.tsx`):** the contact page must stay a server component to SSR the ticker stats; the form was extracted into a `"use client"` child component. Don't merge them back.
- Sticky, edge-to-edge transparent at the very top
- On scroll past 8px, animates into a **floating frosted pill**: `mt-3 px-5 rounded-full bg-[rgba(250,250,247,0.78)] backdrop-blur-xl shadow-[0_10px_30px_rgba(15,77,42,0.08)] border border-white/50`, 300ms transition. Dark ticker strip hides via `translateY(-100%)` when scrolled; a small `● N LIVE` mono chip appears inside the pill.
- **Scroll progress bar** — `fixed top-0` 2px `bg-[var(--forest)]` bar with `transform: scaleX(progress)` based on `window.scrollY / (scrollHeight - innerHeight)`
- **Animated mint underlines** on hover — `<span>` with `bg-[#34D399]` and `group-hover:scale-x-100`
- **Active section highlighting** — IntersectionObserver on sections whose `id` matches `NAV_LINKS[i].sectionId`. When in view, link turns forest green and underline stays at `scale-x-100`. Currently wired for `#how-it-works`; extend by adding more sectionIds.
- **Logo hover lift** — `hover:-translate-y-px`
- B2B badge sits next to the logo
- **Activity chip** beside Marketplace nav link: shows `+N` (mono, mint on forest-tint bg) when `listingsToday > 0`. Hidden when scrolled (the chip lives only in the top state).

**Auth pages** (`src/app/(auth)/`): light paper surfaces, forest CTA, Framer Motion page transitions.

**All buyer + seller + admin pages**: paper bg, forest accents, mint highlight on active nav items via `bg-[var(--forest-tint)]`.

### Public-browse Route Group (Phase 19)
`/marketplace`, `/marketplace/[id]`, `/companies`, `/companies/[id]` live in `src/app/(public-browse)/`, NOT in `(buyer)/`. The shared `(public-browse)/layout.tsx` picks the right nav based on auth + role:
- **Anon** → `MarketingNav` (server wrapper with live ticker) + `MarketingFooter`
- **Recycler / both** → `BuyerNav`
- **Waste producer** → `SellerNav`
- **Admin** is redirected to `/admin` by middleware before this layout runs

Middleware (`src/lib/supabase/middleware.ts`) treats `/marketplace`, `/marketplace/*`, `/companies`, `/companies/*` as public routes (anon users not redirected to login).

The bidding action on listing detail (`<SubmitBidDialog>`) already handles unauthenticated users via a "Sign Up to Submit a Bid" CTA, so anon users can browse freely but can't transact. Sellers viewing a listing in marketplace see no action UI (they can't bid on their own marketplace listings); this is acceptable for V1.

### Bid Accept/Decline Flow (Phase 18)
- **Seller path:** `/seller-bookings` → click any bid card → `/seller-bookings/[id]` (server page that fetches the bid + parent listing + recycler info, with explicit ownership guard since RLS already enforces it). Renders the listing context, the highlighted bid card, and `<BidsList listingId={…} highlightBidId={…} />`.
- **Accept/decline:** `BidsList` opens a confirmation dialog with an optional 280-char message. Confirmed actions write the message to `listing_bids.seller_response_message` and (for Accept) auto-reject all other pending bids on the listing, mark the scrap as `matched`, and create a `transactions` row with a 6-digit `pickup_otp`.
- **Buyer side:** `SubmitBidDialog` renders `existingBid.seller_response_message` in a "Producer's note" block below the accepted/rejected status panel. Same column readable by the bidder via the existing "Recyclers can view own bids" RLS policy.

### Supabase MCP
**Status: Connected and working** (via terminal/CLI — as of 2026-03-26).

The Supabase MCP server is authenticated and operational when using Claude Code via terminal. Claude can run migrations, execute SQL, apply RLS policies, and manage the Supabase project directly — no manual dashboard work needed.

- MCP type: `http` at `https://mcp.supabase.com/mcp`
- Auth: OAuth token stored in `~/.claude/.credentials.json` under `mcpOAuth.supabase`
- **Note for VS Code extension users**: The MCP may show as "not connected" in the extension because it loads via the CLI plugins system (`~/.claude/plugins/`), which the extension doesn't read. Re-authenticate via `/mcp` inside the extension if needed.

### Supabase Project
- **Project:** `scrapkartremastered` (ID: `nlbkvnrmcjjuvubvifbt`, region: `ap-northeast-1`)
- **URL:** `https://nlbkvnrmcjjuvubvifbt.supabase.co`
- **Env vars:** Set in `.env.local` (real values, not placeholders — app is live, not in mock mode)
- **Schema:** All 5 tables live with RLS enabled: `users`, `companies`, `scraps`, `bookings`, `messages`
- **Storage:** `company-logos` and `scrap-images` buckets created (public)
- **Realtime:** Enabled on `messages` table
- **Auth:** Email + password. Signup sends confirmation email. Confirmation links and OAuth redirects point to `https://scrapkart.app` (the canonical Site URL in Supabase Auth → URL Configuration). The Redirect URLs allow-list also includes `https://*.scrapkart.app/auth/callback` (covers `b2b.` and any future subdomains), the vercel preview pattern `https://*-tscrapkart-ship-it.vercel.app/auth/callback`, and `http://localhost:3000/auth/callback` for local dev.
- **Auth bug fixed (2026-03-26):** Signup now shows "check your email" screen instead of prematurely redirecting to `/role-select` before email is confirmed.
- **Google OAuth (2026-03-29):** Enabled in Supabase. Google Cloud project: `scrapkart-491711`. OAuth client credentials stored in Supabase Auth → Providers → Google. `public.users.role` is nullable to support new OAuth users who haven't picked a role yet. DB trigger `handle_new_user()` auto-inserts into `public.users` on every new auth signup (email or OAuth).
- **Auth callback (`src/app/auth/callback/route.ts`):** After OAuth, checks user's role and routes to `/admin`, `/dashboard`, `/marketplace`, or `/role-select` as appropriate.

### Mock Data Mode
The app is currently connected to real Supabase — mock mode is inactive. Mock mode still exists as a fallback: `isMockMode()` in `src/lib/mock-data.ts` detects a placeholder Supabase URL and switches all data fetching to local fixtures. If `.env.local` is ever reset to placeholder values, mock mode re-activates automatically.

---

## Commands

```bash
npm run dev       # Start development server (localhost:3000) — Turbopack, PWA disabled
npm run build     # Production build (runs next build --webpack — required for next-pwa)
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

For shadcn/ui components:
```bash
npx shadcn@latest add <component>
```

No test framework has been chosen yet.

---

## Architecture

### Stack
- **Next.js App Router** — SSR/SSG for public marketplace pages, server components for performance
- **TypeScript** — strict typing across all domain models
- **Tailwind CSS + shadcn/ui** — design system (headless, fully customizable)
- **Supabase** — PostgreSQL, Auth, Realtime (chat/booking sync), Storage (images/logos)
- **next-pwa** — service worker, manifest, installability
- **Vercel** — deployment target

### Actual Directory Layout
```
src/
  app/
    (auth)/             # login, signup, role-select + layout (route group, no URL segment)
    (public-browse)/    # marketplace + companies (publicly accessible browse surfaces) + role-aware layout (Phase 19)
    (buyer)/            # bookings, profile + layout (buyer-only authed pages; marketplace + companies moved out in Phase 19)
    (seller)/           # dashboard, company, scraps, seller-bookings (incl. /seller-bookings/[id] from Phase 18), chat + layout
    admin/              # admin pages (real path /admin/*, NOT a route group — see Gotchas)
    api/
      live-stats/       # GET handler used by the marketing nav's live ticker (Phase 17)
    auth/callback/      # Supabase OAuth callback route
    blogs/              # /blogs and /blogs/[slug] — public marketing surface
    contact/            # /contact
    onboarding/         # producer + recycler onboarding flows
    pending-approval/   # holding page for unapproved sellers
    transactions/       # /transactions for both buyer + seller (RLS filters by role)
    page.tsx            # Landing page (Refined Premium hero + sections)
    not-found.tsx
    layout.tsx          # Root layout — fonts, NextTopLoader, LenisProvider, Toaster
    globals.css
  components/
    ui/                 # shadcn/ui primitives
    shared/             # marketing-nav, marketing-footer, lenis-provider, reveal, motion,
                        # parallax-image, live-marketplace-panel, chat-interface, booking-card,
                        # company-card, scrap-card, image-upload, image-gallery, message-bubble
    landing/            # hero-stat-counter, how-it-works, categories-grid, why-section, cta-band
    auth/               # auth-specific components
    buyer/              # buyer-nav, marketplace-filters, scrap-grid, book-scrap-dialog
    seller/             # seller-nav
    admin/              # admin-nav and admin tables/cards
  lib/
    supabase/           # client.ts, server.ts, middleware.ts, storage.ts
    queries/            # live-listings.ts (server-side data fetchers for the landing page)
    hooks/              # use-realtime-messages.ts
    mock-data.ts        # Mock fixtures + isMockMode() helper
    utils.ts
  types/
    index.ts            # All TypeScript domain model types
  middleware.ts         # Route auth guard (role-based)
  fonts/                # Legacy Lexend Giga font files (unused, safe to delete)
scripts/
  generate-og-card.cjs       # Renders public/og-card.png from logo + brand gradient
  generate-pwa-icons.cjs     # Renders public/icons/{192,512,apple-touch-icon}.png
public/
  herobg.jpg, hiwbg.jpg, categoriesbg.jpg, whybg.jpg, ctabg.jpg   # Landing bg images
  logos/                                                          # All logo variants
  icons/                                                          # PWA icons
  og-card.png
  manifest.json
  sw.js, workbox-*.js, swe-worker-*.js   # Generated by next-pwa, gitignored
docs/
  superpowers/specs/2026-04-29-refined-premium-foundation-design.md   # Source-of-truth aesthetic spec
  superpowers/plans/2026-04-29-ui-overhaul.md
  superpowers/plans/2026-04-29-refined-premium-foundation.md
```

### Domain Models
Five core entities (see `SCRAPKART.md` §5 for full field list):
- **User** — role: `recycler` | `waste_producer` | `admin`
- **Company** — owned by waste producer (ownerId)
- **Scrap** — status: `available` | `booked` | `collected`; categories: Metal, E-waste, Plastic, Paper, Glass, Mixed Scrap
- **Booking** — links recycler + waste producer + scrap
- **Message** — scoped to booking conversation thread

### Design Tokens — Refined Premium (current)
Full set lives in `src/app/globals.css` `:root`. Always reference via CSS var (`var(--forest)`), never hard-code the hex inline unless you need a one-off opacity tweak.

| Token | Var | Hex | Usage |
|---|---|---|---|
| Paper (page bg) | `--paper` | `#FAFAF7` | Default body bg |
| Paper 2 | `--paper-2` | `#F4F2EC` | Secondary surface, button hover |
| Paper 3 | `--paper-3` | `#EFEDE5` | Tertiary surface |
| Ink (primary text) | `--ink` | `#0A0A0A` | Headings, primary body |
| Ink 2 | `--ink-2` | `#3A3A38` | Secondary body |
| Ink 3 | `--ink-3` | `#6E6C66` | Muted text, captions |
| Ink 4 | `--ink-4` | `#A4A29A` | Disabled, lowest contrast |
| Line | `--line` | `#E5E2D8` | Default borders |
| Line 2 | `--line-2` | `#EFEDE5` | Subtle dividers |
| **Forest (brand)** | `--forest` | `#0F4D2A` | Primary CTAs, active states, scroll progress bar |
| Forest 2 | `--forest-2` | `#0B3D1F` | Darker hover |
| Forest tint | `--forest-tint` | `#E8F0EA` | Active nav bg, soft callouts |
| Bark | `--bark` | `#1A2419` | Rare — deepest forest |
| **Mint (accent)** | inline `#34D399` | — | Hairlines, hover underlines, italic accent on dark sections. **Not a CSS var** — kept inline since it's intentionally rare |
| Warning | `--warning` | `#B96A11` | Amber-style warning |
| Danger | `--danger` | `#B0322A` | Errors, destructive |
| Info | `--info` | `#0F3D6E` | Info badges |
| Success | `--success` | `#0F4D2A` | Same as forest |

Spacing scale (`--space-1` to `--space-32`), radius scale (`--radius-xs` 4px through `--radius-xl` 16px), three whisper-level shadows (`--shadow-1/2/3`), and forest/ink rings (`--ring-forest`, `--ring-ink`) also defined.

Target aesthetic: monopo-saigon / Stripe Press / Mast Coffee — premium B2B, hand-feeling typography, paper not glass, deep forest brand. **Not** the recykal/rubicon dark theme (that was the prior version).

### Auth Pattern
- Supabase Auth with role stored in `users` table (`recycler` | `waste_producer` | `admin`)
- Three separate authenticated route groups: `(buyer)/`, `(seller)/`, and `src/app/admin/`
- Middleware (`src/lib/supabase/middleware.ts`) guards all routes by role and auth state
- **Admin route** is `src/app/admin/` (NOT a route group) — using `(admin)/` caused path conflicts with buyer routes like `/bookings` and `/companies`
- **Landing page `/`** is always visible — authenticated users with a role are redirected to their dashboard, but users without a role see the landing page (not forced to `/role-select`)

### Supabase Conventions
- Use server-side Supabase client in Server Components and API routes
- Use browser client in Client Components (with `'use client'`)
- Row Level Security (RLS) is the primary access control layer — enforce at the database level, not just in app logic
- Realtime subscriptions (chat, booking status) in client components only

### RLS Policy Intent
These are the access rules to enforce when writing RLS policies:
- **Public (anonymous):** can read `scraps` where `status='live'` and all rows in `companies`. Added in Phase 19 to support the public marketplace browse. Two policies on the live DB: `"Public can view live scraps"` and `"Public can view companies"`.
- **Waste Producer (seller):** can insert/update/delete only their own company and scrap listings (`ownerId = auth.uid()` / `sellerId = auth.uid()`). Can read all bids on their listings and respond via UPDATE (including writing `seller_response_message`).
- **Recycler (buyer):** read-only access to all `live` scrap listings and company profiles; can insert and update their own bids. Cannot see other recyclers' bids on the same listing.
- **Transactions:** readable and writable only by the producer or recycler involved (`producer_id = auth.uid() OR recycler_id = auth.uid()`). `bookings` table is deprecated; transactions is the active link.
- **Messages:** readable by sender/receiver or participants of the linked transaction.
- **Users table:** users can read/update only their own row.
- **Admin:** full read/write on all tables via `public.is_admin()` SECURITY DEFINER function — avoids infinite recursion that would occur if the policy queried `users` directly.

### V1 Scope Boundaries
Know what is real vs placeholder in V1, and don't over-engineer the placeholder parts:

| Feature | V1 Status |
|---|---|
| Auth | Real — Supabase Auth with role assignment |
| Company profile CRUD | Real |
| Scrap listing CRUD | Real |
| Marketplace browsing & filtering | Real (category filter; geospatial distance filter is UI-only in V1) |
| Booking creation | Real |
| Post-booking chat | Real — Supabase Realtime |
| Search | UI present, deep logic is limited in V1 |
| Payments | UI placeholder only — no gateway in V1 |
| Notifications | Not in V1 |
| Pickup scheduling | Not in V1 |
| Ratings & reputation | Not in V1 |
| Admin dashboard | ✅ Live — `/admin/*`, 5 pages, role-gated |

### Fonts
Three Google fonts loaded via `next/font/google` in `src/app/layout.tsx`:
- **Inter Tight** (`--font-inter-tight`) — body and display. The workhorse for headings, paragraphs, UI text. Weights 300–800.
- **Fraunces** (`--font-fraunces`) — serif italic, variable axes. Reserved for **accent words only** (e.g., "Trade. Recycle. _Repeat._", "Build a _greener_ industry."). Apply via the `.italic-accent` utility class. Do NOT use for body text.
- **JetBrains Mono** (`--font-jetbrains-mono`) — eyebrow captions, badges, code-like labels. Apply via `.mono-caption` utility class. Weights 400, 500.

Plus Jakarta Sans and Lexend Giga were used in earlier versions. Files for both still exist in `src/fonts/` and `Fonts/Lexend_Giga/` but are unused — safe to delete in a future cleanup, but currently harmless.

### Brand Assets
- Logo variants are in `Logos/` (top-level) and mirrored in `public/logos/` — white, black, full-color.
- **Logo aspect ratio is ~6.5:1** (user re-cropped from the original ~1.4:1 in May 2026 to remove blank whitespace around the glyph+wordmark). When adding new logo-rendering code:
  - For `next/image` in nav components: use `width={260} height={40}` (or proportional) with `className="h-10 w-auto"` so width auto-scales from the height constraint. Don't hard-code dimensions assuming the old square-ish aspect.
  - For the OG card (`scripts/generate-og-card.cjs`): the script reads natural aspect via `sharp.metadata()` and derives height — re-cropping the logo doesn't require script changes.
  - For PWA icons (`scripts/generate-pwa-icons.cjs`): the script crops the **leftmost square portion** of the wide logo (the glyph alone) and centers it on a forest-gradient bg. The wordmark would be unreadable at 192/512 px so it's intentionally cropped out.
- Background images in `public/` (all user-provided JPGs): `herobg.jpg`, `hiwbg.jpg`, `categoriesbg.jpg`, `whybg.jpg` (heavy, ~14.5 MB), `ctabg.jpg` (loaded on disk but no longer referenced — CTA Band reverted to plain white).
- `public/og-card.png` is generated; re-run `node scripts/generate-og-card.cjs` if brand colors or logo change.

### Known Quirks & Gotchas
- **shadcn v4 uses Base UI** — no `asChild` prop; use `render` prop instead
- **Next.js 16 middleware warning**: `middleware.ts` is technically deprecated in favour of `proxy.ts` but still works
- **Supabase foreign key joins** use explicit key syntax: `users!bookings_seller_id_fkey(name)`
- **Seller routes** use `/seller-bookings` prefix to avoid conflict with buyer `/bookings`
- **All server pages** dynamically import Supabase server client: `await import("@/lib/supabase/server")` — this avoids build-time errors when env vars are missing
- **PWA + Turbopack incompatible**: `@ducanh2912/next-pwa` injects webpack plugins. Next.js 16 defaults to Turbopack. Build script uses `--webpack` to force webpack mode. Do NOT remove this flag or the service worker won't generate.
- **Generated PWA files** (`public/sw.js`, `public/workbox-*.js`, `public/swe-worker-*.js`) are gitignored — they're regenerated on every Vercel build automatically.
- **Turbopack webpack config error (Next.js 16)**: `next.config.ts` must include `turbopack: {}` in `nextConfig` — without it, the dev server crashes immediately with a hard error about webpack/Turbopack conflict.
- **Admin route is NOT a route group**: Admin pages live at `src/app/admin/` (a real path segment), NOT `src/app/(admin)/`. Using `(admin)/` causes Next.js path conflicts with buyer routes `/bookings` and `/companies` since route groups don't add URL segments.
- **Admin RLS — no recursive queries on `users` table**: Use `public.is_admin()` SECURITY DEFINER function. Never write a policy on `users` that SELECTs from `users` — it causes infinite recursion.
- **Manually inserted auth.users rows**: When inserting test users directly into `auth.users` via SQL, all string columns must be set to `''` (empty string) not NULL — e.g. `email_change`, `confirmation_token`, `recovery_token`, etc. Also set `instance_id = '00000000-0000-0000-0000-000000000000'`. Missing these causes "Database error querying schema" on login.
- **Google OAuth — `invalid_client` error**: The Google Cloud Console popup shows the client secret in a font where uppercase `I` looks like lowercase `l`. Always use the downloaded JSON file (`client_secret` field) for the exact value, never copy from the UI popup.
- **Google OAuth flow**: `signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })` → Google → Supabase → `/auth/callback` → role-based redirect. New users land on `/role-select`. Returning users go straight to their dashboard.
- **`public.users.role` is nullable**: Required for Google OAuth — new users don't have a role until they complete `/role-select`. The check constraint still enforces valid values when role IS set.
- **DB trigger `handle_new_user()`**: Fires on every `auth.users` INSERT. Auto-inserts into `public.users` with name from Google metadata and `role = NULL`. Uses `ON CONFLICT (id) DO NOTHING` so it's safe for all signup methods.
- **Google OAuth consent screen is in TEST MODE**: Only whitelisted test users can sign in via Google. Must publish the app in Google Cloud Console before public launch.
- **Marketplace filter performance**: Category/sort filters use URL params + server re-render (SSR). `useTransition` in `marketplace-filters.tsx` + `loading.tsx` skeleton eliminate the frozen UI feeling. Do NOT switch to client-side filtering — SSR is intentional for SEO.
- **Local prod-build SW survives `npm run dev`**: Running `npm run build` locally generates `public/sw.js` + `workbox-*.js` + `swe-worker-*.js`. The dev server then serves these, browsers register the SW, and your edits appear cached. Symptom: hard reload + cache clear doesn't show new code. Fix: delete the generated SW files from `public/` (they're gitignored), then in DevTools → Application → unregister any active worker + Clear site data. Verify in incognito.
- **Lenis smooth scroll is mounted globally**: `LenisProvider` in root layout. It DOES dispatch native scroll events, so `window.scrollY` listeners (e.g. the marketing nav's pill-on-scroll behavior) still work — but the values update on rAF cadence, not raw wheel events. If you add scroll-driven UI that feels "delayed", that's Lenis interpolation, not a bug. The provider respects `prefers-reduced-motion` and bails out for those users.
- **Two progress bars at top of page**: NextTopLoader (route-transition bar from `nextjs-toploader`) and the marketing nav's scroll progress bar are both 2px and both forest-colored. They never fire at the same time (one is navigation, the other is scroll), but visually they look identical. Don't "fix" one thinking it's a duplicate.
- **Logo aspect ratio (6.5:1)**: After the May 2026 re-crop, ANY new `<Image>` of `ScrapKart Black Logo.png` / `ScrapKart White Logo.png` must use proportional width/height. A common bug: setting both `width={40} height={40}` produces a squished banner. Use the marketing-nav pattern: `width={260} height={40} className="h-10 w-auto"`.
- **`mono-caption` class overrides `text-white`**: When using `.mono-caption` on a dark background (e.g. inside the Why section's dark forest overlay), the class's default `color` wins over `text-white`. Use inline `style={{ color: "#ffffff" }}` to guarantee override. Same gotcha potentially applies to `.italic-accent` if you need a non-default color.
- **CTA Band vertical centering**: Tried `min-h` + `flex items-center` — looked too tall on desktop. Final pattern is asymmetric padding (`pt-40 pb-16 md:pt-52 md:pb-20`) which positions content lower in the visual frame. If you change this section, don't switch to flex-centering without re-checking the user's reaction.
- **Image cache for replaced bg images**: Next.js Image optimizer caches under `.next/dev/cache/images`. If a user replaces e.g. `herobg.jpg` with new content but the same filename, the dev server may serve the cached optimized version. Clearing `.next/dev/cache/images` fixes it.
- **`/marketplace` and `/companies` are NOT in `(buyer)/`**: They live in `src/app/(public-browse)/` so anonymous visitors can read them (Phase 19). Do NOT move them back into `(buyer)/` — the buyer layout redirects all non-recyclers (including anon) to `/dashboard` or `/login`. The role-aware `(public-browse)/layout.tsx` picks the right nav at render time.
- **`.ticker-pulse-dot` ≠ `.pulse-dot`**: `globals.css` defines both — the marketing nav live ticker uses `.ticker-pulse-dot` (mint, opacity fade); the older `live-marketplace-panel.tsx` uses `.pulse-dot` (forest, box-shadow ripple). The names look similar but the visuals differ. Don't merge them.
- **`scraps.status` is `'live'` not `'available'`**: The Booking-era schema used `'available'` and some old code still says that. The enum is `"live" | "matched" | "picked" | "completed" | "cancelled"`. Any query filtering on `status='available'` returns nothing. (Fixed in `(public-browse)/companies/[id]/page.tsx` — grep for other instances if you see "no listings" empty states unexpectedly.)
- **`scraps.images` AND `scraps.photos` are both required writes**: The `photos` column is NOT NULL (default `{}`) and most code that displays scrap images reads both with `[...photos, ...images]`. New scrap creation and scrap edit both write the same array to both columns. Don't write to only one — the marketplace detail page may display stale images.
- **Contact page must be a server component** (after Phase 17): `/contact/page.tsx` is `async` and renders `<MarketingNav />` (a server component that does an SSR fetch for the live ticker). The form is extracted to `/contact/contact-form.tsx` with `"use client"`. Don't merge the form back into the page — async server components cannot be children of `"use client"` components.
- **`listing_bids.seller_response_message`**: Optional text (max 280 chars enforced client-side) written when a seller accepts/declines via the `BidsList` confirmation dialog. Buyers see this via "Recyclers can view own bids" RLS on the same row. On Accept, all other pending bids on the listing get auto-rejected with NULL response_message — only the explicitly accepted/declined bid carries the seller's note.

### Migrations Applied This Session (2026-05-17)
Visible in `supabase migrations list` or the `supabase_migrations.schema_migrations` table:
- `add_seller_response_message_to_listing_bids` — adds nullable TEXT column for Phase 18
- `public_can_view_live_scraps_and_companies` — two SELECT policies allowing anon read of live scraps + all companies, for Phase 19

### Test Accounts (live in production Supabase)
All created directly in `auth.users` + `public.users` via SQL. Seeded with companies, listings, bookings, and messages.

| Email | Password | Role | Details |
|---|---|---|---|
| `admin@scrapkart.test` | `Admin@ScrapKart#2024` | admin | Full admin dashboard access |
| `seller1@scrapkart.test` | `Test@1234` | waste_producer | Iron & Steel Co. — Metal + Mixed Scrap listings |
| `seller2@scrapkart.test` | `Test@1234` | waste_producer | EcoRecycle Ltd. — E-waste, Plastic, Paper listings |
| `buyer1@scrapkart.test` | `Test@1234` | recycler | Has 2 bookings (1 confirmed with chat, 1 pending) |
| `buyer2@scrapkart.test` | `Test@1234` | recycler | Fresh account, no bookings |
