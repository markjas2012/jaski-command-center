$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Jaski Homepage - Sprint 11.7.1"
Write-Host "Safe text cleanup"
Write-Host ""

function Replace-AsciiBytes {
    param(
        [Parameter(Mandatory=$true)][string]$Path,
        [Parameter(Mandatory=$true)][string]$OldText,
        [Parameter(Mandatory=$true)][string]$NewText
    )

    if (-not (Test-Path $Path)) {
        throw "Missing file: $Path"
    }

    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $old = [System.Text.Encoding]::ASCII.GetBytes($OldText)
    $new = [System.Text.Encoding]::ASCII.GetBytes($NewText)

    $matches = New-Object System.Collections.Generic.List[int]

    for ($i = 0; $i -le $bytes.Length - $old.Length; $i++) {
        $ok = $true
        for ($j = 0; $j -lt $old.Length; $j++) {
            if ($bytes[$i + $j] -ne $old[$j]) {
                $ok = $false
                break
            }
        }
        if ($ok) {
            $matches.Add($i)
            $i += $old.Length - 1
        }
    }

    if ($matches.Count -eq 0) {
        Write-Host "No matching text found in: $Path"
        return
    }

    $output = New-Object System.Collections.Generic.List[byte]
    $cursor = 0

    foreach ($start in $matches) {
        for ($i = $cursor; $i -lt $start; $i++) {
            $output.Add($bytes[$i])
        }
        foreach ($b in $new) {
            $output.Add($b)
        }
        $cursor = $start + $old.Length
    }

    for ($i = $cursor; $i -lt $bytes.Length; $i++) {
        $output.Add($bytes[$i])
    }

    [System.IO.File]::WriteAllBytes($Path, $output.ToArray())
    Write-Host "Updated: $Path"
}

$sidebar = ".\components\Sidebar.tsx"
$featured = ".\components\FeaturedToday.tsx"

# Remove the exact sidebar footer element.
Replace-AsciiBytes `
    -Path $sidebar `
    -OldText '<p className="sidebar-footer">Things that make me smile.</p>' `
    -NewText ''

# Remove the exact Featured Today subtitle element.
Replace-AsciiBytes `
    -Path $featured `
    -OldText '<p className={styles.subhead}>Three good rabbit holes. No giant feed.</p>' `
    -NewText ''

Write-Host ""
Write-Host "Sprint 11.7.1 cleanup complete."
Write-Host "No file was decoded or re-encoded."
Write-Host "Refresh localhost:3000."
Write-Host ""
