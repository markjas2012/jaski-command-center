"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SportsScoreStrip.module.css";

type TeamKey = "cardinals" | "blues" | "city" | "mizzou";
type Team = {
  key: TeamKey;
  shortName: string;
  label: "LIVE NOW" | "TODAY" | "FINAL" | "NEXT UP" | "NO GAME";
  latestResult?: string;
  latestResultAt?: string;
  latestTeamScore?: string;
  latestOpponentScore?: string;
  latestOpponentAbbr?: string;
};
type Payload = { teams?: Team[] };

const logo: Record<TeamKey, string> = {
  cardinals: "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png",
  blues: "https://a.espncdn.com/i/teamlogos/nhl/500/stl.png",
  city: "https://a.espncdn.com/i/teamlogos/soccer/500/21812.png",
  mizzou: "https://a.espncdn.com/i/teamlogos/ncaa/500/142.png",
};

function fallbackScore(team: Team) {
  const match = team.latestResult?.match(/^(?:[WLT]\s+)?(\d+)-(\d+)\s+vs\s+(.+)$/i);
  return match ? { mine: match[1], theirs: match[2], opponent: match[3] } : null;
}

export default function SportsScoreStrip() {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/sports/stl?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setPayload)
      .catch(() => setPayload({ teams: [] }));
    return () => controller.abort();
  }, []);

  const finals = useMemo(() => {
    return (payload?.teams || [])
      .map((team) => {
        const fallback = fallbackScore(team);
        const mine = team.latestTeamScore || fallback?.mine;
        const theirs = team.latestOpponentScore || fallback?.theirs;
        const opponent = team.latestOpponentAbbr || fallback?.opponent;
        return mine !== undefined && theirs !== undefined && opponent
          ? { ...team, mine, theirs, opponent }
          : null;
      })
      .filter((team): team is NonNullable<typeof team> => Boolean(team))
      .sort((a, b) => new Date(b.latestResultAt || 0).getTime() - new Date(a.latestResultAt || 0).getTime())
      .slice(0, 2);
  }, [payload]);

  const liveCount = (payload?.teams || []).filter((team) => team.label === "LIVE NOW").length;

  return (
    <section className={styles.strip}>
      <div className={styles.identity}>
        <p>ST. LOUIS / TODAY</p>
        <h1>Sports Room.</h1>
        <span>Your teams. Last results. What’s next.</span>
      </div>

      <div className={styles.finals}>
        <p className={`${styles.endBay} ${styles.finalsLabel}`}>LATEST FINALS</p>
        <div className={styles.scoreGrid}>
          {finals.length ? finals.map((item) => (
            <div className={styles.score} key={item.key}>
              <span className={styles.logo}>
                <img src={logo[item.key]} alt="" aria-hidden="true" />
              </span>
              <strong>{item.shortName}</strong>
              <b>{item.mine}</b>
              <i>—</i>
              <b>{item.theirs}</b>
              <span>{item.opponent}</span>
            </div>
          )) : (
            <span className={styles.empty}>No recent finals in the current feed.</span>
          )}
        </div>
      </div>

      <div className={`${styles.endBay} ${styles.liveStatus} ${liveCount ? styles.isLive : ""}`}>
        {liveCount ? `${liveCount} LIVE NOW` : "NO LIVE GAMES"}
      </div>
    </section>
  );
}
