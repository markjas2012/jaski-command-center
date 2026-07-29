@echo off
setlocal
set "ROOT=C:\Projects\jaski-homepage"
set "SRC=%~dp0"

if not exist "%ROOT%\components\MyTeams.tsx" (
  echo.
  echo ERROR: Could not find %ROOT%\components\MyTeams.tsx
  echo Make sure Jaski Command Center is installed at C:\Projects\jaski-homepage
  pause
  exit /b 1
)

for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set D=%%d-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set T=%%a%%b
set "BACKUP=%ROOT%\_sprint_backups\14.3a_%D%_%T%"
mkdir "%BACKUP%" >nul 2>&1
copy /Y "%ROOT%\components\MyTeams.tsx" "%BACKUP%\MyTeams.tsx" >nul

copy /Y "%SRC%components\MyTeams.tsx" "%ROOT%\components\MyTeams.tsx" >nul
if errorlevel 1 (
  echo ERROR: Copy failed.
  pause
  exit /b 1
)

echo.
echo Sprint 14.3a installed successfully.
echo Backup: %BACKUP%
echo.
echo Refresh http://localhost:3000/sports with Ctrl+Shift+R
pause
