# Integration guide (Option A — runnable demo + tests)

The **integrated Laravel API** lives in `backend_staging/` (full Composer project with Sanctum, migrations, seeders, and PHPUnit).

The `backend/` folder remains a **portable scaffold** (copy-paste into other Laravel apps). After changes, sync into `backend_staging/app`, `routes/api.php`, and `database/`.

---

## Prerequisites

- PHP 8.2+, Composer, MySQL 8 (XAMPP) **or** Docker
- Node 20+ (frontend)
- Extensions: `pdo_mysql` or `pdo_sqlite`, `openssl`, `mbstring`, `tokenizer`, `xml`

---

## Backend (API)

```powershell
cd backend_staging
copy .env.example .env
# For XAMPP MySQL, set:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=society_management
# DB_USERNAME=root
# DB_PASSWORD=

composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API base: `http://127.0.0.1:8000/api/v1`

### CORS / Sanctum (SPA)

In `.env`:

```
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:5173
```

Token login uses `Authorization: Bearer {token}` (no cookie SPA required for current React app).

---

## Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

---

## Automated tests

```powershell
cd backend_staging
php artisan test
```

Uses SQLite in-memory (`phpunit.xml`). Covers login, visitor check-in/out, complaint workflow, unit member attach.

---

## Docker (MySQL only)

```powershell
docker compose up -d
```

Then point `.env` at `DB_HOST=127.0.0.1`, `DB_PORT=3307`, database `society_management`.

---

## CI

GitHub Actions workflow: `.github/workflows/ci.yml` — backend `php artisan test` + frontend `npm run build`.

---

## Demo accounts (after seed)

| Email | Password | Role |
|-------|----------|------|
| super@demo.local | password | Super admin (multi-society) |
| admin@demo.local | password | Society admin |
| guard@demo.local | password | Guard |
| resident@demo.local | password | Resident |
