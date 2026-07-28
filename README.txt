Sprint 14.7.2 — Targeted Schedule Fix

Built directly on Sprint 14.7.1.

Fixes:
- Stops relying on a generic PGA TOUR page-data parser that returned no event.
- Checks the live PGA TOUR schedule page for the current late-season event names.
- Uses a verified 2026 PGA TOUR late-season schedule fallback if the live page changes or blocks parsing.
- Returns the next event with name, dates, course, location, countdown, and link.
- Preserves all approved Golf Room UI and all working feeds.

Install:
Copy BOTH folders into:
  C:\Projects\jaski-homepage

Choose Merge/Replace when prompted.

First check:
  http://localhost:3000/api/golf-next-event

Expected on July 28, 2026:
- available: true
- Rocket Classic
- Jul 30–Aug 2 · 2026
- Detroit Golf Club
- Detroit, MI

Then refresh:
  http://localhost:3000/golf

Do not commit until visually verified.
