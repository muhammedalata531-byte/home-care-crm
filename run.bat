@echo off
title HomeCare AI Copilot Server
cd /d "%~dp0"
echo ========================================================
echo Starting HomeCare AI Copilot Local Server...
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
