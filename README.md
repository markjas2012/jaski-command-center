# Sprint 11.5.7 — Header Cleanup

Removes the redundant weather/status display from the **top-right corner of the homepage header**.

## Removes
The header weather information such as:

`97°`
`Overcast · updated 5 min ago`

## Keeps
- Good Afternoon, Mark
- Date
- Full main Weather card
- Calendar
- Golf
- Watch & Listen
- Featured Today
- Favorites
- Sidebar
- All live data/API work

This is intentionally a tiny cleanup.

## Install

Extract into:

`C:\Projects\jaski-homepage`

Then run:

```powershell
powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_11_5_7.ps1
```

Expected:

`Sprint 11.5.7 header cleanup complete.`

Refresh `localhost:3000`.

If the header looks right, this can be committed as a small follow-up to Sprint 11.5.
