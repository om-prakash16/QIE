# SkillProof — Hiring Tool

A full-stack, enterprise-grade hiring platform built for the modern Web3 talent economy. Companies can post jobs and verify talent, candidates can build verifiable on-chain profiles, and administrators manage the platform through a real-time CMS.

**Stack**: Next.js 16 · FastAPI · Supabase (PostgreSQL) · Solana Web3.js · Framer Motion

---

## Repository Structure

```
/
├── web/                        # Next.js 16 frontend (App Router)
│   └── src/
│       ├── app/                # Route segments (pages & layouts)
│       │   ├── auth/           # Login & registration flows
│       │   ├── dashboard/      # Role-scoped dashboards
│       │   │   ├── candidate/  # Profile, skills, activity timeline
│       │   │   └── company/    # Recruiter dashboard, applicants, hiring activity
│       │   └── admin/          # Admin panel: forensics, activity logs, CMS
│       ├── components/         # Shared UI component library (shadcn/ui + custom)
│       │   ├── auth/           # Role selector, wallet connection
│       │   ├── activity/       # Role-aware timeline components
│       │   ├── features/       # Landing page sections (hero, jobs, stats)
│       │   ├── layout/         # Navbar, sidebar, footer
│       │   └── ui/             # Atomic UI: Button, Card, Input, Badge, Table...
│       ├── context/            # React Context providers
│       │   ├── auth-context.tsx    # Solana wallet auth + JWT session state
│       │   └── cms-context.tsx     # Live CMS content hydration
│       └── lib/
│           ├── api/            # Typed API client (fetchWithAuth bindings)
│           └── validations/    # Zod schema definitions
│
├── server/                     # FastAPI backend (Python 3.11+)
│   ├── main.py                 # App factory, CORS, router registration
│   ├── core/
│   │   ├── supabase.py         # Supabase client singleton
│   │   └── postgres.py         # Legacy MockConnection bridge (Supabase compat)
│   └── modules/                # Feature-scoped routers & services
│       ├── auth/               # Wallet-based authentication, JWT issuance
│       ├── users/              # Profile schema, dynamic profile builder
│       ├── company/            # Company creation, team management
│       ├── jobs/               # Job posting, listing, details
│       ├── applications/       # Apply, status tracking
│       ├── admin/              # User moderation, company verification
│       ├── ai/                 # Resume scoring, skill recommendation
│       ├── analytics/          # Real-time metrics engine (DB driven)
│       ├── activity/           # Multi-actor event stream & audit logs
│       ├── cms/                # Dynamic content management (landing page)
│       ├── notifications/      # In-app notification delivery
│       ├── search/             # Full-text candidate & job search
│       ├── sync/               # Profile sync & data reconciliation
│       ├── nft/                # On-chain credential minting (Solana)
│
├── packages/
│   └── database/
│       └── migrations/         # Ordered SQL migrations (01... to 99...)
│           ├── 01_base_schema.sql
│           ├── 06_company_panel.sql
│           ├── 23_job_marketplace_system.sql
│           ├── 30_activity_events.sql
│           └── 99_master_schema_parity.sql
│
├── contracts/                  # Solana programs (Anchor framework)
├── docker-compose.yml          # Local dev environment orchestration
├── Makefile                    # Dev shortcuts: `make dev`, `make migrate`
└── .env.example                # Required environment variables template
```

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│         Next.js Frontend              │
│  ┌──────────────┐  ┌──────────────┐ │
│  │ auth-context │  │  cms-context │ │
│  └──────┬───────┘  └──────┬───────┘ │
│         │ walletLogin()    │ getVal() │
│         └────────┬─────────┘         │
│             fetchWithAuth()           │
└─────────────────┬───────────────────┘
                  │ HTTPS / REST
                  ▼
┌─────────────────────────────────────┐
│           FastAPI Backend             │
│  /api/v1/auth    /api/v1/company     │
│  /api/v1/jobs    /api/v1/admin       │
│  /api/v1/ai      /api/v1/cms  ...    │
└─────────────────┬───────────────────┘
                  │ Supabase Client
                  ▼
┌─────────────────────────────────────┐
│          Supabase (PostgreSQL)        │
│  users · companies · jobs            │
│  applications · roles · cms_content  │
└─────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Wallet-First Authentication
Authentication is anchored to Solana wallet addresses. On first login, a wallet signs a challenge message; the backend verifies the signature, creates a user record, and issues a short-lived JWT. The role (`USER` / `COMPANY` / `ADMIN`) is embedded in the token and stored in the `users` table.

### 2. Modular FastAPI Architecture
Each feature domain (jobs, applications, company, admin, ai, etc.) lives as an isolated Python package: `router.py` handles HTTP, `service.py` handles business logic, `models.py` defines Pydantic schemas. This mirrors common Django-apps / Rails-engines patterns and makes it trivial to add, disable, or test a feature in isolation.

### 3. Dynamic Content via CMS Context
Landing page copy, navbar links, and feature flags are stored in a `cms_content` table and served via `/api/v1/cms`. The React `CmsContext` hydrates this at page load, making the entire landing experience editable from the admin panel without a code deploy.

### 4. Role-Aware Company Verification
Newly created companies are initialized with `verified = false`. An admin must explicitly promote a company via `PATCH /admin/companies/{id}/verify`. The admin dashboard surfaces a "Pending" badge and "Verify Entity" action for unverified entries.

### 5. Supabase Compatibility Layer
While migrating from a custom Postgres client, a `MockConnection` bridge in `core/postgres.py` proxies calls to Supabase. This allowed legacy routes to keep working without immediate refactoring, while new routes connect directly via the Supabase client singleton.

### 6. Real-Time Activity Intelligence
The platform tracks every lifecycle event (job posting, application, profile view, verification) in a central `activity_events` table. This data is surfaced through specialized timelines for each role. A 15-30s polling cycle ensures dashboards feel alive, providing companies with candidate engagement forensics and admins with a global system audit trail.

---

## Getting Started

```bash
# Clone and set up environment
cp .env.example .env          # and fill in values
cp web/.env.example web/.env.local

# Backend
cd server && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd web && npm install
npm run dev                   # http://localhost:3000

# Or, spin everything up together
make dev
```

**Required environment variables**: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`

---

## Running Database Migrations

Migrations live in `packages/database/migrations/` and are numbered sequentially. Run them in order through the Supabase dashboard SQL editor, or with the Supabase CLI:

```bash
supabase db push
```

---

## Contributing

Pull requests are welcome. Open an issue first for major changes. Ensure any new backend routes follow the module pattern in `server/modules/` and add corresponding API bindings in `web/src/lib/api/api-client.ts`.
