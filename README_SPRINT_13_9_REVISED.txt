JASKI HOMEPAGE — SPRINT 13.9 REVISED — DEAD SET BREAKS

BASELINE
Sprint 13.8 — LOCKED.

WHY THIS REVISION
The first 13.9 expected Dead.net to expose SET 1 / SET 2 / ENCORE headings directly.
It does not reliably do that, even though its clean song list is correct.

APPROACH
- Leave the entire locked 13.8 Dead.net + Archive.org pipeline untouched.
- Keep Dead.net as the source of the visible clean song list.
- Layer verified set-break metadata on top of that list only when we know the boundaries.
- If no verified boundary is available for a date, 13.8's normal clean setlist displays unchanged.

CURRENT VERIFIED OVERRIDE
1982-07-28 — Red Rocks Amphitheatre
SET 1:
Shakedown Street through Deal

SET 2:
Man Smart/Woman Smarter through Sugar Magnolia

ENCORE:
Baby Blue

This structure is supported by published historical setlist sources for the show.

INSTALL
Copy app and components over the current project.
Allow replacement.
Run:
  npm run dev
Refresh:
  http://localhost:3000/jam

IMPORTANT
13.8 remains the known-good data pipeline. This sprint changes presentation metadata only.
