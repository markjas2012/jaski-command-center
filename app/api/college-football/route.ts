import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://site.api.espn.com/apis/site/v2/sports/football/college-football";

type AnyObject = Record<string, any>;

const PRESEASON_FALLBACK = {
  ohioState: {
    team: "Ohio State Buckeyes",
    abbreviation: "OSU",
    record: "0-0",
    ranking: null,
    next: {
      id: "osu-2026-opener",
      name: "Ball State at Ohio State",
      date: "2026-09-05T16:00:00Z",
      status: "pre",
      shortStatus: "TBD",
      venue: "Ohio Stadium",
      away: { name: "Ball State Cardinals", abbreviation: "BALL" },
      home: { name: "Ohio State Buckeyes", abbreviation: "OSU" },
    },
    recent: null,
  },
  mizzou: {
    team: "Missouri Tigers",
    abbreviation: "MIZ",
    record: "0-0",
    ranking: null,
    next: {
      id: "miz-2026-opener",
      name: "Arkansas-Pine Bluff at Missouri",
      date: "2026-09-05T16:00:00Z",
      status: "pre",
      shortStatus: "TBD",
      venue: "Memorial Stadium",
      away: { name: "Arkansas-Pine Bluff Golden Lions", abbreviation: "UAPB" },
      home: { name: "Missouri Tigers", abbreviation: "MIZ" },
    },
    recent: null,
  },
  secGames: [
    {
      id: "sec-alabama-ecu",
      name: "East Carolina at Alabama",
      date: "2026-09-05T16:00:00Z",
      status: "pre",
      shortStatus: "TBD",
      venue: "Bryant-Denny Stadium",
      away: { name: "East Carolina Pirates", abbreviation: "ECU" },
      home: { name: "Alabama Crimson Tide", abbreviation: "ALA" },
    },
    {
      id: "sec-auburn-baylor",
      name: "Baylor vs Auburn",
      date: "2026-09-05T16:00:00Z",
      status: "pre",
      shortStatus: "TBD",
      venue: "Mercedes-Benz Stadium",
      away: { name: "Baylor Bears", abbreviation: "BAY" },
      home: { name: "Auburn Tigers", abbreviation: "AUB" },
    },
    {
      id: "sec-lsu-clemson",
      name: "Clemson at LSU",
      date: "2026-09-05T16:00:00Z",
      status: "pre",
      shortStatus: "TBD",
      venue: "Tiger Stadium",
      away: { name: "Clemson Tigers", abbreviation: "CLEM" },
      home: { name: "LSU Tigers", abbreviation: "LSU" },
    },
    {
      id: "sec-mizzou-uapb",
      name: "Arkansas-Pine Bluff at Missouri",
      date: "2026-09-05T16:00:00Z",
      status: "pre",
      shortStatus: "TBD",
      venue: "Memorial Stadium",
      away: { name: "Arkansas-Pine Bluff Golden Lions", abbreviation: "UAPB" },
      home: { name: "Missouri Tigers", abbreviation: "MIZ" },
    },
  ],
};

async function getJson(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "JaskiHomepage/1.0" },
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`Sports source returned ${res.status}`);
  return res.json();
}

function normalizeGame(event: AnyObject, teamId?: string) {
  const comp = event?.competitions?.[0];
  const competitors = comp?.competitors || [];
  const home = competitors.find((c: AnyObject) => c.homeAway === "home");
  const away = competitors.find((c: AnyObject) => c.homeAway === "away");

  const side = (c: AnyObject) => c ? ({
    name: c.team?.displayName || c.team?.shortDisplayName || "",
    abbreviation: c.team?.abbreviation || "",
    score: c.score?.displayValue ?? c.score ?? undefined,
    rank: c.curatedRank?.current && c.curatedRank.current < 99 ? c.curatedRank.current : null,
  }) : undefined;

  const state = event?.status?.type?.state || comp?.status?.type?.state || "pre";

  return {
    id: String(event?.id || ""),
    name: event?.name || event?.shortName || "",
    date: event?.date || comp?.date || "",
    status: state,
    shortStatus: event?.status?.type?.shortDetail || comp?.status?.type?.shortDetail || "",
    venue: comp?.venue?.fullName || "",
    home: side(home),
    away: side(away),
    teamRank: competitors.find((c: AnyObject) => String(c.team?.id) === String(teamId))?.curatedRank?.current ?? null,
  };
}

