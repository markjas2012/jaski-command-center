"use client";

import { useEffect, useState } from "react";
import styles from "./StLouisLatestScores.module.css";

type TeamSide = {
  name: string;
  abbreviation: string;
  score?: string;
};

type Result = {
  team: string;
  league: string;
  tone: "cardinals" | "blues" | "city";
  date?: string;
  status?: string;
  home?: TeamSide;
  away?: TeamSide;
  sourceUrl: string;
};

type ScoreData = {
  updatedAt: string;
  results: Result[];
};

function dateLabel(value?: string) {
  if (!value) return "Latest final";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Latest final";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(d);
}

function resultLine(result: Result) {
  if (!result.home || !result.away) return "Latest score unavailable";
  return `${result.away.abbreviation} ${result.away.score ?? "–"} · ${result.home.abbreviation} ${result.home.score ?? "–"}`;
}

export default function StLouisLatestScores() {
  const [data, setData] = useState<ScoreData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/st-louis-scores", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((json) => !cancelled && setData(json))
      .catch(() => !cancelled && setData(null));
    return () => { cancelled = true; };
  }, []);

  const placeholders: Result[] = [
    { team: "Cardinals", league: "MLB", tone: "cardinals", sourceUrl: "https://www.mlb.com/cardinals" },
    { team: "Blues", league: "NHL", tone: "blues", sourceUrl: "https://www.nhl.com/blues/" },
    { team: "CITY SC", league: "MLS", tone: "city", sourceUrl: "https://www.stlcitysc.com/" },
  ];

  const results = data?.results?.length ? data.results : placeholders;

  return (
    <div className={styles.wrap} aria-label="Latest St. Louis sports scores">
      {results.map((result) => (
        <a
          key={result.team}
          href={result.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className={`${styles.card} ${styles[result.tone]}`}
        >
          <div className={styles.top}>
            <span>{result.league}</span>
            <span>{dateLabel(result.date)}</span>
          </div>
          <strong>{result.team}</strong>
          <div className={styles.score}>
            {data ? resultLine(result) : "Loading…"}
          </div>
          <span className={styles.open}>Team home ↗</span>
        </a>
      ))}
    </div>
  );
}
