$ErrorActionPreference = "Stop"

$project = (Get-Location).Path
$pack = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Join-Path $pack "SPRINT_13_11_FILES"

if (-not (Test-Path (Join-Path $project "package.json"))) {
  Write-Host ""
  Write-Host "Run this installer from the Jaski homepage project folder:" -ForegroundColor Yellow
  Write-Host "  C:\Projects\jaski-homepage" -ForegroundColor Cyan
  Write-Host ""
  exit 1
}

$targets = @(
  "components\PhishFeature.tsx",
  "components\PhishFeature.module.css",
  "app\api\phish-hub\route.ts"
)

$backup = Join-Path $project ("_sprint_backups\13.11_" + (Get-Date -Format "yyyyMMdd_HHmmss"))
New-Item -ItemType Directory -Force -Path $backup | Out-Null

foreach ($relative in $targets) {
  $source = Join-Path $files $relative
  $target = Join-Path $project $relative
  $targetDir = Split-Path -Parent $target
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

  if (Test-Path $target) {
    $backupTarget = Join-Path $backup $relative
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupTarget) | Out-Null
    Copy-Item $target $backupTarget -Force
  }

  Copy-Item $source $target -Force
  Write-Host "Installed $relative" -ForegroundColor Green
}

Write-Host ""
Write-Host "Sprint 13.11 installed." -ForegroundColor Green
Write-Host "Phish now pulls the latest setlist/show and current Phish news into the #2 section." -ForegroundColor White
Write-Host ""
Write-Host "If the dev server is already running, refresh http://localhost:3000/jam" -ForegroundColor Cyan
