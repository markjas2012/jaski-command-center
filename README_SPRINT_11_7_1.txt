JASKI HOMEPAGE — SPRINT 11.7.1 SAFE TEXT CLEANUP

This replaces the failed 11.7 cleanup.

WHAT IT DOES
------------
Removes only:

1. "Things that make me smile." from Sidebar.tsx
2. "Three good rabbit holes. No giant feed." from FeaturedToday.tsx

WHY THIS VERSION IS SAFER
-------------------------
The installer edits the exact ASCII byte sequences in place.
It does NOT read the TSX files as text and write them back with a different encoding.

That means the existing icons, degree symbols, arrows, apostrophes, and other
Unicode characters are left byte-for-byte untouched.

INSTALL
-------
1. Extract this ZIP into:
   C:\Projects\jaski-homepage

2. Run:

   powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_11_7_1.ps1

3. Refresh localhost:3000

VERIFY
------
- Sidebar icons still look normal.
- "Things that make me smile." is gone.
- Featured Today still says "A few things worth your attention."
- "Three good rabbit holes. No giant feed." is gone.

Do not commit until visually verified.
