$ErrorActionPreference = "Stop"

$path = ".\components\JamHero.tsx"

if (!(Test-Path $path)) {
    throw "Could not find components\JamHero.tsx. Run this from C:\Projects\jaski-homepage."
}

$resolved = (Resolve-Path $path).Path
$text = [System.IO.File]::ReadAllText($resolved)

$backup = "$resolved.pre-12.2.1.bak"
if (!(Test-Path $backup)) {
    Copy-Item $resolved $backup -Force
}

$replacement = @'
const listenNextPicks = [
  {
    title: "Grateful Dead — May 8, 1977",
    body: "Barton Hall · Cornell University · Ithaca, New York. A legendary spring '77 show and an easy choice when you just want to put something great on.",
    href: "https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf",
  },
  {
    title: "Grateful Dead — August 27, 1972",
    body: "Old Renaissance Faire Grounds · Veneta, Oregon. Sun-baked, loose, and expansive — one of the classic outdoor Dead shows.",
    href: "https://archive.org/details/gd72-08-27.sbd.braverman.16582.sbeok.shnf",
  },
  {
    title: "Grateful Dead — March 29, 1990",
    body: "Nassau Coliseum · Uniondale, New York. Branford Marsalis joins in and the band opens up — a fantastic late-era recommendation.",
    href: "https://archive.org/details/gd90-03-29.sbd.nawrocki.3384.sbeok.shnf",
  },
  {
    title: "Grateful Dead — September 21, 1972",
    body: "The Spectrum · Philadelphia, Pennsylvania. Deep 1972 playing with plenty of room to wander.",
    href: "https://archive.org/details/gd72-09-21.sbd.masse.7296.sbeok.shnf",
  },
  {
    title: "Grateful Dead — October 9, 1989",
    body: "Hampton Coliseum · Hampton, Virginia. The Warlocks return to Hampton with huge energy and famous song revivals.",
    href: "https://archive.org/details/gd89-10-09.sbd.serafin.7721.sbeok.shnf",
  },
  {
    title: "Grateful Dead — June 10, 1973",
    body: "RFK Stadium · Washington, D.C. A huge summer '73 show with long-form improvisation and a relaxed outdoor feel.",
    href: "https://archive.org/details/gd73-06-10.sbd.hollister.174.sbeok.shnf",
  },
  {
    title: "Grateful Dead — July 17, 1989",
    body: "Alpine Valley Music Theatre · East Troy, Wisconsin. Peak summer '89 Dead: powerful, polished, and easy to recommend.",
    href: "https://archive.org/details/gd89-07-17.sbd.clugston.6870.sbeok.shnf",
  },
];

function getListenNextPick() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return listenNextPicks[day % listenNextPicks.length];
}

const listenNext = getListenNextPick();

const spotlight = [
  {
    kicker: "ON THIS DAY",
    title: "Today in Grateful Dead history",
    body: "A daily door into one show, one date, and one good reason to hit play.",
    href: "https://archive.org/details/GratefulDead",
    cta: "Open the archive",
  },
  {
    kicker: "LISTEN NEXT",
    title: listenNext.title,
    body: listenNext.body,
    href: listenNext.href,
    cta: "Listen on Archive",
  },
];
'@

$pattern = '(?s)const spotlight = \[.*?\];'
$match = [regex]::Match($text, $pattern)

if (-not $match.Success) {
    throw "Could not find the current spotlight block. No changes were made."
}

$newText = [regex]::Replace($text, $pattern, $replacement, 1)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($resolved, $newText, $utf8NoBom)

Write-Host ""
Write-Host "Sprint 12.2.1 installed successfully."
Write-Host "Only the spotlight data block in JamHero.tsx was changed."
Write-Host "Backup: $backup"
Write-Host ""
Write-Host "Refresh localhost:3000/jam"
