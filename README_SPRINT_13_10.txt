JASKI HOMEPAGE — SPRINT 13.10 — PHISH UPGRADE

BASELINE
Sprint 13.9 Revised — LOCKED.

THIS PACK IS ISOLATED
The locked baseline pack contains the Dead card/API but not the parent Jam Room layout file.
So 13.10 adds the Phish feature component without altering any locked Dead files.

ADD TO THE JAM ROOM PARENT
Import:
  import PhishFeature from "@/components/PhishFeature";

Place:
  <PhishFeature />

directly AFTER the existing Grateful Dead / DeadTodayCard section and BEFORE "What's happening in the Jam Room."

PHISH #2 FOUNDATION
- Dedicated #2 Phish section
- Latest show / official tour link
- LivePhish listening link
- Setlist link
- Official Phish news link
- Clearly subordinate to Grateful Dead

NOT TOUCHED
Dead.net, Archive.org, set breaks, Dead podcast, adjacent Dead content.

NEXT
After this visual foundation is approved, the next isolated pack can make Phish date/venue/setlist populate automatically.

RUN
npm run dev
Refresh http://localhost:3000/jam
