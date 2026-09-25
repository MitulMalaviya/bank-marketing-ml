@echo off
title BankPredict AI - Backend Server
echo ========================================================
echo   Starting Bank Marketing ML Backend (Flask API)
echo   Listening on http://127.0.0.1:5000
echo ========================================================
cd /d "%~dp0"
"D:\python\python.exe" api\run.py
pause
