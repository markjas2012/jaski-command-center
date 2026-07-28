JASKI HOMEPAGE — SPRINT 13.7 — DEAD.NET SETLIST FIX

BASELINE
Built directly from Sprint 13.6.

WHAT WAS WRONG
Dead.net resolved the show conceptually, but the parser was scanning general page text and often fell back to Archive.org track/file metadata. That is why filenames such as gd1982-07-28... appeared in the visible setlist.

WHAT CHANGED
- Parses the Dead.net show page specifically between the SETLIST heading and the SHOW DATE / VENUE section.
- Uses Dead.net song names only for the visual setlist.
- Keeps Archive.org exclusively for the recording/listening layer.
- If Dead.net cannot be parsed, the page no longer displays Archive filenames as a fake setlist.
- Preserves the current Grateful Dead layout and the working Spertilo-style Archive lookup.

EXPECTED JULY 28, 1982 RESULT
Dead.net should provide the clean Red Rocks song list beginning with:
Shakedown Street
Beat It on Down the Line
Greatest Story Ever Told
They Love Each Other
...

INSTALL
Copy app and components over the current project.
Allow replacement.
Run npm run dev.
Refresh http://localhost:3000/jam
