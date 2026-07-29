@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\14.7_Central_Time_Cleanup"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 14.7 INSTALLER
echo  Central Time Cleanup
echo =================================================
echo.

if not exist "%PROJECT%\components" (
  echo ERROR: Could not find %PROJECT%\components
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%\components" mkdir "%BACKUP%\components"

for %%F in (SportsBoard.tsx WorthWatching.tsx) do (
  if exist "%PROJECT%\components\%%F" copy /Y "%PROJECT%\components\%%F" "%BACKUP%\components\%%F" >nul
)

copy /Y "%PACK%components\SportsBoard.tsx" "%PROJECT%\components\SportsBoard.tsx" >nul
copy /Y "%PACK%components\WorthWatching.tsx" "%PROJECT%\components\WorthWatching.tsx" >nul

if errorlevel 1 (
  echo.
  echo ERROR: Installation did not complete successfully.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 14.7 installed successfully.
echo Backup: %BACKUP%
echo.
echo Hard refresh http://localhost:3000/sports with Ctrl+Shift+R
echo.
pause
