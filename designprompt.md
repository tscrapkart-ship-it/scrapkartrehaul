# ScrapKart — UI/UX Remaster Prompt

## Your Mission

You are tasked with a **complete UI/UX overhaul** of ScrapKart — a B2B scrap marketplace connecting waste producers (sellers) with recyclers (buyers). The app is fully built and functional. Your job is to make it **visually stunning, modern, and premium** while keeping every single piece of functionality intact.

> **CRITICAL RULE: DO NOT touch any backend logic, Supabase queries, auth flows, data fetching, API calls, state management, or routing. Only change what the user sees — layout, styling, animations, typography, spacing, colors, and component visuals. If it fetches data or handles auth, leave the logic untouched. Only restyle the JSX/TSX markup and CSS.**

---

## Tech Stack (do not change)

- **Next.js 15 App Router** — all pages are in `src/app/`
- **TypeScript** — strict, do not break types
- **Tailwind CSS** — primary styling tool
- **shadcn/ui** — component primitives (button, card, input, badge, etc.)
- **Supabase** — auth + database + realtime (DO NOT TOUCH)
- **Lexend Giga** — brand font, already loaded via `next/font/local`

## Install These for Animations

```bash
npm install gsap @gsap/react
npm install framer-motion
npm install lucide-react  # already installed, use for icons
```

---

## Brand Identity

| Token | Hex | Usage |
|---|---|---|
| Primary Dark | `#001C30` | Backgrounds, navbars, hero sections |
| Secondary | `#176B87` | Buttons, links, accents |
| Accent | `#64CCC5` | Highlights, glows, hover states |
| Light | `#DAFFFB` | Subtle backgrounds, chips, badges |

**Aesthetic target:** Think **Linear.app** meets **Stripe Dashboard** meets **Vercel** — dark, crisp, minimal, with purposeful motion. Not flashy for the sake of it. Every animation should feel intentional and smooth.

**Font:** Lexend Giga for headings. System sans-serif (`Inter` or `system-ui`) for body text.

**Logo files** are in `public/logos/`:
- `ScrapKart Black Logo.png` — use on light backgrounds
- `ScrapKart White Logo.png` — use on dark backgrounds
- `Scrapkart Full Logo White BG.png` — full wordmark

---

## Non-Negotiable Visual Bar

**This UI must be genuinely stunning.** Not "nice for a startup" — stunning. Someone opening this app on their phone for the first time should feel like they're using a world-class product. Think the first time someone saw Linear, Vercel, or Raycast. That level of craft and visual polish is the target.

If a screen looks generic, flat, or "Bootstrap-like" — redo it. Every screen must feel intentional, premium, and modern.

---

## Mobile-First. Always.

**Design mobile (375px) first, then scale up.** This is non-negotiable. Most users will be on phones.

Rules:
- Every layout must work perfectly at 375px width — no horizontal scroll, no clipped text, no broken grids
- Touch targets must be at least 44×44px (buttons, links, nav items)
- Navigation must collapse to a mobile-friendly drawer/bottom bar on small screens
- Cards must stack to single column on mobile
- Forms must be full-width and thumb-friendly on mobile
- Font sizes must be readable without zooming (minimum 14px body, 24px+ headings on mobile)
- Images must be responsive (`w-full`, `object-cover`, proper aspect ratios)
- Test every screen mentally at: 375px (mobile), 768px (tablet), 1280px (desktop)
- Use Tailwind responsive prefixes properly: `sm:`, `md:`, `lg:`, `xl:`

---

## Design Principles

