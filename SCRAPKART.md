# SCRAPKART's INFO:

# Scrapkart - Idea Overview

**Terminology note:** Waste Producer = entity that generates waste. Recycler = entity that buys, processes, and recovers waste. In the current app code, these map to seller and buyer roles respectively.

## 1) What Scrapkart is

Scrapkart is a business-to-business (B2B) digital marketplace for industrial scrap trading.
It connects companies that generate waste/scrap (**Waste Producers**, technically sellers) with verified **Recyclers** (technically buyers) who collect, process, and recover that waste.

The core goal is to make scrap selling and buying structured, transparent, and faster than traditional offline broker-driven methods.

Scrapkart acts as the facilitator between Waste Producers and Recyclers, enabling trusted discovery, coordination, and transaction flow.

---

## 2) Why Scrapkart exists

The scrap industry is usually fragmented, local, and heavily dependent on calls/WhatsApp/middlemen.
That creates common problems:

- poor price visibility
- delayed communication
- unstructured listings
- trust and coordination issues
- manual tracking of pickup and status

Scrapkart solves this by giving both sides one platform for discovery, booking, and coordination.

---

## 3) Who uses Scrapkart

- **Waste Producers (industrial companies / sellers):** factories, workshops, warehouses, offices, and businesses that regularly generate waste/scrap.
- **Recyclers (buyers):** recycling companies and recovery operators, including aggregators, dismantlers, refurbishers, and processing units.
- **(Future) Admin/Platform team:** for moderation, analytics, payments, commissions, and compliance.

---

## 4) What value each user gets

### Waste Producer value (seller-side)

- List scrap quickly with category, quantity, photos, and location.
- Reach more Recyclers beyond existing local contacts.
- Track listing status (available/booked/collected).
- Communicate with interested Recyclers in-app.
- Increase sales cycle speed and reduce unsold inventory.

### Recycler value (buyer-side)

- Browse available scrap by category and company.
- View quantity, pricing, and location details before contacting.
- Book scrap directly from listings.
- Coordinate pickup, negotiation, and terms through chat.
- Reduce sourcing time and dependency on manual networks.

### Platform value

- Acts as the facilitator between Waste Producers and Recyclers.
- Creates a structured supply-demand network in a large, underserved market.
- Builds data layer for pricing intelligence and market trends.
- Opens monetization options (commission, subscriptions, promoted listings).

---

## 5) Core business idea in one line

Scrapkart is a digital operating layer for industrial scrap commerce: **discover -> evaluate -> book -> coordinate -> collect**.

---

## 6) Product scope in current V1 concept

The V1 is focused on proving the full Waste Producer-Recycler lifecycle (buyer-seller lifecycle in technical terms) with minimal friction:

- simple role-based onboarding (Recycler/Waste Producer)
- Waste Producer company profile setup
- scrap listing creation and management
- Recycler browsing and filtering
- booking creation
- post-booking chat communication
- basic status transitions

---

## 7) Scrap domain covered

Scrapkart supports major scrap categories commonly traded in India:

- Metal
- E-waste
- Plastic
- Paper
- Glass
- Mixed Scrap

Each listing can carry quantity, unit, optional price, description, images, Waste Producer/company identity, and location context.

---

## 8) Revenue model direction (business idea)

Potential revenue streams:

- **Commission per successful transaction**
- **Waste Producer subscriptions** (premium tools, more leads, analytics)
- **Featured/promoted listings**
- **Verification services** (trusted Waste Producer/seller badges, KYC packages)
- **Data-driven services** (market reports, trend insights)

---

## 9) Long-term vision

Scrapkart can evolve from a listing platform into a complete circular-economy transaction system:

- real-time verified marketplace
- integrated logistics and pickup scheduling
- digital payments and settlement
- compliance documentation workflows
- ratings/reputation layer
- regional expansion with multilingual experience

The strategic vision is to become the default B2B infrastructure for industrial scrap movement.

