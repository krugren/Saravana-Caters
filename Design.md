# Saravana Caters — Operations Platform
### Design & Architecture Reference
> "Build like an enterprise architect. Ship like a startup."

---

## Stitch Project

**Project ID:** `14928364561794750008`
**Design System:** Organic Tradition (`assets/b1009073ef984dc882b56976e377fc32`)

---

## Design System — Organic Tradition

### Philosophy
The **Banana Leaf Design Language** — organic warmth of South Indian hospitality fused with the precision of a premium operational platform.

### Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#0d631b` | CTAs, nav accents, success states |
| Forest Green | `#1b4332` | Sidebar, footers, high-contrast areas |
| Gold Accent | `#c8a951` | Revenue figures, premium tier markers |
| Ivory Cream | `#fbf9f1` | Primary canvas / background |
| Surface Container | `#f0eee6` | Card backgrounds |
| Outline | `#707a6c` | Borders, dividers |
| Error | `#ba1a1a` | Destructive actions, critical alerts |

### Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Headlines | Playfair Display | 24-56px | 600-700 |
| Body | Manrope | 16-18px | 400 |
| Labels / Caps | Manrope | 12px | 700, 0.1em tracking |
| Cultural / Tamil | Noto Serif Tamil | 20px | 400 |

---

## Real Service Models (from Services screen)

These are the actual service tiers Saravana Caters offers. All admin screens MUST use only these — not assumed Silver/Gold/Platinum tiers.

### 1. Labour Service (Manpower Only)
- Client provides all ingredients, equipment, and logistics
- Saravana Caters provides: expert chefs + uniformed serving staff
- Pricing: Custom quote based on staff count
- Guest range: 100 to 5000+ guests
- Badge label: "Manpower Only"

### 2. Full Contract Service (End-to-End)
- Saravana Caters handles everything: ingredient sourcing, cooking, serving, cleanup
- Includes on-site consultations in Erode for menu customization
- Pricing: Per plate / per leaf, starting Rs200+
- Guest range: 50 to 500+ guests
- Badge label: "Full-Service (Per Plate/Leaf)"
- Most popular / highlighted tier

### 3. Traditional Package
- Per plate / per leaf pricing
- 24+ village-style dishes
- Banana leaf service included
- 2 signature sweets included
- Guest range: 200 to 1000 guests

### 4. Corporate Package
- Custom quote
- Fusion menu
- High Tea included
- Uniformed waiters
- 2 live counters
- Guest range: 50 to 2000 guests

### Service Comparison

| Feature | Labour Only | Traditional | Full Contract | Corporate |
|---|---|---|---|---|
| Pricing | Fixed labour cost | Per plate/leaf | Per plate from Rs200 | Custom quote |
| Raw Materials | Client provided | Included | Premium incl. | Premium incl. |
| Staff Focus | Expert cooks + servers | Traditional attire | End-to-end mgmt | Professional uniform |
| Guest Range | 100-5000+ | 200-1000 | 50-500+ | 50-2000 |
| Live Counters | Operator provided | 1 counter | Included | 2 counters |

---

## Real Event Types (from Services screen)

- Grand Weddings (500 to 5000+ guests)
- Receptions (elegant buffet and sit-down)
- Temple Festivals (mass catering)
- Private Events — Housewarmings and Birthdays (50+ guests)
- Corporate Events (meetings and galas)
- Educational Festivals (school events)

---

## Real Dishes (from Menu screen)

| Dish | Category | Notes |
|---|---|---|
| Ghee Roast Sannas | Breakfast | Signature dish, weddings |
| Erode Seeraga Samba Biryani | Grand Lunch | Non-veg, crowd favourite |
| Elaneer Payasam | Dessert | Premium, receptions |
| Karaikudi Chicken Curry | Lunch | Non-veg, Chettinad classic |
| Traditional Sambar Vadai | Breakfast | All-time favourite, temple |
| Madurai Mutton Biryani | Lunch | Non-veg, wedding/reception |

Menu categories: Pure Veg / Non-Veg / Breakfast / Lunch / Snacks / Desserts

---

## Admin Screen Inventory

### Public Website (existing)

| Screen | Description |
|---|---|
| Home | Hero, brand story, stats counter |
| Menu & Pricing | Dish explorer, 4 service packages comparison table |
| Gallery | Cinematic food and event photography |
| About | 20-year heritage, team story |
| Services | Events served + 2 service tiers + 6-step process |
| Testimonials | Customer reviews |
| Contact / Book | Enquiry form |

