"use client";

import { useEffect, useState } from "react";
import styles from "./WidespreadPanicFeature.module.css";

type SetBlock = { label: string; songs: string[] };
type Show = {
  date?: string;
  venue?: string;
  location?: string;
  href: string;
  songs: string[];
  sets?: SetBlock[];
};
type Story = { title: string; href: string; date?: string };
type Feed = {
  latest: Show | null;
  news: Story[];
  links: { shows: string; news: string; nugs: string; archive: string };
  updatedAt?: string;
};

function dateLabel(value?: string) {
  if (!value) return "Latest show";
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const parts = iso ? [Number(iso[2]), Number(iso[3]), Number(iso[1])] : us ? [Number(us[1]), Number(us[2]), Number(us[3])] : null;
  if (!parts) return value;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" })
    .format(new Date(parts[2], parts[0] - 1, parts[1]));
}

export default function WidespreadPanicFeature() {
  const [feed, setFeed] = useState<Feed | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/panic-hub", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`panic-hub ${response.status}`);
        return response.json();
      })
      .then((data) => active && setFeed(data))
      .catch(() => active && setFeed(null));
    return () => { active = false; };
  }, []);

  const latest = feed?.latest;
  const sets = latest?.sets?.filter((set) => set.songs.length) || [];
  const totalSongs = sets.length ? sets.reduce((sum, set) => sum + set.songs.length, 0) : latest?.songs?.length || 0;
  const stories = feed?.news?.slice(0, 3) || [];

  return (
    <section className={styles.shell}>
      <header className={styles.head}>
        <div>
          <p>#3 · WIDESPREAD PANIC</p>
          <h2>Widespread Panic.</h2>
          <span>Southern jam, right behind the Dead and Phish.</span>
        </div>
        <div className={styles.rankWrap}>
          {feed?.updatedAt && <small>Updated {feed.updatedAt}</small>}
          <b>#3</b>
        </div>
      </header>

      <div className={styles.grid}>
        <article className={`${styles.card} ${styles.primary}`}>
          <div className={styles.cardTopline}>
            <p>LATEST SHOW</p>
            <span className={styles.dateBadge}>{dateLabel(latest?.date)}</span>
          </div>
          <h3>{latest?.venue || "Newest Panic show."}</h3>
          <div className={styles.locationLine}>
            {latest?.location || "Pulling the newest venue and city from Widespread Panic."}
          </div>
          <div className={styles.showMeta}>
            <span>{totalSongs ? `${totalSongs} songs` : "Setlist when published"}</span>
            <span>{sets.length ? `${sets.length} sections` : "Official show archive"}</span>
          </div>
          <div className={styles.links}>
            <a href={latest?.href || feed?.links?.shows || "https://widespreadpanic.com/shows/past/"} target="_blank" rel="noreferrer">Full setlist ↗</a>
            <a href={feed?.links?.nugs || "https://www.nugs.net/widespread-panic-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/"} target="_blank" rel="noreferrer">Listen on nugs ↗</a>
          </div>
        </article>

        <article className={`${styles.card} ${styles.setlistCard}`}>
          <p>WHAT DID THEY PLAY?</p>
          <h3>{sets.length ? "Last show setlist." : "Latest setlist."}</h3>
          {sets.length ? (
            <div className={styles.setBlocks}>
              {sets.slice(0, 4).map((set) => (
                <div className={styles.setBlock} key={set.label}>
                  <strong>{set.label}</strong>
                  <span>{set.songs.join(" · ")}</span>
                </div>
              ))}
            </div>
          ) : latest?.songs?.length ? (
            <div className={styles.songList}>
              {latest.songs.slice(0, 10).map((song, index) => (
                <span key={`${song}-${index}`}><b>{index + 1}</b>{song}</span>
              ))}
            </div>
          ) : (
            <span className={styles.emptyCopy}>Pulling the newest published Panic setlist.</span>
          )}
          <a href={latest?.href || feed?.links?.archive || "https://www.everydaycompanion.com/setlists/mostrecent.asp"} target="_blank" rel="noreferrer">Open complete setlist ↗</a>
        </article>

        <article className={styles.card}>
          <p>PANIC NEWS</p>
          <h3>What’s happening.</h3>
          <div className={styles.newsList}>
            {stories.map((story) => (
              <a key={story.href} href={story.href} target="_blank" rel="noreferrer">
                <strong>{story.title}</strong>
                {story.date && <small>{story.date}</small>}
              </a>
            ))}
            {!stories.length && (
              <a href={feed?.links?.news || "https://widespreadpanic.com/news/"} target="_blank" rel="noreferrer">
                <strong>Official Widespread Panic news</strong>
                <small>Tour, streams, releases and band updates</small>
              </a>
            )}
          </div>
          <a className={styles.allNews} href={feed?.links?.news || "https://widespreadpanic.com/news/"} target="_blank" rel="noreferrer">All Panic news ↗</a>
        </article>
      </div>
    </section>
  );
}
