SPRINT 12.5 — LISTEN BETTER

Built from the latest Jam Room 12.4 baseline.

CHANGES
1. Hero
   - Hero is much thinner.
   - Displays only "Jam Room."

2. Put something good on
   - New primary listening section.
   - NUGS.TV: recent video/livestream items.
   - NUGS.NET: recently added audio items.
   - Latest-show row for:
       Widespread Panic
       Billy Strings
       The String Cheese Incident
       The Disco Biscuits
       Joe Russo's Almost Dead
   - Data is pulled server-side from public nugs pages.
   - Graceful placeholders are shown if nugs changes markup or blocks a request.

3. Today in Grateful Dead History
   - Full-width upgraded feature card.
   - Uses America/Chicago calendar date.
   - Selects a real Archive.org Grateful Dead recording for today's month/day.
   - Shows date/year, venue/location, recording count, direct featured-show link,
     other-shows-on-this-date link, and show highlights when Archive metadata exposes them.

UNCHANGED
- Existing JamLive section below these features.
- Existing JamUtility section below these features.

INSTALL
Copy BOTH folders into:
  C:\Projects\jaski-homepage

  components
  app

Choose Merge/Replace when prompted.

Refresh:
  http://localhost:3000/jam

Optional API checks:
  http://localhost:3000/api/jam-listen
  http://localhost:3000/api/dead-today

Do not commit until visually verified.
