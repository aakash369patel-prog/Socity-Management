# Society Management System — Implementation Roadmap

## Overview

Monorepo layout: `backend/` (Laravel 11 API), `frontend/` (React 18 + Vite + TypeScript), `docs/`.

---

## Phase 0 — Environment & Scaffolding (Day 1–2)

| Step | Action |
|------|--------|
| 0.1 | Install PHP 8.2+, Composer, Node 20+, MySQL 8.0 |
| 0.2 | `composer create-project laravel/laravel backend` |
| 0.3 | `npm create vite@latest frontend -- --template react-ts` |
| 0.4 | Configure `.env`: `DB_*`, `SANCTUM_STATEFUL_DOMAINS`, `FRONTEND_URL` |
| 0.5 | Enable CORS in `config/cors.php` for SPA origin |
| 0.6 | `php artisan install:api` (Laravel 11) + `composer require laravel/sanctum` |

**Deliverable:** Both apps run locally; health check `GET /api/health`.

---

## Phase 1 — Database & Domain Layer (Day 3–5)

| Step | Action |
|------|--------|
| 1.1 | Run all migrations (see `DATABASE_SCHEMA.md`) |
| 1.2 | Seeders: roles, demo society, admin user, sample units |
| 1.3 | Eloquent models with relationships + `$fillable` + soft deletes |
| 1.4 | Enums: `UserRole`, `UnitStatus`, `VisitorStatus`, `InvoiceStatus`, `ComplaintStatus`, `UnitOccupancyType` |

**Deliverable:** `php artisan migrate:fresh --seed` succeeds.

---

## Phase 2 — Authentication & Authorization (Day 6–7)

| Step | Action |
|------|--------|
| 2.1 | Sanctum token login/logout/register (resident invite flow later) |
| 2.2 | Middleware: `EnsureUserHasRole`, `EnsureUserBelongsToSociety` |
| 2.3 | Policies for society-scoped resources (visitors, invoices, complaints) |
| 2.4 | API: `POST /api/login`, `POST /api/logout`, `GET /api/user` |

**Deliverable:** Role-guarded routes return 403 for wrong role.

---

## Phase 3 — Core Module APIs (Week 2)

### 3.1 User & Unit Management

- CRUD societies (super_admin only)
- CRUD blocks/units; attach owners/tenants via `unit_user`
- Vehicle registry (optional `vehicles` table in Phase 3 extension)

### 3.2 Gate Security & Visitor Log

- Pre-approved guests (future: `visitor_passes`)
- Check-in / check-out (this blueprint implements core flow)
- Delivery log extension on `visitors.purpose` + category field

### 3.3 Financial Accounting

- Generate maintenance invoices per unit/period
- Mark paid/unpaid; ledger entries (`ledger_entries` table — Phase 3 extension)
- Payment gateway webhooks (Razorpay/Stripe — Phase 4)

### 3.4 Helpdesk

- Complaint CRUD + status workflow: `open` → `in_progress` → `resolved`
- Assign to society admin or vendor user

**Deliverable:** Postman/Insomnia collection for all v1 endpoints.

---

## Phase 4 — React Frontend (Week 3–4)

| Step | Action |
|------|--------|
| 4.1 | Folder structure: `components`, `hooks`, `pages`, `services`, `context`, `types` |
| 4.2 | `AuthContext` + protected routes |
| 4.3 | Axios client with Bearer token + 401 redirect |
| 4.4 | Role-based layouts: Admin dashboard, Resident portal, **Guard gate console** |
| 4.5 | Tailwind + shared UI (tables, forms, status badges) |

**Deliverable:** Guard can log visitor check-in from UI against live API.

---

## Phase 5 — Quality, Security & Deploy (Week 5+)

- PHPUnit feature tests for visitor check-in/out and invoice listing
- Rate limiting on login and visitor endpoints
- Audit log for gate actions
- Docker Compose (nginx, php-fpm, mysql, node build)
- CI: lint, test, build

---

## API Versioning & Conventions

- Prefix: `/api/v1`
- JSON: `{ "data": ... }` via API Resources
- Errors: `{ "message": "...", "errors": { "field": ["..."] } }`
- Pagination: Laravel default `?page=`

---

## Role → Module Matrix

| Module | super_admin | society_admin | resident | guard |
|--------|-------------|---------------|----------|-------|
| Societies CRUD | ✓ | — | — | — |
| Units / residents | ✓ | ✓ | read own | read (gate) |
| Visitors | ✓ | ✓ | pre-approve (later) | ✓ check-in/out |
| Invoices | ✓ | ✓ | own unit | — |
| Complaints | ✓ | ✓ manage | create/view own | — |

---

## Next Actions (Immediate)

1. Copy scaffold from this repo into fresh Laravel/React installs.
2. `php artisan migrate`
3. Register middleware in `bootstrap/app.php` (Laravel 11).
4. Wire frontend `VITE_API_URL` to `http://localhost:8000/api/v1`.
