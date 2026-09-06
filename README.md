# Saravana Caters

A full-stack operations platform for a catering business — built to replace spreadsheets, WhatsApp notes, and paper trails with a single, self-hosted application the team can actually use.

---

## What it is

**Saravana Caters** is a custom business platform with two sides:

- A **public-facing website** where customers can browse the menu, gallery, services, and leave reviews
- An **internal operations hub** where the team manages the entire catering workflow — from the first enquiry to the final kitchen runsheet

Both run from the same codebase and share the same database. The split is architectural: the public site and the admin panel are served as two separate Next.js instances, keeping operations internal even if the public site is exposed to the internet.

---

## What the admin panel does

The operations hub covers the full lifecycle of a catering event:

**Pipeline**
- `Enquiries` → customer contacts, event details captured
- `Quotations` → itemised quote builder with PDF export
- `Bookings` → confirmed jobs, timeline, logistics

**Day-of**
- `Kitchen` → per-event task lists for the kitchen team
- `Recipes & Menus` → dish database, menu composition

**Business**
- `Customers` → CRM with full interaction history
- `Inventory` → stock tracking
- `Procurement` → ingredient purchase planning
- `Intelligence` → revenue, booking trends, performance charts

**Site management**
- `Testimonials` → review moderation queue (approve/delete public submissions)
- `Photo Gallery` → upload and manage event photos
- `Business Settings` → name, contact info, social links — all editable from the UI
- `Audit Trail` → every admin action logged

---

## What the public site does

- Homepage with hero, stats counter, event gallery, and testimonials carousel
- Full menu browser (categorised dishes)
- Services page
- Gallery page
- Contact form
- Reviews page — customers can submit, edit, and delete their own reviews

The review system has a full security stack: server-side rate limiting, input sanitisation, HTML stripping, gibberish detection, honeypot field, and CSRF validation. Reviews appear immediately on submission. The admin can delete any review at any time from the operations hub.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (Turbopack) |
| Language | TypeScript |
| Database | SQLite via `better-sqlite3` + Drizzle ORM |
| Auth | Better Auth |
| UI | Vanilla CSS with custom design tokens, Base UI, Lucide icons |
| Animation | GSAP + Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Email | Resend |
| Storage | Cloudflare R2 (for gallery uploads) |
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
| `inventory_items` | Stock tracking |
| `testimonials` | Public reviews |
| `gallery_images` | Photo gallery |
| `business_config` | Site-wide editable settings |
| `audit_logs` | Admin action history |
| `tasks` | Internal task management |

---

## Security

- **CSP** — strict Content Security Policy, eval blocked in production
- **HSTS** — 2-year max-age with subdomain coverage
- **Rate limiting** — in-memory IP-based limiter on all public write endpoints
- **Input sanitisation** — HTML stripped, null bytes, control chars, and zero-width chars removed on every field
- **Gibberish detection** — heuristic multi-layer check on review text
- **CSRF** — Origin/Host validation on all mutation API routes
- **Honeypot** — silent bot rejection on the review form
- **Edit tokens** — 128-bit `crypto.randomUUID()` tokens gate all public edit/delete operations
- **Audit trail** — every admin CREATE/UPDATE/DELETE is logged with user ID and timestamp
- **No secrets in repo** — all env files are gitignored

---

## Getting started

### Prerequisites
- Node.js 20+
- pnpm

### Setup

```bash
# Clone the repo
git clone https://github.com/krugren/Saravana-Caters.git
cd Saravana-Caters

# Install dependencies
pnpm install

# Create your environment file
# (copy from the example — do not commit the real file)
cp .env.example .env.local
# Edit .env.local and fill in the required values
```

### Required environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path, e.g. `file:local.db` |
| `BETTER_AUTH_SECRET` | Random secret (run `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Base URL of the auth server |
| `NEXT_PUBLIC_APP_URL` | Public URL of the site |
| `ADMIN_HOST` | Hostname of the admin portal |

Optional: `RESEND_API_KEY` (email), `R2_*` (gallery uploads), `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (CAPTCHA).

### Database

```bash
# Push schema to the database
pnpm db:push

# Seed with initial data (dishes, CMS content)
pnpm db:seed
pnpm db:seed-dishes
pnpm db:seed-cms

# Create the first admin account
pnpm tsx src/db/bootstrap-owner.mts
```

### Development

```bash
pnpm dev          # Public site on http://localhost:3000
pnpm dev:admin    # Admin portal on http://localhost:3001
```

### Production

```bash
pnpm build

pnpm start:public  # Public site on port 3000
pnpm start:admin   # Admin portal on port 3001
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