### Admin Operations Platform (designed in Stitch)

| Screen | Module | Description |
|---|---|---|
| Login | Auth | Premium branded login with role selector |
| Executive Dashboard | Platform | KPI cards, attention alerts, upcoming events, tasks |
| Enquiry Management | Customer Ops | Lead table, status workflow, interaction timeline |
| Bookings & Calendar | Customer Ops | Monthly calendar + event list, payment tracking |
| Customer Management | Customer Ops | Customer cards, profile, history, notes |
| Kitchen Planning | Kitchen Ops | Prep timeline by time slot, scaled ingredient list |
| Recipes & Menus | Master Data | 4 service models, dish library, per-100-guest scaling |
| Inventory | Inventory | Ledger-based stock table, movement history |
| Procurement | Inventory | Auto-calculated purchase suggestions per event |
| Business Intelligence | BI | Revenue charts, cost ratio, top customers |
| Task Manager | Platform | Kanban board with cross-module tasks |
| Configuration Engine | Platform | Pricing rules, stock thresholds, business profile |
| Audit Trail / Timeline | Platform | Chronological event log with before/after diffs |
| Universal Search | Platform | Ctrl+K command palette overlay |

---

## Architecture Principles

### Core Philosophy
> "Build irreversible decisions correctly. Delay reversible decisions until they are needed."

| Decision | Build Now | Reason |
|---|---|---|
| Database schema | YES | Expensive to change later |
| Configuration system | YES | Expensive to retrofit |
| Stock ledger not editable number | YES | Historical data cannot be recreated |
| Audit trail | YES | Hard to reconstruct |
| Event-driven architecture | YES | Best structural decision |
| AI and ML and Forecasting | NO | Needs 6-12 months of data first |
| Plugin marketplace | NO | One business, one customer |
| Multi-tenancy | NO | One database, one business |
| Predictive analytics | NO | Needs data first |

### Information Flow

Customer Enquiry
  -> Service Model selection (Labour / Full Contract / Traditional / Corporate)
  -> Quotation (dishes x guest count x per-plate rate or labour rate)
  -> Booking (confirmed event)
  -> Kitchen Planning (prep timeline, scaled tasks)
  -> Demand Planning (recipe x guest count = ingredient needs)
  -> Procurement (needs minus stock = purchase list)
  -> Inventory (ledger: purchased -> used -> waste)
  -> Material Flow (loss categories: waste, damage, leftover)
  -> Financial Analysis (revenue, cost, margin)
  -> Decision Support (rule-based alerts, KPIs)

---

## Recommended Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 App Router | Single app, no microservices |
| Database | PostgreSQL on Neon (generous free tier) | Full-text search built in |
| ORM | Drizzle ORM | Best fit for Next.js + Bun + Neon + TypeScript |
| Auth | NextAuth v5 | Simple RBAC (Owner / Kitchen / Admin) |
| File Storage | Cloudflare R2 (free 10GB) | S3-compatible, zero egress cost |
| Deployment | Vercel (free tier) | Zero-config Next.js |
| Search | Postgres full-text search | No separate infra needed |
| Background Jobs | Vercel Cron (free tier) | Expiry alerts, reminders |
| Email | Resend (free 3000 per month) | Quotation delivery |

All free or generous free tier for V1.

---

## Module Breakdown

### Auth & Roles
- 3 roles: Owner (full access), Kitchen (kitchen + inventory read), Admin (bookings + enquiries)
- Simple RBAC

### Customer & Enquiry
- Capture: Name, Phone, Event Type, Date, Guest Count, Source (Walk-in / Phone / Website / WhatsApp)
- Status workflow: New -> Contacted -> Quoted -> Converted -> Closed
- Interaction timeline per enquiry

### Quotation Engine
- Deterministic math only
- Service model selection drives pricing logic:
  - Labour Only: fixed staff count x daily rate
  - Full Contract / Traditional / Corporate: guest count x per-plate rate
- Configurable pricing rules via Configuration Engine
- Output: PDF quotation with letterhead

### Event / Booking
- Convert quote -> confirmed event
- Payment: advance paid, balance due
- Linked to kitchen plan flag

