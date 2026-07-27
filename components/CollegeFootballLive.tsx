"use client";

import { useEffect, useState } from "react";
import styles from "./CollegeFootballLive.module.css";

type Game = {
  id: string;
  name: string;
  date: string;
  status: string;
  shortStatus?: string;
  venue?: string;
  home?: { name: string; abbreviation: string; score?: string; rank?: number | null };
  away?: { name: string; abbreviation: string; score?: string; rank?: number | null };
};

type TeamBlock = {
  team: string;
  abbreviation: string;
  record?: string;
  ranking?: number | null;
  next?: Game | null;
  recent?: Game | null;
};

type LiveData = {
  updatedAt: string;
  ohioState: TeamBlock;
  mizzou: TeamBlock;
  secGames: Game[];
  note?: string;
};

function formatWhen(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function matchup(game?: Game | null) {
  if (!game) return "No game posted yet.";
  const away = game.away?.abbreviation || game.away?.name || "TBD";
  const home = game.home?.abbreviation || game.home?.name || "TBD";
  return `${away} at ${home}`;
}

function scoreLine(game?: Game | null) {
  if (!game || game.status !== "post") return null;
  const away = game.away;
  const home = game.home;
  if (!away || !home) return null;
  return `${away.abbreviation} ${away.score ?? ""} · ${home.abbreviation} ${home.score ?? ""}`;
}

function TeamCard({ title, accent, data }: { title: string; accent: string; data: TeamBlock }) {
  return (
    <article className={styles.teamCard} style={{ ["--accent" as string]: accent }}>
      <div className={styles.teamTop}>
        <span>{title}</span>
        <span>{data.ranking ? `#${data.ranking}` : data.record || "2026"}</span>
      </div>

      <div className={styles.gameBlock}>
        <p className={styles.label}>NEXT GAME</p>
        <h3>{matchup(data.next)}</h3>
        {data.next && <p>{formatWhen(data.next.date)}{data.next.venue ? ` · ${data.next.venue}` : ""}</p>}
      </div>

      <div className={styles.divider} />

      <div className={styles.gameBlock}>
        <p className={styles.label}>{data.recent ? "RECENT" : "PRESEASON"}</p>
        <h4>{data.recent ? matchup(data.recent) : "Opening game is on the board."}</h4>
        <p>{data.recent ? (scoreLine(data.recent) || formatWhen(data.recent.date)) : "Results will appear here once the season begins."}</p>
      </div>
    </article>
  );
}

export default function CollegeFootballLive() {
  const [data, setData] = useState<LiveData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/college-football", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Live sports request failed");
        return res.json();
      })
      .then((json) => !cancelled && setData(json))
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, []);

  return (
    <section className={styles.liveSection} aria-labelledby="live-cfb-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>LIVE COLLEGE FOOTBALL</p>
          <h2 id="live-cfb-title">Game week.</h2>
          <p>Ohio State, Mizzou, and the SEC — pulled fresh when you open the room.</p>
        </div>
        <div className={styles.liveBadge}>
          <span className={styles.dot} />
          {data ? "LIVE DATA" : error ? "OFFLINE" : "LOADING"}
        </div>
      </div>

      {!data && !error && <div className={styles.loading}>Checking the college football board…</div>}

      {error && (
        <div className={styles.loading}>
          Live data is unavailable right now. The Sports room and official team links still work normally.
        </div>
      )}

      {data && (
        <>
          <div className={styles.teamGrid}>
            <TeamCard title="OHIO STATE" accent="#ba0c2f" data={data.ohioState} />
            <TeamCard title="MIZZOU" accent="#d6a900" data={data.mizzou} />
          </div>

          <div className={styles.secPanel}>
            <div className={styles.secHeading}>
              <div>
                <p className={styles.label}>SEC FOOTBALL</p>
                <h3>Games worth knowing about.</h3>
              </div>
              <span>THIS WEEK</span>
            </div>

            <div className={styles.secList}>
              {data.secGames.length ? data.secGames.map((game) => (
                <div className={styles.secGame} key={game.id}>
                  <div>
                    <strong>{matchup(game)}</strong>
                    <p>{formatWhen(game.date)}{game.venue ? ` · ${game.venue}` : ""}</p>
                  </div>
                  <span className={styles.gameStatus}>
                    {scoreLine(game) || game.shortStatus || (game.status === "pre" ? "UPCOMING" : game.status.toUpperCase())}
                  </span>
                </div>
              )) : (
                <p className={styles.empty}>Opening-week SEC games will appear here as the schedule source publishes them.</p>
              )}
            </div>
          </div>

          <p className={styles.updated}>
            Updated {new Date(data.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.
            Preseason schedules are shown even before live game-week feeds begin.
          </p>
        </>
      )}
    </section>
  );
}
