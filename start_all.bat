@echo off
title BankPredict AI Launcher
echo ========================================================
echo   Launching BankPredict AI ML Platform (Backend + Frontend)
echo ========================================================
cd /d "%~dp0"
start "BankPredict AI - Backend" cmd /k "start_backend.bat"
timeout /t 3 /nobreak >nul
start "BankPredict AI - Frontend" cmd /k "start_frontend.bat"
echo.
echo Both servers launched!
echo - Backend:  http://127.0.0.1:5000
echo - Frontend: http://localhost:3000
echo.
pause
