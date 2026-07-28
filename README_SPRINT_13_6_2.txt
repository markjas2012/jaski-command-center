JASKI COMMAND CENTER — SPRINT 13.6.2
Sports Status Diagnostic

Purpose
- Temporarily expose the raw ESPN status data for the CLE/CIN game.
- No visual/layout changes.
- Do not commit this diagnostic sprint.

Install
1. Copy this pack into C:\Projects\jaski-homepage
2. Replace app\api\sports-board\route.ts
3. Leave npm run dev running.
4. In the browser open: http://localhost:3000/api/sports-board
5. Find the "diagnostic" section near the bottom.
6. Send ChatGPT a screenshot of the diagnostic object.

The normal Sports Room can remain open; this diagnostic only adds data to the API response.
