JASKI HOMEPAGE — SPRINT 11.7.2 EXACT CLEANUP

This version targets only the exact visible ASCII phrases, byte-for-byte:

- Things that make me smile.
- Three good rabbit holes. No giant feed.

It does not decode or rewrite the TSX files, so icons and Unicode characters
are left untouched.

INSTALL
-------
Extract into:
C:\Projects\jaski-homepage

Run:
powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_11_7_2.ps1

Then refresh localhost:3000.

VERIFY
------
- Sidebar icons remain normal.
- The sidebar footer phrase is gone.
- Featured Today heading remains.
- The "Three good rabbit holes..." subtitle is gone.

Do not commit until verified.
