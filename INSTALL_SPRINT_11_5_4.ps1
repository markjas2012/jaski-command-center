$ErrorActionPreference = "Stop"

$targets = @(
    ".\components\LiveDashboard.tsx",
    ".\app\page.tsx"
)

$replacements = [ordered]@{
    "Â°"   = "°"
    "Â·"   = "·"
    "Â©"   = "©"
    "Â®"   = "®"
    "Â™"   = "™"
    "Â "   = " "
    "â†’"  = "→"
    "â†"  = "←"
    "â†‘"  = "↑"
    "â†“"  = "↓"
    "â†—"  = "↗"
    "â†˜"  = "↘"
    "â†™"  = "↙"
    "â†–"  = "↖"
    "â€”"  = "—"
    "â€“"  = "–"
    "â€¦"  = "…"
    "â€™"  = "’"
    "â€˜"  = "‘"
    "â€œ"  = "“"
    "â€"  = "”"
    "â€¢"  = "•"
    "â„¢"  = "™"
    "âœ“"  = "✓"
    "â˜…"  = "★"
    "â˜†"  = "☆"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($path in $targets) {
    if (!(Test-Path $path)) {
        continue
    }

    $text = [System.IO.File]::ReadAllText((Resolve-Path $path))

    foreach ($bad in $replacements.Keys) {
        $text = $text.Replace($bad, $replacements[$bad])
    }

    [System.IO.File]::WriteAllText((Resolve-Path $path), $text, $utf8NoBom)
    Write-Host "Cleaned encoding: $path"
}

Write-Host ""
Write-Host "Sprint 11.5.4 encoding cleanup complete."
Write-Host "Featured Today placement was not changed."
Write-Host "Refresh localhost:3000 and verify symbols, arrows, and apostrophes."
