JASKI HOMEPAGE — SPRINT 11.9.3
STABLE ICON REPLACEMENT

Purpose
-------
Stop repairing the corrupted Unicode strings and replace the two troublesome
decorative icons with stable symbols.

Changes
-------
Catholic Reading:
- Replaces the corrupted icon with a simple + symbol.

Grateful Dead:
- Replaces the corrupted upper-right decorative icon with a music note.

Preserves
---------
- Marcus Aurelius card
- Favorites work from Sprint 11.9
- Featured Today
- Weather
- Sidebar
- Sports / Movies / TV
- Layout and card styling

Install
-------
Extract into:

C:\Projects\jaski-homepage

Run:

powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_11_9_3.ps1

Then refresh localhost:3000.

A backup is created:
components\LiveDashboard.tsx.pre-11.9.3.bak

Do not commit until visually verified.
