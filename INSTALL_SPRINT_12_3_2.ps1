$ErrorActionPreference = "Stop"

$jam = ".\components\JamHero.tsx"
if (!(Test-Path $jam)) {
  throw "Run this from C:\Projects\jaski-homepage. components\JamHero.tsx was not found."
}

$resolved = (Resolve-Path $jam).Path
$backup = "$resolved.pre-12.3.2.bak"
if (!(Test-Path $backup)) { Copy-Item $resolved $backup -Force }

$text = [IO.File]::ReadAllText($resolved)

# Guarantee import.
if ($text -notmatch 'DeadTodayCard') {
  $lines = $text -split "`r?`n"
  $lastImport = -1
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^import ') { $lastImport = $i }
  }
  if ($lastImport -lt 0) { throw "No import block found in JamHero.tsx." }

  $before = @($lines[0..$lastImport])
  $after = if ($lastImport + 1 -lt $lines.Length) { @($lines[($lastImport + 1)..($lines.Length - 1)]) } else { @() }
  $text = (@($before) + 'import DeadTodayCard from "./DeadTodayCard";' + @($after)) -join "`r`n"
}

# Find the spotlight grid and replace ONLY its first mapped/static card area with
# a dedicated DeadTodayCard followed by the existing second spotlight item.
$startToken = '<div className={styles.spotlightGrid}>'
$start = $text.IndexOf($startToken)
if ($start -lt 0) { throw "spotlightGrid not found. No changes made." }

# We know this grid ends immediately before JamLive in the current Sprint 12 JamHero.
$jamLive = $text.IndexOf('<JamLive />', $start)
if ($jamLive -lt 0) { throw "JamLive marker not found after spotlightGrid. No changes made." }

$prefix = $text.Substring(0, $start)
$suffix = $text.Substring($jamLive)

$newGrid = @'
<div className={styles.spotlightGrid}>
        <article className={styles.spotlightCard}>
          <DeadTodayCard />
        </article>

        {spotlight.slice(1).map((item) => (
          <a
            className={styles.spotlightCard}
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.cardKicker}>{item.kicker}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <strong>{item.cta} ↗</strong>
          </a>
        ))}
      </div>
    </section>

    '@

$text = $prefix + $newGrid + $suffix
$utf8 = New-Object Text.UTF8Encoding($false)
[IO.File]::WriteAllText($resolved, $text, $utf8)

Write-Host ""
Write-Host "Sprint 12.3.2 installed."
Write-Host "JamHero ON THIS DAY is now explicitly wired to DeadTodayCard."
Write-Host "Backup: $backup"
Write-Host ""
Write-Host "Refresh localhost:3000/jam with Ctrl+Shift+R."
