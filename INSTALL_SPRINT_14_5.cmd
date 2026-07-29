@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\14.5_Sports_Team_Identity"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 14.5 INSTALLER
echo  Sports Room - Team Identity and Final Polish
echo =================================================
echo.

if not exist "%PROJECT%\components" (
  echo ERROR: Could not find %PROJECT%\components
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%" mkdir "%BACKUP%"

for %%F in (MyTeams.tsx WorthWatching.tsx WorthWatching.module.css) do (
  if exist "%PROJECT%\components\%%F" copy /Y "%PROJECT%\components\%%F" "%BACKUP%\%%F" >nul
)

copy /Y "%PACK%components\MyTeams.tsx" "%PROJECT%\components\MyTeams.tsx" >nul
copy /Y "%PACK%components\WorthWatching.tsx" "%PROJECT%\components\WorthWatching.tsx" >nul
copy /Y "%PACK%components\WorthWatching.module.css" "%PROJECT%\components\WorthWatching.module.css" >nul

if errorlevel 1 (
  echo.
  echo ERROR: Installation did not complete successfully.
  echo Existing files were backed up at:
  echo %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 14.5 installed successfully.
echo Backup: %BACKUP%
echo.
echo Refresh http://localhost:3000/sports with Ctrl+Shift+R
echo.
pause
