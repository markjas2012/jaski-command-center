import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const TZ = "America/Chicago";

type TeamCard = {
  team: string;
  league: string;
  mark: string;
  state: "LIVE" | "TODAY" | "NEXT" | "OFF";
  headline: string;
  detail: string;
  href: string;
  record?: string;
  recent?: string;
};

type Event = any;

const configs = [
  {
    team:"Cardinals", league:"MLB", mark:"STL", ids:["STL"], names:["st. louis cardinals"],
    scoreboard:"https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
    href:"https://www.espn.com/mlb/team/_/name/stl/st-louis-cardinals"
  },
  {
    team:"Blues", league:"NHL", mark:"STL", ids:["STL"], names:["st. louis blues"],
    scoreboard:"https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
    href:"https://www.espn.com/nhl/team/_/name/stl/st-louis-blues"
  },
  {
    team:"CITY SC", league:"MLS", mark:"CITY", ids:["STL"], names:["st. louis city sc","st louis city sc"],
    scoreboard:"https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
    href:"https://www.espn.com/soccer/club/_/id/21812/st-louis-city-sc"
  },
  {
    team:"Mizzou", league:"NCAA", mark:"M", ids:["MIZ"], names:["missouri tigers"],
    scoreboard:"https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
    href:"https://www.espn.com/college-football/team/_/id/142/missouri-tigers"
  },
];

function dayKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
  }).format(d);
}

function sameDay(a: Date, b: Date) {
  return dayKey(a) === dayKey(b);
}

function competitors(e: Event) {
  return e.competitions?.[0]?.competitors || [];
}

function ownCompetitor(e: Event, c: any) {
  return competitors(e).find((x: any) => {
    const ab = (x.team?.abbreviation || "").toUpperCase();
    const name = (x.team?.displayName || "").toLowerCase();
    return c.ids.includes(ab) || c.names.some((n: string) => name.includes(n));
  });
}

function matches(e: Event, c: any) {
  return Boolean(ownCompetitor(e, c));
}

function statusText(e: Event) {
  const t = e.status?.type;
  const ct = e.competitions?.[0]?.status?.type;
  return `${t?.shortDetail || ""} ${t?.detail || ""} ${t?.description || ""} ${ct?.shortDetail || ""}`.toLowerCase();
}

function isCanceled(e: Event) {
  return /postponed|canceled|cancelled|suspended|abandoned/.test(statusText(e));
}

function isCompleted(e: Event) {
  return Boolean(e.status?.type?.completed || e.competitions?.[0]?.status?.type?.completed || /\bfinal\b/.test(statusText(e)));
}

function recordFor(e: Event, c: any) {
  const own = ownCompetitor(e, c);
  const records = own?.records || [];
  return records.find((r: any) => r?.type === "total")?.summary
    || records.find((r: any) => r?.summary)?.summary
    || "";
}

function scoreFor(e: Event, c: any) {
  const own = ownCompetitor(e, c);
  const opp = competitors(e).find((x: any) => x !== own);
  if (!own || !opp) return "";

  const ownName = own.team?.shortDisplayName || own.team?.displayName || c.team;
  const oppName = opp.team?.shortDisplayName || opp.team?.displayName || "Opponent";
  const ownScore = own.score ?? "";
  const oppScore = opp.score ?? "";

  if (ownScore === "" || oppScore === "") return "";

  const a = Number(ownScore);
  const b = Number(oppScore);
  const result = Number.isFinite(a) && Number.isFinite(b) ? (a > b ? "W" : a < b ? "L" : "T") : "";

  return `${result ? `${result} · ` : ""}${ownName} ${ownScore} · ${oppName} ${oppScore}`;
}

function detail(e: Event) {
  const comp = e.competitions?.[0];
  const cs = comp?.competitors || [];
  const network = comp?.broadcasts?.[0]?.names?.join(", ");
  const score = cs.length === 2 && cs.some((x: any) => x.score && x.score !== "0")
    ? cs.map((x: any) => `${x.team?.shortDisplayName || x.team?.displayName || "Team"} ${x.score || ""}`.trim()).join(" · ")
    : "";

  if (score && network) return `${score} · ${network}`;
  if (score) return score;
  if (network && e.date) {
    const d = new Date(e.date);
    if (!Number.isNaN(d.getTime())) {
      const when = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
      }).format(d);
      return `${when} · ${network}`;
    }
  }
  if (network) return network;

  if (e.date) {
    const d = new Date(e.date);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
      }).format(d);
    }
  }

  return "Open for details";
}

function nextCandidates(events: Event[], c: any, now: Date) {
  return events
    .filter((e) => matches(e, c) && !isCanceled(e) && !isCompleted(e))
    .filter((e) => {
      if (e.status?.type?.state === "in") return true;
      const d = e.date ? new Date(e.date) : null;
      return Boolean(d && !Number.isNaN(d.getTime()) && (sameDay(d, now) || d.getTime() > now.getTime()));
    })
    .sort((a, b) => {
      const al = a.status?.type?.state === "in" ? 0 : 1;
      const bl = b.status?.type?.state === "in" ? 0 : 1;
      if (al !== bl) return al - bl;
      return new Date(a.date || 8640000000000000).getTime() - new Date(b.date || 8640000000000000).getTime();
    });
}

function recentResult(events: Event[], c: any) {
  const recent = events
    .filter((e) => matches(e, c) && isCompleted(e) && !isCanceled(e))
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0];

  return recent ? scoreFor(recent, c) : "";
}

async function load(c: any): Promise<TeamCard> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2600);

    const res = await fetch(c.scoreboard, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": "JaskiHomepage/14.2" },
    });

    clearTimeout(timer);
    if (!res.ok) throw new Error();

    const json = await res.json();
    const events: Event[] = Array.isArray(json?.events) ? json.events : [];
    const now = new Date();

    const candidates = nextCandidates(events, c, now);
    const event = candidates[0];
    const recent = recentResult(events, c);

    if (!event) {
      // If the active scoreboard has no upcoming event, still surface a record
      // from the most recent matching event when ESPN provides one.
      const matching = events.filter((e) => matches(e, c));
      const record = matching.map((e) => recordFor(e, c)).find(Boolean) || "";

      return {
        team: c.team,
        league: c.league,
        mark: c.mark,
        state: "OFF",
        headline: c.team,
        detail: "No current game on the board. Open the team page for the schedule.",
        href: c.href,
        record,
        recent,
      };
    }

    const d = event.date ? new Date(event.date) : null;
    const live = event.status?.type?.state === "in";
    const today = Boolean(d && !Number.isNaN(d.getTime()) && sameDay(d, now));

    return {
      team: c.team,
      league: c.league,
      mark: c.mark,
      state: live ? "LIVE" : today ? "TODAY" : "NEXT",
      headline: event.shortName || event.name || c.team,
      detail: detail(event),
      href: event.links?.[0]?.href || c.href,
      record: recordFor(event, c),
      recent,
    };
  } catch {
    return {
      team: c.team,
      league: c.league,
      mark: c.mark,
      state: "OFF",
      headline: c.team,
      detail: "Open the team page for schedule, scores and news.",
      href: c.href,
    };
  }
}

export async function GET() {
  const teams = await Promise.all(configs.map(load));

  return NextResponse.json(
    {
      updatedAt: new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, hour: "numeric", minute: "2-digit"
      }).format(new Date()),
      teams,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Jaski-Sprint": "14.2",
      },
    }
  );
}
