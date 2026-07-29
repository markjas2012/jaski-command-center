"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./WorthWatching.module.css";

type Bucket = "LIVE" | "TODAY" | "COMING UP";

type BoardGame = {
  league: string;
  title: string;
  status: string;
  detail: string;
  href: string;
  bucket: Bucket;
  start?: string;
  logo?: string;
};

type StlTeam = {
  key: "cardinals" | "blues" | "city" | "mizzou";
  name: string;
  shortName: string;
  record?: string;
  state: "pre" | "in" | "post" | "unknown";
  label: "LIVE NOW" | "TODAY" | "FINAL" | "NEXT UP" | "NO GAME";
  opponent?: string;
  opponentAbbr?: string;
  homeAway?: "home" | "away";
  startTime?: string;
  status?: string;
  network?: string;
  score?: string;
  latestResult?: string;
  eventUrl?: string;
};

type SportsPayload = { games?: BoardGame[] };
type StlPayload = { teams?: StlTeam[] };

type Pick = {
  id: string;
  league: string;
  title: string;
  status: string;
  detail: string;
  href: string;
  reason: string;
  score: number;
  start?: string;
};

const CENTRAL_TZ = "America/Chicago";

const leagueWeight: Record<string, number> = {
  NFL: 42,
  NCAA: 36,
  MLB: 32,
  NHL: 30,
  NBA: 30,
  MLS: 28,
};

