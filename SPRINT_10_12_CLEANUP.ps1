$ErrorActionPreference = "Stop"

Write-Host "Sprint 10.12 cleanup starting..."

# Remove the obsolete /cooking route left behind before Cooking / BBQ was standardized on /bbq.
if (Test-Path ".\app\cooking") {
    Remove-Item ".\app\cooking" -Recurse -Force
    Write-Host "Removed obsolete app\cooking route."
}

# Remove old standalone patch/readme files that are no longer needed at project root.
$obsolete = @(
    ".\SIDEBAR_PATCH.md"
)

foreach ($file in $obsolete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed obsolete $file"
    }
}

Write-Host "Sprint 10.12 cleanup complete."