---

# Technical Flow

## A) High-level architecture

Current app architecture follows a clean Flutter pattern:

- **Frontend:** Flutter (Material 3 UI)
- **State management:** Provider
- **Central app state:** `AppState` (single source of UI state in V1)
- **Domain models:** User, Company, Scrap, Booking, Message
- **Data source (current):** mock in-memory lists
- **Target backend:** Supabase (auth, database, storage, realtime)

---

## B) Entity model flow

1. **User**
- role: Recycler or Waste Producer (stored as buyer or seller in current technical model)
- identity fields: id, email, phone, name

2. **Company**
- owned by Waste Producer/seller (`ownerId`)
- business profile: name, industry type, address, geo coordinates, logo

3. **Scrap**
- linked to Waste Producer/seller and company
- fields: title, category, quantity, unit, images, address, coordinates, price, description, status, createdAt

4. **Booking**
- connects Recycler/buyer + Waste Producer/seller + scrap
- holds booking lifecycle state and scheduling information

5. **Message**
- linked to booking conversation thread
- sender/receiver/content/timestamp/read status

---

## C) User journey and technical screen flow

### 1) App start and onboarding

`SplashScreen -> LoginScreen -> RoleSelectionScreen`

- splash animation and branding
- login form accepts email + phone (demo mode)
- user selects role:
  - Recycler (buyer) -> Buyer Home
  - Waste Producer (seller) -> Company Setup

### 2) Waste Producer flow

`CompanySetupScreen -> SellerDashboardScreen -> AddScrapScreen`

- Waste Producer creates company profile
- dashboard shows company info + listing stats
- Waste Producer adds scrap listing with category/quantity/unit/images/price/description
- listing is inserted into app state and appears in marketplace

### 3) Recycler flow

`BuyerHomeScreen (tabs) -> ScrapDetailsScreen`

Recycler Home tabs (current screen label: Buyer Home):

- Browse Scrap
- Companies
- Profile

Recycler can:

- filter by category
- open listing details
- express interest
- book available scrap

### 4) Booking and chat flow

`Book & Pay (UI action) -> Booking object created -> ChatScreen`

- booking creation changes scrap status to booked
- conversation opens for Recycler/Waste Producer coordination
- messages are stored and sorted by timestamp in app state

---

## D) Current V1 technical behavior (important)

- authentication is mock (no server auth yet)
- data persistence is in-memory (not permanent across app restart)
- payment is UI-level placeholder (no gateway integration yet)
- notifications are simulated in app logic
- some UI items are TODO placeholders (share, bookings page, settings navigation, etc.)
- search bars are present in UI, but deep search logic is limited
- distance filtering UI exists; production geospatial logic is pending

---

## E) Planned production backend flow (Supabase target)

1. **Auth**
- replace mock login with Supabase Auth
- session persistence, role-based access

2. **Database**
- tables: users, companies, scraps, bookings, messages
- map Dart models to SQL records
- add constraints and indexes

3. **Storage**
- upload scrap images/company logos to Supabase Storage
- store public/private URLs in records

4. **Realtime**
- subscribe to booking and message updates
- live chat and state sync across users

5. **Security**
- row-level security policies:
  - Waste Producer/seller edits only own company/scrap
  - Recycler/buyer sees allowed marketplace data
  - message access scoped by booking participants

6. **Payments**
- integrate Razorpay/Stripe for transaction flow
- booking confirmation tied to payment status
- optional platform commission pipeline

---

## F) End-to-end technical lifecycle (target)

1. User logs in and role is resolved.
2. Waste Producer creates/updates company profile.
3. Waste Producer posts scrap listing with media and metadata.
4. Listing becomes discoverable to Recyclers.
5. Recycler filters/evaluates and books scrap.
6. Booking state updates and chat thread begins.
7. Pickup scheduling and completion status are updated.
8. Payment and commission records are settled.
9. Analytics/reporting are generated for platform intelligence.

