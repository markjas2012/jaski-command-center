JASKI HOMEPAGE — SPRINT 13.10R — JAM ROOM HIERARCHY

PURPOSE
Lock the Jam Room hierarchy and add Phish as its own dedicated #2 section.

HIERARCHY
#1 Grateful Dead — dedicated section, always first
#2 Phish — dedicated section
#3 Widespread Panic — first band in Live Bands
Then: Billy Strings, String Cheese Incident, Disco Biscuits, JRAD and other rotating bands

GRATEFUL DEAD — PRESERVED
- Today in Grateful Dead History
- Latest Good Ol' Grateful Deadcast
- Dead family / adjacent news
- Existing Dead.net and Archive.org behavior

PHISH — NEW DEDICATED #2 SECTION
- Official latest-show / tour link
- LivePhish listening link
- Phish.net setlist link
- Official Phish news link
- Visually subordinate to the Grateful Dead section

LIVE BANDS — CLEANUP
Phish is removed from the generic Live Bands row so it is not duplicated.
Widespread Panic is now explicitly #3.
All remaining bands stay in the rotating tier.

FILES CHANGED
components/JamHero.tsx
components/JamListen.tsx
components/PhishFeature.tsx
components/PhishFeature.module.css

INSTALL — RECOMMENDED
1. Extract this ZIP anywhere.
2. Copy INSTALL_SPRINT_13_10R.ps1 and the SPRINT_13_10R_FILES folder into:
   C:\Projects\jaski-homepage
3. In the VS Code terminal, from C:\Projects\jaski-homepage, run:
   powershell -ExecutionPolicy Bypass -File .\INSTALL_SPRINT_13_10R.ps1
4. Run npm run dev if the site is not already running.
5. Refresh http://localhost:3000/jam

BACKUPS
The installer creates .pre-13.10R.bak copies of the replaced component files before changing anything.
