# Sprint 11.6.2 — Featured Today Intelligence

Improves the three Featured Today selections without changing the UI.

## WATCH
Prioritizes:
- streaming releases
- Netflix
- Prime Video
- Max
- Hulu
- Disney+
- Peacock
- movie / TV premieres

## LISTEN
Prioritizes:
- Grateful Dead
- Dead & Company
- Phish
- Umphrey's McGee
- jam-band touring / concert stories

## EXPLORE
Rotates by day among:
- PGA / golf
- Ohio State
- Mizzou
- spy/thriller books
- gaming / Mortal Kombat / Xbox
- LOST / Dharma
- BBQ / grilling

This prevents one topic from owning the Explore card every day.

## Filtering
Adds:
- freshness scoring
- junk/deal/article filtering
- duplicate-topic filtering across the three cards
- headline quality weighting

## Install

Extract and paste into:

`C:\Projects\jaski-homepage`

Allow replacement of:

- `app\api\featured-today\route.ts`

No UI files are changed.
No PowerShell command.
No layout changes.

Refresh `localhost:3000`.

Do not commit until the three cards look smarter.
