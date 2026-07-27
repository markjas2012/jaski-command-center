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

function firstUseful(stories: Story[]) {
  return stories.find((story) => {
    const title = story.title.toLowerCase();
    return (
      !title.includes("newsletter") &&
      !title.includes("sale") &&
      !title.includes("deal") &&
      !title.includes("coupon")
    );
  });
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
    const [watchStories, listenStories, exploreStories] = await Promise.all([
      news(
        '("what to watch streaming" OR "best movies streaming this week" OR "new on streaming") when:7d'
      ),
      news(
        '("Grateful Dead" OR "Dead & Company" OR "jam band" OR "Phish") when:7d'
      ),
      news(
        '("PGA Tour" OR "Ohio State football" OR "Missouri Tigers" OR "new spy thriller book" OR "BBQ recipe") when:7d'
      ),
    ]);

    const watch = firstUseful(watchStories);
    const listen = firstUseful(listenStories);
    const explore = firstUseful(exploreStories);

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
            detail: "Something current from the jam-band world.",
            href: listen.link,
            source: listen.source || "Music",
            date: listen.date,
          }
        : fallbackItems()[1],

      explore
        ? {
            lane: "EXPLORE",
            title: explore.title,
            detail: "One rotating rabbit hole from the interests already inside Jaski.",
            href: explore.link,
            source: explore.source || "Explore",
            date: explore.date,
          }
        : fallbackItems()[2],
    ];

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      items,
    });
  } catch (error) {
    console.error("Featured Today error:", error);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      items: fallbackItems(),
      mode: "fallback",
    });
  }
}
