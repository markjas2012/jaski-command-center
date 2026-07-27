JASKI HOMEPAGE — SPRINT 12.3
TODAY IN GRATEFUL DEAD HISTORY

Goal
----
Make the ON THIS DAY card show a real Grateful Dead performance from today's
month/day instead of a generic archive doorway.

How it works
------------
- Calls Internet Archive's advanced search API.
- Searches the Grateful Dead collection across 1965-1995 for today's month/day.
- Chooses a real recording.
- Prefers a St. Louis / Maryland Heights / Riverport show when one exists.
- Otherwise chooses the most-downloaded recording returned for today's date.
- Card shows real show date + venue and links to the recording.
- Falls back safely to the Grateful Dead Archive if the lookup fails.

For July 27, verified historical examples include:
- July 27, 1974 - Roanoke Civic Center, Roanoke, VA
- July 27, 1982 - Red Rocks Amphitheatre, Morrison, CO
- July 27, 1994 - Riverport Amphitheatre, Maryland Heights, MO

INSTALL
-------
Extract into:
C:\Projects\jaski-homepage

Run:
powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_12_3.ps1

Then refresh:
localhost:3000/jam

VERIFY
------
- ON THIS DAY now shows a real date and venue.
- LISTEN NEXT remains unchanged.
- Live jam-band stories remain unchanged.
- Clicking ON THIS DAY opens an Archive recording.

Do not commit until visually verified.
