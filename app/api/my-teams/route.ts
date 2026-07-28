import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DISPLAY_TIME_ZONE = "America/Chicago";

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
      detail?: string;
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

function statusText(event: Event) {
  const type = event.status?.type;
  return `${type?.shortDetail || ""} ${type?.detail || ""} ${type?.description || ""}`.toLowerCase();
}

function isUnavailable(event: Event) {
  if (event.status?.type?.completed) return true;
  const text = statusText(event);
  return (
    text.includes("postponed") ||
    text.includes("canceled") ||
    text.includes("cancelled") ||
    text.includes("final")
  );
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
        timeZone: DISPLAY_TIME_ZONE,
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

function isUsableCandidate(event: Event, now: Date) {
  if (isUnavailable(event)) return false;
  if (event.status?.type?.state === "in") return true;

  const start = event.date ? new Date(event.date) : null;
  if (!start || Number.isNaN(start.getTime())) return false;

  // Keep today's scheduled/delayed game, or a genuinely future game.
  // Drop stale non-final events from prior dates so they cannot become "NEXT UP".
  return sameDisplayDay(start, now) || start.getTime() > now.getTime();
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
        "User-Agent": "JaskiHomepage/13.6",
      },
    });

    if (!res.ok) throw new Error("scoreboard unavailable");

    const json = await res.json();
    const events: Event[] = Array.isArray(json?.events) ? json.events : [];
    const now = new Date();
    const relevant = events.filter(findStLouis).filter((event) => isUsableCandidate(event, now));

    if (!relevant.length) {
      return {
        team: config.team,
        league: config.league,
        mark: config.mark,
        state: "OFF",
        headline: `St. Louis ${config.team}`,
        detail: "No current game on the board. Open the team page for the schedule.",
        href: config.href,
      };
    }

    const ranked = [...relevant].sort((a, b) => {
      const aLive = a.status?.type?.state === "in" ? 0 : 1;
      const bLive = b.status?.type?.state === "in" ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;

      const at = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
      const bt = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
      return at - bt;
    });

    const event = ranked[0];
    const start = event.date ? new Date(event.date) : null;
    const isLive = event.status?.type?.state === "in";
    const isToday = Boolean(start && !Number.isNaN(start.getTime()) && sameDisplayDay(start, now));

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
        timeZone: DISPLAY_TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
      teams,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Jaski-Sprint": "13.6",
      },
    }
  );
}
