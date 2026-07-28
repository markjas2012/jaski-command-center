JASKI HOMEPAGE — SPRINT 13.5
WORTH WATCHING

Adds a curated layer between MY TEAMS and SMART BOARD.

WHAT IT DOES
------------
- Uses the existing /api/my-teams and /api/sports-board data.
- Shows only 1–3 games that deserve attention.
- St. Louis Cardinals / Blues get first priority when LIVE or playing TODAY.
- Then prioritizes live games, followed by today's notable games.
- Does NOT promote distant NEXT UP games just to fill space.
- Removes duplicate St. Louis games when the same matchup appears in both feeds.
- If nothing is compelling, it says so instead of manufacturing recommendations.

FILES
-----
components\WorthWatching.tsx        NEW
components\WorthWatching.module.css NEW
components\SportsRoom.tsx           REPLACE

INSTALL
-------
1. Extract this ZIP directly into:

   C:\Projects\jaski-homepage

2. Choose REPLACE when Windows asks about SportsRoom.tsx.

3. Do NOT stop the npm run dev terminal.

4. In the browser press Ctrl + Shift + R on:

   http://localhost:3000/sports

VERIFY
------
Page order should now be:

Quick Board
MY TEAMS — St. Louis first.
WORTH WATCHING — Don't scan the whole board.
SMART BOARD — What's happening now.

Worth Watching should display no more than 3 cards.
The full My Teams and Smart Board sections should remain unchanged.

Do not commit until visually verified.
