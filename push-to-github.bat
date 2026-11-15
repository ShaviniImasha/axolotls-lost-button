@echo off
title Push Axolotl's Lost Button to GitHub
cd /d "%~dp0"
echo ========================================================
echo   Pushing Axolotl's Lost Button to GitHub...
echo ========================================================
echo.
git push -u origin main
echo.
echo ========================================================
echo   Finished!
echo ========================================================
pause
