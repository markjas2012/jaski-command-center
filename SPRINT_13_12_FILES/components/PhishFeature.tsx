"use client";

import { useEffect, useState } from "react";
import styles from "./PhishFeature.module.css";

type Show = {
  date?: string;
  venue?: string;
  location?: string;
  href: string;
  songs: string[];
};

type Story = { title: string; href: string; date?: string };

type Feed = {
  latest: Show | null;
  news: Story[];
  links: { setlists: string; news: string; livePhish: string; tour: string };
  updatedAt?: string;
};

function dateLabel(value?: string) {
  if (!value) return "Latest show";
  const parts = value.split("/");
  if (parts.length !== 3) return value;
  const [m, d, y] = parts.map(Number);
  if (!m || !d || !y) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

export default function PhishFeature() {
  const [feed, setFeed] = useState<Feed | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/phish-hub", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`phish-hub ${response.status}`);
        return response.json();
      })
      .then((data) => active && setFeed(data))
      .catch(() => active && setFeed(null));

    return () => {
      active = false;
    };
  }, []);

  const latest = feed?.latest;
  const songs = latest?.songs?.slice(0, 10) || [];
  const stories = feed?.news?.slice(0, 3) || [];
  const fallbackLinks = [
    { label: "Tour dates", href: feed?.links?.tour || "https://phish.com/tours/" },
    { label: "LivePhish", href: feed?.links?.livePhish || "https://www.livephish.com/" },
  ];

  return (
    <section className={styles.shell}>
      <header className={styles.head}>
        <div>
          <p>#2 · PHISH</p>
          <h2>Phish.</h2>
          <span>The next stop in the Jam Room.</span>
        </div>
        <div className={styles.rankWrap}>
          {feed?.updatedAt && <small>Updated {feed.updatedAt}</small>}
          <b>#2</b>
        </div>
      </header>

      <div className={styles.grid}>
        <article className={`${styles.card} ${styles.primary}`}>
          <div className={styles.cardTopline}>
            <p>LATEST SHOW</p>
            <span className={styles.dateBadge}>{dateLabel(latest?.date)}</span>
          </div>
          <h3>{latest?.venue || "Newest Phish show."}</h3>
          <div className={styles.locationLine}>
            {latest?.location || "Venue and city appear here as soon as the newest setlist posts."}
          </div>
          <div className={styles.showMeta}>
            <span>{songs.length ? `${songs.length} songs surfaced` : "Setlist ready when published"}</span>
            <span>Phish.net</span>
          </div>
          <div className={styles.links}>
            <a href={latest?.href || feed?.links?.setlists || "https://phish.net/setlists/"} target="_blank" rel="noreferrer">
              Full setlist ↗
            </a>
            <a href={feed?.links?.livePhish || "https://www.livephish.com/"} target="_blank" rel="noreferrer">
              Listen on LivePhish ↗
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <p>WHAT DID THEY PLAY?</p>
          <h3>{songs.length ? "Last show highlights." : "Setlist."}</h3>
          {songs.length ? (
            <div className={styles.songList}>
              {songs.map((song, index) => (
                <span key={`${song}-${index}`}><b>{index + 1}</b>{song}</span>
              ))}
            </div>
          ) : (
            <span className={styles.emptyCopy}>Pulling the newest songs from Phish.net.</span>
          )}
          <a href={latest?.href || "https://phish.net/setlists/"} target="_blank" rel="noreferrer">Open complete setlist ↗</a>
        </article>

        <article className={styles.card}>
          <p>PHISH NEWS</p>
          <h3>What’s happening.</h3>
          <div className={styles.newsList}>
            {stories.map((story) => (
              <a key={story.href} href={story.href} target="_blank" rel="noreferrer">
                <strong>{story.title}</strong>
                {story.date && <small>{story.date}</small>}
              </a>
            ))}
            {stories.length < 2 && fallbackLinks.map((item) => (
              <a className={styles.utilityStory} key={item.href} href={item.href} target="_blank" rel="noreferrer">
                <strong>{item.label}</strong>
                <small>Official Phish link</small>
              </a>
            ))}
          </div>
          <a className={styles.allNews} href={feed?.links?.news || "https://phish.com/news/"} target="_blank" rel="noreferrer">All Phish news ↗</a>
        </article>
      </div>
    </section>
  );
}
