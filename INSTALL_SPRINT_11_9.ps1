$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Jaski Homepage - Sprint 11.9"
Write-Host "Favorites polish"
Write-Host ""

$dashboard = ".\components\LiveDashboard.tsx"
$globals = ".\app\globals.css"

if (!(Test-Path $dashboard)) {
    throw "Missing components\LiveDashboard.tsx"
}
if (!(Test-Path $globals)) {
    throw "Missing app\globals.css"
}

# Byte-safe helper for ASCII-only inserts/replacements.
function Replace-AsciiBytes {
    param(
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)][string]$OldText,
        [Parameter(Mandatory=$true)][string]$NewText
    )

    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $old = [System.Text.Encoding]::ASCII.GetBytes($OldText)
    $new = [System.Text.Encoding]::ASCII.GetBytes($NewText)

    $start = -1
    for ($i = 0; $i -le $bytes.Length - $old.Length; $i++) {
        $ok = $true
        for ($j = 0; $j -lt $old.Length; $j++) {
            if ($bytes[$i + $j] -ne $old[$j]) {
                $ok = $false
                break
            }
        }
        if ($ok) {
            $start = $i
            break
        }
    }

    if ($start -lt 0) {
        return $false
    }

    $out = New-Object System.Collections.Generic.List[byte]
    for ($i = 0; $i -lt $start; $i++) { $out.Add($bytes[$i]) }
    foreach ($b in $new) { $out.Add($b) }
    for ($i = $start + $old.Length; $i -lt $bytes.Length; $i++) { $out.Add($bytes[$i]) }

    [System.IO.File]::WriteAllBytes($Path, $out.ToArray())
    return $true
}

# Add the component import after React imports if not already present.
$dashboardText = [System.IO.File]::ReadAllText((Resolve-Path $dashboard))
if ($dashboardText -notmatch 'FavoritesEditor') {
    $ok = Replace-AsciiBytes `
      -Path $dashboard `
      -OldText 'import { useEffect, useMemo, useState } from "react";' `
      -NewText 'import { useEffect, useMemo, useState } from "react";' + "`r`n" + 'import FavoritesEditor from "./FavoritesEditor";'

    if (-not $ok) {
        throw "Could not locate the React import in LiveDashboard.tsx"
    }
}

# Replace the existing Edit Favorites button with the new editor control.
$dashboardText = [System.IO.File]::ReadAllText((Resolve-Path $dashboard))
if ($dashboardText -notmatch '<FavoritesEditor') {
    $patterns = @(
        '<button[^>]*>\s*Edit Favorites\s*</button>',
        '<button[^>]*onClick=\{\(\)\s*=>\s*setEditingFavorites\(true\)\}[^>]*>\s*Edit Favorites\s*</button>'
    )

    $replacement = '<FavoritesEditor favorites={favorites} setFavorites={setFavorites} resetFavorites={resetFavorites} />'
    $replaced = $false

    foreach ($pattern in $patterns) {
        $match = [regex]::Match($dashboardText, $pattern)
        if ($match.Success) {
            $old = $match.Value
            $ok = Replace-AsciiBytes -Path $dashboard -OldText $old -NewText $replacement
            if ($ok) {
                $replaced = $true
                break
            }
        }
    }

    if (-not $replaced) {
        throw "Could not find the existing Edit Favorites button. No dashboard changes were made."
    }
}

# Append CSS using raw bytes without decoding/re-encoding the existing stylesheet.
$marker = "/* Sprint 11.9 Favorites polish */"
$globalsText = [System.IO.File]::ReadAllText((Resolve-Path $globals))
if ($globalsText -notmatch [regex]::Escape($marker)) {
    $cssPath = ".\SPRINT_11_9_FAVORITES.css"
    if (!(Test-Path $cssPath)) {
        throw "Missing SPRINT_11_9_FAVORITES.css"
    }

    $existing = [System.IO.File]::ReadAllBytes($globals)
    $append = [System.IO.File]::ReadAllBytes($cssPath)
    $newline = [System.Text.Encoding]::ASCII.GetBytes("`r`n`r`n")
    $combined = New-Object byte[] ($existing.Length + $newline.Length + $append.Length)
    [Array]::Copy($existing, 0, $combined, 0, $existing.Length)
    [Array]::Copy($newline, 0, $combined, $existing.Length, $newline.Length)
    [Array]::Copy($append, 0, $combined, $existing.Length + $newline.Length, $append.Length)
    [System.IO.File]::WriteAllBytes($globals, $combined)
}

Write-Host ""
Write-Host "Sprint 11.9 installed."
Write-Host "Refresh localhost:3000."
Write-Host "Click Edit Favorites and verify add/edit/remove/save/reset."
