"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./FeaturedToday.module.css";

type ScoreSide = { abbreviation?: string; score?: string };
type ScoreResult = {
  team: string;
  league: string;
  date?: string;
  home?: ScoreSide;
  away?: ScoreSide;
};

type SportsScores = { results?: ScoreResult[] };

type Game = {
  date?: string;
  home?: { abbreviation?: string };
  away?: { abbreviation?: string };
};

type CollegeData = {
  ohioState?: { next?: Game | null };
  mizzou?: { next?: Game | null };
};

type Story = { title: string; link: string; source?: string };
type StreamingData = { worthWatching?: Story[]; newStreaming?: Story[] };

type Show = {
  title: string;
  status: "watching" | "finished";
};

type TvStatus = {
  found?: boolean;
  next?: {
    season?: number | null;
    number?: number | null;
    airstamp?: string | null;
  } | null;
};

type Feature = {
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  tone: "sports" | "football" | "tv" | "movies";
  external?: boolean;
};

const TV_STORAGE_KEY = "jaski-currently-watching-v1";

function shortDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function scoreText(result?: ScoreResult) {
  if (!result?.home || !result?.away) return "Latest result";
  return `${result.away.abbreviation ?? ""} ${result.away.score ?? "–"} · ${result.home.abbreviation ?? ""} ${result.home.score ?? "–"}`;
}

function matchup(game?: Game | null) {
  if (!game?.home || !game?.away) return "";
  return `${game.away.abbreviation ?? "TBD"} at ${game.home.abbreviation ?? "TBD"}`;
}

export default function FeaturedToday() {
  const [scores, setScores] = useState<SportsScores | null>(null);
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [streaming, setStreaming] = useState<StreamingData | null>(null);
  const [tvFeature, setTvFeature] = useState<Feature | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      fetch("/api/st-louis-scores", { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()),
      fetch("/api/college-football", { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()),
      fetch("/api/streaming-radar", { cache: "no-store" }).then((r) => r.ok ? r.json() : Promise.reject()),
    ]).then(([scoreResult, collegeResult, streamingResult]) => {
      if (cancelled) return;
      if (scoreResult.status === "fulfilled") setScores(scoreResult.value);
      if (collegeResult.status === "fulfilled") setCollege(collegeResult.value);
      if (streamingResult.status === "fulfilled") setStreaming(streamingResult.value);
    });

    try {
      const raw = window.localStorage.getItem(TV_STORAGE_KEY);
      const shows: Show[] = raw ? JSON.parse(raw) : [];
      const active = shows.find((show) => show.status === "watching");

      if (active?.title) {
        fetch(`/api/tv-status?q=${encodeURIComponent(active.title)}`, { cache: "no-store" })
          .then((r) => r.ok ? r.json() : Promise.reject())
          .then((status: TvStatus) => {
            if (cancelled || !status?.next) return;
            const ep = status.next;
            const epText = ep.season && ep.number ? `S${ep.season} · E${ep.number}` : "Next episode";
            setTvFeature({
              eyebrow: "WATCHLIST",
              title: active.title,
              detail: `${epText}${ep.airstamp ? ` · ${shortDate(ep.airstamp)}` : ""}`,
              href: "/tv",
              tone: "tv",
            });
          })
          .catch(() => {});
      }
    } catch {}

    return () => { cancelled = true; };
  }, []);

  const features = useMemo(() => {
    const items: Feature[] = [];

    const latest = scores?.results?.[0];
    if (latest) {
      items.push({
        eyebrow: "LATEST SCORE",
        title: latest.team,
        detail: scoreText(latest),
        href: "/sports",
        tone: "sports",
      });
    }

    const osu = college?.ohioState?.next;
    const miz = college?.mizzou?.next;
    const nextGame = [osu, miz]
      .filter(Boolean)
      .sort((a, b) => +new Date(a?.date || 0) - +new Date(b?.date || 0))[0];

    if (nextGame) {
      items.push({
        eyebrow: "COLLEGE FOOTBALL",
        title: matchup(nextGame) || "Next game",
        detail: shortDate(nextGame.date),
        href: "/sports",
        tone: "football",
      });
    }

    if (tvFeature) items.push(tvFeature);

    const story = streaming?.worthWatching?.[0] || streaming?.newStreaming?.[0];
    if (story) {
      items.push({
        eyebrow: "STREAMING PICK",
        title: story.title,
        detail: story.source || "Worth noticing",
        href: story.link,
        tone: "movies",
        external: true,
      });
    }

    return items.slice(0, 4);
  }, [scores, college, streaming, tvFeature]);

  return (
    <section className={styles.featured} aria-labelledby="featured-today-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>FEATURED TODAY</p>
          <h2 id="featured-today-title">A few things worth your attention.</h2>
          <p>Live highlights from the rooms you already use — kept deliberately small.</p>
        </div>
        <span className={styles.live}>LIVE</span>
      </div>

      {features.length === 0 ? (
        <div className={styles.loading}>Checking today&apos;s highlights…</div>
      ) : (
        <div className={styles.grid}>
          {features.map((item, index) => {
            const content = (
              <>
                <div className={styles.cardTop}>
                  <span>{item.eyebrow}</span>
                  <span>0{index + 1}</span>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
                <span className={styles.open}>{item.external ? "Open ↗" : "View room →"}</span>
              </>
            );

            return item.external ? (
              <a
                className={`${styles.card} ${styles[item.tone]}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                key={`${item.eyebrow}-${item.title}`}
              >
                {content}
              </a>
            ) : (
              <Link
                className={`${styles.card} ${styles[item.tone]}`}
                href={item.href}
                key={`${item.eyebrow}-${item.title}`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
