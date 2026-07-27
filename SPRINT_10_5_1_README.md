# Sprint 10.5.1 — Sidebar Hotfix

This hotfix restores the original working sidebar DOM/class structure so the existing globals.css styling applies again.

It preserves the working routes:
- Home
- Jam Room
- St. Louis Sports
- Golf

And adds:
- Movies -> /movies
- Movies active-page highlighting

No CSS, homepage, Jam Room, Sports Room, Golf Room, or Movies Room files are replaced.

Install:
Extract into C:\Projects\jaski-homepage and allow Windows to replace components\Sidebar.tsx.

Then refresh localhost:3000 and verify the sidebar is restored. Click Movies to test /movies.
