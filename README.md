# Sprint 11.1.1 — Preseason Schedule Hotfix

Fixes the empty preseason state in Sprint 11.1.

## Changes
- Ohio State now shows its 2026 opener even before the live game-week feed begins.
- Mizzou now shows its 2026 opener even before the live game-week feed begins.
- The recent-result area becomes a useful preseason state until games are played.
- SEC shows opening-week games instead of an empty July window.
- Live ESPN site data is still preferred when it is available.
- A verified 2026 preseason fallback keeps the cards useful if ESPN's site endpoint does not publish future events through the JSON feed yet.

Verified schedule anchors used by the fallback:
- Ohio State opens Sept. 5 vs Ball State.
- Missouri opens Sept. 5 vs Arkansas-Pine Bluff.
- SEC opening week includes East Carolina at Alabama, Baylor vs Auburn, Clemson at LSU, and Arkansas-Pine Bluff at Missouri.

## Install
Extract and paste into the root of `C:\Projects\jaski-homepage`.
Allow replacements.

No sidebar changes.
No PowerShell command.

Refresh `/sports`.

Do not commit until verified.
