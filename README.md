<div align="center">

# ⚓ TeknePazari

**A full-stack marine marketplace — boats, parts, marinas, crew and more**

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-000000?logo=nextdotjs&logoColor=white)](frontend)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript&logoColor=white)](.)
[![Express](https://img.shields.io/badge/Express-API-259dff)](backend)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](backend/drizzle)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](docker-compose.yml)

</div>

> **Status: in active development.** Core marketplace features work end-to-end
> in dev; payments, tests, and real-time messaging are on the roadmap (see
> [Known gaps](#known-gaps--roadmap)). Kept public as a work-in-progress
> portfolio project.

## What's built

- **11 listing types** — yachts, parts, marinas, crew, equipment, expertise,
  insurance, marketplace, service, storage — each with its **own dynamic form
  schema and filter schema**, dispatched through a per-type handler registry
  (Strategy pattern) on the backend.
- **Category system** — 10 root / 81 sub-categories with tree endpoints,
  search, and a full **user-suggestion workflow**: users propose categories,
  admins approve / reject / merge.
- **Auth** — JWT sessions, e-mail verification and password reset (Resend),
  scheduled cleanup of unverified accounts.
- **Image pipeline** — multer + sharp: resize/optimize on upload, type and
  size limits, served statically.
- **Broker portal** — broker registration, public store pages
  (`/broker/[slug]`), leads/CRM, analytics, reviews.
- **Admin panel** — dashboard stats, listing moderation, user management
  (roles/bans), reports, analytics, category management.
- **Messaging, favorites, notifications** and a user dashboard.

## Architecture

```
├── frontend/           Next.js 14 (App Router) · React 18 · TypeScript
│   └── src/
│       ├── app/        routes: listings, search, dashboard, broker, admin…
│       ├── components/ forms (per listing type), listings, dashboard, ui
│       ├── lib/api/    layered API client: client → services → types
│       ├── lib/validation/  zod schemas (mirrored with the backend)
│       └── store/      zustand
├── backend/            Express · Drizzle ORM · PostgreSQL
│   └── src/
│       ├── routes/     10 route modules (auth, listings, brokers, admin…)
│       ├── controllers/
│       ├── handlers/listing/   ← per-type handler registry (11 types)
│       ├── db/schema/  modular Drizzle schema (core, listings, broker, social)
│       ├── middleware/ auth, upload (multer+sharp), validation
│       └── services/   e-mail (Resend)
├── docs/               product docs: PRD, user stories, wireframes, api spec,
│                       architecture, roadmap + engineering analyses
└── docker-compose.yml  local PostgreSQL
```

Design notes worth a look:

- **Per-type handler registry** (`backend/src/handlers/listing/`) — adding a
  listing type means one handler + one form schema + one filter schema; routes
  and controllers stay untouched.
- **Zod on both ends** — the same validation contracts exist in
  `backend` middleware and `frontend/src/lib/validation`.
- **Modular Drizzle schema** with explicit relations, 6 versioned migrations.

## Running locally

```bash
# 1. Database
docker-compose up -d           # Postgres 15 on :5432

# 2. Backend  (:3001)
cd backend
cp .env.example .env           # set JWT_SECRET; RESEND_API_KEY optional in dev
npm install
npm run db:migrate             # apply Drizzle migrations
npm run seed:categories        # seed the category tree (optional)
npm run dev

# 3. Frontend (:3000)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

## Known gaps / roadmap

Honest list of what a visitor will notice:

- **No payments/checkout yet** — listing packages are speced (see `docs/`) but
  not implemented.
- **No tests yet** — planned as its own phase.
- **Messaging is not real-time** (REST polling; WebSocket planned).
- The 6 newest listing types are still being wired into a few frontend
  label/icon maps (visible as `tsc` warnings).
- Extensive product documentation lives in `docs/` — strategy, PRD, user
  stories, wireframes, API spec, roadmap.

## License

All rights reserved — source available for portfolio review.
