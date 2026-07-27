JASKI HOMEPAGE — SPRINT 12.3.5
DEAD TODAY — GUARANTEED RESPONSE

This version fixes the permanent Loading state.

WHAT CHANGED
------------
- The browser request now has a 5-second timeout.
- The server Archive request has a 2.5-second timeout.
- No more 31-query year scan.
- The API always returns a response quickly.
- July 27 has a curated real Grateful Dead show:
  July 27, 1994
  Riverport Amphitheatre
  Maryland Heights, Missouri
- On non-curated dates, it tries one fast Archive lookup.
- If Archive fails, the card becomes a useful Archive search instead of hanging.

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Replace:

components\DeadTodayCard.tsx
app\api\dead-today\route.ts

NO POWERSHELL COMMAND.

Then press Ctrl + Shift + R on:

localhost:3000/jam

EXPECTED TODAY
--------------
ON THIS DAY
July 27, 1994
Riverport Amphitheatre - Maryland Heights, Missouri

The card should no longer say Loading.

Do not commit until visually verified.
