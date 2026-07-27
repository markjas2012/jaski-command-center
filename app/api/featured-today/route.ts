import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
  "black friday",
  "prime day",
  "where to buy",
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
];

const EXPLORE_ROTATION = [
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
    query: '("Mortal Kombat" OR "video game" OR Xbox) when:7d',
    terms: ["mortal kombat", "video game", "xbox", "gaming"],
  },
  {
    label: "LOST",
    query: '("LOST TV" OR "Lost series" OR Dharma) when:30d',
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
    headers: { "User-Agent": "JaskiHomepage/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Featured RSS returned ${res.status}`);
  return parse(await res.text());
}

function ageHours(date?: string) {
  if (!date) return 999;
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return 999;
  return Math.max(0, (Date.now() - time) / 3_600_000);
}

function normalizedTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleWords(title: string) {
  return new Set(
    normalizedTitle(title)
      .split(" ")
      .filter((word) => word.length > 3)
  );
}

function similarity(a: string, b: string) {
  const aw = titleWords(a);
  const bw = titleWords(b);
  if (!aw.size || !bw.size) return 0;

  let shared = 0;
  for (const word of aw) {
    if (bw.has(word)) shared++;
  }

  return shared / Math.max(aw.size, bw.size);
}

function isJunk(story: Story) {
  const haystack = `${story.title} ${story.source || ""}`.toLowerCase();
  return JUNK_TERMS.some((term) => haystack.includes(term));
}

function scoreStory(story: Story, boosts: string[]) {
  const haystack = `${story.title} ${story.source || ""}`.toLowerCase();
  let score = 0;

  for (const term of boosts) {
    if (haystack.includes(term)) score += 8;
  }

  const hours = ageHours(story.date);
  if (hours <= 24) score += 10;
  else if (hours <= 72) score += 7;
  else if (hours <= 168) score += 4;
  else if (hours <= 336) score += 1;

  if ((story.source || "").length > 2) score += 1;
  if (story.title.length >= 35 && story.title.length <= 110) score += 2;

  return score;
}

function ranked(stories: Story[], boosts: string[]) {
  return stories
    .filter((story) => !isJunk(story))
    .sort((a, b) => scoreStory(b, boosts) - scoreStory(a, boosts));
}

function chooseDistinct(
  stories: Story[],
  boosts: string[],
  usedTitles: string[]
) {
  const options = ranked(stories, boosts);

  for (const story of options) {
    const duplicate = usedTitles.some(
      (used) => similarity(used, story.title) >= 0.5
    );
    if (!duplicate) return story;
  }

  return options[0];
}

function dayIndex() {
  return Math.floor(Date.now() / 86_400_000);
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

export async function GET() {
  try {
    const exploreTopic = EXPLORE_ROTATION[dayIndex() % EXPLORE_ROTATION.length];

    const [watchStories, listenStories, exploreStories] = await Promise.all([
      news(
        '("new on streaming" OR "what to watch streaming" OR "new movie streaming" OR "new TV streaming") when:7d'
      ),
      news(
        '("Grateful Dead" OR "Dead & Company" OR Phish OR "Umphrey\'s McGee" OR jamband) when:7d'
      ),
      news(exploreTopic.query),
    ]);

    const usedTitles: string[] = [];

    const watch = chooseDistinct(watchStories, WATCH_BOOST, usedTitles);
    if (watch) usedTitles.push(watch.title);

    const listen = chooseDistinct(listenStories, LISTEN_BOOST, usedTitles);
    if (listen) usedTitles.push(listen.title);

    const explore = chooseDistinct(
      exploreStories,
      exploreTopic.terms,
      usedTitles
    );

    const items: FeatureItem[] = [
      watch
        ? {
            lane: "WATCH",
            title: watch.title,
            detail: "One current streaming story worth a look.",
            href: watch.link,
            source: watch.source || "Streaming",
            date: watch.date,
          }
        : fallbackItems()[0],

      listen
        ? {
            lane: "LISTEN",
            title: listen.title,
            detail: "One current jam-band story worth your attention.",
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

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      exploreTopic: exploreTopic.label,
      items,
    });
  } catch (error) {
    console.error("Featured Today intelligence error:", error);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      items: fallbackItems(),
      mode: "fallback",
    });
  }
}
