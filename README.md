# Sprint 11.3 — Live TV Watchlist

Turns the existing personal TV tracker into a live watchlist without changing how you manage shows.

## Adds
- Each active show checks for a currently scheduled next episode.
- Next episode season/episode and air date appear directly on the show card when available.
- The old static **NEW THIS WEEK** box becomes **WATCHLIST RADAR**.
- Watchlist Radar shows up to four upcoming episodes from the shows you are actually tracking.
- Shows with no future episode posted stay quiet instead of filling the page with generic TV news.

## Data source
This uses TVmaze's free public API through a local Next.js route:
`/api/tv-status`

TVmaze documents single-show search plus embedded next/previous episode data. No API key is required.

## Install
Extract and paste into the root of `C:\Projects\jaski-homepage`.

Allow replacement of:
- `components\TVRoom.tsx`

New files:
- `components\LiveShowStatus.tsx`
- `components\WatchlistRadar.tsx`
- `components\LiveTV.module.css`
- `app\api\tv-status\route.ts`

No sidebar changes.
No PowerShell command.

Refresh `/tv`.

Your existing locally saved watch list is preserved because the storage key is unchanged.

Do not commit until verified.
