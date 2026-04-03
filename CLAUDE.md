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

---

## Project Status

**All phases complete including admin dashboard and seed data. App is live on Vercel.** Full product context, domain model, user journeys, and feature scope are documented in `SCRAPKART.md`.

### What's been built
| Phase | Scope | Status |
|---|---|---|
| 1 | Project init, Tailwind design tokens, Plus Jakarta Sans font, root layout | ✅ Done |
| 2 | Supabase client/server setup, TypeScript domain types, middleware auth guard | ✅ Done |
| 3 | Auth flows — login, signup, role selection (`(auth)/`) | ✅ Done |
| 4 | Seller dashboard — company profile CRUD, scrap listing CRUD, image upload | ✅ Done |
| 5 | Buyer marketplace — browse listings, category filter, company profiles, booking creation | ✅ Done |
| 6 | Post-booking chat — Supabase Realtime messaging per booking thread | ✅ Done |
| 7 | Landing page — hero, stats, how-it-works, categories, features, testimonials, CTA, footer | ✅ Done |
| Supabase | Schema + RLS + storage buckets applied to live project via MCP | ✅ Done |
| UI/UX | Full frontend overhaul — dark theme, brand colors, all 35+ screens polished | ✅ Done |
| 8 | PWA (`@ducanh2912/next-pwa`, `manifest.json`, icons) + Vercel deploy | ✅ Done |
| 9 | Admin dashboard — `/admin/*` route, all 5 pages, admin role + RLS | ✅ Done |
| 10 | Seed/test data — 5 test accounts live in Supabase with companies, listings, bookings, messages | ✅ Done |
| 11 | Google OAuth — Sign in/up with Google on login + signup pages, DB trigger, smart callback routing | ✅ Done |

### GitHub & Deployment
- **GitHub:** `https://github.com/tscrapkart-ship-it/scrapkartrehaul.git` (branch: `master`)
- **Deployed:** Vercel (connected to GitHub repo — auto-deploys on push to `master`)
- **Build command:** `next build --webpack` (required for `next-pwa` service worker generation — Turbopack is incompatible with PWA webpack plugins)

### What's next
1. **Replace PWA icons** — `public/icons/icon-192x192.png` and `icon-512x512.png` are currently copies of the white logo. Replace with properly sized 192×192 and 512×512 PNGs for full PWA installability (use realfavicongenerator.net)
2. **Admin: suspend/activate users** — the users table has no `suspended` column yet; admin users page shows all users but the suspend action is not yet wired up
3. **Google OAuth — publish consent screen** — currently in test mode (only added test users can sign in via Google). Before public launch, go to Google Cloud Console → OAuth consent screen → Publish App

### Installed Animation Libraries (2026-03-26)
- `gsap` + `@gsap/react` — used for hero entrance animations and stat count-up on landing page
- `framer-motion` — used for auth page transitions (login, signup, role-select)
- `next-themes` — installed, available
- `sonner` — wired into root layout via `<Toaster />`

### UI/UX Redesign — Completed (2026-04-03)
Professional B2B dark theme with emerald green palette. Solid surfaces (no glassmorphism), Plus Jakarta Sans font. Inspired by Recykal/Rubicon. Build passes with zero errors.

**Global changes:**
- `src/app/globals.css` — dark CSS variables (`#0A0A0A` bg, `#141414` card), brand color tokens, utility classes: `.glow-emerald`, `.text-gradient`, `.bg-grid-pattern`
- `src/app/layout.tsx` — Plus Jakarta Sans font via `next/font/google` (`--font-jakarta`), `<Toaster />` wired
- Font switched from Inter → **Plus Jakarta Sans**

**Landing page (`src/app/page.tsx`):**
- `"use client"` — GSAP hero animations (title, subtitle, CTA stagger on mount)
- Stat count-up using GSAP + ScrollTrigger (animates numbers, never hides elements)
- **Hero**: `herobg.jpg` as full-bleed background image, gradient overlay dark-left/transparent-right, text left-aligned
- **Navbar**: `h-20`, `text-base` nav links, `h-11` CTA buttons, hamburger mobile menu
- **Stats bar**: solid `bg-card border border-[#262626]` (no backdrop-blur)
- **CTA**: subtle emerald tint `from-[#10B981]/5 to-background`
- **Scrap Categories**: cards with large icon as subtle bg watermark (top-right, `opacity-20`), left-aligned text
- **Features**: cards with large icon centered in bg (`opacity-12`), center-aligned text

**Auth pages** (`src/app/(auth)/`):
- Split-screen layout: solid dark left panel (logo, tagline, `border-r border-[#262626]`), form on right
- No gradient blobs or glassmorphism — clean solid surfaces
- Cards: `bg-[#141414] border border-[#262626]`
- Buttons: solid `bg-[#10B981] hover:bg-[#059669] text-black`

