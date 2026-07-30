"use client";

import { useEffect, useState } from "react";
import styles from "./FoodRoom.module.css";

type Story = {
  title: string;
  url: string;
  date?: string;
  source: string;
};

type FeedResponse = {
  stories?: Story[];
  updatedAt?: string;
  error?: string;
};

export default function LocalTableLive() {
  const [data, setData] = useState<FeedResponse | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/food/local-table", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as FeedResponse;
        if (!response.ok) throw new Error(payload.error || "Local Table is unavailable.");
        return payload;
      })
      .then((payload) => active && setData(payload))
      .catch((error: unknown) => {
        if (active) setData({ error: error instanceof Error ? error.message : "Local Table is unavailable." });
      });

    return () => {
      active = false;
    };
  }, []);

  const stories = data?.stories ?? [];

  return (
    <article className={`${styles.primaryCard} ${styles.localCard} ${styles.liveLocalCard}`}>
      <div className={styles.cardTopline}>
        <span>03</span>
        <span>LIVE · ST. LOUIS</span>
      </div>

      <div className={styles.localLiveHeader}>
        <div className={`${styles.cardMark} ${styles.localMark}`} aria-hidden="true">STL</div>
        <div>
          <p className={styles.localKicker}>LOCAL TABLE</p>
          <h3>What&apos;s happening around town.</h3>
        </div>
      </div>

      {!data && <p className={styles.feedStatus}>Loading the latest local food coverage…</p>}

      {data?.error && (
        <div className={styles.feedError}>
          <strong>Live feed unavailable.</strong>
          <span>{data.error}</span>
          <a href="https://www.saucemagazine.com/" target="_blank" rel="noreferrer">Open Sauce Magazine ↗</a>
        </div>
      )}

      {stories.length > 0 && (
        <div className={styles.storyList}>
          {stories.slice(0, 5).map((story) => (
            <a href={story.url} target="_blank" rel="noreferrer" className={styles.storyRow} key={`${story.url}-${story.title}`}>
              <div>
                <span className={styles.storySource}>{story.source}{story.date ? ` · ${story.date}` : ""}</span>
                <strong>{story.title}</strong>
              </div>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      )}

      <div className={styles.sourceLine}>
        <span>Live source</span>
        <strong>Sauce Magazine</strong>
      </div>
      <a className={styles.open} href="https://www.saucemagazine.com/" target="_blank" rel="noreferrer">
        All local food news <b>↗</b>
      </a>
    </article>
  );
}
