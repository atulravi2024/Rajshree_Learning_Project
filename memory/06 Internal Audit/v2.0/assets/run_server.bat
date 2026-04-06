@echo off
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%..\..\..\..\"

echo.
echo ======================================================
echo    REPO MOCKUP SERVER (RAJSHREE LEARNING PROJECT)
echo ======================================================
echo.
echo [1] Starting server at Project Root...
echo [2] Opening assets.html in your browser...
echo.

:: Start the browser with the direct URL
start http://localhost:3000/memory/06%%20Internal%%20Audit/v2.0/assets/assets.html

:: Start the server
npx -y serve -l 3000

pause
