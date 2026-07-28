$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
$jamPage = Join-Path $projectRoot "app\jam\page.tsx"
$payload = Join-Path $projectRoot "SPRINT_13_10R_FILES\components"

if (!(Test-Path $jamPage)) {
    throw "Could not find app\jam\page.tsx. Run this from C:\Projects\jaski-homepage."
}

if (!(Test-Path $payload)) {
    throw "Could not find SPRINT_13_10R_FILES\components. Copy the sprint folder into the project root first."
}

$files = @(
    "JamHero.tsx",
    "JamListen.tsx",
    "PhishFeature.tsx",
    "PhishFeature.module.css"
)

foreach ($file in $files) {
    $source = Join-Path $payload $file
    $target = Join-Path $projectRoot ("components\" + $file)

    if (!(Test-Path $source)) {
        throw "Sprint payload is missing $file. No further files were changed."
    }

    if (Test-Path $target) {
        $backup = "$target.pre-13.10R.bak"
        if (!(Test-Path $backup)) {
            Copy-Item $target $backup -Force
        }
    }

    Copy-Item $source $target -Force
}

Write-Host ""
Write-Host "Sprint 13.10R installed."
Write-Host "#1 Grateful Dead is first and remains isolated."
Write-Host "#2 Phish now has its own dedicated feature section."
Write-Host "#3 Widespread Panic now leads the Live Bands section."
Write-Host "Phish was removed from the generic Live Bands row to avoid duplication."
Write-Host ""
Write-Host "Refresh http://localhost:3000/jam (Ctrl+Shift+R if needed)."
