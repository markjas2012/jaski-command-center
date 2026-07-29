@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\15.1_Streaming_Foundation"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 15.1
echo  Streaming Room Foundation
echo =================================================
echo.

if not exist "%PROJECT%\components\Sidebar.tsx" (
  echo ERROR: Jaski project not found at %PROJECT%
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%\components" mkdir "%BACKUP%\components"
if not exist "%BACKUP%\app\movies" mkdir "%BACKUP%\app\movies"
if not exist "%BACKUP%\app\tv" mkdir "%BACKUP%\app\tv"

for %%F in (Sidebar.tsx StreamingRoom.tsx StreamingRoom.module.css) do (
  if exist "%PROJECT%\components\%%F" copy /Y "%PROJECT%\components\%%F" "%BACKUP%\components\%%F" >nul
)
if exist "%PROJECT%\app\movies\page.tsx" copy /Y "%PROJECT%\app\movies\page.tsx" "%BACKUP%\app\movies\page.tsx" >nul
if exist "%PROJECT%\app\tv\page.tsx" copy /Y "%PROJECT%\app\tv\page.tsx" "%BACKUP%\app\tv\page.tsx" >nul

if not exist "%PROJECT%\app\streaming" mkdir "%PROJECT%\app\streaming"

copy /Y "%PACK%components\Sidebar.tsx" "%PROJECT%\components\Sidebar.tsx" >nul
copy /Y "%PACK%components\StreamingRoom.tsx" "%PROJECT%\components\StreamingRoom.tsx" >nul
copy /Y "%PACK%components\StreamingRoom.module.css" "%PROJECT%\components\StreamingRoom.module.css" >nul
copy /Y "%PACK%app\streaming\page.tsx" "%PROJECT%\app\streaming\page.tsx" >nul
copy /Y "%PACK%app\movies\page.tsx" "%PROJECT%\app\movies\page.tsx" >nul
copy /Y "%PACK%app\tv\page.tsx" "%PROJECT%\app\tv\page.tsx" >nul

if errorlevel 1 (
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 15.1 installed.
echo Open http://localhost:3000/streaming
echo Then hard refresh with Ctrl+Shift+R.
echo.
pause
