@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\14.7a_Central_Time_Label_Repair"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 14.7a INSTALLER
echo  Central Time Label Repair
echo =================================================
echo.

if not exist "%PROJECT%\components\SportsBoard.tsx" (
  echo ERROR: Could not find SportsBoard.tsx
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%" mkdir "%BACKUP%"
copy /Y "%PROJECT%\components\SportsBoard.tsx" "%BACKUP%\SportsBoard.tsx" >nul
copy /Y "%PACK%components\SportsBoard.tsx" "%PROJECT%\components\SportsBoard.tsx" >nul

if errorlevel 1 (
  echo.
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 14.7a installed successfully.
echo.
echo Hard refresh http://localhost:3000/sports with Ctrl+Shift+R
echo Expected examples:
echo   8/6 - 8:00 PM EDT  becomes  8/6 - 7:00 PM CDT
echo   8/29 - 3:00 PM EDT becomes  8/29 - 2:00 PM CDT
echo.
pause
