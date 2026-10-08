# Demo login credentials

The full handbook (accounts, societies, database, and service settings) is [CREDENTIALS.html](CREDENTIALS.html). Open that file in a browser to read or print it.

**Login URL:** http://127.0.0.1:5173/login  

**Password for every account:** `password` (8 characters, lowercase, no spaces)

| Role | Email | Password | What to test |
|------|-------|----------|--------------|
| Super Admin (platform) | `super@demo.local` | `password` | Societies, switch society context, all admin features |
| Society Admin (RWA) | `admin@demo.local` | `password` | Units, invoices, payments, complaints, gate |
| Security Guard | `guard@demo.local` | `password` | Gate console, visitor check-in, pass redeem |
| Resident | `resident@demo.local` | `password` | Own invoices, complaints, visitor passes, vehicles |

Default society for staff/resident: **Green Valley Residency** (Pune).  
Super admin can also work in **Lakeview Apartments** via the header society switcher.

## Reset passwords

```powershell
cd backend_staging
php artisan demo:reset-passwords
```

## Reseed database

```powershell
cd backend_staging
php artisan migrate:fresh --seed
```
