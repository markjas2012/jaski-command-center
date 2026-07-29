@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\15.6b_Local_Service_Logos"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 15.6b
echo  Local Service Logos
echo =================================================
echo.

if not exist "%PROJECT%\components\StreamingRoom.tsx" (
  echo ERROR: Streaming Room not found.
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%\components" mkdir "%BACKUP%\components"
if not exist "%BACKUP%\public\streaming-logos" mkdir "%BACKUP%\public\streaming-logos"

copy /Y "%PROJECT%\components\StreamingRoom.tsx" "%BACKUP%\components\StreamingRoom.tsx" >nul

if not exist "%PROJECT%\public\streaming-logos" mkdir "%PROJECT%\public\streaming-logos"

copy /Y "%PACK%components\StreamingRoom.tsx" "%PROJECT%\components\StreamingRoom.tsx" >nul
copy /Y "%PACK%public\streaming-logos\*.svg" "%PROJECT%\public\streaming-logos\" >nul

if errorlevel 1 (
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 15.6b installed.
echo Open http://localhost:3000/streaming
echo Hard refresh with Ctrl+Shift+R.
echo.
pause
