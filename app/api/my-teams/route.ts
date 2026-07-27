import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type TeamCard = {
  team: string;
  league: string;
  mark: string;
  state: "LIVE" | "TODAY" | "NEXT" | "OFF";
  headline: string;
  detail: string;
  href: string;
};

type Competitor = {
  homeAway?: string;
  score?: string;
  team?: {
    abbreviation?: string;
    shortDisplayName?: string;
    displayName?: string;
  };
};

type Event = {
  shortName?: string;
  name?: string;
  date?: string;
  status?: {
    type?: {
      state?: string;
      completed?: boolean;
      shortDetail?: string;
      description?: string;
    };
  };
  competitions?: Array<{
    broadcasts?: Array<{ names?: string[] }>;
    competitors?: Competitor[];
  }>;
  links?: Array<{ href?: string }>;
};

const configs = [
  {
    team: "Cardinals",
    league: "MLB",
    mark: "STL",
    scoreboard: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
    href: "https://www.espn.com/mlb/team/_/name/stl/st-louis-cardinals",
  },
  {
    team: "Blues",
    league: "NHL",
    mark: "STL",
    scoreboard: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
    href: "https://www.espn.com/nhl/team/_/name/stl/st-louis-blues",
  },
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function findStLouis(event: Event) {
  const competitors = event.competitions?.[0]?.competitors || [];
  return competitors.some(
    (c) =>
      c.team?.abbreviation?.toUpperCase() === "STL" ||
      c.team?.displayName?.toLowerCase().includes("st. louis")
  );
}

function gameDetail(event: Event) {
  const competition = event.competitions?.[0];
  const teams = competition?.competitors || [];
  const network = competition?.broadcasts?.[0]?.names?.join(", ");

  const score =
    teams.length === 2 && teams.some((t) => t.score && t.score !== "0")
      ? teams
          .map((t) => `${t.team?.shortDisplayName || t.team?.displayName || "Team"} ${t.score || ""}`.trim())
          .join(" · ")
      : "";

  if (score && network) return `${score} · ${network}`;
  if (score) return score;
  if (network) return network;

  if (event.date) {
    const d = new Date(event.date);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(d);
    }
  }

  return "Open for game details";
}

async function loadTeam(config: typeof configs[number]): Promise<TeamCard> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);

  try {
    const res = await fetch(config.scoreboard, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "JaskiHomepage/13.4",
      },
    });

    if (!res.ok) throw new Error("scoreboard unavailable");

    const json = await res.json();
    const events: Event[] = Array.isArray(json?.events) ? json.events : [];
    const relevant = events.filter(findStLouis);

    if (!relevant.length) {
      return {
        team: config.team,
        league: config.league,
        mark: config.mark,
        state: "OFF",
        headline: `St. Louis ${config.team}`,
        detail: "No game on the current board. Open the team page for the schedule.",
        href: config.href,
      };
    }

    const now = new Date();

    const ranked = relevant
      .filter((event) => !event.status?.type?.completed)
      .sort((a, b) => {
        const aLive = a.status?.type?.state === "in" ? 0 : 1;
        const bLive = b.status?.type?.state === "in" ? 0 : 1;
        if (aLive !== bLive) return aLive - bLive;

        const at = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
        const bt = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
        return at - bt;
      });

    const event = ranked[0] || relevant[0];
    const start = event.date ? new Date(event.date) : null;
    const isLive = event.status?.type?.state === "in";
    const isToday = Boolean(start && !Number.isNaN(start.getTime()) && sameDay(start, now));

    return {
      team: config.team,
      league: config.league,
      mark: config.mark,
      state: isLive ? "LIVE" : isToday ? "TODAY" : "NEXT",
      headline: event.shortName || event.name || `St. Louis ${config.team}`,
      detail: gameDetail(event),
      href: event.links?.[0]?.href || config.href,
    };
  } catch {
    return {
      team: config.team,
      league: config.league,
      mark: config.mark,
      state: "OFF",
      headline: `St. Louis ${config.team}`,
      detail: "Open the team page for scores, schedule, and news.",
      href: config.href,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const teams = await Promise.all(configs.map(loadTeam));

  return NextResponse.json(
    {
      updatedAt: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
      teams,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Jaski-Sprint": "13.4",
      },
    }
  );
}