const identity: Record<StlTeam["key"], { league: string; mark: string; fallbackUrl: string; logo: string }> = {
  cardinals: { league: "MLB", mark: "STL", logo: "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png", fallbackUrl: "https://www.espn.com/mlb/team/_/name/stl/st-louis-cardinals" },
  blues: { league: "NHL", mark: "STL", logo: "https://a.espncdn.com/i/teamlogos/nhl/500/stl.png", fallbackUrl: "https://www.espn.com/nhl/team/_/name/stl/st-louis-blues" },
  city: { league: "MLS", mark: "CITY", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/21812.png", fallbackUrl: "https://www.espn.com/soccer/club/_/id/21812/st-louis-city-sc" },
  mizzou: { league: "NCAA", mark: "M", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/142.png", fallbackUrl: "https://www.espn.com/college-football/team/_/id/142/missouri-tigers" },
};

function formatWhen(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function matchup(team: StlTeam) {
  if (!team.opponentAbbr) return team.shortName;
  const mine = team.key === "mizzou" ? "MIZ" : "STL";
  return team.homeAway === "away" ? `${mine} @ ${team.opponentAbbr}` : `${team.opponentAbbr} @ ${mine}`;
}

function teamDetail(team: StlTeam) {
  const parts: string[] = [];
  if (team.label === "LIVE NOW" || team.label === "FINAL") {
    if (team.score) parts.push(team.score);
    if (team.status) parts.push(team.status);
  } else {
    const when = formatWhen(team.startTime);
    if (when) parts.push(when);
  }
  if (team.network) parts.push(team.network);
  return parts.join(" · ") || "Open for game details.";
}

function startMs(value?: string) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
}

function isStLouisText(value: string) {
  const text = value.toLowerCase();
  return (
    text.includes("stl") ||
    text.includes("st. louis") ||
    text.includes("cardinals") ||
    text.includes("blues") ||
    text.includes("city sc") ||
    text.includes("mizzou") ||
    text.includes("missouri")
  );
}

function rankTeam(team: StlTeam, now: number): Pick | null {
  if (team.label === "NO GAME" || team.label === "FINAL") return null;

  const meta = identity[team.key];
  const when = startMs(team.startTime);
  const daysAway = when === Number.MAX_SAFE_INTEGER ? 999 : Math.max(0, (when - now) / 86_400_000);

  let score = 0;
  let reason = "ST. LOUIS FIRST";
  let status = team.label;

  if (team.label === "LIVE NOW") score = 310;
  else if (team.label === "TODAY") score = 285;
  else if (team.label === "NEXT UP" && daysAway <= 3) {
    score = 225 - daysAway * 5;
    reason = "COMING SOON";
  } else if (team.label === "NEXT UP" && daysAway <= 10) {
    score = 175 - daysAway * 3;
    reason = "NEXT FOR STL";
  } else {
    return null;
  }

  return {
    id: `stl-${team.key}-${team.startTime ?? team.label}`,
    league: meta.league,
    title: matchup(team),
    status,
    detail: teamDetail(team),
    href: team.eventUrl || meta.fallbackUrl,
    reason,
    score,
    start: team.startTime,
    logo: meta.logo,
  };
}

function rankBoardGame(game: BoardGame): Pick | null {
  if (game.bucket === "COMING UP") return null;

  const local = isStLouisText(`${game.title} ${game.detail}`);
  const live = game.bucket === "LIVE";
  const today = game.bucket === "TODAY";

  let score = leagueWeight[game.league] ?? 12;
  if (live) score += 120;
  if (today) score += 65;
  if (local) score += 120;

  return {
    id: `board-${game.league}-${game.title}-${game.start ?? game.status}`,
    league: game.league,
    title: game.title,
    status: live ? "LIVE NOW" : today ? "TODAY" : game.status,
    detail: game.detail,
    href: game.href,
    reason: local ? "ST. LOUIS FIRST" : live ? "LIVE NOW" : "ON TODAY",
    score,
    start: game.start,
  };
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sameGame(a: Pick, b: Pick) {
  const left = normalize(a.title);
  const right = normalize(b.title);
  if (left === right) return true;

  const leftTokens = new Set(left.split(" ").filter(Boolean));
  const rightTokens = right.split(" ").filter(Boolean);
  const overlap = rightTokens.filter((token) => leftTokens.has(token)).length;
  if (a.league === b.league && overlap >= 2) return true;

  return isStLouisText(a.title) && isStLouisText(b.title) && a.league === b.league;
}

export default function WorthWatching() {
  const [sports, setSports] = useState<SportsPayload | null>(null);
  const [stl, setStl] = useState<StlPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const stamp = Date.now();

    Promise.allSettled([
      fetch(`/api/sports-board?t=${stamp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { "Cache-Control": "no-cache" },
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Sports board HTTP ${r.status}`)))),
      fetch(`/api/sports/stl?t=${stamp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { "Cache-Control": "no-cache" },
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`STL feed HTTP ${r.status}`)))),
    ]).then(([sportsResult, stlResult]) => {
      if (sportsResult.status === "fulfilled") setSports(sportsResult.value);
      else setSports({ games: [] });

      if (stlResult.status === "fulfilled") setStl(stlResult.value);
      else setStl({ teams: [] });
    });

    return () => controller.abort();
  }, []);

  const picks = useMemo(() => {
    const now = Date.now();
    const candidates: Pick[] = [];

    for (const team of stl?.teams ?? []) {
      const pick = rankTeam(team, now);
      if (pick) candidates.push(pick);
    }

    for (const game of sports?.games ?? []) {
      const pick = rankBoardGame(game);
      if (pick) candidates.push(pick);
    }

    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return startMs(a.start) - startMs(b.start);
    });

    const unique: Pick[] = [];
    for (const candidate of candidates) {
      if (!unique.some((item) => sameGame(item, candidate))) unique.push(candidate);
      if (unique.length === 3) break;
    }

    return unique;
  }, [sports, stl]);

  const loading = sports === null || stl === null;

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>WORTH WATCHING</p>
          <h2>Don&apos;t scan the whole board.</h2>
        </div>
        <span>1–3 games, picked for you</span>
      </div>

      {loading ? (
        <div className={styles.empty}>Checking today&apos;s slate…</div>
      ) : picks.length ? (
        <div className={styles.grid}>
          {picks.map((pick, index) => (
            <a
              key={pick.id}
              className={index === 0 ? `${styles.card} ${styles.primary}` : styles.card}
              href={pick.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.topline}>
                <span>{pick.reason}</span>
                <b>{pick.league}</b>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {pick.logo ? (
                  <img src={pick.logo} alt="" aria-hidden="true" style={{ width: "28px", height: "28px", objectFit: "contain", flex: "0 0 auto" }} />
                ) : null}
                <h3>{pick.title}</h3>
              </div>
              <p>{pick.detail}</p>
              <div className={styles.footer}>
                <strong>{pick.status}</strong>
                <span>Open ↗</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>Nothing demands your attention right now.</strong>
          <span>The Smart Board below still has the complete slate.</span>
        </div>
      )}
    </section>
  );
}
