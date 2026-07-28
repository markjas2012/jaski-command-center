JASKI HOMEPAGE — SPRINT 13.1 — FEED CLEANUP

BASELINE
Built directly from Sprint 13.0 Compact Listen Now.

GOAL
Clean bad RSS/feed text without changing the layout.

CHANGES
- Strips leaked HTML tags from feed titles/descriptions.
- Normalizes whitespace and common HTML entities.
- Adds a UI-level safety net so raw markup cannot appear in cards.
- Preserves the exact 13.0 compact layout.
- Preserves Phish #2, Widespread Panic #3, and the Grateful Dead centerpiece.
- No intentional visual redesign.

INSTALL
Copy over the current project, allow replacement, refresh localhost:3000.

VERIFY
The NUGS.NET High Sierra card should no longer display raw <div class="venue"... markup.
