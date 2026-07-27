$ErrorActionPreference = "Stop"

$dashboard = ".\components\LiveDashboard.tsx"
$featured = ".\components\FeaturedToday.tsx"

if (!(Test-Path $dashboard)) {
    throw "Could not find components\LiveDashboard.tsx. No changes were made."
}
if (!(Test-Path $featured)) {
    throw "FeaturedToday.tsx is missing. Re-copy Sprint 11.5 before running this hotfix."
}

$lines = Get-Content $dashboard

# Add the import only if it is not already present.
if (-not ($lines -match 'FeaturedToday')) {
    $lastImport = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*import ') {
            $lastImport = $i
        }
    }

    $importLine = 'import FeaturedToday from "./FeaturedToday";'

    if ($lastImport -ge 0) {
        $before = @($lines[0..$lastImport])
        $after = @()
        if ($lastImport + 1 -lt $lines.Count) {
            $after = @($lines[($lastImport + 1)..($lines.Count - 1)])
        }
        $lines = @($before + $importLine + $after)
    } else {
        $lines = @($importLine) + $lines
    }
}

# Remove a previously misplaced FeaturedToday line inside LiveDashboard, if present.
$lines = @($lines | Where-Object { $_ -notmatch '<FeaturedToday\s*/>' })

# Find the Favorites section by the visible ONE-CLICK ACCESS label.
$labelIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'ONE-CLICK ACCESS') {
        $labelIndex = $i
        break
    }
}

# Fallback: locate the visible Favorites heading.
if ($labelIndex -lt 0) {
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match 'Favorites') {
            $labelIndex = $i
            break
        }
    }
}

if ($labelIndex -lt 0) {
    throw "Could not locate the Favorites section in LiveDashboard.tsx. No placement change was made."
}

# Walk upward from the label to the nearest section/article/div opening line.
$insertIndex = -1
for ($i = $labelIndex; $i -ge 0; $i--) {
    if ($lines[$i] -match '^\s*<(section|article|div)\b') {
        $insertIndex = $i
        break
    }
}

if ($insertIndex -lt 0) {
    throw "Found Favorites text but could not locate its container. No placement change was made."
}

$indent = ([regex]::Match($lines[$insertIndex], '^\s*')).Value
$featureLine = $indent + '<FeaturedToday />'

$beforeInsert = @()
if ($insertIndex -gt 0) {
    $beforeInsert = @($lines[0..($insertIndex - 1)])
}
$afterInsert = @($lines[$insertIndex..($lines.Count - 1)])
$lines = @($beforeInsert + $featureLine + "" + $afterInsert)

Set-Content -Path $dashboard -Value $lines -Encoding utf8

# Remove the old page-level placement from app/page.tsx, if Sprint 11.5 inserted it there.
$page = ".\app\page.tsx"
if (Test-Path $page) {
    $pageLines = Get-Content $page

    $pageLines = @($pageLines | Where-Object {
        $_ -notmatch '<FeaturedToday\s*/>' -and
        $_ -notmatch 'import FeaturedToday from "\.\./components/FeaturedToday";'
    })

    Set-Content -Path $page -Value $pageLines -Encoding utf8
}

Write-Host ""
Write-Host "Sprint 11.5.1 Featured placement hotfix complete."
Write-Host "Featured Today is now inserted immediately before the Favorites section."
Write-Host "Refresh localhost:3000."
