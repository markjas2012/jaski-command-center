import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DISPLAY_TIME_ZONE = "America/Chicago";

type Bucket = "LIVE" | "TODAY" | "COMING UP";

type Game = {
  league: string;
  title: string;
  status: string;
  detail: string;
  href: string;
  bucket: Bucket;
  start?: string;
  logos?: string[];
};

type CandidateGame = Game & {
  unavailable: boolean;
};

type EspnEvent = {
  name?: string;
  shortName?: string;
  date?: string;
  status?: {
    type?: {
      state?: string;
      completed?: boolean;
      name?: string;
      shortDetail?: string;
      detail?: string;
      description?: string;
    };
  };
  competitions?: Array<{
    status?: {
      type?: {
        state?: string;
        completed?: boolean;
        name?: string;
        shortDetail?: string;
        detail?: string;
        description?: string;
      };
    };
    broadcasts?: Array<{ names?: string[] }>;
    competitors?: Array<{
      team?: {
        displayName?: string;
        shortDisplayName?: string;
        logo?: string;
        logos?: Array<{ href?: string }>;
      };
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
  {
    league: "MLS",
    url: "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
    fallback: "https://www.mlssoccer.com/schedule/scores",
  },
];

function dayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function sameDisplayDay(a: Date, b: Date) {
  return dayKey(a) === dayKey(b);
}

function statusText(event: EspnEvent) {
  const eventType = event.status?.type;
  const competitionType = event.competitions?.[0]?.status?.type;

  return [
    eventType?.name,
    eventType?.shortDetail,
    eventType?.detail,
    eventType?.description,
    competitionType?.name,
    competitionType?.shortDetail,
    competitionType?.detail,
    competitionType?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasUnavailableStatus(text: string) {
  return (
    text.includes("postponed") ||
    text.includes("canceled") ||
    text.includes("cancelled") ||
    text.includes("suspended") ||
    text.includes("abandoned") ||
    text.includes("final")
  );
}

function isUnavailable(event: EspnEvent) {
  if (event.status?.type?.completed) return true;
  if (event.competitions?.[0]?.status?.type?.completed) return true;
  return hasUnavailableStatus(statusText(event));
}

function classify(event: EspnEvent): Bucket | null {
  if (isUnavailable(event)) return null;

  const state = event.status?.type?.state;
  if (state === "in") return "LIVE";

  const start = event.date ? new Date(event.date) : null;
  if (!start || Number.isNaN(start.getTime())) return null;

  const now = new Date();
  if (sameDisplayDay(start, now)) return "TODAY";
  if (start.getTime() > now.getTime()) return "COMING UP";

  return null;
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
      timeZone: DISPLAY_TIME_ZONE,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return "Open for details";
}

function teamLogos(event: EspnEvent) {
  const competitors = event.competitions?.[0]?.competitors || [];

  return competitors
    .map((competitor) => {
      const team = competitor.team;
      return team?.logo || team?.logos?.[0]?.href || "";
    })
    .filter((value): value is string => Boolean(value))
    .slice(0, 2);
}

async function loadFeed(feed: typeof feeds[number]): Promise<CandidateGame[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);

  try {
    const res = await fetch(feed.url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "JaskiHomepage/14.6",
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    const events: EspnEvent[] = Array.isArray(json?.events) ? json.events : [];

    return events
      .map((event) => {
        const unavailable = isUnavailable(event);
        const bucket = unavailable ? null : classify(event);
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
          logos: teamLogos(event),
          unavailable,
        } satisfies CandidateGame;
      })
      .filter((game): game is CandidateGame => Boolean(game))
      .slice(0, 6);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const results = await Promise.all(feeds.map(loadFeed));

  // Final production gate: an event ESPN marks unavailable can never reach
  // the public games array, regardless of any upstream classification path.
  const games: Game[] = results
    .flat()
    .filter((game) => !game.unavailable)
    .filter((game) => !hasUnavailableStatus(`${game.status} ${game.detail}`.toLowerCase()))
    .map(({ unavailable: _unavailable, ...game }) => game);

  return NextResponse.json(
    {
      updatedAt: new Intl.DateTimeFormat("en-US", {
        timeZone: DISPLAY_TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
      games,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Jaski-Sprint": "14.6",
      },
    }
  );
}
