import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SAUCE_FEED = "https://www.saucemagazine.com/feed/";

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function tag(item: string, name: string) {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decode(match[1]) : "";
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export async function GET() {
  try {
    const response = await fetch(SAUCE_FEED, {
      headers: { "User-Agent": "JaskiCommandCenter/17.3" },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(`Sauce Magazine returned ${response.status}.`);
    }

    const xml = await response.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
    const stories = items
      .map((item) => ({
        title: tag(item, "title"),
        url: tag(item, "link"),
        date: formatDate(tag(item, "pubDate")),
        source: "Sauce",
      }))
      .filter((story) => story.title && story.url.startsWith("http"))
      .slice(0, 8);

    if (!stories.length) {
      throw new Error("Sauce Magazine returned no readable stories.");
    }

    return NextResponse.json({ stories, updatedAt: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load Sauce Magazine.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
