$ErrorActionPreference = "Stop"

$path = ".\components\LiveDashboard.tsx"

if (!(Test-Path $path)) {
    throw "Could not find components\LiveDashboard.tsx. Run this from the jaski-homepage project root."
}

$resolved = (Resolve-Path $path).Path
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$text = [System.IO.File]::ReadAllText($resolved)
$original = $text

# Backup first.
$backup = "$resolved.pre-11.9.3.bak"
if (!(Test-Path $backup)) {
    [System.IO.File]::WriteAllText($backup, $original, $utf8NoBom)
}

# Replace the icon contents by anchoring to the card content, not the corrupted glyph.
# Catholic Reading card: replace the first icon-like div immediately before TODAY'S CATHOLIC READING.
$catholicPattern = '(?s)(<article[^>]*reading-card[^>]*>.*?<div[^>]*className="[^"]*(?:reading-icon|card-icon)[^"]*"[^>]*>).*?(</div>.*?TODAY''S CATHOLIC READING)'
$catholicReplacement = '$1<span aria-hidden="true">+</span>$2'
$catholicNew = [regex]::Replace($text, $catholicPattern, $catholicReplacement, 1)

if ($catholicNew -eq $text) {
    # Fallback: locate the card using the visible heading, then replace the nearest prior short div.
    $headingIndex = $text.IndexOf("TODAY'S CATHOLIC READING")
    if ($headingIndex -ge 0) {
        $windowStart = [Math]::Max(0, $headingIndex - 1200)
        $window = $text.Substring($windowStart, $headingIndex - $windowStart)
        $matches = [regex]::Matches($window, '<div[^>]*>[^<]{0,40}</div>')
        if ($matches.Count -gt 0) {
            $m = $matches[$matches.Count - 1]
            $absStart = $windowStart + $m.Index
            $replacement = '<div className="reading-icon" aria-hidden="true">+</div>'
            $text = $text.Remove($absStart, $m.Length).Insert($absStart, $replacement)
        }
    }
} else {
    $text = $catholicNew
}

# Grateful Dead card: replace the decorative upper-right icon by anchoring to ON THIS DAY / TODAY IN GRATEFUL DEAD HISTORY.
$deadPattern = '(?s)(<article[^>]*(?:dead-history-card|dead-card)[^>]*>.*?<span[^>]*className="[^"]*(?:dead-header-icon|dead-icon)[^"]*"[^>]*>).*?(</span>)'
$deadReplacement = '$1♪$2'
$deadNew = [regex]::Replace($text, $deadPattern, $deadReplacement, 1)

if ($deadNew -eq $text) {
    $deadHeading = $text.IndexOf("TODAY IN GRATEFUL DEAD HISTORY")
    if ($deadHeading -ge 0) {
        $windowStart = [Math]::Max(0, $deadHeading - 1400)
        $window = $text.Substring($windowStart, $deadHeading - $windowStart)
        $matches = [regex]::Matches($window, '<span[^>]*>[^<]{1,40}</span>')
        if ($matches.Count -gt 0) {
            $m = $matches[$matches.Count - 1]
            $absStart = $windowStart + $m.Index
            $replacement = '<span className="dead-header-icon" aria-hidden="true">♪</span>'
            $text = $text.Remove($absStart, $m.Length).Insert($absStart, $replacement)
        }
    }
} else {
    $text = $deadNew
}

if ($text -eq $original) {
    throw "Sprint 11.9.3 could not locate either target icon. No changes were made."
}

[System.IO.File]::WriteAllText($resolved, $text, $utf8NoBom)

Write-Host ""
Write-Host "Sprint 11.9.3 installed."
Write-Host "Catholic Reading icon replaced with a stable plus sign."
Write-Host "Grateful Dead decorative icon replaced with a stable music note."
Write-Host "Backup: $backup"
Write-Host ""
Write-Host "Refresh localhost:3000 and verify Things Worth Exploring Today."
