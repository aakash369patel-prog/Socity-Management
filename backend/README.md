# Society Management — Laravel API (scaffold)

> **Runnable app:** use `../backend_staging/` (merged with this scaffold + `php artisan test`).

Copy the contents of this folder into a Laravel 11 project created with:

```bash
composer create-project laravel/laravel .
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

Register middleware alias `role` (see `bootstrap/app.middleware-snippet.php`).

Merge `routes/api.php` routes into your application routes file.

Seed demo data:

```bash
php artisan db:seed
```

Ensure `User` model uses `HasApiTokens` and run Sanctum migrations.
