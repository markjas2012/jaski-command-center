$ErrorActionPreference = "Stop"

$dashboard = ".\components\LiveDashboard.tsx"
$page = ".\app\page.tsx"

if (!(Test-Path $dashboard)) {
    throw "Could not find components\LiveDashboard.tsx. No changes were made."
}

$content = Get-Content $dashboard -Raw

# 1) Ensure the FeaturedToday import exists.
$importLine = 'import FeaturedToday from "./FeaturedToday";'
if ($content -notmatch 'import\s+FeaturedToday\s+from\s+"\.\/FeaturedToday";') {
    $content = $content -replace '(import\s+\{\s*useEffect,\s*useMemo,\s*useState\s*\}\s+from\s+"react";)', "`$1`r`n$importLine"
}

# 2) Remove any existing FeaturedToday render inside this file so we only have one.
$content = $content -replace '(?m)^\s*<FeaturedToday\s*/>\s*\r?\n?', ''

# 3) Insert FeaturedToday immediately before the exact Favorites section visible in the current file.
$marker = '<section className="favorites-section" aria-labelledby="favorites-title">'
if ($content.Contains($marker)) {
    $content = $content.Replace(
        $marker,
        "      <FeaturedToday />`r`n`r`n      $marker"
    )
}
else {
    throw "Could not find the exact Favorites section marker in LiveDashboard.tsx. No placement change was made."
}

Set-Content -Path $dashboard -Value $content -Encoding utf8

# 4) Clean up the earlier page-level attempt, if it exists.
if (Test-Path $page) {
    $pageContent = Get-Content $page -Raw
    $pageContent = $pageContent -replace '(?m)^\s*import\s+FeaturedToday\s+from\s+"\.\.\/components\/FeaturedToday";\s*\r?\n?', ''
    $pageContent = $pageContent -replace '(?m)^\s*<FeaturedToday\s*/>\s*\r?\n?', ''
    Set-Content -Path $page -Value $pageContent -Encoding utf8
}

Write-Host ""
Write-Host "Sprint 11.5.2 installed successfully."
Write-Host "Featured Today is inserted immediately before Favorites in LiveDashboard.tsx."
Write-Host "Refresh localhost:3000."
