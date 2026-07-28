Sprint 14.4.3 — Leaderboard Position Fix

Built on the approved 14.4.1 Golf Room design and FedEx Cup fix.

Production changes:
- Removes the temporary 14.4.2 diagnostic.
- Uses ESPN's actual competitor `order` field as the displayed leaderboard position.
- Sorts every returned golfer by that official `order`.
- Keeps each golfer's score attached to the same ESPN competitor object.
- Shows F for completed events.
- Does not invent a Today score when ESPN does not expose a reliable explicit value.
- Preserves the Golf Room layout, branding, FedEx Cup treatment, Big Events, and Links & Resources.

Install:
Copy BOTH folders into:
  C:\Projects\jaski-homepage

  app
  components

Choose Merge/Replace when Windows prompts.

Refresh:
  http://localhost:3000/golf

Use Ctrl+Shift+R if needed.

Optional API check:
  http://localhost:3000/api/golf-leaderboard

Expected for a completed tournament:
- leaderboard rows sorted by ESPN order
- official tournament score beside the correct golfer
- Thru shows F

Do not commit until visually verified.
