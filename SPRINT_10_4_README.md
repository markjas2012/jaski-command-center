# Jaski Command Center — Sprint 10.4

## Component 04: Golf Room

This sprint adds the dedicated `/golf` room.

### Included
- `app/golf/page.tsx`
- `components/GolfRoom.tsx`
- `components/GolfRoom.module.css`

### Install
Extract the ZIP into the root of:

`C:\Projects\jaski-homepage`

Allow Windows to merge the `app` and `components` folders.

This sprint is additive: it does not replace `globals.css`, `page.tsx`, or the existing Sprint 10.3 Sports room.

### Test
With `npm run dev` already running, open:

`http://localhost:3000/golf`

The existing Golf sidebar item should open the new room if it already points to `/golf`.

### Sprint intent
Establish a polished permanent Golf room without live-data complexity yet. Future sprint components can add tournaments, local courses, feeds, and personalized golf shortcuts inside this room.
