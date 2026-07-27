$ErrorActionPreference = "Stop"

$jam = ".\components\JamHero.tsx"
if (!(Test-Path $jam)) {
    throw "Could not find components\JamHero.tsx. Run this from C:\Projects\jaski-homepage."
}

$resolved = (Resolve-Path $jam).Path
$backup = "$resolved.pre-12.3.3.bak"
if (!(Test-Path $backup)) {
    Copy-Item $resolved $backup -Force
}

$text = [System.IO.File]::ReadAllText($resolved)

if ($text -notmatch 'import DeadTodayCard from "\./DeadTodayCard";') {
    $text = $text -replace 'import JamLive from "\./JamLive";', 'import JamLive from "./JamLive";' + "`r`n" + 'import DeadTodayCard from "./DeadTodayCard";'
}

$gridStart = $text.IndexOf('<div className={styles.spotlightGrid}>')
$jamLiveStart = $text.IndexOf('<JamLive />')

if ($gridStart -lt 0 -or $jamLiveStart -lt 0 -or $jamLiveStart -le $gridStart) {
    throw "Could not find the current spotlight grid/JamLive boundary. No changes were made."
}

$prefix = $text.Substring(0, $gridStart)
$suffix = $text.Substring($jamLiveStart)

$grid = @'
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

$text = $prefix + $grid + $suffix

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($resolved, $text, $utf8)

Write-Host ""
Write-Host "Sprint 12.3.3 installed."
Write-Host "Dead Today now uses three Archive search strategies and exposes diagnostics on fallback."
Write-Host "Backup: $backup"
Write-Host ""
Write-Host "Refresh /jam with Ctrl+Shift+R."
