JASKI HOMEPAGE — SPRINT 11.9.1
ENCODING REPAIR

Purpose
-------
Repair the Unicode/mojibake damage visible in Things Worth Exploring Today
without undoing the new Sprint 11.9 Favorites work.

This repair targets only:

components\LiveDashboard.tsx

It does not modify:
- FavoritesEditor.tsx
- FeaturedToday.tsx
- Sidebar.tsx
- Sports
- Movies
- TV
- Weather logic

Safety
------
A backup is created before writing:

components\LiveDashboard.tsx.pre-11.9.1.bak

Install
-------
Extract into:

C:\Projects\jaski-homepage

Run:

powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_11_9_1.ps1

Then refresh localhost:3000.

Verify
------
- Marcus Aurelius card symbol is normal.
- Catholic reading card symbol is normal.
- Grateful Dead card symbol is normal.
- No degree symbols/arrows/apostrophes are broken.
- Favorites section remains intact.

Do not commit until visually verified.
