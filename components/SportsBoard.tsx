"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SportsBoard.module.css";

type Bucket = "LIVE" | "TODAY" | "COMING UP";

type Game = {
  league: string;
  title: string;
  status: string;
  detail: string;
  href: string;
  bucket: Bucket;
  start?: string;
  logos?: string[];
};

type SportsPayload = {
  updatedAt: string;
  games: Game[];
};

const fallback: Game[] = [
  {
    league: "MLB",
    title: "Baseball scoreboard",
    status: "Open MLB",
    detail: "Scores, probable pitchers, and today's slate.",
    href: "https://www.mlb.com/scores",
    bucket: "TODAY",
  },
  {
    league: "NFL",
    title: "Football schedule",
    status: "Open NFL",
    detail: "Preseason, regular season, and upcoming games.",
    href: "https://www.nfl.com/schedules/",
    bucket: "COMING UP",
  },
  {
    league: "NCAA",
    title: "College scoreboard",
    status: "Open NCAA",
    detail: "Current college scores and schedules.",
    href: "https://www.ncaa.com/scoreboard",
    bucket: "COMING UP",
  },
];

function Section({
  title,
  eyebrow,
  games,
}: {
  title: string;
  eyebrow: string;
  games: Game[];
}) {
  if (!games.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        <div>
          <p>{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <span>Showing {games.length} {games.length === 1 ? "game" : "games"}</span>
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
              <b>{game.bucket === "COMING UP" || game.bucket === "TODAY" ? (formatCentralStart(game.start) || centralizeEspnLabel(game.status)) : centralizeEspnLabel(game.status)}</b>
            </div>
            <div className={styles.matchup}>
              {game.logos?.length ? (
                <div className={styles.logos} aria-hidden="true">
                  {game.logos.slice(0, 2).map((logo, logoIndex) => (
                    <span className={styles.logoShell} key={`${logo}-${logoIndex}`}>
                      <img
                        src={logo}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.parentElement?.remove();
                        }}
                      />
                    </span>
                  ))}
                </div>
              ) : null}
              <h4>{game.title}</h4>
            </div>
            <p>{game.detail}</p>
            <strong>Open ↗</strong>
          </a>
        ))}
      </div>
    </section>
  );
}



function centralizeEspnLabel(value?: string) {
  if (!value) return "";

  const match = value.match(
    /^(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*(EDT|EST)$/i
  );

  if (!match) return value;

  const [, monthText, dayText, hourText, minuteText, ampm, easternZone] = match;
  let hour = Number(hourText);

  if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

  // ESPN's Eastern label is one hour ahead of St. Louis in both daylight
  // and standard time for these U.S. sports schedules.
  hour -= 1;
  if (hour < 0) hour += 24;

  const centralAmpm = hour >= 12 ? "PM" : "AM";
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  const centralZone = easternZone.toUpperCase() === "EST" ? "CST" : "CDT";
  return `${Number(monthText)}/${Number(dayText)} - ${displayHour}:${minuteText} ${centralAmpm} ${centralZone}`;
}

function formatCentralStart(start?: string) {
  if (!start) return "";

  const date = new Date(start);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();

  const sameDay = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date) === new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);

  if (sameDay) return time;

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "numeric",
    day: "numeric",
  }).format(date);

  return `${day} · ${time}`;
}

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

  const games = data?.games?.length ? data.games : fallback;

  const buckets = useMemo(() => {
    const order = (a: Game, b: Game) => {
      const aTime = a.start ? new Date(a.start).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.start ? new Date(b.start).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    };

    return {
      live: games.filter((g) => g.bucket === "LIVE").sort(order).slice(0, 6),
      today: games.filter((g) => g.bucket === "TODAY").sort(order).slice(0, 6),
      coming: games.filter((g) => g.bucket === "COMING UP").sort(order).slice(0, 6),
    };
  }, [games]);

  return (
    <section className={styles.board}>
      <div className={styles.heading}>
        <div>
          <p>SMART BOARD</p>
          <h2>What’s happening now.</h2>
        </div>
        <span>{data?.updatedAt ? `Updated ${data.updatedAt}` : "Current links"}</span>
      </div>

      <Section title="Live right now." eyebrow="LIVE" games={buckets.live} />
      <Section title="Today & tonight." eyebrow="TODAY" games={buckets.today} />
      <Section title="Coming up." eyebrow="NEXT" games={buckets.coming} />

      <div className={styles.utility}>
        <div>
          <p>FULL BOARD</p>
          <h3>Need everything?</h3>
          <span>Jump to the league sites for the complete slate.</span>
        </div>
        <div className={styles.utilityLinks}>
          <a href="https://www.espn.com/scores" target="_blank" rel="noreferrer">ESPN ↗</a>
          <a href="https://www.mlb.com/scores" target="_blank" rel="noreferrer">MLB ↗</a>
          <a href="https://www.nfl.com/schedules/" target="_blank" rel="noreferrer">NFL ↗</a>
          <a href="https://www.nba.com/schedule" target="_blank" rel="noreferrer">NBA ↗</a>
          <a href="https://www.nhl.com/schedule" target="_blank" rel="noreferrer">NHL ↗</a>
          <a href="https://www.ncaa.com/scoreboard" target="_blank" rel="noreferrer">NCAA ↗</a>
        </div>
      </div>
    </section>
  );
}
