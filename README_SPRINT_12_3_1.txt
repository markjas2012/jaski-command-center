JASKI HOMEPAGE — SPRINT 12.3.1
DEAD TODAY — CORRECTED DATA PATH

This fixes the Sprint 12.3 fallback problem.

WHY 12.3 FAILED
---------------
The first version built a large OR query against the Archive date metadata.
The card was correctly falling back because that search path was not returning
a usable result.

12.3.1 CHANGES
--------------
- Searches Internet Archive by the Grateful Dead identifier date pattern:
  gd*-MM-DD*
- Forces no-cache on the API and browser request.
- Keeps the current Jam Room JSX/layout intact.
- Makes the ON THIS DAY card open the actual returned recording even though
  the existing parent card still has its original Archive fallback href.
- Prefers St. Louis / Maryland Heights / Riverport when today's date has one.
- Otherwise prefers the most-downloaded recording.
- If Archive still returns nothing, the fallback now opens a search for the
  correct month/day rather than the generic collection.

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Replace:

components\DeadTodayCard.tsx
app\api\dead-today\route.ts

No PowerShell command.

Then use Ctrl + Shift + R on:

localhost:3000/jam

VERIFY
------
ON THIS DAY should show:
- a real historical date
- a venue/location when Archive metadata provides it
- "Listen on Archive"

Clicking the card should open that recording.

Do not commit until verified.
