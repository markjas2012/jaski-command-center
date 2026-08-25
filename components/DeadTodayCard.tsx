"use client";

import { useEffect, useState } from "react";
import styles from "./DeadTodayCard.module.css";

type TodayPayload = {
  showDate: string;
  year?: string;
  venue: string;
  location?: string;
  href: string;
  searchHref: string;
  note: string;
  recordings?: number;
  highlights?: string[];
  live: boolean;
  recordingTitle?: string;
  setlist?: { title: string; track?: string; section?: string }[];
  deadNetHref?: string;
  showImage?: string;
  setlistSource?: string;
  audioSource?: string;
  archiveTrackCount?: number;
  deadNetFetched?: boolean;
};

type HubItem = {
  title: string;
  href: string;
  date?: string;
  description?: string;
};

type HubPayload = {
  podcast: HubItem | null;
  news: HubItem[];
  podcastHome: string;
  newsHome: string;
};

const initialToday: TodayPayload = {
  showDate: "Today in Grateful Dead History",
  venue: "",
  href: "https://archive.org/details/GratefulDead",
  searchHref: "https://archive.org/details/GratefulDead",
  note: "Finding today’s featured recording...",
  live: false,
};

const initialHub: HubPayload = {
  podcast: null,
  news: [],
  podcastHome: "https://www.dead.net/deadcast",
  newsHome: "https://www.dead.net/features/news",
};

function friendlyDate(raw?: string) {
  if (!raw) return "Latest episode";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function DeadTodayCard() {
  const [show, setShow] = useState<TodayPayload>(initialToday);
  const [hub, setHub] = useState<HubPayload>(initialHub);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadToday = async () => {
      try {
        const res = await fetch(`/api/dead-today?t=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as TodayPayload;
        if (active) setShow(data);
      } catch {
        if (active) setShow(initialToday);
      }
    };

    const loadHub = async () => {
      try {
        const res = await fetch(`/api/dead-hub?t=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as HubPayload;
        if (active) setHub(data);
      } catch {
        if (active) setHub(initialHub);
      }
    };

    void loadToday();
    void loadHub();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const songs = show.setlist ?? [];
  const halfway = Math.ceil(songs.length / 2);
  const firstHalf = songs.slice(0, halfway);
  const secondHalf = songs.slice(halfway);

  return (
    <section className={styles.deadHub}>
      <header className={styles.heroHead}>
        <div>
          <p>THE GRATEFUL DEAD</p>
          <h2>Grateful Dead.</h2>
          <span>The center of the Jam Room.</span>
        </div>
        <span className={styles.crown}>GD · ARCHIVE 01</span>
      </header>

      <div className={styles.mainGrid}>
        <article className={styles.historyCard}>
          <div className={styles.historyInner}>
            <div className={styles.historyInfo}>
              <div>
                <span className={styles.kicker}>TODAY IN GRATEFUL DEAD HISTORY</span>
                <div className={styles.dateRow}>
                  <h3>{show.showDate}</h3>
                  {show.year ? <span className={styles.year}>{show.year}</span> : null}
                </div>
              </div>

              <div className={styles.venueBlock}>
                <span>VENUE</span>
                <strong>{show.venue || "Grateful Dead Live Archive"}</strong>
                {show.location ? <small>{show.location}</small> : null}
              </div>

              <div className={styles.historyLinks}>
                <div className={styles.sources}>
                  <span>SHOW DATA · DEAD.NET</span>
                  <span>AUDIO · ARCHIVE.ORG</span>
                </div>

                <div className={styles.actions}>
                  <a className={styles.primary} href={show.href} target="_blank" rel="noreferrer">
                    {show.live ? "Listen to featured recording" : "Open Archive"} ↗
                  </a>
                  {show.deadNetHref ? (
                    <a href={show.deadNetHref} target="_blank" rel="noreferrer">
                      Full show on Dead.net ↗
                    </a>
                  ) : null}
                  <a href={show.searchHref} target="_blank" rel="noreferrer">
                    Other recordings ↗
                  </a>
                </div>
              </div>
            </div>

            {/*
              IMPORTANT: These class names deliberately DO NOT contain "setlist".
              jam-festival.module.css has legacy global selectors matching
              [class*="setlist"], which were forcing this panel into grid column 3
              and creating the skinny implicit column seen in the screenshots.
            */}
            <div className={styles.songsPanel}>
              <div className={styles.songsHead}>
                <span>SETLIST</span>
                <small>{songs.length ? `${songs.length} SONGS · DEAD.NET` : "LOADING"}</small>
              </div>

              {songs.length ? (
                <div className={styles.songGrid}>
                  <ol>
                    {firstHalf.map((item, index) => (
                      <li key={`a-${index}-${item.title}`}>{item.title}</li>
                    ))}
                  </ol>
                  <ol start={halfway + 1}>
                    {secondHalf.map((item, index) => (
                      <li key={`b-${index}-${item.title}`}>{item.title}</li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className={styles.emptySongs}>{show.note}</p>
              )}
            </div>
          </div>
        </article>

        <article className={styles.hubCard}>
          <section>
            <span className={styles.kicker}>GOOD OL&apos; GRATEFUL DEADCAST</span>
            <h3>Latest episode.</h3>
            <a
              className={styles.featureLink}
              href={hub.podcast?.href || hub.podcastHome}
              target="_blank"
              rel="noreferrer"
            >
              <small>{friendlyDate(hub.podcast?.date)}</small>
              <strong>{hub.podcast?.title || "Open the Good Ol' Grateful Deadcast"}</strong>
              <span>{hub.podcast?.description || "The official Grateful Dead podcast."}</span>
              <b>Listen ↗</b>
            </a>
            <a className={styles.textLink} href={hub.podcastHome} target="_blank" rel="noreferrer">
              Deadcast archive ↗
            </a>
          </section>

          <div className={styles.divider} />

          <section>
            <span className={styles.kicker}>DEAD FAMILY & ADJACENT</span>
            <h3>What&apos;s happening around the music.</h3>
            <div className={styles.newsList}>
              {(hub.news.length
                ? hub.news
                : [{ title: "Open the latest news from Dead.net", href: hub.newsHome }]
              )
                .slice(0, 3)
                .map((item) => (
                  <a key={`${item.href}-${item.title}`} href={item.href} target="_blank" rel="noreferrer">
                    <strong>{item.title}</strong>
                    <span>Read ↗</span>
                  </a>
                ))}
            </div>
            <a className={styles.textLink} href={hub.newsHome} target="_blank" rel="noreferrer">
              More Dead family news ↗
            </a>
          </section>
        </article>
      </div>
    </section>
  );
}
