$ErrorActionPreference = "Stop"

$path = ".\components\LiveDashboard.tsx"

if (!(Test-Path $path)) {
    throw "Could not find components\LiveDashboard.tsx. Run this from the jaski-homepage project root."
}

$resolved = (Resolve-Path $path).Path
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$text = [System.IO.File]::ReadAllText($resolved)
$original = $text

# The current header's right-side weather block contains the visible
# "updated X min ago" text. Remove the smallest enclosing JSX <div>.
$needle = 'updated '
$needleIndex = $text.IndexOf($needle)

if ($needleIndex -lt 0) {
    throw "Could not find the top-right weather status text. No changes were made."
}

# Find the opening <div ...> immediately enclosing the status.
$openIndex = $text.LastIndexOf("<div", $needleIndex)
if ($openIndex -lt 0) {
    throw "Could not locate the weather status container. No changes were made."
}

# Walk forward through nested divs until the matching closing </div>.
$tagRegex = [regex]'<div\b[^>]*>|</div>'
$matches = $tagRegex.Matches($text, $openIndex)

$depth = 0
$closeEnd = -1

foreach ($m in $matches) {
    if ($m.Index -lt $openIndex) { continue }

    if ($m.Value.StartsWith("<div")) {
        $depth++
    } else {
        $depth--
        if ($depth -eq 0) {
            $closeEnd = $m.Index + $m.Length
            break
        }
    }
}

if ($closeEnd -lt 0) {
    throw "Could not safely determine the end of the weather status container. No changes were made."
}

$block = $text.Substring($openIndex, $closeEnd - $openIndex)

# Safety check: only remove a block that actually contains the weather update status.
if ($block -notmatch 'updated\s*\{?' -and $block -notmatch 'updated ') {
    throw "Safety check failed: located block does not look like the weather status. No changes were made."
}

$backup = "$resolved.pre-11.5.7.bak"
if (!(Test-Path $backup)) {
    [System.IO.File]::WriteAllText($backup, $original, $utf8NoBom)
}

$text = $text.Remove($openIndex, $closeEnd - $openIndex)
[System.IO.File]::WriteAllText($resolved, $text, $utf8NoBom)

Write-Host ""
Write-Host "Sprint 11.5.7 header cleanup complete."
Write-Host "Removed only the top-right weather/status block."
Write-Host "The main Weather card and Featured Today were not changed."
Write-Host "Refresh localhost:3000."
