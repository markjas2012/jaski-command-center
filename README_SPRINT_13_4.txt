JASKI HOMEPAGE — SPRINT 13.4
MY TEAMS

Adds a personalized St. Louis layer above the Smart Sports Board.

MY TEAMS
--------
- St. Louis Cardinals
- St. Louis Blues

When a team is on the current scoreboard, its card shows:
- LIVE NOW / TODAY / NEXT UP
- matchup
- score or network/time when available
- direct game/team link

When there is no current game, the card stays useful and links to the team page.

The section sits between Quick Board and Smart Board so St. Louis teams get
priority without changing the general scoreboard.

FILES
-----
components\MyTeams.tsx
components\MyTeams.module.css
components\SportsRoom.tsx
app\api\my-teams\route.ts

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Choose REPLACE for SportsRoom.tsx.

No PowerShell command.

Then Ctrl + Shift + R:

localhost:3000/sports

VERIFY
------
- MY TEAMS / St. Louis first appears above Smart Board.
- Cardinals and Blues each have one card.
- Cardinals should show current/today information when on the MLB board.
- Blues remain useful even when there is no NHL game.
- Smart Board remains unchanged beneath it.

Do not commit until visually verified.
