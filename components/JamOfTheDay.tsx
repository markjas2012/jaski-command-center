"use client";

import { useEffect, useState } from "react";
import styles from "./JamOfTheDay.module.css";

type Highlight = {
  label: string;
  href?: string;
};

type JamPick = {
  artist: string;
  date?: string;
  venue?: string;
  location?: string;
  title?: string;
  source?: string;
  href: string;
  why?: string;
  highlights?: Highlight[];
  artwork?: string;
  visualKey?: string;
};

type Feed = {
  updatedAt?: string;
  pick?: JamPick | null;
};

export default function JamOfTheDay() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const pick = feed?.pick;

  useEffect(() => {
    let active = true;

    fetch("/api/jam-of-day", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => active && setFeed(data))
      .catch(() => active && setFeed(null));

    return () => {
      active = false;
    };
  }, []);

  const visualClass =
    pick?.visualKey === "dead"
      ? styles.dead
      : pick?.visualKey === "phish"
      ? styles.phish
      : pick?.visualKey === "panic"
      ? styles.panic
      : styles.discovery;

  return (
    <section className={styles.wrap}>
      <div className={styles.kickerRow}>
        <div className={styles.kicker}>JAM OF THE DAY</div>
        <span className={styles.source}>{pick?.source || "DAILY PICK"}</span>
      </div>

      <div className={styles.body}>
        {pick?.artwork ? (
          <a
            className={styles.artwork}
            href={pick.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Listen to ${pick.artist}`}
          >
            <img src={pick.artwork} alt={`${pick.artist} — ${pick.title || "Jam of the Day"}`} />
          </a>
        ) : (
          <div className={`${styles.artworkFallback} ${visualClass}`} aria-hidden="true">
            <div className={styles.visualMark}>
              <span>{pick?.artist || "Jam Room"}</span>
              <strong>{pick?.title || "Daily Pick"}</strong>
            </div>
          </div>
        )}

        <div className={styles.identity}>
          <span className={styles.artist}>{pick?.artist || "Jam Room"}</span>
          <h2>{pick?.title || "Put on something worth hearing."}</h2>

          <div className={styles.meta}>
            {[pick?.date, pick?.venue, pick?.location].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          {pick?.why ? (
            <div className={styles.why}>
              <strong>WHY THIS ONE</strong>
              <p>{pick.why}</p>
            </div>
          ) : null}

          {pick?.highlights?.length ? (
            <div className={styles.highlights}>
              <strong>LISTEN FOR</strong>
              <div>
                {pick.highlights.slice(0, 3).map((item) =>
                  item.href ? (
                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                      {item.label} ↗
                    </a>
                  ) : (
                    <span key={item.label}>{item.label}</span>
                  )
                )}
              </div>
            </div>
          ) : null}

          {pick?.href ? (
            <a className={styles.listen} href={pick.href} target="_blank" rel="noreferrer">
              Listen now ↗
            </a>
          ) : null}
        </div>

        <div className={styles.dateBadge}>
          <span>DAILY PICK</span>
          <strong>{feed?.updatedAt || "Today"}</strong>
        </div>
      </div>
    </section>
  );
}
