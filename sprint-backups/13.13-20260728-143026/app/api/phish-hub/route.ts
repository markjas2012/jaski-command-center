import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SetBlock = {
  label: string;
  songs: string[];
};

type Show = {
  date?: string;
  venue?: string;
  location?: string;
  href: string;
  songs: string[];
  sets: SetBlock[];
};

type News = {
  title: string;
  href: string;
  date?: string;
};

const SETLISTS = "https://phish.net/setlists/phish";
const NEWS = "https://phish.com/news/";
const LIVEPHISH = "https://www.livephish.com/";

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&#x2013;/g, "–")
    .replace(/&#8212;|&#x2014;/g, "—")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absolute(base: string, href: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

async function fetchText(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.12R",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function dateFromHref(href: string) {
  const slug = href.match(/phish-([a-z]+)-(\d{1,2})-(\d{4})/i);
  if (!slug) return "";
  const months: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  const month = months[slug[1].toLowerCase()];
  if (!month) return "";
  return `${String(month).padStart(2, "0")}/${String(Number(slug[2])).padStart(2, "0")}/${slug[3]}`;
}

function latestSetlistLink(html: string) {
  const rx = /<a[^>]+href=["']([^"']*\/setlists\/phish-[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(rx)) {
    const href = absolute(SETLISTS, match[1]);
    const label = decode(match[2]);
    if (!href || !/\/setlists\/phish-/i.test(href)) continue;
    return { href, label };
  }
  return null;
}

function songLinks(fragment: string) {
  const songs: string[] = [];
  const seen = new Set<string>();
  const rx = /<a[^>]+href=["'][^"']*\/song\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of fragment.matchAll(rx)) {
    const song = decode(match[1]);
    const key = song.toLowerCase();
    if (!song || song.length > 90 || seen.has(key)) continue;
    if (/^(song histories|songs|jam charts)$/i.test(song)) continue;
    seen.add(key);
    songs.push(song);
  }
  return songs;
}

function extractSets(html: string): SetBlock[] {
  const markers = [...html.matchAll(/(?:SET\s+\d+|ENCORE)\s*:/gi)];
  const blocks: SetBlock[] = [];

  for (let index = 0; index < markers.length; index += 1) {
    const marker = markers[index];
    const start = marker.index ?? 0;
    const end = index + 1 < markers.length ? (markers[index + 1].index ?? html.length) : Math.min(html.length, start + 12000);
    const label = decode(marker[0]).replace(/:$/, "").toUpperCase();
    const songs = songLinks(html.slice(start, end));
    if (songs.length) blocks.push({ label, songs });
    if (blocks.length >= 4) break;
  }

  return blocks;
}

function extractVenueAndLocation(html: string) {
  let venue = "";
  let location = "";
  let venueEnd = 0;

  // Individual Phish.net show pages link the venue. This is much more reliable than the page title.
  const venueAnchor = html.match(/<a[^>]+href=["'][^"']*\/venue\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/i);
  if (venueAnchor) {
    venue = decode(venueAnchor[1]);
    venueEnd = (venueAnchor.index ?? 0) + venueAnchor[0].length;
  }

  // Extra fallbacks for layout/class changes.
  if (!venue) {
    const classVenue = html.match(/<[^>]+class=["'][^"']*(?:setlist-venue|venue-name)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
    venue = decode(classVenue?.[1] || "");
    venueEnd = classVenue ? (classVenue.index ?? 0) + classVenue[0].length : 0;
  }

  const nearby = decode(html.slice(venueEnd, Math.min(html.length, venueEnd + 1800)));
  const locationMatch = nearby.match(/\b([A-Z][A-Za-zÀ-ÿ.'’&\- ]{1,60},\s*(?:[A-Z]{2}|[A-Za-zÀ-ÿ.'’&\- ]{3,40})(?:,\s*[A-Za-zÀ-ÿ.'’&\- ]{3,40})?)\b/);
  if (locationMatch) location = locationMatch[1].trim();

  // If a venue string itself includes the location, split it cleanly.
  if (!location && venue.includes(",")) {
    const parts = venue.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 3) {
      location = parts.slice(-2).join(", ");
      venue = parts.slice(0, -2).join(", ");
    }
  }

  return { venue, location };
}

function showDetails(html: string, href: string, fallbackLabel = ""): Show {
  const plain = decode(html);
  const title =
    decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") ||
    fallbackLabel;

  const date =
    title.match(/\b([01]?\d\/[0-3]?\d\/202\d)\b/)?.[1] ||
    plain.match(/\b([01]?\d\/[0-3]?\d\/202\d)\b/)?.[1] ||
    dateFromHref(href);

  const { venue, location } = extractVenueAndLocation(html);
  const sets = extractSets(html);
  const songs = sets.length
    ? sets.flatMap((set) => set.songs)
    : songLinks(html).slice(0, 30);

  return { date, venue, location, href, songs, sets };
}

function parseNews(html: string): News[] {
  const out: News[] = [];
  const seen = new Set<string>();
  const rx = /<a[^>]+href=["']([^"']*\/news\/[^"'#?]+\/?)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(rx)) {
    const href = absolute(NEWS, match[1]);
    const title = decode(match[2]);
    if (!title || title.length < 8 || title.length > 160) continue;
    if (/^(read more|news|older|newer)$/i.test(title)) continue;
    if (seen.has(href)) continue;
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
  const [indexHtml, newsHtml] = await Promise.all([
    fetchText(SETLISTS).catch(() => ""),
    fetchText(NEWS).catch(() => ""),
  ]);

  let latest: Show | null = null;
  if (indexHtml) {
    const link = latestSetlistLink(indexHtml);
    if (link) {
      const detailHtml = await fetchText(link.href).catch(() => "");
      latest = detailHtml
        ? showDetails(detailHtml, link.href, link.label)
        : { href: link.href, songs: [], sets: [], venue: link.label, date: dateFromHref(link.href) };
    }
  }

  return NextResponse.json({
    latest,
    news: newsHtml ? parseNews(newsHtml) : [],
    links: {
      setlists: SETLISTS,
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
