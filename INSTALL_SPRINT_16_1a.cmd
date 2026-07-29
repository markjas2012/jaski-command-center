@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\16.1a_Jaski_Arcade_Identity"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 16.1a
echo  Jaski Arcade Identity Pass
echo =================================================
echo.

if not exist "%PROJECT%\components\GamingRoom.tsx" (
  echo ERROR: GamingRoom.tsx was not found at:
  echo %PROJECT%\components\GamingRoom.tsx
  echo Install Sprint 16.1 first. No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%\components" mkdir "%BACKUP%\components"
copy /Y "%PROJECT%\components\GamingRoom.tsx" "%BACKUP%\components\GamingRoom.tsx" >nul

copy /Y "%PACK%components\GamingRoom.tsx" "%PROJECT%\components\GamingRoom.tsx" >nul

if errorlevel 1 (
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 16.1a installed.
echo Hero identity is now Jaski Arcade.
echo Video Games remains the sidebar destination.
echo Hard refresh with Ctrl+Shift+R.
echo.
pause
