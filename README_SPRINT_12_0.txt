JASKI HOMEPAGE — SPRINT 12.0
JAM ROOM FOUNDATION

Purpose
-------
Create the first fully intentional sidebar destination and establish the room
template for future sections.

Adds
----
- New Jam Room hero identity.
- Dark listening-room visual direction.
- Quick links to Nugs, Relix, JamBase, and the Grateful Dead Archive.
- "Today in Grateful Dead history" card.
- "Listen Next" recommendation card.
- Reusable room structure that can later support live tours, setlists, releases,
  and archive picks.

Does not change
---------------
- Homepage
- Favorites
- Featured Today
- Weather
- Sidebar structure
- Sports / Golf / Movies / TV / Games / Books / BBQ

Install
-------
Extract into:

C:\Projects\jaski-homepage

Allow replacement of:

app\jam\page.tsx

Add:

components\JamHero.tsx
components\JamHero.module.css

No PowerShell command.

Then open:

http://localhost:3000/jam

Do not commit until visually verified.
