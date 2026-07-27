"use client";

import { useEffect, useState } from "react";
import styles from "./MyTeams.module.css";

type TeamCard = {
  team: string;
  league: string;
  mark: string;
  state: "LIVE" | "TODAY" | "NEXT" | "OFF";
  headline: string;
  detail: string;
  href: string;
};

type Payload = {
  updatedAt: string;
  teams: TeamCard[];
};

const fallback: TeamCard[] = [
  {
    team: "Cardinals",
    league: "MLB",
    mark: "STL",
    state: "NEXT",
    headline: "St. Louis Cardinals",
    detail: "Open the Cardinals schedule and scoreboard.",
    href: "https://www.espn.com/mlb/team/_/name/stl/st-louis-cardinals",
  },
  {
    team: "Blues",
    league: "NHL",
    mark: "STL",
    state: "OFF",
    headline: "St. Louis Blues",
    detail: "Open the Blues schedule and team page.",
    href: "https://www.espn.com/nhl/team/_/name/stl/st-louis-blues",
  },
];

function stateLabel(state: TeamCard["state"]) {
  if (state === "LIVE") return "LIVE NOW";
  if (state === "TODAY") return "TODAY";
  if (state === "NEXT") return "NEXT UP";
  return "TEAM";
}

export default function MyTeams() {
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    fetch(`/api/my-teams?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData({ updatedAt: "", teams: fallback }));
  }, []);

  const teams = data?.teams?.length ? data.teams : fallback;

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>MY TEAMS</p>
          <h2>St. Louis first.</h2>
        </div>
        <span>{data?.updatedAt ? `Updated ${data.updatedAt}` : "Cardinals · Blues"}</span>
      </div>

      <div className={styles.grid}>
        {teams.map((item) => (
          <a
            key={`${item.league}-${item.team}`}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
          >
            <div className={styles.identity}>
              <span className={styles.mark}>{item.mark}</span>
              <div>
                <small>{item.league}</small>
                <strong>{item.team}</strong>
              </div>
            </div>

            <div className={styles.game}>
              <span className={item.state === "LIVE" ? styles.live : styles.state}>
                {stateLabel(item.state)}
              </span>
              <h3>{item.headline}</h3>
              <p>{item.detail}</p>
            </div>

            <b>Open ↗</b>
          </a>
        ))}
      </div>
    </section>
  );
}
