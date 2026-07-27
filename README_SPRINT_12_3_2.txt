SPRINT 12.3.2 — DEAD TODAY FULL REPLACEMENT

This pack fixes the actual rendering path.

It includes:
- components/DeadTodayCard.tsx
- app/api/dead-today/route.ts
- installer that explicitly rewires JamHero.tsx
- automatic JamHero backup

INSTALL
1. Extract this ZIP into C:\Projects\jaski-homepage
2. Open the VS Code terminal in C:\Projects\jaski-homepage
3. Run:

powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_12_3_2.ps1

4. Ctrl+Shift+R on localhost:3000/jam

VERIFY
The ON THIS DAY card should no longer be the old static spotlight[0].
It should display a real show when the Archive lookup succeeds.

Do not commit until verified.
