import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type HubItem = { title: string; href: string; date?: string; description?: string };

const PODCAST_RSS = "https://rss.art19.com/good-ol-grateful-deadcast";
const DEADCAST_HOME = "https://www.dead.net/deadcast";
const NEWS_HOME = "https://www.dead.net/features/news";

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstTag(block: string, tag: string) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decode(m[1]) : "";
}

function firstLink(block: string) {
  const link = firstTag(block, "link");
  if (link) return link;
  const guid = firstTag(block, "guid");
  return guid.startsWith("http") ? guid : DEADCAST_HOME;
}

async function fetchText(url: string, accept: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 JaskiCommandCenter/12.7", Accept: accept },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parsePodcast(xml: string): HubItem | null {
  const item = xml.match(/<item\b[\s\S]*?<\/item>/i)?.[0];
  if (!item) return null;
  return {
    title: firstTag(item, "title") || "Good Ol' Grateful Deadcast",
    href: firstLink(item),
    date: firstTag(item, "pubDate"),
    description: firstTag(item, "description"),
  };
}

function absoluteDead(href: string) {
  if (href.startsWith("http")) return href;
  return `https://www.dead.net${href.startsWith("/") ? href : `/${href}`}`;
}

function parseNews(html: string): HubItem[] {
  const out: HubItem[] = [];
  const seen = new Set<string>();
  const rx = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(rx)) {
    const href = match[1];
    const title = decode(match[2]);
    if (!href || !title || title.length < 12 || title.length > 140) continue;
    if (!/\/features\//i.test(href) && !/\/news\//i.test(href)) continue;
    if (/^(read more|news|features)$/i.test(title)) continue;
    const absolute = absoluteDead(href);
    if (seen.has(absolute)) continue;
    seen.add(absolute);
    out.push({ title, href: absolute });
    if (out.length >= 3) break;
  }
  return out;
}

export async function GET() {
  const [podcastXml, newsHtml] = await Promise.all([
    fetchText(PODCAST_RSS, "application/rss+xml,application/xml,text/xml").catch(() => ""),
    fetchText(NEWS_HOME, "text/html,application/xhtml+xml").catch(() => ""),
  ]);
  return NextResponse.json({
    podcast: podcastXml ? parsePodcast(podcastXml) : null,
    news: newsHtml ? parseNews(newsHtml) : [],
    podcastHome: DEADCAST_HOME,
    newsHome: NEWS_HOME,
  });
}
