"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./WorthWatching.module.css";

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

type TeamCard = {
  team: string;
  league: string;
  mark: string;
  state: "LIVE" | "TODAY" | "NEXT" | "OFF";
  headline: string;
  detail: string;
  href: string;
};

type SportsPayload = { games?: Game[] };
type TeamsPayload = { teams?: TeamCard[] };

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

const leagueWeight: Record<string, number> = {
  NFL: 34,
  NCAA: 28,
  MLB: 24,
  NHL: 22,
  NBA: 22,
};

function isStLouisText(value: string) {
  const text = value.toLowerCase();
  return (
    text.includes("stl") ||
    text.includes("st. louis") ||
    text.includes("cardinals") ||
    text.includes("blues")
  );
}

function rankBoardGame(game: Game): Pick {
  const local = isStLouisText(`${game.title} ${game.detail}`);
  const live = game.bucket === "LIVE";
  const today = game.bucket === "TODAY";

  let score = leagueWeight[game.league] ?? 10;
  if (live) score += 85;
  if (today) score += 55;
  if (local) score += 100;

  return {
    id: `board-${game.league}-${game.title}`,
    league: game.league,
    title: game.title,
    status: live ? "LIVE NOW" : today ? "TODAY" : game.status,
    detail: game.detail,
    href: game.href,
    reason: local ? "YOUR TEAM" : live ? "LIVE NOW" : "ON TODAY",
    score,
    start: game.start,
  };
}

function rankTeam(team: TeamCard): Pick | null {
  if (team.state !== "LIVE" && team.state !== "TODAY") return null;

  return {
    id: `team-${team.league}-${team.team}`,
    league: team.league,
    title: team.headline,
    status: team.state === "LIVE" ? "LIVE NOW" : "TODAY",
    detail: team.detail,
    href: team.href,
    reason: "ST. LOUIS FIRST",
    score: team.state === "LIVE" ? 240 : 205,
  };
}

function sameGame(a: Pick, b: Pick) {
  const left = a.title.toLowerCase();
  const right = b.title.toLowerCase();
  if (left === right) return true;

  const bothLocal = isStLouisText(left) && isStLouisText(right);
  return bothLocal && a.league === b.league;
}

export default function WorthWatching() {
  const [sports, setSports] = useState<SportsPayload | null>(null);
  const [teams, setTeams] = useState<TeamsPayload | null>(null);

  useEffect(() => {
    const stamp = Date.now();

    Promise.allSettled([
      fetch(`/api/sports-board?t=${stamp}`, { cache: "no-store" }).then((r) =>
        r.ok ? r.json() : Promise.reject()
      ),
      fetch(`/api/my-teams?t=${stamp}`, { cache: "no-store" }).then((r) =>
        r.ok ? r.json() : Promise.reject()
      ),
    ]).then(([sportsResult, teamsResult]) => {
      if (sportsResult.status === "fulfilled") setSports(sportsResult.value);
      else setSports({ games: [] });

      if (teamsResult.status === "fulfilled") setTeams(teamsResult.value);
      else setTeams({ teams: [] });
    });
  }, []);

  const picks = useMemo(() => {
    const candidates: Pick[] = [];

    for (const team of teams?.teams ?? []) {
      const pick = rankTeam(team);
      if (pick) candidates.push(pick);
    }

    for (const game of sports?.games ?? []) {
      if (game.bucket === "COMING UP") continue;
      candidates.push(rankBoardGame(game));
    }

    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const at = a.start ? new Date(a.start).getTime() : Number.MAX_SAFE_INTEGER;
      const bt = b.start ? new Date(b.start).getTime() : Number.MAX_SAFE_INTEGER;
      return at - bt;
    });

    const unique: Pick[] = [];
    for (const candidate of candidates) {
      if (!unique.some((item) => sameGame(item, candidate))) unique.push(candidate);
      if (unique.length === 3) break;
    }

    return unique;
  }, [sports, teams]);

  const loading = sports === null || teams === null;

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>WORTH WATCHING</p>
          <h2>Don’t scan the whole board.</h2>
        </div>
        <span>1–3 games, picked for you</span>
      </div>

      {loading ? (
        <div className={styles.empty}>Checking today’s slate…</div>
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
              <h3>{pick.title}</h3>
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
          <span>The full Smart Board is right below when you want the complete slate.</span>
        </div>
      )}
    </section>
  );
}
