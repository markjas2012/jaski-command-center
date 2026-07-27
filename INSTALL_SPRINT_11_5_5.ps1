$ErrorActionPreference = "Stop"

$targets = @(
    ".\components\LiveDashboard.tsx",
    ".\app\page.tsx"
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)

function SuspicionScore([string]$text) {
    $score = 0

    # Common markers created when UTF-8 text is misread as Windows-1252.
    foreach ($ch in @("Â", "Ã", "â")) {
        $score += ([regex]::Matches($text, [regex]::Escape($ch))).Count * 3
    }

    # Unicode replacement character is always bad.
    $score += ([regex]::Matches($text, [string][char]0xFFFD)).Count * 20

    return $score
}

function Repair-Mojibake([string]$text) {
    $current = $text

    # Up to three passes handles both ordinary and double-encoded mojibake.
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

        $afterScore = SuspicionScore $candidate

        # Only accept a pass when it clearly improves the text and does not
        # introduce the Unicode replacement character.
        if ($candidate.Contains([string][char]0xFFFD)) { break }
        if ($afterScore -ge $beforeScore) { break }

        $current = $candidate
    }

    return $current
}

$changedAny = $false

foreach ($path in $targets) {
    if (!(Test-Path $path)) {
        Write-Host "Skipped missing file: $path"
        continue
    }

    $resolved = (Resolve-Path $path).Path
    $original = [System.IO.File]::ReadAllText($resolved)
    $repaired = Repair-Mojibake $original

    # Surgical fallbacks built from character codes so this installer itself
    # does not depend on Unicode literals surviving ZIP/extract/editor handling.
    $badDegree = ([string][char]0x00C2) + ([string][char]0x00B0)
    $degree = [string][char]0x00B0
    $repaired = $repaired.Replace($badDegree, $degree)

    # "â†’" = mojibake form of right arrow.
    $badRight = ([string][char]0x00E2) + ([string][char]0x2020) + ([string][char]0x2019)
    $right = [string][char]0x2192
    $repaired = $repaired.Replace($badRight, $right)

    # "â†—" = mojibake form of north-east arrow.
    $badNE = ([string][char]0x00E2) + ([string][char]0x2020) + ([string][char]0x2014)
    $ne = [string][char]0x2197
    $repaired = $repaired.Replace($badNE, $ne)

    # "â€™" = mojibake form of curly apostrophe.
    $badApostrophe = ([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x2122)
    $apostrophe = [string][char]0x2019
    $repaired = $repaired.Replace($badApostrophe, $apostrophe)

    # "â€”" = mojibake em dash.
    $badEmDash = ([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201D)
    $emDash = [string][char]0x2014
    $repaired = $repaired.Replace($badEmDash, $emDash)

    if ($repaired -ne $original) {
        $backup = "$resolved.pre-11.5.5.bak"
        if (!(Test-Path $backup)) {
            [System.IO.File]::WriteAllText($backup, $original, $utf8NoBom)
        }

        [System.IO.File]::WriteAllText($resolved, $repaired, $utf8NoBom)
        Write-Host "Repaired encoding: $path"
        $changedAny = $true
    }
    else {
        Write-Host "No encoding changes needed: $path"
    }
}

Write-Host ""
if ($changedAny) {
    Write-Host "Sprint 11.5.5 encoding repair complete."
} else {
    Write-Host "Sprint 11.5.5 finished, but no matching mojibake was found."
}
Write-Host "Featured Today placement and page layout were not changed."
Write-Host "Refresh localhost:3000 and check the degree symbols, arrows, and WHAT'S NEW label."
