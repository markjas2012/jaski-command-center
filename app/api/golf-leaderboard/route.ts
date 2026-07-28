import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && value) {
    const obj = value as any;
    return String(obj.displayValue ?? obj.value ?? "");
  }
  return String(value);
}

function leaderboardOrder(entry: any): number | null {
  const n = Number(entry?.order);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function safeThru(entry: any, eventState: string): string {
  if (eventState === "post") return "F";

  const candidates = [
    entry?.status?.type?.shortDetail,
    entry?.status?.type?.detail,
    entry?.status?.type?.description,
    entry?.status?.displayValue,
  ];

  for (const candidate of candidates) {
    const value = text(candidate).trim();
    if (!value) continue;

    if (/^(f|final|complete)$/i.test(value)) return "F";

    const match = value.match(/(?:thru\s*)?(\d{1,2})/i);
    if (match) {
      const holes = Number(match[1]);
      if (holes >= 1 && holes <= 18) return String(holes);
    }
  }

  return "";
}

function safeToday(entry: any): string {
  // ESPN's per-hole linescores are reliable, but without a round-par field
  // we do not manufacture a "Today" number. Blank is better than wrong.
  const explicit = [
    entry?.today,
    entry?.roundScore,
    entry?.currentRoundScore,
  ];

  for (const candidate of explicit) {
    const value = text(candidate).trim();
    if (value) return value;
  }

  return "";
}

export async function GET() {
  try {
    const response = await fetch(SCOREBOARD, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ESPN ${response.status}`);
    }

    const data: any = await response.json();
    const events = Array.isArray(data?.events) ? data.events : [];

    if (!events.length) {
      throw new Error("No PGA TOUR event returned");
    }

    // Prefer a tournament currently in progress. Otherwise use the most
    // recent completed event, then the next scheduled event.
    const event =
      events.find((e: any) => e?.status?.type?.state === "in") ??
      events.find((e: any) => e?.status?.type?.state === "post") ??
      events.find((e: any) => e?.status?.type?.state === "pre") ??
      events[0];

    const competition = event?.competitions?.[0] ?? {};
    const competitors = Array.isArray(competition?.competitors)
      ? competition.competitors
      : [];

    const eventState =
      competition?.status?.type?.state ??
      event?.status?.type?.state ??
      "";

    const leaders = competitors
      .map((entry: any) => {
        const order = leaderboardOrder(entry);
        if (order === null) return null;

        const athlete = entry?.athlete ?? {};
        const name =
          athlete?.displayName ??
          athlete?.fullName ??
          athlete?.name ??
          "";

        if (!name) return null;

        return {
          order,
          position: String(order),
          name,
          score: text(entry?.score) || "E",
          today: safeToday(entry),
          thru: safeThru(entry, eventState),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.order - b.order)
      .slice(0, 12)
      .map(({ order, ...player }: any) => player);

    const statusObj = competition?.status ?? event?.status ?? {};
    const status =
      statusObj?.type?.shortDetail ??
      statusObj?.type?.detail ??
      statusObj?.type?.description ??
      "PGA TOUR";

    return NextResponse.json({
      tournament: event?.name ?? competition?.name ?? "PGA TOUR",
      status,
      leaders,
      updated: new Date().toISOString(),
      source: "ESPN PGA TOUR scoreboard",
    });
  } catch (error) {
    return NextResponse.json({
      tournament: "PGA TOUR",
      status: "Leaderboard unavailable",
      leaders: [],
      error: "Live scoring is temporarily unavailable. PGA TOUR links below still work.",
      updated: new Date().toISOString(),
    });
  }
}
