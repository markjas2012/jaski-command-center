export type BillyShow = { date: string; venue: string; location: string; href: string };
export const BILLY_TOUR = "https://www.billystrings.com/tour/";
export const BILLY_ARCHIVE = "https://billybase.net/";
function clean(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&#8211;|&#x2013;/g, "–").replace(/&amp;/g, "&").replace(/&#39;|&#8217;/g, "’").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
export function parseBillyLatest(html: string, today: string): BillyShow | null {
  const candidates: BillyShow[] = [];
  for (const m of html.matchAll(/<a[^>]+href\s*=\s*["']([^"']*\/show\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = clean(m[2]);
    const nearby = html.slice((m.index || 0) + m[0].length, (m.index || 0) + m[0].length + 300);
    const date = text.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] || nearby.match(/class=["']home-last-show-date["'][^>]*>(\d{4}-\d{2}-\d{2})/)?.[1];
    if (!date || date >= today) continue;
    const title = text.replace(date, "").trim();
    const parts = title.split(/\s+[–—]\s+/);
    if (parts.length < 2) continue;
    candidates.push({ date, venue: parts[0], location: parts.slice(1).join(" – "), href: new URL(m[1], BILLY_ARCHIVE).href });
  }
  return candidates.sort((a,b) => b.date.localeCompare(a.date))[0] || null;
}
export function parseBillyTour(html: string, today: string): BillyShow | null {
  const candidates: BillyShow[] = [];
  const blocks = html.split(/id=["']date\d+["']/i).slice(1);
  for (const block of blocks) {
    const rawDate = clean(block).match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/)?.[0];
    if (!rawDate) continue;
    const time = new Date(rawDate + " 12:00:00 UTC");
    if (Number.isNaN(time.getTime())) continue;
    const date = time.toISOString().slice(0,10);
    const location = clean(block.match(/<div[^>]*class=["'][^"']*\bdebra\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || "");
    const venue = clean(block.match(/<div[^>]*class=["'][^"']*text-xl font-bold[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || "");
    if (date >= today && location && venue) candidates.push({ date, venue, location, href: BILLY_TOUR });
  }
  return candidates.sort((a,b) => a.date.localeCompare(b.date))[0] || null;
}