1. **Dark-first** — primary surfaces are dark (`#001C30` or near-black). Use light text.
2. **Glass morphism sparingly** — frosted glass cards (`backdrop-blur`, `bg-white/5`) for overlays and modals.
3. **Micro-interactions everywhere** — buttons should have hover lifts, cards should scale subtly, inputs should glow on focus.
4. **GSAP for entrance animations** — stagger list items, slide in sections, fade in page content on load.
5. **Framer Motion for component transitions** — page transitions, dialog open/close, tab switches.
6. **Generous whitespace** — don't cram. Breathe.
7. **Consistent border radius** — use `rounded-2xl` for cards, `rounded-xl` for inputs/buttons.
8. **Subtle gradients** — use linear gradients for hero backgrounds, not flat fills.
9. **Glow effects** — teal glow (`#64CCC5`) on active/hover states using `box-shadow`.
10. **No harsh borders** — use `border border-white/10` or `border border-brand-accent/20` on dark backgrounds.
11. **Every empty state is designed** — no raw "No data found" text. Use icons, friendly copy, and a CTA.
12. **Every loading state is designed** — skeleton screens, not spinners. Match the shape of the real content.
13. **Typography hierarchy is strict** — one clear H1, supporting H2/H3, muted body. Never two competing focal points on the same screen.

---

## Screen-by-Screen Instructions

---

### 1. Landing Page (`src/app/page.tsx`)

The most important screen. This is what new users see first. Make it jaw-dropping.

**Hero Section:**
- Full-viewport dark background with a subtle animated gradient mesh (use GSAP or CSS)
- Large Lexend Giga headline with a gradient text effect (teal to white)
- Subheadline in muted grey
- Two CTAs: "Get Started" (primary, filled teal) and "Browse Marketplace" (ghost/outline)
- Floating particles or a subtle grid pattern in the background
- GSAP: animate headline words staggering in on load, fade up the subheadline and buttons

**Stats Section:**
- Dark card row with 3–4 stat numbers (e.g. "500+ Companies", "10,000 tons recycled")
- Numbers animate (count up) when scrolled into view using GSAP ScrollTrigger

**How It Works Section:**
- 3-step horizontal flow with numbered steps, icons, and connecting lines
- Cards with glass morphism effect
- GSAP: stagger cards sliding up from below on scroll

**Categories Section:**
- 6 category cards in a grid: Metal, E-waste, Plastic, Paper, Glass, Mixed Scrap
- Each card has an icon, name, and subtle hover glow in teal
- On hover: card lifts with a teal glow border and slight scale

**Features Section:**
- Alternating left-right layout or bento grid
- Icons with teal accent color

**Testimonials Section:**
- Horizontal scrollable cards or a carousel
- Avatar, name, company, quote

**CTA Section:**
- Full-width dark gradient banner
- Bold headline + signup button

**Footer:**
- Dark footer with logo, nav links, social links (if any)

**Navbar:**
- Sticky, dark, with blur backdrop on scroll (`backdrop-blur-md bg-brand-dark/80`)
- Logo left, nav links center/right
- "Sign In" ghost button + "Get Started" filled button
- Smooth scroll links for landing page sections

---

### 2. Auth Layout (`src/app/(auth)/layout.tsx`)

- Split-screen layout: left side is a dark decorative panel (brand colors, logo, tagline, subtle pattern), right side has the form
- On mobile: single column, form only
- The decorative panel can have abstract geometric shapes or the logo large and centered with a tagline

---

### 3. Login Page (`src/app/(auth)/login/page.tsx`)

**DO NOT change:** `supabase.auth.signInWithPassword()` call, error state, router logic.

- Clean card form on the right panel
- "Welcome back" headline
- Email + password inputs with teal focus glow
- "Sign In" button — full width, teal gradient, hover lift effect
- "Forgot password?" link (UI only, no functionality needed)
- Link to signup below
- Framer Motion: form fades and slides up on mount

---

### 4. Signup Page (`src/app/(auth)/signup/page.tsx`)

**DO NOT change:** `supabase.auth.signUp()` call, `emailSent` state logic, error handling.

- Same layout as login
- Name + email + password fields
- After signup: the "check your email" screen should look premium — large email icon (animated), clear message, soft card

---

### 5. Role Select Page (`src/app/(auth)/role-select/page.tsx`)

**DO NOT change:** role selection logic, `supabase.from("users").upsert()`, router redirects.

- Two large selection cards (Waste Producer / Recycler)
- Cards should be visually distinct — dark with teal border on selected
- Icons for each role (e.g. factory icon for seller, recycle icon for buyer)
- Selected state: glowing teal border + checkmark
- "Continue" button activates only when a role is picked
- Framer Motion: cards animate in with stagger

