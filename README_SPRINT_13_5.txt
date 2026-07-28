JASKI HOMEPAGE — SPRINT 13.5 — SPERTILO-STYLE LOOKUP

BASELINE
Built directly from Sprint 13.4.

WHY
The public Grateful Dead Time Machine project (eichblatt/deadstream) proves the reliable model:
resolve a performance date, then choose a preferred recording ("best tape") for that show.

THIS SPRINT
- Stops depending on wildcard date matching.
- Builds explicit Archive.org date queries for every Grateful Dead touring year, 1965–1995.
- Resolves all shows matching today's month/day.
- Chooses the latest historical performance date for that calendar day.
- Chooses a preferred tape for that show using source-quality scoring:
  matrix > soundboard/SBD > pre-FM/FM > audience.
- Uses downloads only as a tie-breaker.
- Penalizes obvious incomplete/partial recordings.
- Keeps the existing venue, recording, setlist, Listen, and Other Shows Today UI.
- Carries forward Sprint 13.2 duplicate removal and all later Jam Room work.

NOTE
This implements the proven Time Machine workflow in Jaski without copying Spertilo/deadstream source code.

INSTALL
Copy app and components over the current project.
Allow replacement of included files.
Run:
  npm run dev
Refresh:
  http://localhost:3000/jam
