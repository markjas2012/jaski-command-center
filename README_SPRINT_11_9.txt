JASKI HOMEPAGE — SPRINT 11.9
FAVORITES POLISH

Goal
----
Make the Favorites section actually editable while preserving the current Jaski look.

What this adds
--------------
- A real Edit Favorites modal.
- Edit label, description, URL, and two-character mark.
- Add a favorite.
- Remove a favorite.
- Save favorites using the existing homepage favorites state/localStorage.
- Reset to defaults.
- Cleaner hover/polish for favorite cards.
- No changes to Weather, Featured Today, Sidebar, Sports, Movies, TV, or Quick Launch.

Install
-------
1. Extract this ZIP into:
   C:\Projects\jaski-homepage

2. Run:

   powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_11_9.ps1

3. Refresh localhost:3000.

Verify
------
- Favorites section still looks clean.
- Edit Favorites opens the editor.
- Change one favorite and Save.
- Refresh the page and verify the change persists.
- Add/Remove work.
- Reset Defaults works.

Do not commit until verified.
