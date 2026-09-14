MIDNIGHT RADIO — Mobile/Desktop V5

Changes:
- Removed the animated reel overlay completely.
- Removed all A/B-side functionality from the web UI.
- Kept the mobile layout direction, but fixed desktop sizing/alignment with a centered responsive player and panels.
- Player uses the optimized player.webp.
- Current cover remains the full-screen background to avoid a second background image request.
- MP3 is loaded only when Play/Next/Previous actually starts playback.
- Current LRC is fetched shortly after the visual layer paints.

Upload/replace only these files in the GitHub repository root:
index.html
style.css
script.js
player.webp

Do not delete or replace:
audio/
covers/
Lyric/
