# Sprint 10.12 — Final Polish

This is the Sprint 10 cleanup/checkpoint pack.

## What changes
- Removes Settings from the sidebar.
- Keeps Hiking removed.
- Preserves all working room links and active-page highlighting.
- Keeps Quick Launch and Notes as the two utility links.
- Includes a small cleanup script that removes the obsolete `/cooking` route left behind before Cooking / BBQ was standardized on `/bbq`.

## Install
1. Extract this ZIP.
2. Paste the contents into the root of `C:\Projects\jaski-homepage`.
3. Allow `components\Sidebar.tsx` to replace the existing file.
4. In the VS Code terminal, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\SPRINT_10_12_CLEANUP.ps1
```

5. Refresh the browser.

## Verify
Click through:
- Home
- Jam Room
- St. Louis Sports
- Golf
- Movies
- TV Shows
- Video Games
- Books
- Cooking / BBQ
- Quick Launch
- Notes

Confirm:
- Each link opens.
- The current room gets the blue active highlight.
- Hiking is gone.
- Settings is gone.
- Cooking / BBQ opens `/bbq`.

Do not commit until this verification passes.
