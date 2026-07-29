@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\14.4_Worth_Watching"

echo.
echo ==============================================
echo  JASKI COMMAND CENTER - SPRINT 14.4 INSTALLER
echo  Worth Watching - Curated Picks
echo ==============================================
echo.

if not exist "%PROJECT%\components" (
  echo ERROR: Could not find %PROJECT%\components
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%" mkdir "%BACKUP%"

if exist "%PROJECT%\components\WorthWatching.tsx" copy /Y "%PROJECT%\components\WorthWatching.tsx" "%BACKUP%\WorthWatching.tsx" >nul
if exist "%PROJECT%\components\WorthWatching.module.css" copy /Y "%PROJECT%\components\WorthWatching.module.css" "%BACKUP%\WorthWatching.module.css" >nul

copy /Y "%PACK%components\WorthWatching.tsx" "%PROJECT%\components\WorthWatching.tsx" >nul
copy /Y "%PACK%components\WorthWatching.module.css" "%PROJECT%\components\WorthWatching.module.css" >nul

if errorlevel 1 (
  echo.
  echo ERROR: Installation did not complete successfully.
  echo Check that the project is located at %PROJECT%
  pause
  exit /b 1
)

echo.
echo Sprint 14.4 installed successfully.
echo Backup: %BACKUP%
echo.
echo Refresh http://localhost:3000/sports with Ctrl+Shift+R
echo.
pause
