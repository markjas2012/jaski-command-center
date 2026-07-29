param([string]$ProjectRoot = 'C:\Projects\jaski-homepage')
$ErrorActionPreference = 'Stop'
Write-Host "Jaski Command Center — Sprint 14.3" -ForegroundColor Cyan
Write-Host "Live-Data Reliability installer" -ForegroundColor Cyan

if (-not (Test-Path $ProjectRoot)) { throw "Project not found: $ProjectRoot" }
if (-not (Test-Path (Join-Path $ProjectRoot 'package.json'))) { throw "package.json not found in $ProjectRoot" }

$packRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backup = Join-Path $ProjectRoot ".sprint-backups\14.3_$stamp"
New-Item -ItemType Directory -Path $backup -Force | Out-Null

$files = @(
  @{ Src='lib\sports-reliability.ts'; Dst='lib\sports-reliability.ts' },
  @{ Src='app\api\sports\stl\route.ts'; Dst='app\api\sports\stl\route.ts' }
)

foreach ($f in $files) {
  $src = Join-Path $packRoot $f.Src
  $dst = Join-Path $ProjectRoot $f.Dst
  if (-not (Test-Path $src)) { throw "Pack file missing: $src" }
  if (Test-Path $dst) {
    $b = Join-Path $backup $f.Dst
    New-Item -ItemType Directory -Path (Split-Path -Parent $b) -Force | Out-Null
    Copy-Item $dst $b -Force
  }
  New-Item -ItemType Directory -Path (Split-Path -Parent $dst) -Force | Out-Null
  Copy-Item $src $dst -Force
  Write-Host "Installed: $($f.Dst)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Sprint 14.3 data layer installed." -ForegroundColor Green
Write-Host "Backup: $backup"
Write-Host "Verify at: http://localhost:3000/api/sports/stl"
Write-Host "Sports Room design files were not modified." -ForegroundColor Yellow