---
---

# ScrapKart — Project Context & Development Guide

> **This file is the central long-term memory for ScrapKart development.**
> It must be kept updated throughout the entire development lifecycle.

---

## 1. Project Overview

**ScrapKart** is a B2B digital marketplace for industrial scrap trading.

It connects **Waste Producers** (factories, workshops, warehouses, offices — entities that generate industrial waste/scrap) with **Recyclers** (recycling companies, aggregators, dismantlers, refurbishers — entities that buy, process, and recover waste).

### Problem

The scrap industry is fragmented, local, and heavily dependent on calls, WhatsApp, and middlemen. This creates:

- Poor price visibility
- Delayed communication
- Unstructured listings
- Trust and coordination issues
- Manual tracking of pickup and status

### Solution

ScrapKart provides a single structured platform for discovery, booking, and coordination between Waste Producers and Recyclers. The core flow:

**discover → evaluate → book → coordinate → collect**

### Platform Pivot

ScrapKart was initially built as a Flutter mobile app (APK was produced). That direction has been **fully abandoned**. The project is now a **Web Application / Progressive Web App (PWA)** — mobile-friendly, installable, responsive across all devices.

---

## 2. Business Model

ScrapKart acts as the facilitator between Waste Producers and Recyclers in a large, underserved market.

### Revenue Streams (Future)

- **Commission per successful transaction**
- **Waste Producer subscriptions** (premium tools, more leads, analytics)
- **Featured/promoted listings**
- **Verification services** (trusted badges, KYC packages)
- **Data-driven services** (market reports, pricing intelligence, trend insights)

---

## 3. User Roles

### Waste Producers (Sellers)

- Factories, workshops, warehouses, offices, businesses generating scrap
- Create company profiles, list scrap, manage listings, coordinate with Recyclers

### Recyclers (Buyers)

- Recycling companies, aggregators, dismantlers, refurbishers, processing units
- Browse marketplace, evaluate listings, book scrap, coordinate pickup

### Admin / Platform Team (Future)

- Moderation, analytics, payments, commissions, compliance

---

## 4. Core Product Features

| Feature | Status | Notes |
|---|---|---|
| Role-based onboarding (Recycler / Waste Producer) | Planned | |
| Waste Producer company profile setup | Planned | |
| Scrap listing creation & management | Planned | Category, quantity, unit, images, price, description, location |
| Marketplace browsing & filtering | Planned | By category, location, company |
| Scrap booking | Planned | |
| Post-booking chat (buyer ↔ seller) | Planned | Real-time messaging |
| Listing lifecycle | Planned | available → booked → collected |
| Company directory | Planned | |
| Search | Planned | |
| Notifications | Future | |
| Logistics / pickup scheduling | Future | |
| Payments integration | Future | Razorpay / Stripe |
| Ratings & reputation | Future | |
| Admin dashboard | Future | |

---

## 5. Domain Model

### User
- `id`, `email`, `phone`, `name`
- `role`: recycler (buyer) | waste_producer (seller)
- Auth and session data

### Company
- `id`, `ownerId` (waste producer)
- `name`, `industryType`, `address`, `geoCoordinates`, `logo`
- Business profile for the waste-producing entity

### Scrap
- `id`, `sellerId`, `companyId`
- `title`, `category`, `quantity`, `unit`, `price`, `description`
- `images[]`, `address`, `coordinates`
- `status`: available | booked | collected
- `createdAt`

**Scrap Categories:** Metal, E-waste, Plastic, Paper, Glass, Mixed Scrap

### Booking
- `id`, `buyerId`, `sellerId`, `scrapId`
- Lifecycle state, scheduling information
- Links recycler + waste producer + scrap

### Message
- `id`, `bookingId`, `senderId`, `receiverId`
- `content`, `timestamp`, `readStatus`
- Scoped to booking conversation thread

---

## 6. User Journey

