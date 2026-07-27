# Sprint 10.4.1 — Jam History Hotfix

Replaces the frozen Jam Room history hero with a date-aware version.

Included:
- components/JamHero.tsx

The current local date is checked every minute. July 24, July 27, and July 28 have local show entries. Other dates show a clean "History entry coming soon" state rather than stale history.

Install by copying the `components` folder into `C:\\Projects\\jaski-homepage` and allowing Windows to replace `JamHero.tsx`.
