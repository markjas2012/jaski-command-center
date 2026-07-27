$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Jaski Homepage - Sprint 11.7.2"
Write-Host "Exact cleanup"
Write-Host ""

function Remove-AsciiSequence {
    param(
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)][string]$Target
    )

    if (-not (Test-Path $Path)) {
        throw "Missing file: $Path"
    }

    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $targetBytes = [System.Text.Encoding]::ASCII.GetBytes($Target)

    $start = -1
    for ($i = 0; $i -le $bytes.Length - $targetBytes.Length; $i++) {
        $ok = $true
        for ($j = 0; $j -lt $targetBytes.Length; $j++) {
            if ($bytes[$i + $j] -ne $targetBytes[$j]) {
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
        Write-Host "Target text not found in: $Path"
        return $false
    }

    $out = New-Object byte[] ($bytes.Length - $targetBytes.Length)

    if ($start -gt 0) {
        [Array]::Copy($bytes, 0, $out, 0, $start)
    }

    $afterStart = $start + $targetBytes.Length
    $afterLength = $bytes.Length - $afterStart
    if ($afterLength -gt 0) {
        [Array]::Copy($bytes, $afterStart, $out, $start, $afterLength)
    }

    [System.IO.File]::WriteAllBytes($Path, $out)
    Write-Host "Removed text from: $Path"
    return $true
}

$sidebar = ".\components\Sidebar.tsx"
$featured = ".\components\FeaturedToday.tsx"

# Exact visible phrases only. No decoding or re-encoding.
$sidebarDone = Remove-AsciiSequence -Path $sidebar -Target "Things that make me smile."
$featuredDone = Remove-AsciiSequence -Path $featured -Target "Three good rabbit holes. No giant feed."

Write-Host ""
Write-Host "Sprint 11.7.2 finished."
Write-Host "Sidebar phrase removed: $sidebarDone"
Write-Host "Featured subtitle removed: $featuredDone"
Write-Host "No Unicode characters were rewritten."
Write-Host "Refresh localhost:3000."
