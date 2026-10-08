# Quick check: API reachable + demo login works
param([int]$Port = 8002)

$base = "http://127.0.0.1:$Port/api/v1"
Write-Host "Checking $base ..." -ForegroundColor Cyan

try {
    $health = Invoke-RestMethod -Uri "$base/health" -TimeoutSec 5
    Write-Host "Health OK: $($health | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch {
    Write-Host "Health FAILED. Start API: cd backend_staging; php artisan serve --port=$Port" -ForegroundColor Red
    exit 1
}

try {
    $login = Invoke-RestMethod -Method Post -Uri "$base/login" -ContentType "application/json" `
        -Body '{"email":"admin@demo.local","password":"password"}' -TimeoutSec 5
    Write-Host "Login OK for admin@demo.local (role: $($login.user.role))" -ForegroundColor Green
} catch {
    Write-Host "Login FAILED. Run: php artisan migrate:fresh --seed" -ForegroundColor Red
    exit 1
}

Write-Host "Set frontend/.env: VITE_API_URL=$base" -ForegroundColor Yellow
