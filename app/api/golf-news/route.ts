import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NEWS_URL = "https://site.api.espn.com/apis/site/v2/sports/golf/pga/news";

type NewsItem = {
  headline: string;
  description: string;
  href: string;
  source: string;
};

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function scoreStory(article: any): number {
  const haystack = `${text(article?.headline)} ${text(article?.description)}`.toLowerCase();
  let score = 0;

  const priorityTerms = [
    "masters",
    "pga championship",
    "u.s. open",
    "us open",
    "the open",
    "players championship",
    "the players",
    "ryder cup",
    "presidents cup",
    "fedex cup",
    "fedexcup",
    "pga tour",
    "major",
  ];

  for (const term of priorityTerms) {
    if (haystack.includes(term)) score += 3;
  }

  if (article?.premium) score -= 1;
  if (article?.video?.length) score += 0.25;

  return score;
}

export async function GET() {
  try {
    const res = await fetch(NEWS_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error(`ESPN ${res.status}`);

    const data: any = await res.json();
    const articles = Array.isArray(data?.articles) ? data.articles : [];

    const stories: NewsItem[] = articles
      .map((article: any) => {
        const href =
          article?.links?.web?.href ??
          article?.links?.mobile?.href ??
          article?.link ??
          "";

        return {
          headline: text(article?.headline),
          description: text(article?.description),
          href,
          source: text(article?.source) || "ESPN",
          score: scoreStory(article),
          published:
            new Date(article?.published ?? article?.lastModified ?? 0).getTime() || 0,
        };
      })
      .filter((story: any) => story.headline && story.href)
      .sort((a: any, b: any) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.published - a.published;
      })
      .slice(0, 4)
      .map(({ score, published, ...story }: any) => story);

    return NextResponse.json({
      stories,
      available: stories.length > 0,
      updated: new Date().toISOString(),
      source: "ESPN PGA",
    });
  } catch {
    return NextResponse.json({
      stories: [],
      available: false,
      updated: new Date().toISOString(),
      source: "ESPN PGA",
    });
  }
}
