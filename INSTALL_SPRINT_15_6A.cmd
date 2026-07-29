@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\15.6a_Server_Component_Logo_Fix"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 15.6a
echo  Server Component Logo Fix
echo =================================================
echo.

if not exist "%PROJECT%\components\StreamingRoom.tsx" (
  echo ERROR: Streaming Room not found.
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%" mkdir "%BACKUP%"
copy /Y "%PROJECT%\components\StreamingRoom.tsx" "%BACKUP%\StreamingRoom.tsx" >nul

copy /Y "%PACK%components\StreamingRoom.tsx" "%PROJECT%\components\StreamingRoom.tsx" >nul

if errorlevel 1 (
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 15.6a installed.
echo Open http://localhost:3000/streaming
echo Hard refresh with Ctrl+Shift+R.
echo.
pause
