$ErrorActionPreference = "Stop"

$path = ".\components\JamHero.tsx"
if (!(Test-Path $path)) {
    throw "Could not find components\JamHero.tsx. Run this from the jaski-homepage project root."
}

$text = [System.IO.File]::ReadAllText((Resolve-Path $path))

if ($text -notmatch 'import ListenNext') {
    $text = $text -replace 'import JamLive from "\./JamLive";', 'import JamLive from "./JamLive";' + "`r`n" + 'import ListenNext, { getListenNextHref } from "./ListenNext";'
}

$old = @'
      <div className={styles.spotlightGrid}>
        {spotlight.map((item) => (
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
'@

$new = @'
      <div className={styles.spotlightGrid}>
        <a
          className={styles.spotlightCard}
          href="https://archive.org/details/GratefulDead"
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.cardKicker}>ON THIS DAY</span>
          <h3>Today in Grateful Dead history</h3>
          <p>A daily door into one show, one date, and one good reason to hit play.</p>
          <strong>Open the archive ↗</strong>
        </a>

        <a
          className={styles.spotlightCard}
          href={getListenNextHref()}
          target="_blank"
          rel="noreferrer"
        >
          <ListenNext />
        </a>
      </div>
'@

if ($text.Contains($old)) {
    $text = $text.Replace($old, $new)
} else {
    throw "Could not find the existing spotlightGrid block. No changes were made."
}

# Remove the now-unused spotlight constant if it still exists.
$text = [regex]::Replace(
    $text,
    '(?s)const spotlight = \[.*?\];\s*',
    ''
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Resolve-Path $path), $text, $utf8NoBom)

Write-Host ""
Write-Host "Sprint 12.2 installed."
Write-Host "Listen Next now rotates through real Grateful Dead show recommendations."
Write-Host "Refresh localhost:3000/jam."
