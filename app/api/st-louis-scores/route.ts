import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AnyObject = Record<string, any>;

async function json(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "JaskiHomepage/1.0" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function normalizeEvent(event: AnyObject) {
  const comp = event?.competitions?.[0];
  const competitors = comp?.competitors || [];
  const home = competitors.find((c: AnyObject) => c.homeAway === "home");
  const away = competitors.find((c: AnyObject) => c.homeAway === "away");

  const side = (c: AnyObject) => c ? ({
    name: c.team?.displayName || c.team?.shortDisplayName || "",
    abbreviation: c.team?.abbreviation || "",
    score: c.score?.displayValue ?? c.score ?? "",
  }) : undefined;

  return {
    date: event?.date || comp?.date || "",
    status: event?.status?.type?.state || comp?.status?.type?.state || "",
    home: side(home),
    away: side(away),
  };
}

function latestCompleted(events: AnyObject[], matcher?: (e: AnyObject) => boolean) {
  return events
    .filter((e) => !matcher || matcher(e))
    .map(normalizeEvent)
    .filter((e) => e.status === "post")
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0] || null;
}

function range(daysBack: number) {
  const end = new Date();
  const start = new Date(Date.now() - daysBack * 86400000);
  const ymd = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  return `${ymd(start)}-${ymd(end)}`;
}

export async function GET() {
  const results: AnyObject[] = [];

  // Cardinals: current MLB team schedule.
  try {
    const mlb = await json("https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/stl/schedule?season=2026");
    const latest = latestCompleted(mlb?.events || []);
    results.push({
      team: "Cardinals",
      league: "MLB",
      tone: "cardinals",
      sourceUrl: "https://www.mlb.com/cardinals",
      ...(latest || {}),
    });
  } catch {
    results.push({ team: "Cardinals", league: "MLB", tone: "cardinals", sourceUrl: "https://www.mlb.com/cardinals" });
  }

  // Blues: most recent completed game from the 2025-26 NHL schedule.
  try {
    const nhl = await json("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/stl/schedule?season=2026");
    const latest = latestCompleted(nhl?.events || []);
    results.push({
      team: "Blues",
      league: "NHL",
      tone: "blues",
      sourceUrl: "https://www.nhl.com/blues/",
      ...(latest || {}),
    });
  } catch {
    results.push({ team: "Blues", league: "NHL", tone: "blues", sourceUrl: "https://www.nhl.com/blues/" });
  }

  // CITY: use the MLS scoreboard over a generous recent window and identify St. Louis by team name/abbreviation.
  try {
    const mls = await json(`https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=${range(45)}&limit=200`);
    const matcher = (event: AnyObject) => {
      const teams = event?.competitions?.[0]?.competitors || [];
      return teams.some((c: AnyObject) => {
        const name = String(c.team?.displayName || "").toLowerCase();
        const abbr = String(c.team?.abbreviation || "").toUpperCase();
        return name.includes("st. louis") || name.includes("st louis") || abbr === "STL";
      });
    };
    const latest = latestCompleted(mls?.events || [], matcher);
    results.push({
      team: "CITY SC",
      league: "MLS",
      tone: "city",
      sourceUrl: "https://www.stlcitysc.com/",
      ...(latest || {}),
    });
  } catch {
    results.push({ team: "CITY SC", league: "MLS", tone: "city", sourceUrl: "https://www.stlcitysc.com/" });
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    results,
  });
}
