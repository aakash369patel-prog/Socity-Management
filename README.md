# Society Management System

Laravel 11 (API + Sanctum) · React 18 (Vite + TypeScript + Tailwind) · MySQL 8

## Repository layout

| Path | Purpose |
|------|---------|
| **`backend_staging/`** | **Integrated Laravel 11 API** (Composer, Sanctum, tests) — use this to run locally |
| `backend/` | Portable API scaffold (sync into Laravel when customizing) |
| `frontend/` | React + Vite SPA |
| `docs/INTEGRATION.md` | Full setup, Docker, CI, demo accounts |
| `docs/IMPLEMENTATION_ROADMAP.md` | Phased delivery plan |
| `scripts/setup.ps1` | One-shot Windows setup helper |

## Quick start

```powershell
.\scripts\setup.ps1
# Terminal 1
cd backend_staging; php artisan serve
# Terminal 2
cd frontend; npm run dev
```

Login at `/login` with `guard@demo.local` / `password`. Run API tests: `cd backend_staging; php artisan test`.

See **[docs/INTEGRATION.md](docs/INTEGRATION.md)** for MySQL (XAMPP), Docker, and CORS details.

## Demo API

### Auth (Sanctum)

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/v1/login` | Public |
| GET | `/api/v1/user` | Bearer token |
| POST | `/api/v1/logout` | Bearer token |

**Seeded users** (`php artisan db:seed`): `super@demo.local` (platform), `admin@demo.local`, `guard@demo.local`, `resident@demo.local` — password `password`. Two societies seeded for multi-RWA demo.

### Visitors & units

| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/api/v1/units` | guard, society_admin, super_admin |
| GET | `/api/v1/visitors?inside_only=1` | guard, society_admin, super_admin |
| POST | `/api/v1/visitors/check-in` | guard, society_admin, super_admin |
| POST | `/api/v1/visitors/{id}/check-out` | guard, society_admin, super_admin |

### Invoices

| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/api/v1/invoices` | society_admin, super_admin, resident (own units) |
| POST | `/api/v1/invoices` | society_admin, super_admin |
| GET | `/api/v1/invoices/{id}` | society_admin, super_admin, resident (own) |
| PATCH | `/api/v1/invoices/{id}` | society_admin, super_admin |

### Complaints (helpdesk)

| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/api/v1/complaints` | society_admin, super_admin, resident (own) |
| POST | `/api/v1/complaints` | society_admin, super_admin, resident |
| GET | `/api/v1/complaints/{id}` | society_admin, super_admin, resident (own) |
| PATCH | `/api/v1/complaints/{id}` | society_admin, super_admin (status, assign) |

### Unit management

| Method | Endpoint | Roles |
|--------|----------|-------|
| POST | `/api/v1/units` | society_admin, super_admin |
| GET | `/api/v1/units/{id}` | society_admin, super_admin |
| PATCH | `/api/v1/units/{id}` | society_admin, super_admin |
| DELETE | `/api/v1/units/{id}` | society_admin, super_admin |
| POST | `/api/v1/units/{id}/members` | society_admin, super_admin |
| DELETE | `/api/v1/units/{id}/members/{userId}` | society_admin, super_admin |
| GET | `/api/v1/users/residents` | society_admin, super_admin |
| GET | `/api/v1/users/assignable` | society_admin, super_admin |

## Frontend routes

| Path | Access |
|------|--------|
| `/login` | Public |
| `/` | Authenticated |
| `/guard` | guard, society_admin, super_admin |
| `/invoices` | society_admin, super_admin, resident |
| `/complaints` | society_admin, super_admin, resident |
| `/units` | society_admin, super_admin |
| `/societies` | super_admin (CRUD + context switch) |
| `/ledger` | society_admin, super_admin, resident |

### Societies (super admin)

| Method | Endpoint | Roles |
|--------|----------|-------|
| GET | `/api/v1/societies` | super_admin |
| POST | `/api/v1/societies` | super_admin |
| PATCH | `/api/v1/societies/{id}` | super_admin |
| DELETE | `/api/v1/societies/{id}` | super_admin |
| PUT | `/api/v1/user/current-society` | super_admin |

### Payments & ledger

| Method | Endpoint | Roles |
|--------|----------|-------|
| POST | `/api/v1/payments` | society_admin, super_admin |
| GET | `/api/v1/payments` | society_admin, super_admin, resident (own units) |
| GET | `/api/v1/ledger` | society_admin, super_admin, resident (own units) |
| POST | `/api/v1/webhooks/razorpay` | Public (signature if `RAZORPAY_WEBHOOK_SECRET` set) |

New invoices post a **ledger debit**; recording a payment posts a **credit** and marks the invoice paid.

### Gate (passes, vehicles, delivery)

| Method | Endpoint | Roles |
|--------|----------|-------|
| POST | `/api/v1/visitor-passes` | resident, society_admin, super_admin |
| GET | `/api/v1/visitor-passes` | resident (own), admin (all) |
| POST | `/api/v1/visitor-passes/redeem` | guard, society_admin, super_admin |
| POST | `/api/v1/visitor-passes/{id}/revoke` | creator / admin |
| GET/POST/DELETE | `/api/v1/vehicles` | resident (own units), admin |
| POST | `/api/v1/visitors/check-in` | + `entry_type`, `vendor_name` for deliveries |

Frontend: `/visitor-passes`, `/vehicles`, gate **Redeem pass** + delivery fields on check-in.