**All buyer + seller pages**: dark theme, white headings, emerald accents, Lucide icons for empty states, dark status badges

### GSAP Gotcha — Scroll Animations
Do NOT use `gsap.from()` with `opacity: 0` + ScrollTrigger on section content in Next.js. On hydration, GSAP sets elements to `opacity: 0` immediately; if the ScrollTrigger never fires (timing/hydration issue), content stays invisible. Safe pattern: only use GSAP `from()` for on-mount animations (no ScrollTrigger). For scroll reveals, use CSS or Framer Motion `whileInView` instead.

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
- **Auth:** Email + password. Signup sends confirmation email. Confirmation links point to `https://scrapkartrehaul.vercel.app` — updated in Supabase dashboard → Auth → URL Configuration.
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
    (auth)/             # login, signup, role-select + layout
    (buyer)/            # marketplace, companies, bookings, chat, profile + layout
    (seller)/           # dashboard, company, scraps, seller-bookings, chat + layout
    auth/callback/      # Supabase OAuth callback route
    page.tsx            # Landing page
    not-found.tsx
    layout.tsx          # Root layout (font, theme, toaster)
    globals.css
  components/
    ui/                 # shadcn/ui primitives (button, card, badge, input, etc.)
    shared/             # booking-card, chat-interface, scrap-card, company-card, image-upload, etc.
    buyer/              # marketplace-filters, scrap-grid, book-scrap-dialog, buyer-nav
    seller/             # seller-nav
  lib/
    supabase/           # client.ts, server.ts, middleware.ts, storage.ts
    hooks/              # use-realtime-messages.ts
    mock-data.ts        # Mock fixtures + isMockMode() helper
    utils.ts
  types/
    index.ts            # All TypeScript domain model types
  middleware.ts         # Route auth guard (role-based)
  fonts/                # Lexend Giga variable font
```

### Domain Models
Five core entities (see `SCRAPKART.md` §5 for full field list):
- **User** — role: `recycler` | `waste_producer` | `admin`
- **Company** — owned by waste producer (ownerId)
- **Scrap** — status: `available` | `booked` | `collected`; categories: Metal, E-waste, Plastic, Paper, Glass, Mixed Scrap
- **Booking** — links recycler + waste producer + scrap
- **Message** — scoped to booking conversation thread

### Design Tokens
| Token | Hex |
|---|---|
| Background | `#0A0A0A` |
| Card/Surface | `#141414` |
| Primary (emerald 500) | `#10B981` |
| Secondary (emerald 600) | `#059669` |
| Light accent (emerald 400) | `#34D399` |
| Foreground | `#F5F5F5` |
| Muted text | `#A3A3A3` |
| Muted bg | `#1A1A1A` |
| Border | `#262626` |

Configured via CSS variables in `globals.css`. Target aesthetic: Recykal / Rubicon — professional B2B, solid surfaces, emerald green palette.

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
- **Waste Producer (seller):** can insert/update/delete only their own company and scrap listings (`ownerId = auth.uid()` / `sellerId = auth.uid()`)
- **Recycler (buyer):** read-only access to all `available` scrap listings and company profiles; cannot modify seller data
- **Bookings:** readable and writable only by the buyer or seller involved in that booking (`buyerId = auth.uid() OR sellerId = auth.uid()`)
- **Messages:** readable and writable only by participants of the linked booking — enforce via join to bookings table, not just sender/receiver fields
- **Users table:** users can read/update only their own row
- **Admin:** full read/write on all 5 tables via `public.is_admin()` SECURITY DEFINER function — avoids infinite recursion that would occur if the policy queried `users` directly

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
**Plus Jakarta Sans** is the active font, loaded via `next/font/google` in `src/app/layout.tsx` with variable `--font-jakarta`. Lexend Giga files still exist in `Fonts/Lexend_Giga/` and `src/fonts/` but are no longer used.

### Brand Assets
Logo variants are in `Logos/` and mirrored in `public/logos/` — white, black, and full-color versions.

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

### Test Accounts (live in production Supabase)
All created directly in `auth.users` + `public.users` via SQL. Seeded with companies, listings, bookings, and messages.

| Email | Password | Role | Details |
|---|---|---|---|
| `admin@scrapkart.test` | `Admin@ScrapKart#2024` | admin | Full admin dashboard access |
| `seller1@scrapkart.test` | `Test@1234` | waste_producer | Iron & Steel Co. — Metal + Mixed Scrap listings |
| `seller2@scrapkart.test` | `Test@1234` | waste_producer | EcoRecycle Ltd. — E-waste, Plastic, Paper listings |
| `buyer1@scrapkart.test` | `Test@1234` | recycler | Has 2 bookings (1 confirmed with chat, 1 pending) |
| `buyer2@scrapkart.test` | `Test@1234` | recycler | Fresh account, no bookings |
