import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const BUILD = "17.26a";

const TMDB_BASE = "https://api.themoviedb.org/3";

type TmdbTitle = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  media_type?: "movie" | "tv";
};

type Story = {
  title: string;
  link: string;
  source?: string;
  date?: string;
};

type FeatureItem = {
  lane: "WATCH" | "LISTEN" | "EXPLORE";
  title: string;
  detail: string;
  href: string;
  source?: string;
  date?: string;
};

type ExploreTopic = {
  label: string;
  query: string;
  terms: string[];
};

const TRUSTED_SOURCE_BOOSTS: Record<string, number> = {
  "reuters": 14,
  "associated press": 14,
  "ap news": 14,
  "variety": 14,
  "deadline": 14,
  "the hollywood reporter": 13,
  "hollywood reporter": 13,
  "indiewire": 12,
  "vulture": 11,
  "entertainment weekly": 11,
  "rolling stone": 10,
  "jambase": 14,
  "relix": 13,
  "live for live music": 12,
  "ign": 10,
  "engadget": 10,
  "the verge": 11,
  "polygon": 10,
  "espn": 12,
  "pga tour": 12,
  "golf digest": 10,
  "golfweek": 9,
  "the athletic": 11,
  "st. louis post-dispatch": 11,
  "stltoday": 11,
  "jambands.com": 13,
};

const JUNK_TERMS = [
  "newsletter",
  "sale",
  "deal",
  "coupon",
  "gift guide",
  "sponsored",
  "shopping",
  "buy now",
  "best deals",
  "promo code",
  "prime day",
  "where to buy",
  "affiliate",
  "review roundup",
  "explained ending",
  "every movie and show",
];

const LISTEN_BOOST = [
  "grateful dead",
  "dead & company",
  "phish",
  "umphrey",
  "jam band",
  "jamband",
  "concert",
  "tour",
  "live music",
  "setlist",
  "festival",
  "album",
  "new music",
];

const EXPLORE_ROTATION: ExploreTopic[] = [
  {
    label: "GOLF",
    query: '("PGA Tour" OR golf OR "major championship") when:7d',
    terms: ["pga", "golf", "major", "tour"],
  },
  {
    label: "OHIO STATE",
    query: '("Ohio State football" OR Buckeyes) when:7d',
    terms: ["ohio state", "buckeyes"],
  },
  {
    label: "MIZZOU",
    query: '("Missouri Tigers" OR Mizzou) when:7d',
    terms: ["missouri", "mizzou", "tigers"],
  },
  {
    label: "BOOKS",
    query: '("spy thriller" OR espionage novel OR "new thriller book") when:14d',
    terms: ["spy", "thriller", "espionage", "novel", "book"],
  },
  {
    label: "GAMING",
    query: '("Mortal Kombat" OR Xbox OR "video game") when:7d',
    terms: ["mortal kombat", "xbox", "gaming", "video game"],
  },
  {
    label: "LOST",
    query: '("LOST TV" OR Dharma OR "Lost series") when:30d',
    terms: ["lost", "dharma"],
  },
  {
    label: "BBQ",
    query: '("BBQ recipe" OR grilling OR barbecue) when:7d',
    terms: ["bbq", "grill", "barbecue", "recipe"],
  },
];

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function tag(item: string, name: string) {
  const match = item.match(
    new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i")
  );
  return match ? decode(match[1]) : "";
}

function parse(xml: string): Story[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const raw = match[1];
      const sourceMatch = raw.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
      return {
        title: tag(raw, "title").replace(/\s+-\s+[^-]+$/, "").trim(),
        link: tag(raw, "link"),
        date: tag(raw, "pubDate"),
        source: sourceMatch ? decode(sourceMatch[1]) : "",
      };
    })
    .filter((story) => story.title && story.link);
}

