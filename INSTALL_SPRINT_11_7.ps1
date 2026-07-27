$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Jaski Homepage - Sprint 11.7"
Write-Host "Featured Today cleanup"
Write-Host ""

$project = Get-Location
$dashboard = Join-Path $project "components\LiveDashboard.tsx"
$sidebar = Join-Path $project "components\Sidebar.tsx"

function Replace-TextVariants {
    param(
        [string]$Path,
        [string[]]$Patterns,
        [string]$Replacement = ""
    )

    if (-not (Test-Path $Path)) {
        Write-Host "Skipped missing file: $Path"
        return $false
    }

    $text = Get-Content -Raw -Path $Path
    $original = $text

    foreach ($pattern in $Patterns) {
        $text = [regex]::Replace(
            $text,
            $pattern,
            $Replacement,
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
    }

    if ($text -ne $original) {
        Set-Content -Path $Path -Value $text -Encoding utf8
        Write-Host "Updated: $Path"
        return $true
    }

    Write-Host "No matching cleanup text found in: $Path"
    return $false
}

# Remove the sidebar footer phrase while leaving the rest of the sidebar untouched.
Replace-TextVariants -Path $sidebar -Patterns @(
    '<[^>]+className=["''][^"'']*sidebar[^"'']*(?:footer|tagline|motto)[^"'']*["''][^>]*>\s*Things that make me smile\.?\s*</[^>]+>',
    '<p[^>]*>\s*Things that make me smile\.?\s*</p>',
    '<span[^>]*>\s*Things that make me smile\.?\s*</span>',
    'Things that make me smile\.?'
) | Out-Null

# Remove the Featured Today subtitle while preserving the heading and cards.
Replace-TextVariants -Path $dashboard -Patterns @(
    '<p[^>]*>\s*Three good rabbit holes\.\s*No giant feed\.?\s*</p>',
    '<span[^>]*>\s*Three good rabbit holes\.\s*No giant feed\.?\s*</span>',
    'Three good rabbit holes\.\s*No giant feed\.?'
) | Out-Null

Write-Host ""
Write-Host "Sprint 11.7 cleanup applied."
Write-Host "Refresh localhost:3000 and verify:"
Write-Host "  - Sidebar footer phrase is gone"
Write-Host "  - Featured Today subtitle is gone"
Write-Host "  - 'A few things worth your attention.' remains"
Write-Host ""
