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

**Phases 1–7 + Supabase setup + full UI/UX overhaul complete.** The app is live against a real Supabase project. Auth (signup + login) is tested and working end-to-end. Full product context, domain model, user journeys, and feature scope are documented in `SCRAPKART.md`.

### What's been built
| Phase | Scope | Status |
|---|---|---|
| 1 | Project init, Tailwind design tokens, Inter font, root layout | ✅ Done |
| 2 | Supabase client/server setup, TypeScript domain types, middleware auth guard | ✅ Done |
| 3 | Auth flows — login, signup, role selection (`(auth)/`) | ✅ Done |
| 4 | Seller dashboard — company profile CRUD, scrap listing CRUD, image upload | ✅ Done |
| 5 | Buyer marketplace — browse listings, category filter, company profiles, booking creation | ✅ Done |
| 6 | Post-booking chat — Supabase Realtime messaging per booking thread | ✅ Done |
| 7 | Landing page — hero, stats, how-it-works, categories, features, testimonials, CTA, footer | ✅ Done |
| Supabase | Schema + RLS + storage buckets applied to live project via MCP | ✅ Done |
| UI/UX | Full frontend overhaul — dark theme, brand colors, all 35+ screens polished | ✅ Done |
| 8 | PWA (next-pwa, manifest.json, icons) + Vercel deploy | ⏳ Next |

### What's next (in order)
1. **Phase 8 — PWA + Deploy**: `next-pwa` setup, `manifest.json`, app icons, Vercel deploy
2. **Update Supabase Site URL**: After Vercel deploy, update the Supabase Auth Site URL to the Vercel domain so email confirmation links work from any device (currently points to `localhost:3000`)

### Installed Animation Libraries (2026-03-26)
- `gsap` + `@gsap/react` — used for hero entrance animations and stat count-up on landing page
- `framer-motion` — used for auth page transitions (login, signup, role-select)
- `next-themes` — installed, available
- `sonner` — wired into root layout via `<Toaster />`

### UI/UX Overhaul — Completed (2026-03-26)
Full dark-first design system applied across all pages. Build passes with zero errors.

**Global changes:**
- `src/app/globals.css` — dark CSS variables (`#001C30` bg, `#002a47` card), brand color tokens, utility classes: `.glow-teal`, `.glass`, `.text-gradient`, `.bg-grid-pattern`
- `src/app/layout.tsx` — Inter font via `next/font/google` (`--font-inter`), `<Toaster />` wired
- Font switched from Lexend Giga → **Inter**

**Landing page (`src/app/page.tsx`):**
- `"use client"` — GSAP hero animations (badge, title, subtitle, CTA stagger on mount)
- Stat count-up using GSAP + ScrollTrigger (animates numbers, never hides elements)
- **Hero**: `herobg.jpg` as full-bleed background image, gradient overlay dark-left/transparent-right, text left-aligned
- **Navbar**: `h-20`, `text-base` nav links, `h-11` CTA buttons, hamburger mobile menu
- **Scrap Categories**: cards with large icon as subtle bg watermark (top-right, `opacity-20`), left-aligned text
- **Features ("Built for Industrial Scrap Trading")**: cards with large icon centered in bg (`opacity-12`), center-aligned text
- Scroll-triggered opacity animations removed — they caused invisible content due to GSAP hydration timing in Next.js. Only hero mount animations and stat count-up use GSAP.

**Auth pages** (`src/app/(auth)/`):
- Split-screen layout: dark decorative left panel (logo, tagline, gradient blobs), form on right
- Login, signup, role-select: glassmorphic cards, Lucide icons, Framer Motion transitions
- All auth logic untouched

**All buyer + seller pages**: dark theme, white headings, teal accents, Lucide icons for empty states, dark status badges

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
- **Auth:** Email + password. Signup sends confirmation email. Confirmation link currently points to `localhost:3000` — will update to Vercel URL after deploy.
- **Auth bug fixed (2026-03-26):** Signup now shows "check your email" screen instead of prematurely redirecting to `/role-select` before email is confirmed.

### Mock Data Mode
The app is currently connected to real Supabase — mock mode is inactive. Mock mode still exists as a fallback: `isMockMode()` in `src/lib/mock-data.ts` detects a placeholder Supabase URL and switches all data fetching to local fixtures. If `.env.local` is ever reset to placeholder values, mock mode re-activates automatically.

---

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
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
- **User** — role: `recycler` | `waste_producer`
- **Company** — owned by waste producer (ownerId)
- **Scrap** — status: `available` | `booked` | `collected`; categories: Metal, E-waste, Plastic, Paper, Glass, Mixed Scrap
- **Booking** — links recycler + waste producer + scrap
- **Message** — scoped to booking conversation thread

### Design Tokens
| Token | Hex |
|---|---|
| Primary Dark | `#001C30` |
| Secondary | `#176B87` |
| Accent | `#64CCC5` |
| Light | `#DAFFFB` |

Configure these in `tailwind.config.ts` under `theme.extend.colors`. Target aesthetic: Stripe Dashboard / Linear.

### Auth Pattern
- Supabase Auth with role stored in user metadata or a `users` table
- Two separate authenticated route groups: `(buyer)/` and `(seller)/`
- Middleware (`middleware.ts`) guards routes by role and auth state

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
| Admin dashboard | Not in V1 |

### Fonts
**Inter** is the active font, loaded via `next/font/google` in `src/app/layout.tsx` with variable `--font-inter`. Lexend Giga files still exist in `Fonts/Lexend_Giga/` and `src/fonts/` but are no longer used.

### Brand Assets
Logo variants are in `Logos/` and mirrored in `public/logos/` — white, black, and full-color versions.

### Known Quirks & Gotchas
- **shadcn v4 uses Base UI** — no `asChild` prop; use `render` prop instead
- **Next.js 16 middleware warning**: `middleware.ts` is technically deprecated in favour of `proxy.ts` but still works
- **Supabase foreign key joins** use explicit key syntax: `users!bookings_seller_id_fkey(name)`
- **Seller routes** use `/seller-bookings` prefix to avoid conflict with buyer `/bookings`
- **All server pages** dynamically import Supabase server client: `await import("@/lib/supabase/server")` — this avoids build-time errors when env vars are missing
