import { gamingNewsPriority } from "./gaming-preferences";
export type GamingNews = { source: string; label: string; headline: string; summary: string; href: string; image: string | null; artLabel: string; published: number };
const sources = [
  { source: "XBOX", url: "https://news.xbox.com/en-us/feed/", href: "https://news.xbox.com/en-us/" },
  { source: "PLAYSTATION", url: "https://blog.playstation.com/feed/", href: "https://blog.playstation.com/" },
];
function decode(value: string): string {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n: string) => { const code = n[0].toLowerCase() === "x" ? parseInt(n.slice(1),16) : +n; return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ""; }).replace(/&nbsp;/g," ");
}
function text(value: string) { return decode(value).replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim(); }
function tag(xml: string, name: string) { return xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,"i"))?.[1] || ""; }
function safeUrl(value: string) { try { const u = new URL(decode(value)); return u.protocol === "https:" ? u.href : null; } catch { return null; } }
export function parseGamingFeed(xml: string, source: string, now = Date.now()): GamingNews[] {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].flatMap((match) => {
    const item = match[1], headline = text(tag(item,"title")), href = safeUrl(text(tag(item,"link")));
    const published = Date.parse(text(tag(item,"pubDate")));
    if (!headline || !href || !Number.isFinite(published) || published > now + 3600000 || now-published > 14*86400000) return [];
    const categories = [...item.matchAll(/<category\b[^>]*>([\s\S]*?)<\/category>/gi)].map((match) => text(match[1])).join(" ");
    if (!gamingNewsPriority(headline, categories)) return [];
    const content = decode(tag(item,"content:encoded") || tag(item,"description"));
    const image = safeUrl(item.match(/<media:(?:content|thumbnail)[^>]*url=["']([^"']+)["']/i)?.[1] || content.match(/<img[^>]*src=["']([^"']+)["']/i)?.[1] || "");
    return [{ source, headline, href, published, image, summary: text(tag(item,"description")).slice(0,180), label: "LATEST NEWS", artLabel: new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"America/Chicago"}).format(new Date(published)) }];
  }).sort((a,b) => b.published-a.published);
}
export async function getGamingNews(): Promise<GamingNews[]> {
  const results = await Promise.allSettled(sources.map(async (source) => {
    const res = await fetch(source.url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(7000) });
    if (!res.ok) throw new Error("Gaming news source unavailable");
    return parseGamingFeed(await res.text(),source.source);
  }));
  const items = results.flatMap((r) => r.status === "fulfilled" ? r.value : []).sort((a,b) => b.published-a.published);
  const seen = new Set<string>();
  const unique = items.filter((item) => { if (seen.has(item.href)) return false; seen.add(item.href); return true; }).slice(0,3);
  return unique.length ? unique : sources.map((source) => ({ source:source.source, headline:`Open ${source.source === "XBOX" ? "Xbox Wire" : "PlayStation Blog"}`, summary:"No matching major-game, fighting, sports, or hardware headlines are available right now. Open the source for more news.", href:source.href, image:null, label:"OPEN SOURCE", artLabel:"NO MATCHING HEADLINES", published:0 }));
}

