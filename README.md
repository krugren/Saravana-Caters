# Saravana Caters

Full-stack catering business platform built with **Next.js 16**, **SQLite (Drizzle ORM)**, and **Better Auth**.

## Architecture

Two Next.js servers sharing a single codebase and SQLite database — a **public portal** for customers and a separate **admin portal** for internal operations, both gated by the same auth layer.

## Features

### Public Site
- Homepage with hero, testimonials, gallery, stats
- Menu browser, services, about, contact form
- Customer review submission (rate-limited, sanitised, gibberish-detected)

### Admin Operations Hub
- Dashboard with live KPIs
- Enquiries → Quotations → Bookings pipeline
- Customer CRM
- Kitchen task management
- Recipe & menu builder
- Inventory & procurement
- Business intelligence reports
- Testimonials moderation queue
- Photo gallery manager
- Audit trail

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Push the database schema
pnpm db:push

# Seed the database (optional)
pnpm db:seed

# Create the owner account
pnpm tsx src/db/bootstrap-owner.mts

# Run in development
pnpm dev          # public portal (port 3000)
pnpm dev:admin    # admin portal (port 3001)

# Run in production
pnpm build
pnpm start:public  # port 3000
pnpm start:admin   # port 3001
```

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Database**: SQLite via `better-sqlite3` + Drizzle ORM
- **Auth**: Better Auth
- **Styling**: Vanilla CSS with custom design tokens
- **Security**: CSP, HSTS, rate limiting, input sanitisation, gibberish detection
