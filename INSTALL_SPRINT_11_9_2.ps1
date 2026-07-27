$ErrorActionPreference = "Stop"

$target = Join-Path (Get-Location) "app\components\LiveDashboard.tsx"
if (-not (Test-Path $target)) {
    throw "Could not find app\components\LiveDashboard.tsx. Run this from the jaski-homepage project root."
}

$backup = "$target.pre-11.9.2.bak"
Copy-Item $target $backup -Force

$text = [System.IO.File]::ReadAllText($target)

# Repair only the two remaining mojibake icon strings.
# Catholic reading icon: replace corrupted check/book-style glyph with a stable cross.
$text = [regex]::Replace(
    $text,
    '(<article className="reading-card[\s\S]*?<div className="reading-icon"[^>]*>)[\s\S]*?(</div>)',
    '$1&#10013;$2',
    1
)

# Grateful Dead card upper-right decorative icon: use a stable music note.
$text = [regex]::Replace(
    $text,
    '(<span className="dead-header-icon"[^>]*>)[\s\S]*?(</span>)',
    '$1&#9835;$2',
    1
)

# Write UTF-8 without BOM to avoid reintroducing encoding artifacts.
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($target, $text, $utf8NoBom)

Write-Host "Sprint 11.9.2 installed."
Write-Host "Backup: $backup"
Write-Host "Refresh localhost:3000 and verify the Catholic Reading and Grateful Dead icons."
