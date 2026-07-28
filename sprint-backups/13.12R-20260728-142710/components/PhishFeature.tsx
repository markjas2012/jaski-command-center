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

function showLine(show?: Show | null) {
  if (!show) return "Newest setlist and show details";
  return [show.date, show.venue, show.location].filter(Boolean).join(" · ");
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
  const songs = latest?.songs?.slice(0, 7) || [];
  const stories = feed?.news?.slice(0, 2) || [];

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
        <article className={styles.primary}>
          <p>LATEST SHOW</p>
          <h3>{latest?.venue || "Newest Phish show."}</h3>
          <span>{showLine(latest)}</span>
          <div className={styles.links}>
            <a href={latest?.href || feed?.links?.setlists || "https://phish.net/setlists/"} target="_blank" rel="noreferrer">
              Full setlist ↗
            </a>
            <a href={feed?.links?.livePhish || "https://www.livephish.com/"} target="_blank" rel="noreferrer">
              Listen on LivePhish ↗
            </a>
          </div>
        </article>

        <article>
          <p>WHAT DID THEY PLAY?</p>
          <h3>{songs.length ? "Last show highlights." : "Setlist."}</h3>
          {songs.length ? (
            <div className={styles.songList}>
              {songs.map((song, index) => (
                <span key={`${song}-${index}`}>{song}</span>
              ))}
            </div>
          ) : (
            <span>Pulling the newest songs from Phish.net.</span>
          )}
          <a href={latest?.href || "https://phish.net/setlists/"} target="_blank" rel="noreferrer">Open setlist ↗</a>
        </article>

        <article>
          <p>PHISH NEWS</p>
          <h3>What’s happening.</h3>
          <div className={styles.newsList}>
            {stories.length ? stories.map((story) => (
              <a key={story.href} href={story.href} target="_blank" rel="noreferrer">
                <strong>{story.title}</strong>
                {story.date && <small>{story.date}</small>}
              </a>
            )) : (
              <span>Tour, release and band updates from Phish.</span>
            )}
          </div>
          <a className={styles.allNews} href={feed?.links?.news || "https://phish.com/news/"} target="_blank" rel="noreferrer">All Phish news ↗</a>
        </article>
      </div>
    </section>
  );
}
