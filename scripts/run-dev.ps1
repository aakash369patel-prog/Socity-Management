# Start Society Management (API + UI) — run in two terminals or use this script
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$env:Path = "C:\Program Files\nodejs;" + $env:Path

$ApiPort = 8002
Write-Host "API: http://127.0.0.1:$ApiPort/api/v1/health" -ForegroundColor Cyan
Write-Host "UI:  http://127.0.0.1:5173/login" -ForegroundColor Cyan
Write-Host "Demo: guard@demo.local / password" -ForegroundColor Green

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\backend_staging'; if (-not (Test-Path database\database.sqlite)) { New-Item -ItemType File database\database.sqlite | Out-Null }; php artisan migrate:fresh --seed --force; php artisan serve --host=127.0.0.1 --port=$ApiPort"
)

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "`$env:Path = 'C:\Program Files\nodejs;' + `$env:Path; cd '$Root\frontend'; if (-not (Test-Path .env)) { Copy-Item .env.example .env }; if (-not (Test-Path node_modules)) { npm install }; npm run dev -- --host 127.0.0.1 --port 5173"
)
