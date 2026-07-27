"use client";

import { useEffect, useState } from "react";
import styles from "./SportsBoard.module.css";

type Game = {
  league: string;
  title: string;
  status: string;
  detail: string;
  href: string;
};

type SportsPayload = {
  updatedAt: string;
  games: Game[];
  diagnostics?: string[];
};

const fallback: Game[] = [
  {
    league: "MLB",
    title: "Baseball scoreboard",
    status: "Open MLB",
    detail: "Scores, probable pitchers, and today's slate.",
    href: "https://www.mlb.com/scores",
  },
  {
    league: "NFL",
    title: "Football schedule",
    status: "Open NFL",
    detail: "Preseason, regular season, and upcoming games.",
    href: "https://www.nfl.com/schedules/",
  },
  {
    league: "NCAA",
    title: "College scoreboard",
    status: "Open NCAA",
    detail: "Current college scores and schedules.",
    href: "https://www.ncaa.com/scoreboard",
  },
];

export default function SportsBoard() {
  const [data, setData] = useState<SportsPayload | null>(null);

  useEffect(() => {
    fetch(`/api/sports-board?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData({ updatedAt: "", games: fallback }));
  }, []);

  const games = data?.games?.length ? data.games.slice(0, 6) : fallback;

  return (
    <section className={styles.board}>
      <div className={styles.heading}>
        <div>
          <p>LIVE BOARD</p>
          <h2>Today & tonight.</h2>
        </div>
        <span>{data?.updatedAt ? `Updated ${data.updatedAt}` : "Current links"}</span>
      </div>

      <div className={styles.grid}>
        {games.map((game, index) => (
          <a
            key={`${game.league}-${game.title}-${index}`}
            className={styles.game}
            href={game.href}
            target="_blank"
            rel="noreferrer"
          >
            <div className={styles.topline}>
              <span>{game.league}</span>
              <b>{game.status}</b>
            </div>
            <h3>{game.title}</h3>
            <p>{game.detail}</p>
            <strong>Open ↗</strong>
          </a>
        ))}
      </div>

      <div className={styles.utility}>
        <div>
          <p>QUICK CHECK</p>
          <h3>Need the full board?</h3>
          <span>Use the league sites for complete scores, schedules, and standings.</span>
        </div>
        <div className={styles.utilityLinks}>
          <a href="https://www.espn.com/scores" target="_blank" rel="noreferrer">ESPN Scores ↗</a>
          <a href="https://www.mlb.com/scores" target="_blank" rel="noreferrer">MLB ↗</a>
          <a href="https://www.nfl.com/schedules/" target="_blank" rel="noreferrer">NFL ↗</a>
          <a href="https://www.ncaa.com/scoreboard" target="_blank" rel="noreferrer">NCAA ↗</a>
        </div>
      </div>
    </section>
  );
}
