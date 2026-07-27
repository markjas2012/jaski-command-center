$ErrorActionPreference = "Stop"

$path = ".\components\JamHero.tsx"
if (!(Test-Path $path)) {
    throw "Could not find components\JamHero.tsx. Run this from C:\Projects\jaski-homepage."
}

$resolved = (Resolve-Path $path).Path
$text = [System.IO.File]::ReadAllText($resolved)
$backup = "$resolved.pre-12.3.bak"

if (!(Test-Path $backup)) {
    Copy-Item $resolved $backup -Force
}

if ($text -notmatch 'import DeadTodayCard') {
    $text = $text -replace 'import JamLive from "\./JamLive";', 'import JamLive from "./JamLive";' + "`r`n" + 'import DeadTodayCard from "./DeadTodayCard";'
}

$pattern = '(?s)<div className=\{styles\.spotlightGrid\}>.*?</div>\s*</section>'
$match = [regex]::Match($text, $pattern)

if (-not $match.Success) {
    throw "Could not find the current spotlight grid. No changes were made."
}

$replacement = @'
<div className={styles.spotlightGrid}>
        <a
          className={styles.spotlightCard}
          href="https://archive.org/details/GratefulDead"
          target="_blank"
          rel="noreferrer"
        >
          <DeadTodayCard />
        </a>

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

$text = [regex]::Replace($text, $pattern, $replacement, 1)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($resolved, $text, $utf8NoBom)

Write-Host ""
Write-Host "Sprint 12.3 installed."
Write-Host "Today's Dead card now pulls a real show from the Internet Archive."
Write-Host "Backup: $backup"
Write-Host ""
Write-Host "Refresh localhost:3000/jam"