### Onboarding
1. Landing page → Sign up / Log in
2. Select role: Recycler or Waste Producer

### Waste Producer Flow
3. Create company profile (name, industry, address, logo)
4. Access seller dashboard (company info, listing stats)
5. Add scrap listing (category, quantity, unit, images, price, description, location)
6. Manage listings (edit, update status, view interest)

### Recycler Flow
3. Access marketplace (browse scrap, view companies, manage profile)
4. Filter listings by category, location, company
5. View listing details (quantity, pricing, location, seller info)
6. Express interest / book scrap

### Post-Booking Flow
7. Booking created → scrap status changes to booked
8. Chat thread opens between Recycler and Waste Producer
9. Coordinate pickup details, negotiate terms
10. Pickup completed → status changes to collected

---

## 7. Product Vision

ScrapKart aims to become the **default B2B infrastructure for industrial scrap movement** — evolving from a listing marketplace into a complete circular-economy transaction system.

### Long-Term Roadmap
- Real-time verified marketplace
- Integrated logistics and pickup scheduling
- Digital payments and settlement
- Compliance documentation workflows
- Ratings and reputation layer
- Regional expansion with multilingual experience
- Pricing intelligence and market analytics
- Mobile-first PWA with offline capabilities

---

## 8. Milestones

### Completed
- [x] Project concept and domain model defined
- [x] Initial Flutter prototype built (now abandoned)
- [x] Platform pivot decision: Flutter → Web App / PWA
- [x] Project context documented (this file)
- [x] Tech stack finalized: Next.js + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel

### Current Stage
- **Phase: Pre-Development — Project Initialization**

### Upcoming
- [ ] Initialize project structure
- [ ] Design system setup (colors, typography, components)
- [ ] Authentication flow
- [ ] Core UI shell (layout, navigation, routing)
- [ ] Company profile CRUD
- [ ] Scrap listing CRUD
- [ ] Marketplace browsing & filtering
- [ ] Booking system
- [ ] Real-time chat
- [ ] PWA configuration (manifest, service worker, installability)

---

## 9. Architecture Notes

### Platform
- **Type:** Web Application / PWA
- **Responsive:** Mobile-first, works across all devices
- **Installable:** PWA with service worker, manifest, offline support

### Design System

| Token | Hex | Usage |
|---|---|---|
| Primary Dark | `#001C30` | Headers, primary text, nav backgrounds |
| Secondary | `#176B87` | Buttons, links, active states |
| Accent | `#64CCC5` | Highlights, badges, CTAs, success states |
| Light | `#DAFFFB` | Backgrounds, cards, subtle fills |

### Design Philosophy
- Clean, modern, highly intuitive
- Fast, professional, minimal friction
- Target aesthetic: **Stripe Dashboard / Linear / modern SaaS** — not traditional enterprise
- Optimized for industrial users who need speed and clarity

### Tech Stack (Finalized)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI Library | React |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui (headless, fully customizable) |
| Backend / Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime (chat, booking status sync) |
| File Storage | Supabase Storage (scrap images, company logos) |
| PWA | next-pwa |
| Deployment | Vercel |

**Why this stack:**
- Next.js App Router gives SSR/SSG for SEO on public marketplace pages + server components for performance
- TypeScript provides type safety across the full domain model
- Tailwind CSS + shadcn/ui enables the Stripe/Linear aesthetic with full design control using our custom color palette
- Supabase covers auth, database, realtime, and storage in one platform with Row Level Security
- Vercel is the natural deployment target for Next.js with edge functions and global CDN
- next-pwa handles service worker, manifest, and installability for PWA requirements

---

## 10. Updates Log

| Date | Update |
|---|---|
| 2026-03-10 |Documented full project scope, domain model, user journeys, design system, and milestone plan. Platform pivot from Flutter to Web/PWA confirmed. |
| 2026-03-10 | Tech stack finalized: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Vercel. PWA via next-pwa. |