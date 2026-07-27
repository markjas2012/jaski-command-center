"use client";

import { useEffect, useState } from "react";
import styles from "./LiveStreamingRadar.module.css";

type Story = {
  title: string;
  link: string;
  source?: string;
  date?: string;
};

type RadarData = {
  updatedAt: string;
  newStreaming: Story[];
  worthWatching: Story[];
  theaters: Story[];
};

function shortDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d);
}

function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  return (
    <a
      href={story.link}
      target="_blank"
      rel="noreferrer"
      className={`${styles.card} ${featured ? styles.featured : ""}`}
    >
      <div className={styles.meta}>
        <span>{story.source || "STREAMING"}</span>
        <span>{shortDate(story.date)}</span>
      </div>
      <h3>{story.title}</h3>
      <span className={styles.open}>Read ↗</span>
    </a>
  );
}

export default function LiveStreamingRadar() {
  const [data, setData] = useState<RadarData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/streaming-radar", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((json) => !cancelled && setData(json))
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>NEW TO STREAMING</p>
            <h2>Streaming radar.</h2>
            <p>Fresh arrivals and release coverage across the services you actually use.</p>
          </div>
          <span className={styles.live}>{data ? "LIVE" : error ? "OFFLINE" : "LOADING"}</span>
        </div>

        {!data && !error && <div className={styles.loading}>Checking what just landed…</div>}
        {error && <div className={styles.loading}>Streaming radar is unavailable right now. Your service links still work below.</div>}

        {data && (
          <div className={styles.grid}>
            {data.newStreaming.slice(0, 6).map((story, i) => (
              <StoryCard story={story} featured={i === 0} key={`${story.link}-${i}`} />
            ))}
          </div>
        )}
      </section>

      <div className={styles.twoCol}>
        <section className={styles.panel}>
          <div className={styles.smallHead}>
            <div>
              <p className={styles.kicker}>WHAT TO WATCH</p>
              <h2>Worth noticing.</h2>
            </div>
          </div>

          <div className={styles.list}>
            {data?.worthWatching.slice(0, 4).map((story, i) => (
              <a href={story.link} target="_blank" rel="noreferrer" key={`${story.link}-${i}`}>
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.source || "Streaming"}{story.date ? ` · ${shortDate(story.date)}` : ""}</p>
                </div>
                <span>↗</span>
              </a>
            ))}
            {!data && !error && <p className={styles.empty}>Loading recommendations…</p>}
            {data && !data.worthWatching.length && <p className={styles.empty}>Nothing worthwhile surfaced yet.</p>}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.smallHead}>
            <div>
              <p className={styles.kicker}>IN THEATERS</p>
              <h2>Just the highlights.</h2>
            </div>
            <span className={styles.blip}>SMALL BLIP</span>
          </div>

          <div className={styles.list}>
            {data?.theaters.slice(0, 3).map((story, i) => (
              <a href={story.link} target="_blank" rel="noreferrer" key={`${story.link}-${i}`}>
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.source || "Movies"}{story.date ? ` · ${shortDate(story.date)}` : ""}</p>
                </div>
                <span>↗</span>
              </a>
            ))}
            {!data && !error && <p className={styles.empty}>Loading theatrical highlights…</p>}
            {data && !data.theaters.length && <p className={styles.empty}>No theatrical highlight surfaced yet.</p>}
          </div>
        </section>
      </div>

      {data && <p className={styles.updated}>Updated {new Date(data.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.</p>}
    </>
  );
}
