JASKI HOMEPAGE — SPRINT 13.8 — DEAD.NET RESOLVER + PARSER

BASELINE
Built directly from Sprint 13.7.

WHAT THIS FIXES
13.7 correctly hid Archive filenames, but Dead.net still was not consistently feeding the visible setlist or Full Show button.

13.8 changes the approach:
- The Dead.net show URL is generated directly from the resolved historical date.
- The Full show on Dead.net button is available even if server-side Dead.net fetching fails.
- Dead.net HTML is converted to visible text lines.
- Jaski locates the actual "setlist" marker and reads song lines until "show date".
- A setlist must contain at least 5 songs to be accepted, avoiding false-positive page sections.
- Archive.org track metadata is no longer used as a visible setlist under any circumstance.
- Archive.org remains the recording/audio layer.
- Dead.net remains the show/setlist layer.

JULY 28, 1982
Dead.net currently exposes the clean show setlist beginning:
Shakedown Street
Beat it on Down the Line
Greatest Story Ever Told
They Love Each Other
Mama Tried
Mexicali Blues
...

INSTALL
Copy app and components over the current project.
Allow replacement.
Run npm run dev.
Refresh http://localhost:3000/jam
