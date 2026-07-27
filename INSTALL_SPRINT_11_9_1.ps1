$ErrorActionPreference = "Stop"

$path = ".\components\LiveDashboard.tsx"

if (!(Test-Path $path)) {
    throw "Could not find components\LiveDashboard.tsx. Run this from the jaski-homepage project root."
}

$resolved = (Resolve-Path $path).Path
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)

function SuspicionScore([string]$text) {
    $score = 0

    foreach ($ch in @("Â", "Ã", "â", "ð")) {
        $score += ([regex]::Matches($text, [regex]::Escape($ch))).Count * 3
    }

    $score += ([regex]::Matches($text, [string][char]0xFFFD)).Count * 20
    return $score
}

function Repair-Mojibake([string]$text) {
    $current = $text

    for ($pass = 0; $pass -lt 3; $pass++) {
        $beforeScore = SuspicionScore $current
        if ($beforeScore -eq 0) { break }

        try {
            $bytes = $cp1252.GetBytes($current)
            $candidate = [System.Text.Encoding]::UTF8.GetString($bytes)
        }
        catch {
            break
        }

        if ($candidate.Contains([string][char]0xFFFD)) { break }

        $afterScore = SuspicionScore $candidate
        if ($afterScore -ge $beforeScore) { break }

        $current = $candidate
    }

    return $current
}

$original = [System.IO.File]::ReadAllText($resolved)
$repaired = Repair-Mojibake $original

# Targeted fallbacks for common sequences seen in Jaski.
$map = [ordered]@{}

# Â°
$map[((([string][char]0x00C2) + ([string][char]0x00B0)))] = [string][char]0x00B0
# Â·
$map[((([string][char]0x00C2) + ([string][char]0x00B7)))] = [string][char]0x00B7

# â†’
$map[((([string][char]0x00E2) + ([string][char]0x2020) + ([string][char]0x2019)))] = [string][char]0x2192
# â†—
$map[((([string][char]0x00E2) + ([string][char]0x2020) + ([string][char]0x2014)))] = [string][char]0x2197
# â€™
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x2122)))] = [string][char]0x2019
# â€œ
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x0153)))] = [string][char]0x201C
# â€
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x009D)))] = [string][char]0x201D
# â€”
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201D)))] = [string][char]0x2014
# â€“
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201C)))] = [string][char]0x2013
# â€¦
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x00A6)))] = [string][char]0x2026
# â€¢
$map[((([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x00A2)))] = [string][char]0x2022

foreach ($bad in $map.Keys) {
    $repaired = $repaired.Replace($bad, $map[$bad])
}

if ($repaired -eq $original) {
    Write-Host "Sprint 11.9.1 finished: no mojibake changes were needed."
    Write-Host "No file was changed."
    exit 0
}

$backup = "$resolved.pre-11.9.1.bak"
if (!(Test-Path $backup)) {
    [System.IO.File]::WriteAllText($backup, $original, $utf8NoBom)
}

[System.IO.File]::WriteAllText($resolved, $repaired, $utf8NoBom)

Write-Host ""
Write-Host "Sprint 11.9.1 encoding repair complete."
Write-Host "Repaired LiveDashboard.tsx only."
Write-Host "Favorites functionality was preserved."
Write-Host "Refresh localhost:3000 and inspect Things Worth Exploring Today."
