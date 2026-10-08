# Database Schema (MySQL 8.0+)

## Entity Relationship Summary

```
societies 1──* units 1──* unit_user *──1 users
societies 1──* visitors *──1 units
societies 1──* invoices *──1 units
societies 1──* complaints *──1 users (reporter)
complaints assigned_to → users.id (nullable)
users.current_society_id → societies.id (nullable)
```

## Tables

### societies

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| name | VARCHAR(255) | indexed |
| address | TEXT | |
| registration_number | VARCHAR(100) | unique, nullable |
| deleted_at | TIMESTAMP | soft delete |
| created_at, updated_at | TIMESTAMP | |

### units

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| society_id | FK → societies | cascade delete |
| block_name | VARCHAR(100) | composite index with flat_number |
| flat_number | VARCHAR(50) | |
| floor | TINYINT | nullable |
| status | ENUM occupied, vacant | default vacant |
| deleted_at | TIMESTAMP | |
| created_at, updated_at | TIMESTAMP | |

**Indexes:** `(society_id, block_name, flat_number)` unique

### users

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| name | VARCHAR(255) | |
| email | VARCHAR(255) | unique |
| password | VARCHAR(255) | |
| phone | VARCHAR(20) | nullable, indexed |
| role | ENUM super_admin, society_admin, resident, guard | indexed |
| current_society_id | FK → societies | nullable, set null on delete |
| email_verified_at | TIMESTAMP | nullable |
| deleted_at | TIMESTAMP | |
| remember_token | VARCHAR(100) | |
| created_at, updated_at | TIMESTAMP | |

### unit_user (pivot)

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| unit_id | FK → units | cascade |
| user_id | FK → users | cascade |
| type | ENUM owner, tenant | |
| deleted_at | TIMESTAMP | |
| created_at, updated_at | TIMESTAMP | |

**Indexes:** unique `(unit_id, user_id, type)` where not soft-deleted (app-level or partial index)

### visitors

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| society_id | FK → societies | |
| unit_id | FK → units | nullable (society-level visitor) |
| name | VARCHAR(255) | |
| phone | VARCHAR(20) | indexed |
| vehicle_number | VARCHAR(50) | nullable |
| purpose | VARCHAR(500) | |
| status | ENUM entered, exited | default entered |
| check_in | TIMESTAMP | |
| check_out | TIMESTAMP | nullable |
| checked_in_by | FK → users | guard |
| checked_out_by | FK → users | nullable |
| deleted_at | TIMESTAMP | |
| created_at, updated_at | TIMESTAMP | |

**Indexes:** `(society_id, status)`, `(society_id, check_in)`

### invoices

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| society_id | FK → societies | |
| unit_id | FK → units | |
| invoice_number | VARCHAR(50) | unique per society |
| amount | DECIMAL(12,2) | |
| due_date | DATE | indexed |
| status | ENUM paid, unpaid | default unpaid |
| paid_at | TIMESTAMP | nullable |
| deleted_at | TIMESTAMP | |
| created_at, updated_at | TIMESTAMP | |

**Indexes:** unique `(society_id, invoice_number)`

### complaints

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT UNSIGNED PK | |
| society_id | FK → societies | |
| user_id | FK → users | reporter |
| title | VARCHAR(255) | |
| description | TEXT | |
| category | VARCHAR(100) | indexed |
| status | ENUM open, in_progress, resolved | default open |
| assigned_to | FK → users | nullable |
| resolved_at | TIMESTAMP | nullable |
| deleted_at | TIMESTAMP | |
| created_at, updated_at | TIMESTAMP | |

**Indexes:** `(society_id, status)`

### Sanctum

- `personal_access_tokens` — default Sanctum migration

### Future extensions (Financial / Gate)

- `payments` (invoice_id, gateway_ref, amount, status)
- `ledger_entries` (society_id, unit_id, debit, credit, reference_type, reference_id)
- `visitor_passes` (pre-approved QR passes)
- `vehicles` (unit_id, plate_number, type)
