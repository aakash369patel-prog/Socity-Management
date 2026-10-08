@echo off
title Society Management - Launcher
cd /d "%~dp0"
echo Starting API (port 8002) and UI (port 5173) in new windows...
start "Society API" cmd /k "cd /d "%~dp0backend_staging" && php artisan serve --host=127.0.0.1 --port=8002"
timeout /t 2 /nobreak >nul
start "Society UI" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && cd /d "%~dp0frontend" && npm run dev"
echo.
echo Open: http://127.0.0.1:5173/login
echo Login: admin@demo.local  password: password
pause
