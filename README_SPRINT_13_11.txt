JASKI HOMEPAGE — SPRINT 13.11
PHISH: LIVE DATA

WHAT CHANGES
- Keeps Phish locked at #2 in the Jam Room.
- Replaces the three static Phish cards with live data.
- Latest Show now resolves from the newest Phish.net setlist.
- What Did They Play? shows up to seven songs from that newest setlist.
- Phish News pulls the newest official stories from Phish.com.
- LivePhish remains one click away.
- Graceful fallbacks keep the section usable if an external site is temporarily unavailable.

INSTALL
1. Extract this ZIP.
2. Open PowerShell in C:\Projects\jaski-homepage
3. Run:
   powershell -ExecutionPolicy Bypass -File <path-to-extracted-pack>\INSTALL_SPRINT_13_11.ps1
4. Refresh http://localhost:3000/jam

FILES
components\PhishFeature.tsx
components\PhishFeature.module.css
app\api\phish-hub\route.ts

NOTES
- Sprint 13.10R should already be installed.
- No media files are touched.
- Existing files replaced by this sprint are backed up under _sprint_backups\13.11_<timestamp>.
