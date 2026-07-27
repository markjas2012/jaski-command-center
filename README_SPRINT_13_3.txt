JASKI HOMEPAGE — SPRINT 13.3
SMART SPORTS BOARD

WHAT CHANGES
------------
The Live Board is now grouped intelligently:

LIVE
- games in progress right now

TODAY
- games scheduled for today/tonight

COMING UP
- future games that are not today

Also adds:
- NBA
- NHL

Finished games are omitted from the Smart Board to keep it focused.
Empty sections do not render.

FILES
-----
components\SportsBoard.tsx
components\SportsBoard.module.css
app\api\sports-board\route.ts

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Replace the included files.

NO POWERSHELL COMMAND.

Then press Ctrl + Shift + R on:

localhost:3000/sports

VERIFY
------
- SMART BOARD header appears.
- Live games, if any, appear under Live right now.
- Today's games appear under Today & tonight.
- Future games appear under Coming up.
- Empty sections disappear automatically.
- NBA/NHL appear only when there are current/upcoming games.
- Existing Sports Room hero and Quick Board remain unchanged.

Do not commit until visually verified.
