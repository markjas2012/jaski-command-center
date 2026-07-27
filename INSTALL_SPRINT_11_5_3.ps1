$ErrorActionPreference = "Stop"

$dashboard = ".\components\LiveDashboard.tsx"
$page = ".\app\page.tsx"

if (!(Test-Path $dashboard)) {
    throw "LiveDashboard.tsx was not found."
}

$content = Get-Content $dashboard -Raw

$import = 'import FeaturedToday from "./FeaturedToday";'
if ($content -notmatch 'import FeaturedToday from "\.\/FeaturedToday";') {
    $content = $content -replace '(import \{ useEffect, useMemo, useState \} from "react";)', "`$1`r`n$import"
}

# Remove any existing render first to avoid duplicates.
$content = $content -replace '(?m)^\s*<FeaturedToday\s*/>\s*\r?\n?', ''

$marker = '<section className="favorites-section" aria-labelledby="favorites-title">'
if (-not $content.Contains($marker)) {
    throw "Favorites section marker was not found."
}

$content = $content.Replace(
    $marker,
    "      <FeaturedToday />`r`n`r`n      $marker"
)

Set-Content -Path $dashboard -Value $content -Encoding utf8

# Clean old page-level attempt if present.
if (Test-Path $page) {
    $pageContent = Get-Content $page -Raw
    $pageContent = $pageContent -replace '(?m)^\s*import FeaturedToday from "\.\.\/components\/FeaturedToday";\s*\r?\n?', ''
    $pageContent = $pageContent -replace '(?m)^\s*<FeaturedToday\s*/>\s*\r?\n?', ''
    Set-Content -Path $page -Value $pageContent -Encoding utf8
}

Write-Host "Sprint 11.5.3 installed successfully."
Write-Host "Featured Today is now directly above Favorites."
