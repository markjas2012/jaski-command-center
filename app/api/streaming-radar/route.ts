import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Story = {
  title: string;
  link: string;
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
  const match = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
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

  if (!res.ok) throw new Error(`News RSS returned ${res.status}`);
  return parse(await res.text());
}

function unique(stories: Story[]) {
  const seen = new Set<string>();
  return stories.filter((story) => {
    const key = story.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET() {
  try {
    const [newStreaming, worthWatching, theaters] = await Promise.all([
      news('("new on Netflix" OR "new on Prime Video" OR "new on Max" OR "new on Hulu" OR "new on Disney+" OR "new on Peacock") when:7d'),
      news('("best movies streaming" OR "what to watch streaming" OR "movies to stream this week") when:7d'),
      news('("new movies in theaters this week" OR "movies opening this weekend") when:7d'),
    ]);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      newStreaming: unique(newStreaming).slice(0, 12),
      worthWatching: unique(worthWatching).slice(0, 8),
      theaters: unique(theaters).slice(0, 5),
    });
  } catch (error) {
    console.error("Streaming radar error:", error);
    return NextResponse.json(
      { error: "Streaming radar unavailable." },
      { status: 503 }
    );
  }
}
