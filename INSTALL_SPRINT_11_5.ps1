$ErrorActionPreference = "Stop"

$page = ".\app\page.tsx"
$importLine = 'import FeaturedToday from "../components/FeaturedToday";'
$componentLine = '      <FeaturedToday />'

if (!(Test-Path $page)) {
    throw "Could not find app\page.tsx. Run this from the jaski-homepage project root."
}

$content = Get-Content $page -Raw

if ($content -notmatch 'FeaturedToday') {
    # Add import after the existing import block.
    $lines = Get-Content $page
    $lastImport = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*import ') { $lastImport = $i }
    }

    if ($lastImport -ge 0) {
        $before = @()
        if ($lastImport -ge 0) { $before = $lines[0..$lastImport] }
        $after = @()
        if ($lastImport + 1 -lt $lines.Count) { $after = $lines[($lastImport + 1)..($lines.Count - 1)] }
        $lines = @($before + $importLine + $after)
        Set-Content -Path $page -Value $lines
        $content = Get-Content $page -Raw
    } else {
        Set-Content -Path $page -Value ($importLine + "`r`n" + $content)
        $content = Get-Content $page -Raw
    }
}

if ($content -notmatch '<FeaturedToday\s*/>') {
    # Preferred insertion: directly after LiveDashboard.
    if ($content -match '<LiveDashboard\s*/>') {
        $content = $content -replace '(<LiveDashboard\s*/>)', "`$1`r`n$componentLine"
    }
    # Fallback: insert before the final closing main tag.
    elseif ($content -match '</main>') {
        $content = $content -replace '</main>', "$componentLine`r`n    </main>"
    }
    else {
        throw "Could not safely locate the homepage insertion point. No component was inserted."
    }

    Set-Content -Path $page -Value $content
}

Write-Host "Sprint 11.5 Featured Today installed."
Write-Host "Refresh localhost:3000 and verify the new Featured Today section."
