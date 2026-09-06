# Saravana Caters

A full-stack operations platform for a catering business — built to replace spreadsheets, WhatsApp notes, and paper trails with a single, self-hosted application the team can actually use.

---

## What it is

**Saravana Caters** is a custom business platform with two sides:

- A **public-facing website** where customers can browse the menu, gallery, services, and leave reviews
- An **internal operations hub** where the team manages the entire catering workflow — from the first enquiry to the final kitchen runsheet

Both run from the same codebase and share the same database. The split is architectural: the public site and the admin panel are served as two separate Next.js instances, keeping operations internal even if the public site is exposed to the internet.

---

## Database: SQLite (not PostgreSQL)

The original design spec called for PostgreSQL on Neon. **We went with SQLite instead**, and here's why it's the right call for this specific project:

- **Single business, one location** — there's no concurrent write pressure that requires a server-based database
- **Zero DevOps** — no connection pools, no cold starts, no hosted DB to manage or pay for
- **Self-hosted** — the entire platform including the database lives on the server you control
- **Fast reads** — SQLite reads are memory-mapped; for a catering business doing dozens of bookings a month, it's faster than a networked Postgres query
- **Simple backups** — a database backup is literally copying one file

The tradeoff: no horizontal scaling and no full-text search out of the box. Neither matters for a single-location catering business.

Drizzle ORM handles the schema and queries. The same Drizzle code would work on PostgreSQL if you ever needed to migrate.

---

## What's built

### Public website ✅
- [x] Homepage — hero section, animated stats counter, events gallery, testimonials carousel, CTA
- [x] Menu page — full dish browser with categories
- [x] Services page — service model explanations
- [x] Gallery page — event photo browser
- [x] About page
- [x] Contact form — enquiry submission with email notification
- [x] Reviews page — customers can submit, edit, and delete their own reviews
- [x] SEO — sitemap, robots.txt, OpenGraph, JSON-LD schema, breadcrumbs
- [x] PWA manifest
- [x] Security headers — CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy

### Review system security ✅
- [x] Server-side rate limiting (2 submissions / IP / 24h)
- [x] Input sanitisation — HTML stripped, null bytes, control chars, zero-width chars removed
- [x] Gibberish detection — char repetition, keyboard mash, vowel ratio, word quality heuristics
- [x] Honeypot field — silent bot rejection
- [x] CSRF validation — Origin/Host header check on all mutation routes
- [x] Edit tokens — 128-bit `crypto.randomUUID()` tokens gate all public edit/delete operations
- [x] Admin delete — any review can be removed from the ops hub at any time

### Admin operations hub ✅
- [x] Authentication — Better Auth with session management, login gate
- [x] Dashboard — live KPIs (revenue, bookings, pending enquiries, inventory alerts)
- [x] Enquiries — capture name, phone, event type, date, guest count, source channel
- [x] Quotations — itemised quote builder with PDF export
- [x] Bookings — confirmed events with payment tracking (advance paid / balance due)
- [x] Customer CRM — customer cards, full enquiry and booking history
- [x] Kitchen tasks — per-event task lists for the kitchen team
- [x] Menu & recipe management — dish library, menu composition, 4 service models
- [x] Inventory — ledger-based stock tracking (movements, not editable numbers)
- [x] Procurement — ingredient purchase planning based on upcoming events
- [x] Business intelligence — revenue charts, booking trends, cost ratios, top customers
- [x] Task manager — internal operational tasks
- [x] Testimonials moderation — admin queue to delete public reviews
- [x] Photo gallery manager — upload and manage event photos
- [x] Business settings — name, contact info, social links, pricing rules — all editable from UI
- [x] Audit trail — every admin CREATE/UPDATE/DELETE logged with user and timestamp

---

## What's not built yet

### Near-term (planned)
- [ ] **Universal search** — Ctrl+K command palette across customers, events, tasks
- [ ] **WhatsApp / Email quotation sending** — send PDF quote directly from the quotation view
- [ ] **Kitchen plan print layout** — print-optimised runsheet for the kitchen team
- [ ] **Advance / payment tracking** — balance reminders, receipt generation
- [ ] **Supplier master** — supplier directory linked to procurement suggestions
- [ ] **Multi-role access** — Owner / Kitchen / Admin roles with scoped permissions (currently single owner account)

