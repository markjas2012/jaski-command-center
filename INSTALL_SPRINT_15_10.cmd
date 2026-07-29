@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\15.10_New_and_Coming_Polish"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 15.10
echo  New and Coming Presentation Pass
echo =================================================
echo.

if not exist "%PROJECT%\components\StreamingRoom.module.css" (
  echo ERROR: Streaming Room stylesheet not found.
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%" mkdir "%BACKUP%"
copy /Y "%PROJECT%\components\StreamingRoom.module.css" "%BACKUP%\StreamingRoom.module.css" >nul

copy /Y "%PACK%components\StreamingRoom.module.css" "%PROJECT%\components\StreamingRoom.module.css" >nul

if errorlevel 1 (
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 15.10 installed.
echo Open http://localhost:3000/streaming
echo Hard refresh with Ctrl+Shift+R.
echo Review New and Coming only.
echo Continue Watching and Already Yours should remain unchanged.
echo.
pause
