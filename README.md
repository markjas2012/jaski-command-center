# Sprint 11.6 — Component 01: Featured Today

Upgrades the existing **Featured Today** section into the compact daily discovery row.

## Three cards only

### WATCH
One current streaming / movie / TV item worth noticing.

### LISTEN
One current Grateful Dead / Dead & Company / Phish / jam-band item.

### EXPLORE
One rotating item from the interests already represented in Jaski:
golf, Ohio State, Mizzou, books, cooking, and similar rabbit holes.

The section deliberately stays at **three cards**.

## Live feed

Adds:

`/api/featured-today`

It reads fresh Google News RSS searches through the Next.js server and normalizes the results into the three Jaski cards.

No API key is required.

If the live source is unavailable, the section falls back to links into the existing Jaski rooms instead of breaking the homepage.

## Install

Extract the ZIP and paste it into:

`C:\Projects\jaski-homepage`

Allow replacement of:

- `components\FeaturedToday.tsx`
- `components\FeaturedToday.module.css`

New file:

- `app\api\featured-today\route.ts`

No PowerShell command.
No homepage placement changes.
No Sidebar changes.
No Weather changes.

Refresh `localhost:3000`.

Do not commit until verified.
