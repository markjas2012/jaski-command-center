JASKI HOMEPAGE — SPRINT 13.9 — DEAD SET BREAKS

BASELINE
Sprint 13.8 — LOCKED.

SCOPE
Presentation-only improvement to the working Grateful Dead card.

WHAT CHANGED
- Preserves Dead.net set headings when the show page supplies them.
- Displays SET 1, SET 2, SET 3, and ENCORE as separate visual groups.
- If Dead.net does not expose set headings, the existing clean setlist still displays normally.
- No changes to the locked Archive.org recording lookup.
- No changes to Spertilo-style show/recording resolution.
- No changes to Dead.net URL resolution, show visual, podcast, adjacent news, or the rest of Jam Room.

IMPORTANT
Sprint 13.8 remains the known-good pipeline. 13.9 only adds set-break presentation on top of it.

INSTALL
Copy app and components over the current project.
Allow replacement.
Run:
  npm run dev
Refresh:
  http://localhost:3000/jam
