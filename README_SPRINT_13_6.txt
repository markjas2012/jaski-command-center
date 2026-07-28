JASKI HOMEPAGE — SPRINT 13.6 — DEAD.NET SHOW / ARCHIVE.ORG AUDIO

BASELINE
Built directly from Sprint 13.5.

LOCKED SOURCE SPLIT
Dead.net = show presentation layer
- official show page
- clean show setlist when available
- show-page visual when Dead.net exposes a useful image
- direct Full show on Dead.net link

Archive.org = technical/audio layer
- Spertilo-style date resolution
- preferred recording selection
- featured recording title/source
- Listen to featured recording
- alternate recordings

WHAT CHANGED
- After Archive resolves the featured historical show date, Jaski loads the matching Dead.net show page.
- Dead.net setlist replaces raw Archive audio filenames whenever it is available.
- The UI labels the source split clearly.
- Adds a Dead.net show visual only when the page provides a useful non-generic Open Graph image.
- Keeps Archive.org as the listening source.
- Existing Jam Room hierarchy/layout remains intact.

INSTALL
Copy app and components over the current project.
Allow replacement.
Run npm run dev.
Refresh http://localhost:3000/jam