---

### 6. Buyer Navigation (`src/components/buyer/buyer-nav.tsx`)

**DO NOT change:** logout logic, auth check, link destinations.

- Dark sticky navbar (`bg-brand-dark`)
- Logo left
- Nav links: Marketplace, Companies, Bookings, Profile — with active state indicator (teal underline or dot)
- User greeting with avatar (initials-based)
- Logout button as icon button or subtle text link
- Mobile: hamburger → slide-out drawer (Sheet component already exists)

---

### 7. Marketplace Page (`src/app/(buyer)/marketplace/page.tsx`)

**DO NOT change:** data fetching, filtering logic, Supabase queries.

- Page header with title + subtitle
- Filters bar: search input + category pill buttons + sort dropdown — all styled dark
- Scrap grid below
- Loading state: skeleton cards
- Empty state: illustrated empty message

---

### 8. Marketplace Filters (`src/components/buyer/marketplace-filters.tsx`)

**DO NOT change:** filter state, onChange handlers, filter logic.

- Search input with search icon, dark background, teal focus ring
- Category pills: scrollable row, inactive = dark outlined, active = teal filled
- Sort dropdown: dark styled select

---

### 9. Scrap Card (`src/components/shared/scrap-card.tsx`)

**DO NOT change:** data props, click handlers, link destinations.

- Dark card (`bg-[#001C30]` or slightly lighter) with rounded-2xl
- Image at top (aspect-video, object-cover)
- Category badge (teal chip)
- Title, price (prominent, teal), quantity/unit
- Location with pin icon
- Hover: subtle lift + teal glow border
- Status badge (available = green, booked = amber, collected = grey)

---

### 10. Scrap Detail Page (`src/app/(buyer)/marketplace/[id]/page.tsx`)

**DO NOT change:** data fetching, booking dialog trigger, Supabase queries.

- Hero image gallery at top (full width or large)
- Details below in a two-column layout: left = images + description, right = price card (sticky)
- Price card: dark card with price prominent, quantity, "Book Now" CTA button
- Company info section below with logo + name + link to company page
- Breadcrumb at top: Marketplace > [Scrap Title]
- GSAP: content fades in on load

---

### 11. Book Scrap Dialog (`src/components/buyer/book-scrap-dialog.tsx`)

**DO NOT change:** booking creation logic, Supabase insert, status update.

- Glass morphism modal
- Clear confirmation message with scrap title + price
- Cancel (ghost) + Confirm (teal filled) buttons
- Framer Motion: scale + fade in on open

---

### 12. Companies Page (`src/app/(buyer)/companies/page.tsx`)

**DO NOT change:** data fetching, link destinations.

- Grid of company cards
- Page header with title

---

### 13. Company Card (`src/components/shared/company-card.tsx`)

**DO NOT change:** data props, click handlers.

- Dark card with company logo/avatar (initials fallback)
- Company name, industry badge, city/state
- Hover: lift + glow effect

---

### 14. Company Detail Page (`src/app/(buyer)/companies/[id]/page.tsx`)

**DO NOT change:** data fetching, Supabase queries.

- Company hero banner: dark gradient with logo + name + industry
- Info grid below: address, city, state, pincode
- "Available Listings" section below with scrap cards grid

---

### 15. Buyer Bookings Page (`src/app/(buyer)/bookings/page.tsx`)

**DO NOT change:** data fetching, status counts.

- Status summary bar at top: pending / confirmed / collected counts as chips
- List of booking cards
- Empty state per status

---

### 16. Booking Card (`src/components/shared/booking-card.tsx`)

**DO NOT change:** data props, click/link handlers.

- Dark card with scrap title, counterparty name, price
- Status badge: colour-coded (pending = amber, confirmed = teal, collected = grey, cancelled = red)
- Date and a right-arrow chevron to indicate it's clickable

---

### 17. Booking Detail Page — Buyer (`src/app/(buyer)/bookings/[id]/page.tsx`)

**DO NOT change:** data fetching, chat button, Supabase queries.