### Master Data (Menus and Recipes)
- 4 service models: Labour Only, Full Contract, Traditional, Corporate
- Dish library: Pure Veg, Non-Veg, Breakfast, Lunch, Snacks, Desserts categories
- Actual dishes from the menu screen
- Recipe: ingredients per 100 guests + prep steps
- Drives kitchen planning and demand calculation

### Inventory (Ledger-Based)
- NEVER edit a number directly — all changes via movements
- Movement types: Purchase, Used (event), Waste, Damage, Return, Adjustment
- Current stock = sum of all ledger entries
- Minimum threshold per ingredient triggers Attention Panel alert

### Procurement (Suggestions)
- Formula: Required = recipe qty per guest x guest count for all upcoming events
- Purchase = Required minus Current Stock (if positive)
- Suggested supplier from master supplier table

### Kitchen Planning
- Prep timeline: tasks with time slots, assigned staff, duration
- Scaled ingredient list: recipe x guest count vs current stock
- Print-friendly layout

### Business Intelligence
- Revenue by month, by event type (Wedding / Reception / Temple / Private / Corporate / Educational)
- Financial summary: gross revenue, material cost, net margin
- Top customers by revenue
- Decision Insights: rule-based alerts (no AI)

### Configuration Engine
- All business rules in DB tables — editable without a deploy
- Pricing: per-plate rate by service model, labour day rate, minimum advance %
- Stock thresholds per ingredient
- GST rate, business profile, bank details

### Task Manager
- Cross-module operational tasks (Kitchen, Inventory, Procurement, Booking)
- Kanban: To Do / In Progress / Done

### Business Timeline (Audit Trail)
- Every action recorded: user, timestamp, entity, before/after
- Filterable by module, user, date range

### Universal Search
- Postgres full-text search across customers, events, ingredients, tasks
- Ctrl+K overlay, keyboard navigable

---

## Build Order (8-10 Weeks)

### Weeks 1-2 — Foundation
- Next.js + Drizzle + Neon setup
- Database schema: customers, events, service_models, recipes, ingredients, suppliers, users
- Configuration Engine tables (pricing by service model, stock thresholds)
- Auth (NextAuth v5, 3 roles)
- Sidebar layout shell

### Weeks 3-4 — Core Business Flow
- Enquiry CRUD + status workflow
- Customer management
- Booking creation + calendar view

### Weeks 5-6 — Operations
- Master data (service models, dish library, recipes, ingredients, suppliers)
- Inventory ledger
- Procurement suggestions
- Kitchen planning

### Weeks 7-8 — Intelligence & Platform
- Executive dashboard
- Business Intelligence
- Task Manager
- Universal Search
- Audit Trail

### Weeks 9-10 — Polish
- File attachments via Cloudflare R2
- WhatsApp / Email quotation sending
- Print-optimised kitchen plan layout
- Real usage with family

---

## Architecture Decision Records (ADRs)

| ADR | Decision | Reason |
|---|---|---|
| ADR-001 | Drizzle over Prisma | Better fit for Next.js App Router, Bun, Neon, serverless |
| ADR-002 | Ledger-based inventory | Historical data is irreplaceable, audit trail is built in |
| ADR-003 | Configuration Engine in DB | Hardcoding pricing is expensive to undo later |
| ADR-004 | No Redis or queues in V1 | Add only when real load justifies it |
| ADR-005 | Postgres full-text search | No separate infra, good enough for this scale |
| ADR-006 | Single Next.js app | One business, no distributed complexity needed |
| ADR-007 | Neon over self-hosted Postgres | Zero DevOps, generous free tier, auto-suspend |
| ADR-008 | 4 service models not Silver/Gold/Platinum | Matches real business: Labour, Full Contract, Traditional, Corporate |

---

## The V1 Test

Before adding anything, ask: "Can this be computed with zero historical data, using only today's inputs?"

| Feature | Passes | V1 |
|---|---|---|
| Quotation (service model x guests x per-plate rate) | YES | YES |
| Kitchen plan (recipe x guest count) | YES | YES |
| Purchase list (needs minus stock) | YES | YES |
| Inventory current stock (ledger sum) | YES | YES |
| Revenue this month | YES | YES |
| Seasonal demand forecasting | NO — needs 1+ year data | NO |
| Supplier reliability scoring | NO — needs months of records | NO |
| Price trend analysis | NO — needs price history | NO |
