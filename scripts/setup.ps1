# Society Management — local setup (Windows / XAMPP)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "==> Backend (backend_staging)" -ForegroundColor Cyan
Set-Location "$Root\backend_staging"
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env — configure DB_* for MySQL if not using SQLite."
}
composer install
php artisan key:generate --force
php artisan migrate --seed --force
Write-Host "API: php artisan serve  ->  http://127.0.0.1:8000/api/v1/health"

Write-Host "`n==> Frontend" -ForegroundColor Cyan
Set-Location "$Root\frontend"
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}
if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm install
    Write-Host "UI: npm run dev  ->  http://localhost:5173"
} else {
    Write-Host "npm not found — install Node 20+ and run: npm install && npm run dev"
}

Set-Location $Root
Write-Host "`nDone. Run tests: cd backend_staging; php artisan test" -ForegroundColor Green
