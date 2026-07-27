JASKI HOMEPAGE — SPRINT 12.2
LISTEN NEXT

Purpose
-------
Turn the Jam Room's "One show worth your time" placeholder into a real rotating
Grateful Dead recommendation.

What changes
------------
- Adds a rotating daily Grateful Dead show recommendation.
- Shows artist, date, venue, city, and a short reason to listen.
- Links directly to a recording on Internet Archive.
- Keeps the existing Jam Room layout.
- Does not alter the live-news section.
- Does not add new page sections.

Install
-------
1. Extract into:
   C:\Projects\jaski-homepage

2. Run:
   powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_12_2.ps1

3. Refresh:
   http://localhost:3000/jam

Verify
------
- "ON THIS DAY" card still looks the same.
- "LISTEN NEXT" now shows a real show, date, venue, city, and description.
- Clicking the card opens the Internet Archive recording.
- Live Jam Room stories remain below.

Do not commit until visually verified.
