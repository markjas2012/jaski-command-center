JASKI HOMEPAGE — SPRINT 12.4
JAM ROOM POLISH + UTILITY

WHAT THIS DOES
--------------
1. ON THIS DAY
   - Tries an exact Archive lookup for a specific recording.
   - For July 27, it looks for a 1994-07-27 Riverport recording.
   - If Archive does not answer quickly, it falls back to the official Dead.net
     show page instead of generic search results.

2. LISTEN NEXT
   - Moves the recommendation into its own component.
   - Uses a 3-step daily rotation through 7 shows so adjacent days do not repeat.
   - Keeps the same clean card design.

3. TONIGHT
   - Adds one compact utility strip beneath the live stories.
   - JamBase: concerts & tour dates
   - Nugs: livestreams & recent shows
   - Relix: shows, festivals & music news

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Replace/add the included files.

NO POWERSHELL COMMAND.

Then:
Ctrl + Shift + R on localhost:3000/jam

VERIFY
------
- Existing Jam Room layout is intact.
- ON THIS DAY still shows July 27, 1994 today.
- LISTEN NEXT still works.
- A compact TONIGHT section appears beneath the current-story section.
- No Room DNA section.
- No encoding garbage.

Do not commit until visually verified.