### Requires real data first (deferred)
- [ ] **Seasonal demand forecasting** — needs 12+ months of booking history
- [ ] **Supplier reliability scoring** — needs months of purchase records
- [ ] **Price trend analysis** — needs historical pricing data
- [ ] **AI/ML recommendations** — needs enough data to be meaningful

### Deliberately not planned
- **Multi-tenancy** — one business, one database, that's the point
- **Plugin marketplace** — unnecessary complexity for a single-operator platform

---

## Information flow

The platform is designed around a single linear pipeline:

```
Customer Enquiry
  → Service model selected (Labour / Full Contract / Traditional / Corporate)
  → Quotation built (dishes × guest count × per-plate or labour rate)
  → Booking confirmed (advance paid, date locked)
  → Kitchen plan generated (prep timeline, scaled task list)
  → Demand calculated (recipe × guest count = ingredient requirements)
  → Procurement suggested (requirements − current stock = purchase list)
  → Inventory updated (purchased → used → waste movements logged)
  → Business intelligence updated (revenue, cost, margin recalculated)
```

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (Turbopack) |
| Language | TypeScript |
| Database | SQLite via `better-sqlite3` + Drizzle ORM |
| Auth | Better Auth |
| UI | Vanilla CSS + Tailwind CSS v4, Base UI, Lucide icons |
| Animation | GSAP + Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Email | Resend |
| Storage | Cloudflare R2 (gallery uploads) |
| CAPTCHA | Cloudflare Turnstile |
| Linting | Biome |

---

## Database schema

| Table | Purpose |
|---|---|
| `users`, `sessions`, `accounts` | Better Auth authentication |
| `enquiries` | Incoming customer enquiries |
| `quotations`, `quotation_items` | Quote builder |
| `bookings` | Confirmed events |
| `customers` | CRM records |
| `kitchen_tasks` | Per-event kitchen task lists |
| `menus`, `menu_items` | Dish and menu management |
| `inventory_items` | Ledger-based stock tracking |
| `testimonials` | Public reviews (with edit tokens) |
| `gallery_images` | Event photos |
| `business_config` | Site-wide editable settings |
| `audit_logs` | Admin action history |
| `tasks` | Internal task management |

---

## Getting started

### Prerequisites
- Node.js 20+
- pnpm

### Setup

```bash
git clone https://github.com/krugren/Saravana-Caters.git
cd Saravana-Caters

pnpm install

# Create your local environment file — never commit this
cp .env.example .env.local
# Edit .env.local and fill in the values
```

### Required environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path — use `file:local.db` |
| `BETTER_AUTH_SECRET` | Long random secret (`openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Base URL of the public portal |
| `NEXT_PUBLIC_APP_URL` | Same as above |
| `ADMIN_HOST` | Hostname of the admin portal |

Optional: `RESEND_API_KEY` (email), `R2_*` (photo uploads), `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (CAPTCHA on review form).

### Database

```bash
pnpm db:push          # Create tables from schema
pnpm db:seed          # Seed base data
pnpm db:seed-dishes   # Seed dish library
pnpm db:seed-cms      # Seed CMS content (homepage sections)

# Create the first admin account
pnpm tsx src/db/bootstrap-owner.mts
```

### Development

```bash
pnpm dev          # Public site → http://localhost:3000
pnpm dev:admin    # Admin portal → http://localhost:3001
```

### Production

```bash
pnpm build
pnpm start:public  # Public site
pnpm start:admin   # Admin portal
```

---

## Project structure

```
src/
├── app/
│   ├── (public)/      # Public website pages
│   ├── (admin)/       # Admin portal pages
│   └── api/           # API routes (auth, gallery, public review)
├── components/
│   ├── public/        # Navbar, footer, floating CTA
│   ├── admin/         # Sidebar, topbar
│   └── ui/            # Shared UI primitives
├── features/          # Server actions, grouped by domain
├── db/
│   ├── schema/        # Drizzle table definitions
│   └── migrations/    # Schema migration scripts
└── lib/               # Auth, rate limiter, sanitiser, gibberish detector, audit logger
```
