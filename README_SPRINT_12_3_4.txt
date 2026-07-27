JASKI HOMEPAGE — SPRINT 12.3.4
DEAD TODAY — FULL COMPONENT REPLACEMENT

This pack stops patching JamHero.tsx.

It fully replaces:
- components/JamHero.tsx
- components/DeadTodayCard.tsx
- app/api/dead-today/route.ts

It preserves the approved Sprint 12 layout:
- Jam Room hero
- Tonight's Doorway
- Nugs / Relix / JamBase / Archive
- Listen Next rotating show
- JamLive current stories
- NO Room DNA section

INSTALL
-------
Extract into:

C:\Projects\jaski-homepage

Choose REPLACE when Windows asks for the three files above.

NO POWERSHELL COMMAND.

Then:
1. Ctrl+S if VS Code has any of those files open.
2. Ctrl+Shift+R on localhost:3000/jam

VERIFY
------
The top-right ON THIS DAY card is now structurally forced to render DeadTodayCard.

Success:
- real historical date
- venue/location if available
- Listen on Archive

Fallback:
- a small "12.3.4 · ..." diagnostic line appears

That diagnostic line proves the new component is actually rendering.

Do not commit until visually verified.
