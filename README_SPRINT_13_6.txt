JASKI COMMAND CENTER
SPRINT 13.6 — SPORTS ROOM FINAL POLISH

PURPOSE
Final status-accuracy cleanup for the approved Sports Room. No layout, card,
Worth Watching, My Teams component, or Smart Board component changes are included.

WHAT THIS FIXES
- Uses America/Chicago consistently for TODAY vs NEXT UP decisions.
- Prevents postponed/canceled/final games from appearing as active or upcoming.
- Prevents stale non-final games from prior dates from being labeled NEXT UP.
- Keeps genuinely future games as COMING UP / NEXT UP.
- Keeps live games and today's games in their correct sections.
- Keeps update timestamps in St. Louis time.

INSTALL
1. Keep the dev server running.
2. Extract this ZIP.
3. Copy the contents of Sprint_013_6_Sports_Room_Final_Polish into:
   C:\Projects\jaski-homepage
4. Choose Replace when Windows prompts for the two route.ts files.
5. Refresh http://localhost:3000/sports
6. Use Ctrl+Shift+R if needed.

FILES REPLACED
app\api\my-teams\route.ts
app\api\sports-board\route.ts

EXPECTED REVIEW
- Cardinals/Blues status should no longer be driven by a stale prior-day event.
- Postponed games should disappear from the Smart Board instead of sitting in Coming Up.
- Worth Watching should continue to show only live/today picks and may correctly remain empty.
- Existing visual structure should be unchanged.

Do not commit until the Sports Room has been visually checked.