- Two-panel layout: left = booking details, right = quick actions
- Scrap info card, seller info, status timeline (visual step indicator)
- "Open Chat" button prominent

---

### 18. Chat Page — Buyer (`src/app/(buyer)/bookings/[id]/chat/page.tsx`)

**DO NOT change:** Realtime subscription, message send logic, Supabase queries.

- Full-height chat layout (no scroll on page, only message area scrolls)
- Dark header with back button, booking/scrap title
- Message area: dark background, own messages right-aligned (teal bubble), received messages left-aligned (dark grey bubble)
- Input bar pinned to bottom: dark input + teal send button

---

### 19. Chat Interface (`src/components/shared/chat-interface.tsx`)

**DO NOT change:** message state, Realtime hook, send logic, auto-scroll.

- Restyle only the visual shell

---

### 20. Message Bubble (`src/components/shared/message-bubble.tsx`)

**DO NOT change:** sender logic, timestamp, content.

- Own messages: teal gradient bubble, right side
- Received: dark grey bubble, left side
- Timestamp below each bubble in muted text
- Subtle entrance animation (Framer Motion slide-in from side)

---

### 21. Buyer Profile Page (`src/app/(buyer)/profile/page.tsx`)

**DO NOT change:** form submit logic, Supabase update, field values.

- Dark card form with avatar at top (initials circle, large)
- Name + phone fields
- Role badge (read-only chip)
- Save button (teal)

---

### 22. Seller Navigation (`src/components/seller/seller-nav.tsx`)

**DO NOT change:** logout logic, link destinations.

- Same dark navbar style as buyer nav
- Links: Dashboard, Company, Listings, Bookings

---

### 23. Seller Dashboard (`src/app/(seller)/dashboard/page.tsx`)

**DO NOT change:** data fetching, stats logic, company check.

- Stats row: 3 metric cards (Total Listings, Available, Booked) — dark glass cards with large numbers and teal accents
- Company card below: logo + name + edit link
- If no company set up: prominent onboarding CTA card ("Set Up Your Company to Start Selling")
- GSAP: stats count up on load

---

### 24. Company Profile — View (`src/app/(seller)/company/page.tsx`)

**DO NOT change:** data fetching, edit link.

- Company hero with logo, name, industry
- Info grid: address, city, state, pincode, description
- Edit button top-right

---

### 25. Company Setup Form (`src/app/(seller)/company/setup/page.tsx`)

**DO NOT change:** form submit, Supabase insert, image upload logic.

- Multi-step feel (even if single page): logo upload at top, fields below in sections
- Sections: Basic Info, Location, Description
- Image upload zone: dashed border, drag-drop styled area

---

### 26. Company Edit Form (`src/app/(seller)/company/edit/page.tsx`)

**DO NOT change:** form submit, Supabase update, image upload logic.

- Same as setup form, pre-populated

---

### 27. Seller Scraps List (`src/app/(seller)/scraps/page.tsx`)

**DO NOT change:** data fetching, delete logic, link destinations.

- Grid of scrap cards (same restyle as marketplace scrap card)
- "New Listing" button top-right — teal, prominent
- Empty state: illustrated prompt to create first listing

---

### 28. New Scrap Form (`src/app/(seller)/scraps/new/page.tsx`)

**DO NOT change:** form submit, Supabase insert, image upload, category options.

- Dark form with clearly sectioned fields
- Image upload zone at top (prominent)
- Category selector: pill/chip buttons (not a dropdown)
- Price + quantity + unit in a row
- Location fields in a grid

---

### 29. Edit Scrap Form (`src/app/(seller)/scraps/[id]/edit/page.tsx`)

**DO NOT change:** form submit, Supabase update, delete logic.

- Same as new scrap form, pre-populated
- Delete button: destructive red, with confirmation dialog

---

### 30. Seller Bookings List (`src/app/(seller)/seller-bookings/page.tsx`)

**DO NOT change:** data fetching, link destinations.

- Same style as buyer bookings — status chips + booking card list

---

### 31. Seller Booking Detail (`src/app/(seller)/seller-bookings/[id]/page.tsx`)

