"use client";

import { useEffect, useState } from "react";
import styles from "./JamTonight.module.css";

type LiveItem = {
  artist: string;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  source: "Nugs" | "JamBase";
  href: string;
  action: "Watch" | "Details";
};

type Feed = {
  updatedAt?: string;
  nugs: LiveItem[];
  local: LiveItem[];
};

function Card({ item, featured = false }: { item: LiveItem; featured?: boolean }) {
  return (
    <a className={`${styles.card} ${featured ? styles.featured : ""}`} href={item.href} target="_blank" rel="noreferrer">
      <div className={styles.meta}>
        <span>{item.source}</span>
        <small>{[item.date, item.time].filter(Boolean).join(" · ") || "Upcoming"}</small>
      </div>
      <h4>{item.artist}</h4>
      <strong>{item.venue || "Show details"}</strong>
      {item.location ? <p>{item.location}</p> : null}
      <b>{item.action} ↗</b>
    </a>
  );
}

export default function JamTonight() {
  const [feed, setFeed] = useState<Feed | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/live-tonight", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => active && setFeed(data))
      .catch(() => active && setFeed({ updatedAt: "", nugs: [], local: [] }));
    return () => { active = false; };
  }, []);

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>WHAT’S HAPPENING LIVE</p>
          <h2>Shows to watch. Shows to go see.</h2>
          <small>One featured pick plus four more on each side. Everything else stays one click away.</small>
        </div>
        <span>{feed?.updatedAt ? `Updated ${feed.updatedAt}` : "Live listings"}</span>
      </div>

      <div className={styles.columns}>
        <div className={styles.group}>
          <div className={styles.groupHead}>
            <div>
              <span>NUGS</span>
              <h3>Upcoming livestreams.</h3>
            </div>
            <a href="https://www.nugs.net/watch-live-music/" target="_blank" rel="noreferrer">See all streams ↗</a>
          </div>
          <div className={styles.grid}>
            {(feed?.nugs || []).slice(0, 5).map((item, index) => <Card key={item.href + item.date} item={item} featured={index === 0} />)}
          </div>
          {!feed?.nugs?.length ? <p className={styles.empty}>No upcoming Nugs streams were verified right now.</p> : null}
        </div>

        <div className={styles.group}>
          <div className={styles.groupHead}>
            <div>
              <span>JAMBASE · NEAR ST. LOUIS FIRST</span>
              <h3>Go see something live.</h3>
            </div>
            <a href="https://www.jambase.com/concerts/us/missouri" target="_blank" rel="noreferrer">See all area shows ↗</a>
          </div>
          <div className={styles.grid}>
            {(feed?.local || []).slice(0, 5).map((item, index) => <Card key={item.href + item.date} item={item} featured={index === 0} />)}
          </div>
          {!feed?.local?.length ? <p className={styles.empty}>Open JamBase for current Missouri-area listings.</p> : null}
        </div>
      </div>
    </section>
  );
}
