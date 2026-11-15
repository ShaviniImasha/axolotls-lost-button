@echo off
title Axolotl's Lost Button - Full Stack Launcher
echo ==============================================
echo  Launching Axolotl's Lost Button (Frontend + Backend)
echo ==============================================
start "Axolotl Backend" cmd /k npm run dev:backend
timeout /t 2 /nobreak >nul
start "Axolotl Frontend" cmd /k npm run dev:frontend
