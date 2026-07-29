@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\14.6_Full_Sports_Identity"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 14.6 INSTALLER
echo  Full Sports Identity
echo =================================================
echo.

if not exist "%PROJECT%\components" (
  echo ERROR: Could not find %PROJECT%\components
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%PROJECT%\app\api\sports-board" (
  echo ERROR: Could not find %PROJECT%\app\api\sports-board
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%\components" mkdir "%BACKUP%\components"
if not exist "%BACKUP%\app\api\sports-board" mkdir "%BACKUP%\app\api\sports-board"

for %%F in (SportsBoard.tsx SportsBoard.module.css WorthWatching.tsx WorthWatching.module.css) do (
  if exist "%PROJECT%\components\%%F" copy /Y "%PROJECT%\components\%%F" "%BACKUP%\components\%%F" >nul
)
if exist "%PROJECT%\app\api\sports-board\route.ts" copy /Y "%PROJECT%\app\api\sports-board\route.ts" "%BACKUP%\app\api\sports-board\route.ts" >nul

copy /Y "%PACK%components\SportsBoard.tsx" "%PROJECT%\components\SportsBoard.tsx" >nul
copy /Y "%PACK%components\SportsBoard.module.css" "%PROJECT%\components\SportsBoard.module.css" >nul
copy /Y "%PACK%components\WorthWatching.tsx" "%PROJECT%\components\WorthWatching.tsx" >nul
copy /Y "%PACK%components\WorthWatching.module.css" "%PROJECT%\components\WorthWatching.module.css" >nul
copy /Y "%PACK%app\api\sports-board\route.ts" "%PROJECT%\app\api\sports-board\route.ts" >nul

if errorlevel 1 (
  echo.
  echo ERROR: Installation did not complete successfully.
  echo Backups are at:
  echo %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 14.6 installed successfully.
echo Backup: %BACKUP%
echo.
echo Hard refresh http://localhost:3000/sports with Ctrl+Shift+R
echo.
pause