**DO NOT change:** data fetching, status update, "Mark as Collected" logic, chat button.

- Two-panel layout: booking details left, actions right
- "Mark as Collected" — prominent teal button
- Status badge + buyer info

---

### 32. Chat Page — Seller (`src/app/(seller)/seller-bookings/[id]/chat/page.tsx`)

**DO NOT change:** Realtime logic, message send.

- Same chat UI as buyer chat page

---

### 33. Image Upload (`src/components/shared/image-upload.tsx`)

**DO NOT change:** upload logic, Supabase storage calls, file handling.

- Styled drop zone: dashed border, icon, "Click or drag images here" text
- Preview thumbnails in a grid with remove (×) button on each
- Upload progress indicator

---

### 34. Image Gallery (`src/components/shared/image-gallery.tsx`)

**DO NOT change:** image selection logic, array handling.

- Main image large at top
- Thumbnail strip below, selected thumbnail highlighted with teal border

---

### 35. Not Found Page (`src/app/not-found.tsx`)

- Dark background, large "404" in Lexend Giga with teal gradient
- Short message + "Go Home" button

---

## Animation Guidelines (GSAP)

```js
// Page entrance — stagger children
gsap.from(".stagger-item", {
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: "power3.out"
});

// Scroll-triggered section reveals
gsap.from(".section", {
  scrollTrigger: { trigger: ".section", start: "top 80%" },
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

// Count-up for stats
gsap.to(counter, {
  innerText: targetValue,
  duration: 2,
  snap: { innerText: 1 },
  scrollTrigger: { trigger: counter, start: "top 85%" }
});
```

Use `@gsap/react` hooks (`useGSAP`) for React integration. Register `ScrollTrigger` plugin.

---

## Framer Motion Guidelines

```tsx
// Page wrapper
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>

// Staggered list
<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item_variant} />
  ))}
</motion.div>
```

---

## What NOT to Touch

- Any file in `src/lib/` — Supabase clients, hooks, utils, mock data
- Any file in `src/types/` — TypeScript domain models
- `src/middleware.ts` — auth route guard
- `src/app/auth/callback/route.ts` — OAuth callback
- `.env.local` — environment variables
- `package.json` dependencies beyond what's listed to install above
- Any `async` data fetching function, Supabase query, or auth call
- Any `router.push()` / redirect logic
- Form `onSubmit` handlers — restyle the form, not the submit logic
- The `isMockMode()` logic in mock-data.ts

---

## Final Checklist Before Submitting

**Functionality (must not be broken):**
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes
- [ ] Auth flow works: signup → check email screen, login → dashboard/marketplace
- [ ] Role selection works and inserts into Supabase
- [ ] Marketplace loads, filters, and search work
- [ ] Booking creation works (Book Now dialog)
- [ ] Chat interface renders and sends messages
- [ ] Seller dashboard stats render
- [ ] Seller can create/edit/delete scrap listings
- [ ] Image upload works on company setup and scrap forms
- [ ] GSAP animations don't crash on SSR (use `useEffect` or `useGSAP`, never run GSAP on server)
- [ ] No console errors related to missing props or broken imports

**Mobile (test every screen at 375px):**
- [ ] Landing page — hero, sections, navbar all look great on mobile
- [ ] Auth pages — forms are full width, readable, thumb-friendly
- [ ] Marketplace — filters scroll horizontally, cards stack to 1 column
- [ ] Scrap detail — price card is not hidden or clipped
- [ ] Chat — input bar is pinned to bottom, not hidden by keyboard
- [ ] Seller dashboard — stats stack cleanly
- [ ] All navbars collapse to mobile drawer/hamburger
- [ ] No horizontal scroll on any screen
- [ ] All tap targets are at least 44×44px

**Visual quality bar:**
- [ ] Every screen looks premium and intentional — not generic
- [ ] Every empty state has a designed illustration/icon + friendly copy
- [ ] Every loading state uses skeleton screens matching content shape
- [ ] Animations feel smooth, not janky (60fps)
- [ ] Dark theme is consistent across all screens — no white flashes or unstyled elements
