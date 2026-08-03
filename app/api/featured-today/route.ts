import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const BUILD = "17.14c";

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

const WATCH_BLOCKED_SOURCES = [
  "screenhub",
  "screenhub australia",
  "the manual",
  "comingsoon",
  "comicbookmovie",
  "bingeworthy",
  "yahoo shopping",
  "msn shopping",
  "screen rant",
  "we got this covered",
  "bgr",
];

const WATCH_PREFERRED_SOURCES = [
  "variety",
  "deadline",
  "the hollywood reporter",
  "hollywood reporter",
  "indiewire",
  "vulture",
  "entertainment weekly",
  "rolling stone",
  "the wrap",
  "av club",
  "reuters",
  "associated press",
  "ap news",
];

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

const WATCH_BOOST = [
  "streaming",
  "netflix",
  "prime video",
  "max",
  "hulu",
  "disney+",
  "peacock",
  "movie",
  "series",
  "tv",
  "premiere",
  "release",
  "new on",
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

function isWatchBlocked(story: Story) {
  const source = sourceName(story);
  return WATCH_BLOCKED_SOURCES.some((name) => source.includes(name));
}

function isWatchPreferred(story: Story) {
  const source = sourceName(story);
  return WATCH_PREFERRED_SOURCES.some((name) => source.includes(name));
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

function chooseWatch(stories: Story[]) {
  const clean = ranked(stories, WATCH_BOOST).filter(
    (story) => !isWatchBlocked(story)
  );

  const preferred = clean.filter(isWatchPreferred);
  return preferred[0] || clean[0];
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

    const [watchStories, listenStories, exploreStories] = await Promise.all([
      news(
        '("new on streaming" OR "streaming premiere" OR "new movie streaming" OR "new TV streaming") (Variety OR Deadline OR "Hollywood Reporter" OR IndieWire OR Vulture OR "Entertainment Weekly") when:7d'
      ),
      news(
        '("Grateful Dead" OR "Dead & Company" OR Phish OR "Umphrey\'s McGee" OR Goose OR jamband) (JamBase OR Relix OR "Live For Live Music" OR Jambands) when:7d'
      ),
      news(exploreTopic.query),
    ]);

    const usedTitles: string[] = [];
    const watch = chooseWatch(watchStories);
    if (watch) usedTitles.push(watch.title);

    const listen = chooseDistinct(listenStories, LISTEN_BOOST, usedTitles);
    if (listen) usedTitles.push(listen.title);

    const explore = chooseDistinct(exploreStories, exploreTopic.terms, usedTitles);

    const items: FeatureItem[] = [
      watch
        ? {
            lane: "WATCH",
            title: watch.title,
            detail: "A current streaming story from a preferred entertainment source.",
            href: watch.link,
            source: watch.source || "Streaming",
            date: watch.date,
          }
        : fallbackItems()[0],
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