async function news(query: string) {
  const url =
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
    `&hl=en-US&gl=US&ceid=US:en`;

  const res = await fetch(url, {
    headers: { "User-Agent": "JaskiHomepage/11.8.2" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Featured RSS returned ${res.status}`);
  return parse(await res.text());
}

function sourceName(story: Story) {
  return (story.source || "").trim().toLowerCase();
}

function sourceBoost(story: Story) {
  const source = sourceName(story);
  let boost = 0;
  for (const [name, points] of Object.entries(TRUSTED_SOURCE_BOOSTS)) {
    if (source.includes(name)) boost = Math.max(boost, points);
  }
  return boost;
}

function ageHours(date?: string) {
  if (!date) return 999;
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return 999;
  return Math.max(0, (Date.now() - time) / 3_600_000);
}

function isJunk(story: Story) {
  const haystack = `${story.title} ${story.source || ""}`.toLowerCase();
  return JUNK_TERMS.some((term) => haystack.includes(term));
}

function scoreStory(story: Story, boosts: string[]) {
  const haystack = `${story.title} ${story.source || ""}`.toLowerCase();
  let score = sourceBoost(story);

  for (const term of boosts) {
    if (haystack.includes(term)) score += 8;
  }

  const hours = ageHours(story.date);
  if (hours <= 18) score += 18;
  else if (hours <= 48) score += 13;
  else if (hours <= 96) score += 8;
  else if (hours <= 168) score += 3;
  else if (hours <= 336) score -= 3;
  else score -= 10;

  if (story.title.length >= 35 && story.title.length <= 105) score += 3;
  if (story.title.length > 125) score -= 7;

  const clickbait = ["you won't believe", "what happens next", "fans are shocked", "breaks the internet"];
  if (clickbait.some((term) => haystack.includes(term))) score -= 18;

  return score;
}

function ranked(stories: Story[], boosts: string[]) {
  return stories
    .filter((story) => !isJunk(story))
    .sort((a, b) => scoreStory(b, boosts) - scoreStory(a, boosts));
}

function normalizedTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleWords(title: string) {
  return new Set(normalizedTitle(title).split(" ").filter((w) => w.length > 3));
}

function similarity(a: string, b: string) {
  const aw = titleWords(a);
  const bw = titleWords(b);
  if (!aw.size || !bw.size) return 0;
  let shared = 0;
  for (const word of aw) if (bw.has(word)) shared++;
  return shared / Math.max(aw.size, bw.size);
}

function chooseDistinct(stories: Story[], boosts: string[], usedTitles: string[]) {
  const options = ranked(stories, boosts);
  for (const story of options) {
    if (!usedTitles.some((used) => similarity(used, story.title) >= 0.5)) {
      return story;
    }
  }
  return options[0];
}

function utcDayIndex() {
  const now = new Date();
  const dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor(dayStart / 86_400_000);
}

function tmdbHeaders(): HeadersInit | undefined {
  const token = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  return token ? { Authorization: `Bearer ${token}`, accept: "application/json" } : undefined;
}

function tmdbApiKey(): string | undefined {
  return process.env.TMDB_API_KEY?.trim() || undefined;
}

async function tmdb<T>(path: string): Promise<T | null> {
  const headers = tmdbHeaders();
  const apiKey = tmdbApiKey();
  if (!headers && !apiKey) return null;

  const separator = path.includes("?") ? "&" : "?";
  const url = apiKey
    ? `${TMDB_BASE}${path}${separator}api_key=${encodeURIComponent(apiKey)}`
    : `${TMDB_BASE}${path}`;

  try {
    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function tmdbWatchScore(item: TmdbTitle) {
  const votes = Math.log10((item.vote_count ?? 0) + 1);
  const rating = (item.vote_average ?? 0) * Math.min(1, votes / 2.5);
  return (item.popularity ?? 0) + rating * 4;
}

async function dailyWatchPick(): Promise<FeatureItem | null> {
  const data = await tmdb<{ results: TmdbTitle[] }>(
    "/trending/all/day?language=en-US"
  );

  const candidates = (data?.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .filter((item) => Boolean(item.title || item.name))
    .filter((item) => (item.vote_count ?? 0) >= 20)
    .sort((a, b) => tmdbWatchScore(b) - tmdbWatchScore(a))
    .slice(0, 10);

  if (!candidates.length) return null;

  const item = candidates[utcDayIndex() % candidates.length];
  const mediaType = item.media_type === "tv" ? "tv" : "movie";
  const title = item.title || item.name || "Today's streaming pick";
  const date = item.release_date || item.first_air_date;

  return {
    lane: "WATCH",
    title: `Watch tonight: ${title}`,
    detail: "A fresh daily pick from what is trending now.",
    href: `https://www.themoviedb.org/${mediaType}/${item.id}`,
    source: "TMDB Daily",
    date,
  };
}

function fallbackItems(): FeatureItem[] {
  return [
    {
      lane: "WATCH",
      title: "See what just landed.",
      detail: "Open the Movies room for the live Streaming Radar.",
      href: "/movies",
      source: "Jaski Movies",
    },
    {
      lane: "LISTEN",
      title: "Drop into the Jam Room.",
      detail: "Live music, Grateful Dead history, and the next good listen.",
      href: "/jam",
      source: "Jaski Jam Room",
    },
    {
      lane: "EXPLORE",
      title: "Pick a rabbit hole.",
      detail: "Golf, games, books, cooking, and everything else you actually care about.",
      href: "/",
      source: "Jaski",
    },
  ];
}

export async function GET(request: NextRequest) {
  const requestId = request.nextUrl.searchParams.get("r") || "none";

  try {
    const exploreTopic =
      EXPLORE_ROTATION[utcDayIndex() % EXPLORE_ROTATION.length];

    const [watch, listenStories, exploreStories] = await Promise.all([
      dailyWatchPick(),
      news(
        '("Grateful Dead" OR "Dead & Company" OR Phish OR "Umphrey\'s McGee" OR Goose OR jamband) (JamBase OR Relix OR "Live For Live Music" OR Jambands) when:7d'
      ),
      news(exploreTopic.query),
    ]);

    const usedTitles: string[] = [];
    if (watch) usedTitles.push(watch.title);

    const listen = chooseDistinct(listenStories, LISTEN_BOOST, usedTitles);
    if (listen) usedTitles.push(listen.title);

    const explore = chooseDistinct(exploreStories, exploreTopic.terms, usedTitles);

    const items: FeatureItem[] = [
      watch || fallbackItems()[0],
      listen
        ? {
            lane: "LISTEN",
            title: listen.title,
            detail: "A current jam-band story worth your attention.",
            href: listen.link,
            source: listen.source || "Music",
            date: listen.date,
          }
        : fallbackItems()[1],
      explore
        ? {
            lane: "EXPLORE",
            title: explore.title,
            detail: `${exploreTopic.label} is today's rotating rabbit hole.`,
            href: explore.link,
            source: explore.source || exploreTopic.label,
            date: explore.date,
          }
        : fallbackItems()[2],
    ];

    return NextResponse.json(
      {
        build: BUILD,
        requestId,
        updatedAt: new Date().toISOString(),
        exploreTopic: exploreTopic.label,
        items,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "X-Jaski-Build": BUILD,
        },
      }
    );
  } catch (error) {
    console.error("Featured Today data-path error:", error);

    return NextResponse.json(
      {
        build: BUILD,
        requestId,
        updatedAt: new Date().toISOString(),
        items: fallbackItems(),
        mode: "fallback",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "X-Jaski-Build": BUILD,
        },
      }
    );
  }
}
