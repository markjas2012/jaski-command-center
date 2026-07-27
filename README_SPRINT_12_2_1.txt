JASKI HOMEPAGE — SPRINT 12.2.1
LISTEN NEXT — CORRECTED INSTALLER

This version is built against the exact current JamHero.tsx structure shown
after Sprint 12.1.

It does NOT restructure JSX.

It changes only the existing `const spotlight = [...]` data block.

Result:
- ON THIS DAY remains unchanged.
- LISTEN NEXT becomes a real rotating Grateful Dead show recommendation.
- The existing card/map layout remains untouched.
- JamLive remains untouched.
- No new import is required.
- No new component is required.

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Run:

powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_12_2_1.ps1

Then refresh:

localhost:3000/jam

VERIFY
------
The right-side LISTEN NEXT card should now show:
- Grateful Dead
- a real date
- venue/city in the description
- "Listen on Archive"

Do not commit until visually verified.
