JASKI HOMEPAGE — SPRINT 13.3 — DEAD HISTORY + SETLIST

BASELINE
Built from the full Jaski project you uploaded, with Sprint 13.2 carried forward.

GOAL
Make Today in Grateful Dead History actually surface a real show for today’s calendar date and include the setlist/track list when Archive.org exposes it.

WHAT CHANGED
- Finds Grateful Dead recordings on Archive.org for today’s month/day.
- Features the latest historical show on that calendar date.
- Displays date/year, venue/location, and featured recording title.
- Pulls the track list from Archive.org recording metadata and displays it as the setlist.
- Adds a direct Listen to featured show link.
- Keeps Other shows today for alternate years/recordings.
- Carries forward removal of the duplicate lower “Grateful Dead · Today” strip.
- Preserves Deadcast, adjacent news, Now Playing, Tonight, Nugs, Phish #2, and Widespread Panic #3.

INSTALL
Copy the app and components folders over the matching folders in your current Jaski project.
Allow replacement of included files.
Run npm run dev.
Refresh http://localhost:3000/jam

VERIFY
Today in Grateful Dead History should show a specific show and, when Archive.org metadata contains track titles, a setlist.
