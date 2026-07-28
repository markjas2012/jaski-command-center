import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Story = {
  title: string;
  source: string;
  href: string;
  date?: string;
  time: number;
  band?: string;
  priority?: boolean;
  score: number;
  fingerprint: string;
};

const feeds = [
  { source: "JamBase", url: "https://www.jambase.com/feed" },
  { source: "Relix", url: "https://relix.com/feed/" },
  { source: "Live For Live Music", url: "https://liveforlivemusic.com/feed/" },
];

const favorites = [
  { label: "Grateful Dead", terms: ["grateful dead", "dead & company", "dead and company", "jerry garcia", "bob weir", "bobby weir"] },
  { label: "Phish", terms: ["phish", "trey anastasio", "page mcconnell", "mike gordon", "jon fishman"] },
  { label: "Widespread Panic", terms: ["widespread panic", "john bell", "jimmy herring"] },
  { label: "Billy Strings", terms: ["billy strings"] },
  { label: "String Cheese", terms: ["string cheese incident", "the string cheese incident"] },
  { label: "Disco Biscuits", terms: ["disco biscuits", "the disco biscuits"] },
  { label: "JRAD", terms: ["joe russo's almost dead", "joe russos almost dead", "jrad"] },
  { label: "Goose", terms: ["goose", "rick mitarotonda"] },
  { label: "Umphrey's", terms: ["umphrey's mcgee", "umphreys mcgee"] },
];

const sceneTerms = [
  "jam band","jam-band","jamband","tour","livestream","live stream","festival","setlist",
  "concert","shows","residency","new year's","new years","album","single","release",
  "collaboration","sit-in","sit in","benefit","reunion","announces","announced",
  "music festival","live music"
];

const weakPatterns = [
  /\bsponsored\b/i,
  /\badvertisement\b/i,
  /\bmerch(?:andise)?\b/i,
  /\bshop now\b/i,
  /\bgiveaway\b/i,
  /\bcontest\b/i,
  /\bphoto gallery\b/i,
];

function clean(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;|&#038;/g, "&")
    .replace(/&#8217;|&apos;|&#39;/g, "'")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function first(text: string, tag: string) {
  const m = text.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? clean(m[1]) : "";
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|a|an|with|and|to|for|of|on|at|in|from|new|shares|share|announces|announced|confirms|reveals)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string) {
  return normalize(value)
    .split(" ")
    .filter((x) => x.length >= 4);
}

function favoriteMatch(title: string) {
  const lower = title.toLowerCase();
  return favorites.find((favorite) =>
    favorite.terms.some((term) => lower.includes(term))
  );
}

function sceneRelevant(title: string) {
  const lower = title.toLowerCase();
  if (favoriteMatch(title)) return true;
  return sceneTerms.some((term) => lower.includes(term));
}

function fingerprint(title: string) {
  const stop = new Set([
    "live","music","tour","show","shows","date","dates","band","concert","festival",
    "announces","announced","shares","confirms","new","with","from","into","after",
    "before","will","their","this","that","more","first","second"
  ]);
  return tokens(title)
    .filter((t) => !stop.has(t))
    .slice(0, 8)
    .sort()
    .join("|");
}

function similarity(a: string, b: string) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared++;
  return shared / Math.min(A.size, B.size);
}

function storyScore(title: string, time: number) {
  const favorite = favoriteMatch(title);
  const ageDays = time ? Math.max(0, (Date.now() - time) / 86400000) : 365;
  const freshness = Math.max(0, 30 - ageDays);
  const sceneBonus = sceneRelevant(title) ? 20 : 0;
  return Math.round((favorite ? 120 : 0) + sceneBonus + freshness);
}

async function getStories(feed: { source: string; url: string }): Promise<Story[]> {
  try {
    const res = await fetch(feed.url, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.18R" },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const items = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/gi))
      .slice(0, 16)
      .map((m) => m[0]);

    return items
      .map((item) => {
        const title = first(item, "title");
        const href = first(item, "link");
        const pubDate = first(item, "pubDate");
        const d = pubDate ? new Date(pubDate) : null;
        const time = d && !Number.isNaN(d.getTime()) ? d.getTime() : 0;
        const favorite = favoriteMatch(title);

        return {
          title,
          source: feed.source,
          href,
          date:
            time > 0
              ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(time))
              : "",
          time,
          band: favorite?.label,
          priority: Boolean(favorite),
          score: storyScore(title, time),
          fingerprint: fingerprint(title),
        };
      })
      .filter((story) => {
        if (!story.title || !story.href) return false;
        if (story.title.length < 18 || story.title.length > 180) return false;
        if (weakPatterns.some((pattern) => pattern.test(story.title))) return false;
        if (!sceneRelevant(story.title)) return false;
        if (story.time > 0 && Date.now() - story.time > 30 * 86400000) return false;
        return true;
      });
  } catch {
    return [];
  }
}

function dedupe(stories: Story[]) {
  const output: Story[] = [];
  const seenUrls = new Set<string>();

  for (const story of stories) {
    const urlKey = story.href.split("?")[0].replace(/\/$/, "");
    if (seenUrls.has(urlKey)) continue;

    const duplicate = output.some((existing) => {
      if (story.fingerprint && existing.fingerprint && story.fingerprint === existing.fingerprint) return true;
      return similarity(story.title, existing.title) >= 0.6;
    });

    if (duplicate) continue;

    seenUrls.add(urlKey);
    output.push(story);
  }

  return output;
}

function chooseStories(stories: Story[]) {
  const unique = dedupe(
    stories.sort((a, b) => b.score - a.score || b.time - a.time)
  );

  const picked: Story[] = [];
  const sourceCounts = new Map<string, number>();

  // Favorites first.
  for (const story of unique.filter((story) => story.priority)) {
    if (picked.length >= 6) break;
    const count = sourceCounts.get(story.source) || 0;
    if (count >= 3) continue;
    picked.push(story);
    sourceCounts.set(story.source, count + 1);
  }

  // Then genuinely relevant scene stories.
  for (const story of unique.filter((story) => !story.priority)) {
    if (picked.length >= 6) break;
    const count = sourceCounts.get(story.source) || 0;
    if (count >= 2) continue;
    picked.push(story);
    sourceCounts.set(story.source, count + 1);
  }

  return picked.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    return b.time - a.time;
  });
}

export async function GET() {
  const groups = await Promise.all(feeds.map(getStories));
  const selected = chooseStories(groups.flat());

  return NextResponse.json({
    updatedAt: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date()),
    stories: selected.map(({ score, time, fingerprint, ...story }) => story),
  });
}
