JASKI HOMEPAGE — SPRINT 13.2
LIVE SPORTS BOARD

Adds a real live/current sports board beneath the Sports Room foundation.

WHAT IT DOES
------------
- Pulls current scoreboard data for:
  MLB
  NFL
  NCAA football
- Shows up to six current/upcoming games.
- Displays matchup, status, score/time, and TV network when available.
- Falls back to useful league links if a feed is unavailable.
- Keeps Golf out of the Sports Room.
- Removes the temporary "ROOM RULE" footer from Sprint 13.1.
- Does not touch Jam Room or Homepage.

FILES
-----
components\SportsBoard.tsx
components\SportsBoard.module.css
components\SportsRoom.tsx
app\api\sports-board\route.ts

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Choose REPLACE for SportsRoom.tsx.

No PowerShell command.

Then Ctrl+Shift+R on:

localhost:3000/sports

VERIFY
------
- Sports Room hero remains intact.
- Quick Board remains intact.
- A new LIVE BOARD / Today & tonight section appears below.
- Current/upcoming games populate when feeds respond.
- No ROOM RULE section at the bottom.

Do not commit until visually verified.
