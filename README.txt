JASKI COMMAND CENTER — SPRINT 14.3a
Sports Card API Wiring Fix

PURPOSE
Connect the existing four St. Louis team cards to the Sprint 14.3 endpoint:
  /api/sports/stl

THIS PACK CHANGES ONLY
  components/MyTeams.tsx

IT DOES NOT CHANGE
- Sports Room CSS/layout
- Worth Watching
- Smart Board
- Jam Room

FIXES
- Cardinals card consumes 14.3 live/today/final/next data
- Blues card consumes the 14.3 schedule result
- CITY SC card consumes the real next-match result
- Mizzou card consumes 14.3 football data
- Dates/times display in America/Chicago (St. Louis/Central)
- Missing fields stay gracefully absent instead of inventing data

INSTALL
1. Extract the ZIP.
2. Double-click INSTALL_SPRINT_14_3A.cmd
3. Refresh http://localhost:3000/sports with Ctrl+Shift+R

DO NOT COMMIT TO GITHUB UNTIL THE FOUR CARDS ARE VISUALLY VERIFIED.
