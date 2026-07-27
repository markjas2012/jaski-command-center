JASKI HOMEPAGE — SPRINT 12.1
JAM ROOM LIVE CONTENT

This pack adds live/current content beneath the existing Sprint 12.0 Jam Room.

ADD:
  components/JamLive.tsx
  components/JamLive.module.css
  app/api/jam-feed/route.ts

THEN EDIT:
  components/JamHero.tsx

1. Add this import near the top:
   import JamLive from "./JamLive";

2. Near the bottom of the returned <main>, immediately BEFORE </main>, add:
   <JamLive />

Save and refresh:
  http://localhost:3000/jam

WHAT IT DOES
- Pulls one current story each from JamBase, Relix, and Live For Live Music RSS feeds.
- Refreshes server-side every 15 minutes.
- Adds a clean three-story "What's happening" section.
- Adds a Grateful Dead "today" archive doorway.
- Falls back to useful source links if feeds fail.

IMPORTANT
Do not replace JamHero.tsx with an older copy.
Do not alter the Sprint 12.0 layout.
Verify visually before committing.
