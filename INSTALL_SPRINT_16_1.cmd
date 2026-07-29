@echo off
setlocal
set "PROJECT=C:\Projects\jaski-homepage"
set "PACK=%~dp0"
set "BACKUP=%PROJECT%\_sprint_backups\16.1_Video_Games_Foundation"

echo.
echo =================================================
echo  JASKI COMMAND CENTER - SPRINT 16.1
echo  Video Games Foundation
echo =================================================
echo.

if not exist "%PROJECT%\app" (
  echo ERROR: Jaski Command Center project was not found at:
  echo %PROJECT%
  echo No files were changed.
  pause
  exit /b 1
)

if not exist "%BACKUP%" mkdir "%BACKUP%"
if not exist "%BACKUP%\components" mkdir "%BACKUP%\components"
if not exist "%BACKUP%\app\video-games" mkdir "%BACKUP%\app\video-games"
if not exist "%BACKUP%\app\games" mkdir "%BACKUP%\app\games"

if exist "%PROJECT%\components\GamingRoom.tsx" copy /Y "%PROJECT%\components\GamingRoom.tsx" "%BACKUP%\components\GamingRoom.tsx" >nul
if exist "%PROJECT%\components\GamingRoom.module.css" copy /Y "%PROJECT%\components\GamingRoom.module.css" "%BACKUP%\components\GamingRoom.module.css" >nul
if exist "%PROJECT%\app\video-games\page.tsx" copy /Y "%PROJECT%\app\video-games\page.tsx" "%BACKUP%\app\video-games\page.tsx" >nul
if exist "%PROJECT%\app\games\page.tsx" copy /Y "%PROJECT%\app\games\page.tsx" "%BACKUP%\app\games\page.tsx" >nul

if not exist "%PROJECT%\components" mkdir "%PROJECT%\components"
if not exist "%PROJECT%\app\video-games" mkdir "%PROJECT%\app\video-games"
if not exist "%PROJECT%\app\games" mkdir "%PROJECT%\app\games"

copy /Y "%PACK%components\GamingRoom.tsx" "%PROJECT%\components\GamingRoom.tsx" >nul
copy /Y "%PACK%components\GamingRoom.module.css" "%PROJECT%\components\GamingRoom.module.css" >nul
copy /Y "%PACK%app\video-games\page.tsx" "%PROJECT%\app\video-games\page.tsx" >nul
copy /Y "%PACK%app\games\page.tsx" "%PROJECT%\app\games\page.tsx" >nul

if errorlevel 1 (
  echo ERROR: Installation failed.
  echo Backup: %BACKUP%
  pause
  exit /b 1
)

echo.
echo Sprint 16.1 installed.
echo Try the Video Games item in the sidebar first.
echo Direct routes: http://localhost:3000/video-games and http://localhost:3000/games
echo Hard refresh with Ctrl+Shift+R.
echo.
pause
