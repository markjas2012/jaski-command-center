JASKI HOMEPAGE — SPRINT 11.8.1
WATCH SOURCE FILTER

Purpose
-------
Fix the remaining weak WATCH source behavior from Sprint 11.8.

Changes
-------
- Hard-blocks weak WATCH sources such as ScreenHub.
- Prefers Variety, Deadline, The Hollywood Reporter, IndieWire, Vulture,
  Entertainment Weekly, Rolling Stone, Reuters, AP, and similar stronger sources.
- Leaves LISTEN and EXPLORE logic intact.
- No UI changes.
- No Sidebar changes.
- No homepage layout changes.

Install
-------
Extract into:

C:\Projects\jaski-homepage

Allow replacement of:

app\api\featured-today\route.ts

No PowerShell command.

Then hard refresh with Ctrl + Shift + R.

Do not commit until the WATCH card is clearly improved.
