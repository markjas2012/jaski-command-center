import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Bucket = "LIVE" | "TODAY" | "COMING UP";

type Game = {
  league: string;
  title: string;
  status: string;
  detail: string;
  href: string;
  bucket: Bucket;
  start?: string;
};

type EspnEvent = {
  name?: string;
  shortName?: string;
  date?: string;
  status?: {
    type?: {
      state?: string;
      completed?: boolean;
      shortDetail?: string;
      detail?: string;
      description?: string;
    };
  };
  competitions?: Array<{
    broadcasts?: Array<{ names?: string[] }>;
    competitors?: Array<{
      team?: { displayName?: string; shortDisplayName?: string };
      score?: string;
    }>;
  }>;
  links?: Array<{ href?: string }>;
};

const feeds = [
  {
    league: "MLB",
    url: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
    fallback: "https://www.mlb.com/scores",
  },
  {
    league: "NFL",
    url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    fallback: "https://www.nfl.com/schedules/",
  },
  {
    league: "NCAA",
    url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
    fallback: "https://www.ncaa.com/scoreboard/football/fbs",
  },
  {
    league: "NBA",
    url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
    fallback: "https://www.nba.com/schedule",
  },
  {
    league: "NHL",
    url: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
    fallback: "https://www.nhl.com/schedule",
  },
];

function sameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function classify(event: EspnEvent): Bucket | null {
  const state = event.status?.type?.state;
  const completed = Boolean(event.status?.type?.completed);

  if (completed) return null;
  if (state === "in") return "LIVE";

  const start = event.date ? new Date(event.date) : null;
  if (!start || Number.isNaN(start.getTime())) return "COMING UP";

  const now = new Date();
  return sameLocalDay(start, now) ? "TODAY" : "COMING UP";
}

function formatDetail(event: EspnEvent) {
  const competition = event.competitions?.[0];
  const teams = competition?.competitors || [];
  const broadcast = competition?.broadcasts?.[0]?.names?.join(", ");

  const scoreLine =
    teams.length === 2 && teams.some((team) => team.score && team.score !== "0")
      ? teams
          .map((team) => `${team.team?.shortDisplayName || team.team?.displayName || "Team"} ${team.score || ""}`.trim())
          .join(" · ")
      : "";

  if (scoreLine && broadcast) return `${scoreLine} · ${broadcast}`;
  if (scoreLine) return scoreLine;
  if (broadcast) return broadcast;

  const date = event.date ? new Date(event.date) : null;
  if (date && !Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return "Open for details";
}

async function loadFeed(feed: typeof feeds[number]): Promise<Game[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);

  try {
    const res = await fetch(feed.url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "JaskiHomepage/13.3",
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    const events: EspnEvent[] = Array.isArray(json?.events) ? json.events : [];

    return events
      .map((event) => {
        const bucket = classify(event);
        if (!bucket) return null;

        return {
          league: feed.league,
          title: event.shortName || event.name || `${feed.league} game`,
          status:
            event.status?.type?.shortDetail ||
            event.status?.type?.description ||
            "Scheduled",
          detail: formatDetail(event),
          href: event.links?.[0]?.href || feed.fallback,
          bucket,
          start: event.date,
        } satisfies Game;
      })
      .filter((game): game is Game => Boolean(game))
      .slice(0, 6);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const results = await Promise.all(feeds.map(loadFeed));
  const games = results.flat();

  return NextResponse.json(
    {
      updatedAt: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
      games,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Jaski-Sprint": "13.3",
      },
    }
  );
}
