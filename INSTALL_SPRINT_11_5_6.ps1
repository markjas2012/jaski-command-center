$ErrorActionPreference = "Stop"

$path = ".\components\LiveDashboard.tsx"

if (!(Test-Path $path)) {
    throw "Could not find $path. Run this from the jaski-homepage project root."
}

$resolved = (Resolve-Path $path).Path
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$text = [System.IO.File]::ReadAllText($resolved)

# Build the bad sequence from character codes:
# U+00C2 U+00B7 = "Â" followed by middle dot.
$bad = ([string][char]0x00C2) + ([string][char]0x00B7)
$good = [string][char]0x00B7

$count = ([regex]::Matches($text, [regex]::Escape($bad))).Count

if ($count -gt 0) {
    $backup = "$resolved.pre-11.5.6.bak"
    if (!(Test-Path $backup)) {
        [System.IO.File]::WriteAllText($backup, $text, $utf8NoBom)
    }

    $text = $text.Replace($bad, $good)
    [System.IO.File]::WriteAllText($resolved, $text, $utf8NoBom)

    Write-Host "Sprint 11.5.6 complete: repaired $count remaining middle-dot encoding artifact(s)."
} else {
    Write-Host "Sprint 11.5.6 complete: no remaining middle-dot encoding artifact was found."
}

Write-Host "No layout, weather logic, Featured Today placement, or other content was changed."
Write-Host "Refresh localhost:3000 and verify the top-right status reads like: Overcast · updated 5 min ago"
