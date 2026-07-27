JASKI HOMEPAGE — SPRINT 12.3.3
DEAD TODAY: LIVE + DIAGNOSTICS

This pack makes the ON THIS DAY lookup much more robust.

SEARCH ORDER
------------
1. Internet Archive date wildcard:
   date:????-MM-DD

2. If that returns nothing:
   exact searches for YYYY-MM-DD across 1965-1995

3. If that returns nothing:
   identifier wildcard gd*-MM-DD*

The API uses the documented Internet Archive advanced-search endpoint with
fielded Lucene-style queries.

DIAGNOSTICS
-----------
If no live show is returned, the card will display a small line such as:

12.3.3 · date-wildcard:0 | exact-year-scan:0 | identifier-wildcard:0

That tells us exactly where the failure is rather than silently showing the
old static fallback.

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Run:

powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_12_3_3.ps1

Then Ctrl+Shift+R on:

localhost:3000/jam

VERIFY
------
Success:
- ON THIS DAY shows a real show date
- venue/location if available
- Listen on Archive

Fallback:
- ON THIS DAY shows a diagnostic line beginning "12.3.3"
- send a screenshot of that line; it will tell us the exact failure

Do not commit until verified.