function teamBlock(schedule: AnyObject, teamId: string) {
  const events = (schedule?.events || []).map((e: AnyObject) => normalizeGame(e, teamId));
  const now = Date.now();

  const upcoming = events
    .filter((g: AnyObject) => g.status !== "post" && new Date(g.date).getTime() >= now - 6 * 60 * 60 * 1000)
    .sort((a: AnyObject, b: AnyObject) => +new Date(a.date) - +new Date(b.date))[0] || null;

  const recent = events
    .filter((g: AnyObject) => g.status === "post" || new Date(g.date).getTime() < now)
    .sort((a: AnyObject, b: AnyObject) => +new Date(b.date) - +new Date(a.date))[0] || null;

  const record = schedule?.team?.recordSummary || schedule?.team?.record || schedule?.team?.standingSummary || "";
  const ranking = upcoming?.teamRank && upcoming.teamRank < 99
    ? upcoming.teamRank
    : recent?.teamRank && recent.teamRank < 99
      ? recent.teamRank
      : null;

  const strip = (g: AnyObject) => g ? ({
    id: g.id, name: g.name, date: g.date, status: g.status, shortStatus: g.shortStatus,
    venue: g.venue, home: g.home, away: g.away
  }) : null;

  return {
    team: schedule?.team?.displayName || "",
    abbreviation: schedule?.team?.abbreviation || "",
    record: typeof record === "string" ? record : "",
    ranking,
    next: strip(upcoming),
    recent: strip(recent),
  };
}

function mergeTeam(primary: AnyObject, fallback: AnyObject) {
  return {
    ...fallback,
    ...primary,
    next: primary?.next || fallback.next,
    recent: primary?.recent || fallback.recent,
    record: primary?.record || fallback.record,
  };
}

export async function GET() {
  try {
    const year = new Date().getFullYear();

    const [osu, miz, sec] = await Promise.allSettled([
      getJson(`${BASE}/teams/194/schedule?season=${year}`),
      getJson(`${BASE}/teams/142/schedule?season=${year}`),
      getJson(`${BASE}/scoreboard?groups=8&dates=${year}0901-${year}0910&limit=100`),
    ]);

    const osuBlock = osu.status === "fulfilled" ? teamBlock(osu.value, "194") : null;
    const mizBlock = miz.status === "fulfilled" ? teamBlock(miz.value, "142") : null;

    let secGames: AnyObject[] = [];
    if (sec.status === "fulfilled") {
      secGames = (sec.value?.events || [])
        .map((e: AnyObject) => normalizeGame(e))
        .sort((a: AnyObject, b: AnyObject) => +new Date(a.date) - +new Date(b.date))
        .slice(0, 8)
        .map(({ teamRank, ...g }: AnyObject) => g);
    }

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      mode: "preseason-aware",
      ohioState: mergeTeam(osuBlock, PRESEASON_FALLBACK.ohioState),
      mizzou: mergeTeam(mizBlock, PRESEASON_FALLBACK.mizzou),
      secGames: secGames.length ? secGames : PRESEASON_FALLBACK.secGames,
      note: "Preseason-aware college football data",
    });
  } catch (error) {
    console.error("College football live data error:", error);
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      mode: "fallback",
      ohioState: PRESEASON_FALLBACK.ohioState,
      mizzou: PRESEASON_FALLBACK.mizzou,
      secGames: PRESEASON_FALLBACK.secGames,
      note: "Verified 2026 preseason schedule fallback",
    });
  }
}
