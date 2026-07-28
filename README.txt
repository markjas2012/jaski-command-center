Sprint 14.11 — Final Functionality Pass

Built directly on Sprint 14.10.

This is a resilience/testing sprint, not a redesign.

Changes:
- All four live client feeds now reject non-200 responses cleanly.
- Adds useful official fallback links when:
  leaderboard is unavailable
  FedEx Cup standings are unavailable
  golf news is unavailable
  Next on Tour is unavailable
- External tournament/resource logos now degrade gracefully instead of showing broken-image boxes.
- Adds scripts/golf-room-smoke-test.mjs to check all four Golf Room APIs at once.
- No layout redesign.
- No changes to working data logic, event dates, or locked Golf Room hierarchy.

Install:
Copy BOTH folders into:
  C:\Projects\jaski-homepage

  components
  scripts

Choose Merge/Replace when prompted.

Refresh:
  http://localhost:3000/golf

Optional one-command API check from the project terminal:
  node scripts/golf-room-smoke-test.mjs

Expected:
  PASS leaderboard
  PASS FedEx Cup
  PASS next event
  PASS golf news

Do not commit until visually verified.
