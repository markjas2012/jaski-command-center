import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Item = {
  artist: string;
  title: string;
  venue?: string;
  location?: string;
  date?: string;
  href: string;
  searchHref?: string;
  ageDays?: number;
  fresh?: boolean;
};

const DISCOVERY_ARTISTS = [
  "Billy Strings",
  "The String Cheese Incident",
  "The Disco Biscuits",
  "Joe Russo's Almost Dead",
  "Goose",
  "Umphrey's McGee",
];

const KNOWN_ARTISTS = ["Phish", "Widespread Panic", ...DISCOVERY_ARTISTS];
const FRESH_DAYS = 120;

const URLS = {
  video: "https://www.nugs.net/watch-live-music/",
  audio: "https://www.nugs.net/recentlyadded.html",
};

function decode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();
}

function strip(html: string) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

function absolute(href: string) {
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return `https://www.nugs.net${href}`;
  return `https://www.nugs.net/${href}`;
}

function searchHref(artist: string) {
  return `https://www.nugs.net/search/?q=${encodeURIComponent(artist)}`;
}

function dateTime(raw?: string) {
  if (!raw) return 0;
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return 0;
  const year = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]);
  return new Date(year, Number(m[1]) - 1, Number(m[2])).getTime();
}

function ageDays(raw?: string) {
  const time = dateTime(raw);
  if (!time) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((Date.now() - time) / 86_400_000));
}

function cleanCandidate(value?: string) {
  if (!value) return "";
  return decode(strip(value))
    .replace(/^(buy|listen|download|watch|details|view)\s+/i, "")
    .replace(/\s*[-–—]\s*nugs(?:\.net)?\s*$/i, "")
    .trim();
}

function pickVenue(rawHtml: string, plain: string, artist: string) {
  const attributePatterns = [
    /(?:data-(?:name|title)|aria-label|title)=["']([^"']{4,140})["']/gi,
    /class=["'][^"']*(?:product-name|product-title|tile-name|name)[^"']*["'][^>]*>([\s\S]{0,220}?)<\//gi,
  ];

  const venueWords = /arena|theatre|theater|amphithe(?:atre|ater)|hall|center|centre|club|festival|pavilion|auditorium|ballroom|park|red rocks|brewery|stage|casino|resort|garden|field|stadium|plaza|civic|music hall|event center|event centre|opera house|fairgrounds|beach|pier|academy|tabernacle|fillmore|bowl/i;

  const candidates: string[] = [];
  for (const pattern of attributePatterns) {
    for (const m of rawHtml.matchAll(pattern)) candidates.push(cleanCandidate(m[1]));
  }

  const segments = plain
    .split(/\s{2,}|\s+[|•·]\s+|\s+[–—]\s+/)
    .map(cleanCandidate)
    .filter((x) => x.length >= 4 && x.length <= 120);
  candidates.push(...segments);

  return (
    candidates.find((x) => venueWords.test(x) && !x.toLowerCase().includes(artist.toLowerCase())) || ""
  );
}

function pickLocation(plain: string, venue?: string) {
  const start = venue ? plain.indexOf(venue) : -1;
  const area = start >= 0 ? plain.slice(start + venue!.length, start + venue!.length + 220) : plain;
  const match = area.match(/\b([A-Z][A-Za-z.' -]{2,35}),\s*([A-Z]{2})\b/);
  return match ? `${match[1].trim()}, ${match[2]}` : "";
}

function parseProducts(html: string, artistHint = ""): Item[] {
  const matches = Array.from(
    html.matchAll(/href=["']([^"']*(?:live-download|WEBCASTVARIANT)[^"']*\.html)["']/gi)
  );

  const seen = new Set<string>();
  const out: Item[] = [];

  for (const match of matches) {
    const href = absolute(decode(match[1]));
    if (seen.has(href)) continue;
    seen.add(href);

    const index = match.index ?? 0;
    const rawChunk = html.slice(Math.max(0, index - 1800), index + 2200);
    const chunk = strip(rawChunk);
    const dateMatch = chunk.match(/\b(\d{1,2}\/\d{1,2}\/(?:20)?\d{2})\b/);
    const artist =
      KNOWN_ARTISTS.find((name) => chunk.toLowerCase().includes(name.toLowerCase())) ||
      artistHint ||
      "";

    const venue = pickVenue(rawChunk, chunk, artist);
    const location = pickLocation(chunk, venue);
    const date = dateMatch?.[1];

    out.push({
      artist,
      title: venue || (artist ? `${artist} — recent show` : "Recent nugs show"),
      venue: venue || undefined,
      location: location || undefined,
      date,
      href,
      searchHref: artist ? searchHref(artist) : undefined,
      ageDays: ageDays(date),
      fresh: ageDays(date) <= FRESH_DAYS,
    });

    if (out.length >= 36) break;
  }

  return out;
}

async function fetchText(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.16",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function latestForArtist(artist: string): Promise<Item | null> {
  try {
    const html = await fetchText(searchHref(artist));
    const products = parseProducts(html, artist)
      .filter((item) => !item.artist || item.artist.toLowerCase().includes(artist.toLowerCase()) || artist.toLowerCase().includes(item.artist.toLowerCase()))
      .sort((a, b) => dateTime(b.date) - dateTime(a.date));

    const newestDated = products.find((item) => dateTime(item.date) > 0);
    const selected = newestDated ?? products[0] ?? null;
    if (!selected) return null;

    return {
      ...selected,
      artist,
      searchHref: searchHref(artist),
      ageDays: ageDays(selected.date),
      fresh: ageDays(selected.date) <= FRESH_DAYS,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [videoHtml, audioHtml, ...latest] = await Promise.all([
      fetchText(URLS.video).catch(() => ""),
      fetchText(URLS.audio).catch(() => ""),
      ...DISCOVERY_ARTISTS.map((artist) => latestForArtist(artist)),
    ]);

    const latestMap: Record<string, Item | null> = {};
    DISCOVERY_ARTISTS.forEach((artist, index) => {
      latestMap[artist] = latest[index] ?? null;
    });

    const discovery = DISCOVERY_ARTISTS
      .map((artist) => latestMap[artist])
      .filter((item): item is Item => Boolean(item))
      .sort((a, b) => {
        if (a.fresh !== b.fresh) return a.fresh ? -1 : 1;
        return dateTime(b.date) - dateTime(a.date);
      });

    return NextResponse.json({
      video: videoHtml ? parseProducts(videoHtml).slice(0, 6) : [],
      audio: audioHtml ? parseProducts(audioHtml).slice(0, 6) : [],
      latest: latestMap,
      discovery,
      updatedAt: new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
    });
  } catch {
    return NextResponse.json({
      video: [],
      audio: [],
      latest: Object.fromEntries(DISCOVERY_ARTISTS.map((artist) => [artist, null])),
      discovery: [],
      updatedAt: "",
    });
  }
}
