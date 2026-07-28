import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Show = {
  date?: string;
  venue?: string;
  location?: string;
  href: string;
  songs: string[];
};

type News = {
  title: string;
  href: string;
  date?: string;
};

const SETLISTS = "https://phish.net/setlists/";
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
        "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.11",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
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

function showDetails(html: string, href: string, fallbackLabel = "") : Show {
  const plain = decode(html);

  const title =
    decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") ||
    fallbackLabel;

  const titleMatch = title.match(/Phish\s*,?\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*([01]?\d\/[0-3]?\d\/\d{4})\s*[-–—]\s*([^|]+)/i);
  const date = titleMatch?.[1]?.trim() || plain.match(/\b([01]?\d\/[0-3]?\d\/202\d)\b/)?.[1] || "";
  let venue = titleMatch?.[2]?.trim() || "";
  venue = venue.replace(/\s*\|\s*Phish\.net.*$/i, "").trim();

  let location = "";
  if (venue.includes(",")) {
    const parts = venue.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 3) {
      location = parts.slice(-2).join(", ");
      venue = parts.slice(0, -2).join(", ");
    }
  }

  const songs: string[] = [];
  const seen = new Set<string>();

  // Phish.net song links are the most stable signal on individual setlist pages.
  const songRx = /<a[^>]+href=["'][^"']*\/song\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(songRx)) {
    const song = decode(match[1]);
    if (!song || song.length > 80 || seen.has(song.toLowerCase())) continue;
    if (/^(song histories|songs|jam charts)$/i.test(song)) continue;
    seen.add(song.toLowerCase());
    songs.push(song);
    if (songs.length >= 10) break;
  }

  return { date, venue, location, href, songs };
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
        : { href: link.href, songs: [], venue: link.label };
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
