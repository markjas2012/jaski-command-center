import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OFFICIAL = "https://www.pgatour.com/fedexcup/official";
const TARGET_ID = "R-02671-2026";

type Standing = {
  rank: number;
  name: string;
  points: string;
};

function extractNextData(html: string): any | null {
  const match = html.match(
    /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
  );

  if (!match?.[1]) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function num(value: unknown): number | null {
  const s = text(value).replace(/,/g, "");
  if (!s) return null;

  const n = Number(s.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function findTargetNode(root: any): any | null {
  let found: any | null = null;

  function visit(node: any, depth = 0) {
    if (found || depth > 30 || node === null || node === undefined) return;

    if (Array.isArray(node)) {
      for (const item of node) visit(item, depth + 1);
      return;
    }

    if (typeof node === "object") {
      const values = Object.values(node);

      if (
        text((node as any)?.id) === TARGET_ID ||
        text((node as any)?.leaderboardId) === TARGET_ID ||
        text((node as any)?.rankingId) === TARGET_ID ||
        values.some((v) => typeof v === "string" && v === TARGET_ID)
      ) {
        found = node;
        return;
      }

      for (const value of values) {
        visit(value, depth + 1);
      }
    }
  }

  visit(root);
  return found;
}

function playerName(row: any): string {
  const candidates = [
    row?.displayName,
    row?.playerName,
    row?.fullName,
    row?.name,
    row?.firstName && row?.lastName
      ? `${row.firstName} ${row.lastName}`
      : "",
  ];

  for (const value of candidates) {
    const s = text(value);
    if (s && s.length > 2) return s;
  }

  return "";
}

function rankFromOfficial(row: any): number | null {
  const candidates = [
    row?.rankingData?.official,
    row?.thisWeekRank,
    row?.officialSort,
  ];

  for (const value of candidates) {
    const n = num(value);
    if (n !== null && n >= 1 && n <= 250) return n;
  }

  return null;
}

function pointsFromOfficial(row: any): string {
  const candidates = [
    row?.pointData?.official,
    row?.pointData?.projected,
  ];

  for (const value of candidates) {
    const n = num(value);
    if (n !== null && n >= 0) {
      return Math.round(n).toLocaleString("en-US");
    }
  }

  return "";
}

function parseOfficialPlayers(target: any): Standing[] {
  const officialPlayers = Array.isArray(target?.officialPlayers)
    ? target.officialPlayers
    : [];

  const rows = officialPlayers
    .map((row: any) => {
      const rank = rankFromOfficial(row);
      const name = playerName(row);
      const points = pointsFromOfficial(row);

      if (rank === null || !name || !points) return null;

      return {
        rank,
        name,
        points,
      } satisfies Standing;
    })
    .filter(Boolean) as Standing[];

  const seenRanks = new Set<number>();
  const seenNames = new Set<string>();

  return rows
    .sort((a, b) => a.rank - b.rank)
    .filter((row) => {
      const nameKey = row.name.toLowerCase();

      if (seenRanks.has(row.rank)) return false;
      if (seenNames.has(nameKey)) return false;

      seenRanks.add(row.rank);
      seenNames.add(nameKey);
      return true;
    });
}

export async function GET() {
  try {
    const res = await fetch(OFFICIAL, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`PGA TOUR ${res.status}`);
    }

    const html = await res.text();
    const nextData = extractNextData(html);

    if (!nextData) {
      throw new Error("No __NEXT_DATA__ found");
    }

    const target = findTargetNode(nextData);

    if (!target) {
      return NextResponse.json({
        standings: [],
        available: false,
        updated: new Date().toISOString(),
        source: "PGA TOUR",
        href: OFFICIAL,
      });
    }

    let standings = parseOfficialPlayers(target);

    const topFive = [1, 2, 3, 4, 5]
      .map((rank) => standings.find((row) => row.rank === rank))
      .filter(Boolean) as Standing[];

    standings = topFive.length >= 3
      ? topFive
      : standings.slice(0, 5);

    return NextResponse.json({
      standings,
      available: standings.length >= 3,
      updated: new Date().toISOString(),
      source: "PGA TOUR",
      href: OFFICIAL,
    });
  } catch {
    return NextResponse.json({
      standings: [],
      available: false,
      updated: new Date().toISOString(),
      source: "PGA TOUR",
      href: OFFICIAL,
    });
  }
}
