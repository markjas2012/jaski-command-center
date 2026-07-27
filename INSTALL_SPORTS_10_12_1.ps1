$ErrorActionPreference = "Stop"

Write-Host "Installing Sprint 10.12.1 - Sports Expansion..."

$cssPath = ".\app\globals.css"
$patchPath = ".\SPORTS_10_12_1.css"
$marker = "Sprint 10.12.1 — College Sports Expansion"

if (!(Test-Path $cssPath)) {
    throw "Could not find app\globals.css. Run this from the jaski-homepage project root."
}

if (!(Test-Path ".\components\StLouisSports.tsx")) {
    throw "Could not find components\StLouisSports.tsx after copying the pack."
}

$currentCss = Get-Content $cssPath -Raw
if ($currentCss -notmatch [regex]::Escape($marker)) {
    Add-Content -Path $cssPath -Value "`r`n"
    Get-Content $patchPath -Raw | Add-Content -Path $cssPath
    Write-Host "Added college sports styling to app\globals.css."
} else {
    Write-Host "College sports styling already installed; CSS unchanged."
}

Write-Host "Sprint 10.12.1 install complete."
