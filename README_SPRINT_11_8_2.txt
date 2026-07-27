JASKI HOMEPAGE — SPRINT 11.8.2
FEATURED TODAY DATA-PATH RESET

Purpose
-------
Stop debugging source-ranking blindly and guarantee that the homepage is
actually receiving the current Featured Today route.

What changes
------------
API route:
- force-dynamic
- revalidate = 0
- force-no-store
- external Google News RSS requests use cache: no-store
- response includes Cache-Control: no-store
- response includes build marker: 11.8.2
- response echoes a unique request ID

FeaturedToday component:
- requests /api/featured-today with a unique request ID every mount
- fetches with cache: no-store
- keeps the current visual design unchanged
- logs build + request ID to the browser console for diagnosis

The ScreenHub block from 11.8.1 remains in place.

Install
-------
Extract into:

C:\Projects\jaski-homepage

Allow replacement of:

app\api\featured-today\route.ts
components\FeaturedToday.tsx

No PowerShell command.

Then:
1. Refresh localhost:3000
2. If needed, Ctrl + Shift + R

Expected
--------
The WATCH result should be recalculated by the current route rather than a
cached response. ScreenHub is explicitly blocked.

Do not commit until verified.
