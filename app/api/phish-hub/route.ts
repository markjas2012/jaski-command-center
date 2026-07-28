import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SetBlock = { label: string; songs: string[] };
type Show = {
  date?: string;
  venue?: string;
  location?: string;
  href: string;
  songs: string[];
  sets: SetBlock[];
  source?: string;
};
type News = { title: string; href: string; date?: string };

const PHISHIN_API = "https://phish.in/api/v2/shows";
const PHISHIN = "https://phish.in";
const PHISHNET_SETLISTS = "https://phish.net/setlists/phish";
const NEWS = "https://phish.com/news/";
const LIVEPHISH = "https://www.livephish.com/";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    const out = text(value);
    if (out) return out;
  }
  return "";
}

function arrayOfRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord).filter(Boolean) as Record<string, unknown>[] : [];
}

function normalizeDate(value: string): string {
  if (!value) return "";
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[2]}/${iso[3]}/${iso[1]}`;
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (us) return `${us[1].padStart(2,"0")}/${us[2].padStart(2,"0")}/${us[3]}`;
  return value;
}

function isoDate(value: string): string {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (us) return `${us[3]}-${us[1].padStart(2,"0")}-${us[2].padStart(2,"0")}`;
  return "";
}

function showHref(date: string): string {
  const iso = isoDate(date);
  return iso ? `${PHISHIN}/${iso}` : PHISHIN;
}

function setLabel(raw: unknown): string {
  const value = firstText(raw).toUpperCase();
  if (!value) return "SETLIST";
  if (value === "1" || value === "SET1" || value === "SET 1") return "SET 1";
  if (value === "2" || value === "SET2" || value === "SET 2") return "SET 2";
  if (value === "3" || value === "SET3" || value === "SET 3") return "SET 3";
  if (value === "E" || value === "ENCORE" || value === "ENCORE 1") return "ENCORE";
  if (value === "E2" || value === "ENCORE 2") return "ENCORE 2";
  if (value === "S" || value === "SOUNDCHECK") return "SOUNDCHECK";
  return value;
}

function locationFromVenue(venueObj: Record<string, unknown> | null, showObj: Record<string, unknown>): string {
  const city = firstText(
    venueObj?.city,
    venueObj?.city_name,
    showObj.city,
    showObj.city_name,
  );
  const region = firstText(
    venueObj?.state,
    venueObj?.state_code,
    venueObj?.province,
    venueObj?.region,
    showObj.state,
    showObj.state_code,
  );
  const country = firstText(venueObj?.country, venueObj?.country_name, showObj.country);
  if (city && region) return `${city}, ${region}`;
  if (city && country && !/united states|usa|us/i.test(country)) return `${city}, ${country}`;
  return city || region || country || firstText(showObj.location, showObj.venue_location);
}

function trackTitle(track: Record<string, unknown>): string {
  const song = asRecord(track.song);
  return firstText(track.title, track.song_name, track.name, song?.title, song?.name);
}

function buildSets(tracks: Record<string, unknown>[]): SetBlock[] {
  const ordered = [...tracks].sort((a, b) => {
    const ap = Number(a.position ?? a.track_position ?? 0);
    const bp = Number(b.position ?? b.track_position ?? 0);
    return ap - bp;
  });
  const map = new Map<string, string[]>();
  for (const track of ordered) {
    const title = trackTitle(track);
    if (!title) continue;
    const label = setLabel(track.set ?? track.set_name ?? track.set_number ?? track.section);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(title);
  }
  return [...map.entries()].map(([label, songs]) => ({ label, songs }));
}

function extractPayloadArray(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return arrayOfRecords(payload);
  const root = asRecord(payload);
  if (!root) return [];
  for (const key of ["data", "shows", "results", "items"]) {
    const list = arrayOfRecords(root[key]);
    if (list.length) return list;
  }
  const dataObj = asRecord(root.data);
  if (dataObj) {
    for (const key of ["shows", "results", "items"]) {
      const list = arrayOfRecords(dataObj[key]);
      if (list.length) return list;
    }
  }
  return [];
}

function showDateValue(show: Record<string, unknown>): string {
  return firstText(show.date, show.show_date, show.showdate, show.performance_date);
}

function compareShowDate(a: Record<string, unknown>, b: Record<string, unknown>): number {
  return showDateValue(b).localeCompare(showDateValue(a));
}

function normalizeApiShow(showObj: Record<string, unknown>): Show | null {
  const rawDate = showDateValue(showObj);
  if (!rawDate) return null;

  const venueObj = asRecord(showObj.venue);
  const venue = firstText(
    venueObj?.name,
    venueObj?.venue_name,
    showObj.venue_name,
    typeof showObj.venue === "string" ? showObj.venue : "",
  );
  const location = locationFromVenue(venueObj, showObj);

  let tracks = arrayOfRecords(showObj.tracks);
  if (!tracks.length) tracks = arrayOfRecords(showObj.performances);
  if (!tracks.length) tracks = arrayOfRecords(showObj.setlist);

  const sets = buildSets(tracks);
  const songs = sets.flatMap((set) => set.songs);

  return {
    date: normalizeDate(rawDate),
    venue,
    location,
    href: firstText(showObj.url, showObj.href, showObj.permalink) || showHref(rawDate),
    songs,
    sets,
    source: "Phish.in API v2",
  };
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "JaskiCommandCenter/13.13" },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.13" },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

async function latestFromApi(): Promise<Show | null> {
  const urls = [
    `${PHISHIN_API}?order_by=date&direction=desc&limit=5`,
    `${PHISHIN_API}?sort_attr=date&sort_dir=desc&per_page=5&page=1`,
    PHISHIN_API,
  ];

  for (const url of urls) {
    try {
      const payload = await fetchJson(url);
      const shows = extractPayloadArray(payload).sort(compareShowDate);
      if (!shows.length) continue;
      const latestObj = shows[0];
      let latest = normalizeApiShow(latestObj);
      if (!latest) continue;

      // Some list endpoints omit track/setlist details. Try common detail forms.
      if (!latest.songs.length) {
        const id = firstText(latestObj.id, latestObj.show_id, latestObj.slug);
        const iso = isoDate(showDateValue(latestObj));
        const candidates = [
          id ? `${PHISHIN_API}/${encodeURIComponent(id)}` : "",
          iso ? `${PHISHIN_API}/${iso}` : "",
          iso ? `${PHISHIN_API}?date=${iso}` : "",
        ].filter(Boolean);

        for (const detailUrl of candidates) {
          try {
            const detail = await fetchJson(detailUrl);
            const root = asRecord(detail);
            const records = extractPayloadArray(detail);
            const detailObj = records[0] || asRecord(root?.data) || root;
            if (!detailObj) continue;
            const richer = normalizeApiShow(detailObj);
            if (richer) {
              latest = {
                ...latest,
                ...richer,
                venue: richer.venue || latest.venue,
                location: richer.location || latest.location,
                href: richer.href || latest.href,
                source: "Phish.in API v2",
              };
            }
            if (latest.songs.length && latest.venue && latest.location) break;
          } catch { /* try next detail shape */ }
        }
      }

      return latest;
    } catch { /* try next query form */ }
  }
  return null;
}

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&gt;/g, ">").replace(/&lt;/g, "<")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parsePhishInShowPage(html: string, dateHint = ""): Show | null {
  const plain = decode(html);
  const dateText = plain.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4}\b/i)?.[0] || dateHint;
  let date = dateHint;
  if (dateText && !/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    const parsed = new Date(dateText);
    if (!Number.isNaN(parsed.valueOf())) date = parsed.toISOString().slice(0, 10);
  }

  const titlePos = plain.indexOf(dateText);
  const after = titlePos >= 0 ? plain.slice(titlePos + dateText.length) : plain;
  const setPos = after.search(/\bSet\s+1\b/i);
  const header = (setPos >= 0 ? after.slice(0, setPos) : after.slice(0, 350)).trim();
  const headerLines = header.split(/\s{2,}|\n/).map((s) => s.trim()).filter(Boolean);

  // HTML heading order on Phish.in is date, venue, location. Prefer structured heading text.
  const headings = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((m) => decode(m[1])).filter(Boolean);
  let venue = "";
  let location = "";
  const dateIndex = headings.findIndex((h) => /\b\d{4}\b/.test(h) && /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(h));
  if (dateIndex >= 0) {
    venue = headings[dateIndex + 1] || "";
    location = headings[dateIndex + 2] || "";
  }
  if (!venue && headerLines.length) venue = headerLines[0];
  if (!location && headerLines.length > 1) location = headerLines[1];

  const sets: SetBlock[] = [];
  const markerRx = /\b(Set\s+[123]|Encore(?:\s+2)?|Soundcheck)\b/gi;
  const markers = [...plain.matchAll(markerRx)];
  for (let i = 0; i < markers.length; i++) {
    const start = (markers[i].index ?? 0) + markers[i][0].length;
    const end = i + 1 < markers.length ? (markers[i + 1].index ?? plain.length) : plain.length;
    const chunk = plain.slice(start, end);
    const songs: string[] = [];
    // Phish.in's show page includes durations/metadata after song names. We use linked song labels from matching HTML slice when possible.
    const htmlApproxStart = Math.max(0, Math.floor((start / Math.max(1, plain.length)) * html.length) - 1000);
    const htmlApproxEnd = Math.min(html.length, Math.ceil((end / Math.max(1, plain.length)) * html.length) + 1000);
    const fragment = html.slice(htmlApproxStart, htmlApproxEnd);
    for (const m of fragment.matchAll(/<a[^>]+href=["']\/\d{4}-\d{2}-\d{2}\/[^"'#?]+["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const name = decode(m[1]);
      if (name && name.length < 100 && !songs.includes(name) && !/previous show|next show/i.test(name)) songs.push(name);
    }
    if (songs.length) sets.push({ label: setLabel(markers[i][0]), songs });
  }

  return {
    date: normalizeDate(date),
    venue,
    location,
    href: date ? `${PHISHIN}/${isoDate(date) || date}` : PHISHIN,
    songs: sets.flatMap((set) => set.songs),
    sets,
    source: "Phish.in",
  };
}

async function enrichFromPhishInPage(show: Show | null): Promise<Show | null> {
  if (!show?.date) return show;
  const iso = isoDate(show.date);
  if (!iso) return show;
  try {
    const html = await fetchText(`${PHISHIN}/${iso}`);
    const page = parsePhishInShowPage(html, iso);
    if (!page) return show;
    return {
      ...show,
      venue: show.venue || page.venue,
      location: show.location || page.location,
      sets: show.sets.length ? show.sets : page.sets,
      songs: show.songs.length ? show.songs : page.songs,
      href: page.href || show.href,
      source: show.songs.length && show.venue && show.location ? show.source : "Phish.in API v2 + show page",
    };
  } catch {
    return show;
  }
}

function parseNews(html: string): News[] {
  const out: News[] = [];
  const seen = new Set<string>();
  const rx = /<a[^>]+href=["']([^"']*\/news\/[^"'#?]+\/?)['"][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(rx)) {
    const href = new URL(match[1], NEWS).toString();
    const title = decode(match[2]);
    if (!title || title.length < 8 || title.length > 160 || /^(read more|news|older|newer)$/i.test(title) || seen.has(href)) continue;
    seen.add(href);
    const index = match.index ?? 0;
    const nearby = decode(html.slice(Math.max(0, index - 700), index + 900));
    const date = nearby.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},\s+202\d\b/i)?.[0];
    out.push({ title, href, date });
    if (out.length >= 3) break;
  }
  return out;
}

export async function GET() {
  const [apiLatest, newsHtml] = await Promise.all([
    latestFromApi().catch(() => null),
    fetchText(NEWS).catch(() => ""),
  ]);

  const latest = await enrichFromPhishInPage(apiLatest);

  return NextResponse.json({
    latest,
    news: newsHtml ? parseNews(newsHtml) : [],
    links: {
      setlists: latest?.href || PHISHNET_SETLISTS,
      news: NEWS,
      livePhish: LIVEPHISH,
      tour: "https://phish.com/tours/",
    },
    updatedAt: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date()),
  });
}
