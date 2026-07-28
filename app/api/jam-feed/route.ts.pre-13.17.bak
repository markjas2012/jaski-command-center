import { NextResponse } from "next/server";

type Story = { title: string; source: string; href: string; date?: string };

const feeds = [
  { source: "JamBase", url: "https://www.jambase.com/feed" },
  { source: "Relix", url: "https://relix.com/feed/" },
  { source: "Live For Live Music", url: "https://liveforlivemusic.com/feed/" },
];

function clean(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&apos;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .trim();
}

function first(text: string, tag: string) {
  const match = text.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? clean(match[1]) : "";
}

async function getStory(feed: { source: string; url: string }): Promise<Story | null> {
  try {
    const res = await fetch(feed.url, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const item = xml.match(/<item[\s\S]*?<\/item>/i)?.[0];
    if (!item) return null;

    const title = first(item, "title");
    const link = first(item, "link");
    const pubDate = first(item, "pubDate");

    if (!title || !link) return null;

    let date = "";
    if (pubDate) {
      const d = new Date(pubDate);
      if (!Number.isNaN(d.getTime())) {
        date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
      }
    }

    return { title, source: feed.source, href: link, date };
  } catch {
    return null;
  }
}

export async function GET() {
  const results = await Promise.all(feeds.map(getStory));
  const stories = results.filter((story): story is Story => Boolean(story));

  return NextResponse.json({
    updatedAt: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
    stories,
  });
}
