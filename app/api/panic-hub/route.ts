import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SetBlock = { label: string; songs: string[] };
type Show = { date?: string; venue?: string; location?: string; href: string; songs: string[]; sets: SetBlock[]; source?: string };
type News = { title: string; href: string; date?: string };

const SITE = "https://widespreadpanic.com";
const PAST = `${SITE}/shows/past/`;
const NEWS = `${SITE}/news/`;
const EC = "https://www.everydaycompanion.com/setlists/mostrecent.asp";
const NUGS = "https://www.nugs.net/widespread-panic-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/";

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.14" },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.text();
  } finally { clearTimeout(timer); }
}

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&gt;/g, ">").replace(/&lt;/g, "<")
    .replace(/&#8217;|&#x2019;/g, "’").replace(/&#8211;|&#x2013;/g, "–")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function absolute(href: string, base = SITE): string {
  try { return new URL(href, base).toString(); } catch { return base; }
}

function prettyDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : iso;
}

function setLabel(raw: string): string {
  const v = raw.trim().toUpperCase();
  if (v === "1" || v === "SET 1") return "SET 1";
  if (v === "2" || v === "SET 2") return "SET 2";
  if (v === "3" || v === "SET 3") return "SET 3";
  if (v === "E" || v === "ENCORE") return "ENCORE";
  if (v === "E2" || v === "ENCORE 2") return "ENCORE 2";
  return v || "SETLIST";
}

function latestShowLink(html: string): { date: string; href: string } | null {
  const matches = [...html.matchAll(/href=["']([^"']*\/shows\/(\d{4}-\d{2}-\d{2})-[^"']+)["']/gi)]
    .map((m) => ({ href: absolute(m[1]), date: m[2] }));
  if (!matches.length) return null;
  const today = new Date().toISOString().slice(0, 10);
  return matches.filter((x) => x.date <= today).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
}

function parseOfficialShow(html: string, href: string, dateHint: string): Show | null {
  const h1 = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const venue = h1 && !/widespread panic/i.test(h1) ? h1 : decode(html.match(/<h[2-4][^>]*class=["'][^"']*(?:title|venue)[^"']*["'][^>]*>([\s\S]*?)<\/h[2-4]>/i)?.[1] || "");
  const plain = decode(html);

  // Official show pages expose a street address directly after the venue heading.
  let location = "";
  const cityState = plain.match(/\b([A-Z][A-Za-z .'-]+),\s*([A-Z]{2})\s+\d{5}(?:-\d{4})?\b/);
  if (cityState) location = `${cityState[1].trim()}, ${cityState[2]}`;
  if (!location) {
    const loc = plain.match(/\b([A-Z][A-Za-z .'-]+),\s*([A-Z]{2}),?\s*(?:United States|USA|US)\b/);
    if (loc) location = `${loc[1].trim()}, ${loc[2]}`;
  }

  // Parse the official setlist by walking the HTML after its Setlist heading and collecting list items.
  const setHeading = html.search(/>\s*Setlist\s*</i);
  const sectionHtml = setHeading >= 0 ? html.slice(setHeading, Math.min(html.length, setHeading + 30000)) : html;
  const items = [...sectionHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => decode(m[1])).filter(Boolean);
  const sets: SetBlock[] = [];
  let current: SetBlock | null = null;
  for (const item of items) {
    const marker = item.match(/^(?:Set\s*)?(1|2|3)$|^(E|Encore|Encore 2)$/i);
    if (marker) {
      current = { label: setLabel(marker[1] || marker[2] || item), songs: [] };
      sets.push(current);
      continue;
    }
    const song = item.replace(/^\d+\s+/, "").trim();
    if (!song || /show photos|ticket|rsvp|stream|download|more info/i.test(song)) continue;
    if (!current) {
      current = { label: "SET 1", songs: [] };
      sets.push(current);
    }
    if (song.length < 140 && !current.songs.includes(song)) current.songs.push(song);
  }

  // Some WP templates render the set number and song number as plain divs instead of li elements.
  if (!sets.some((s) => s.songs.length)) {
    const setText = decode(sectionHtml).split(/Show Photos|Related|Tickets/i)[0];
    const markers = [...setText.matchAll(/(?:^|\s)(1|2|3|E)\s+(?=\d+\s)/g)];
    for (let i = 0; i < markers.length; i++) {
      const start = (markers[i].index ?? 0) + markers[i][0].length;
      const end = i + 1 < markers.length ? (markers[i + 1].index ?? setText.length) : setText.length;
      const chunk = setText.slice(start, end);
      const songs = [...chunk.matchAll(/(?:^|\s)\d+\s+(.+?)(?=(?:\s+\d+\s+)|$)/g)].map((m) => m[1].trim()).filter((s) => s && s.length < 120);
      if (songs.length) sets.push({ label: setLabel(markers[i][1]), songs });
    }
  }

  const cleaned = sets.filter((set) => set.songs.length);
  if (!venue && !cleaned.length) return null;
  return { date: prettyDate(dateHint), venue, location, href, sets: cleaned, songs: cleaned.flatMap((s) => s.songs), source: "WidespreadPanic.com" };
}

function parseEverydayCompanion(html: string): Show | null {
  const plain = decode(html);
  const date = plain.match(/\b(\d{2})\/(\d{2})\/(\d{2})\b/) || plain.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const venueMatch = title.match(/-\s*\d{2}\/\d{2}\/\d{2,4}\s+(.+)$/);
  let dateValue = "";
  if (date) {
    const year = date[3].length === 2 ? `20${date[3]}` : date[3];
    dateValue = `${date[1]}/${date[2]}/${year}`;
  }
  const songs = [...html.matchAll(/<a[^>]+href=["'][^"']*(?:song|songs)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => decode(m[1])).filter((s) => s && s.length < 100);
  return dateValue || songs.length ? { date: dateValue, venue: venueMatch?.[1]?.trim() || "", location: "", href: EC, songs: [...new Set(songs)], sets: [], source: "Everyday Companion" } : null;
}

function parseNews(html: string): News[] {
  const out: News[] = [];
  const seen = new Set<string>();
  const anchors = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  for (const match of anchors) {
    const title = decode(match[2]);
    const href = absolute(match[1]);
    if (!title || title.length < 7 || title.length > 140 || !href.startsWith(SITE) || /read more|more|news$/i.test(title)) continue;
    if (!/\/news\//i.test(href) && !/\/20\d{2}\//.test(href)) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const around = html.slice(Math.max(0, (match.index ?? 0) - 500), (match.index ?? 0) + match[0].length + 200);
    const d = decode(around).match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\b/i)?.[0];
    out.push({ title, href, date: d });
    if (out.length >= 6) break;
  }
  return out;
}

async function getLatest(): Promise<Show | null> {
  try {
    const pastHtml = await fetchText(PAST);
    const link = latestShowLink(pastHtml);
    if (link) {
      try {
        const showHtml = await fetchText(link.href);
        const show = parseOfficialShow(showHtml, link.href, link.date);
        if (show) return show;
      } catch { /* fall through */ }
    }
  } catch { /* fall through */ }
  try { return parseEverydayCompanion(await fetchText(EC)); } catch { return null; }
}

export async function GET() {
  const [latest, news] = await Promise.all([
    getLatest(),
    fetchText(NEWS).then(parseNews).catch(() => [] as News[]),
  ]);

  return NextResponse.json({
    latest,
    news,
    links: { shows: PAST, news: NEWS, nugs: NUGS, archive: EC },
    updatedAt: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
  }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
