"use client";

import { useEffect, useState } from "react";
import styles from "./DeadTodayCard.module.css";

type TodayPayload = {
  showDate: string; year?: string; venue: string; location?: string; href: string;
  searchHref: string; note: string; recordings?: number; highlights?: string[]; live: boolean;
  recordingTitle?: string; setlist?: { title: string; track?: string; section?: string }[];
  deadNetHref?: string; showImage?: string; setlistSource?: string; audioSource?: string;
  archiveTrackCount?: number; deadNetFetched?: boolean;
};
type HubItem = { title: string; href: string; date?: string; description?: string };
type HubPayload = { podcast: HubItem | null; news: HubItem[]; podcastHome: string; newsHome: string };

const initialToday: TodayPayload = {
  showDate: "Today in Grateful Dead History", venue: "", href: "https://archive.org/details/GratefulDead",
  searchHref: "https://archive.org/details/GratefulDead", note: "Finding today’s featured recording...", live: false,
};
const initialHub: HubPayload = {
  podcast: null, news: [], podcastHome: "https://www.dead.net/deadcast", newsHome: "https://www.dead.net/features/news",
};

function friendlyDate(raw?: string) {
  if (!raw) return "Latest episode";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default function DeadTodayCard() {
  const [show, setShow] = useState<TodayPayload>(initialToday);
  const [hub, setHub] = useState<HubPayload>(initialHub);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 7500);
    Promise.all([
      fetch(`/api/dead-today?t=${Date.now()}`, { cache: "no-store", signal: controller.signal })
        .then((res) => (res.ok ? res.json() : initialToday)).catch(() => initialToday),
      fetch(`/api/dead-hub?t=${Date.now()}`, { cache: "no-store", signal: controller.signal })
        .then((res) => (res.ok ? res.json() : initialHub)).catch(() => initialHub),
    ]).then(([today, deadHub]) => { setShow(today); setHub(deadHub); window.clearTimeout(timer); });
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, []);

  return (
    <section className={styles.deadHub}>
      <header className={styles.heroHead}>
        <div>
          <p>THE GRATEFUL DEAD</p>
          <h2>Grateful Dead.</h2>
          <span className={styles.subhead}>The center of the Jam Room.</span>
        </div>
        <span className={styles.crown}>#1 · ALWAYS</span>
      </header>

      <div className={styles.grid}>
        <article className={`${styles.panel} ${styles.history}`}>
          <div className={styles.panelHead}>
            <div>
              <p>TODAY IN GRATEFUL DEAD HISTORY</p>
              <h3>{show.showDate}</h3>
              <span className={styles.featureLabel}>FEATURED TODAY</span>
            </div>
            {show.year ? <span className={styles.year}>{show.year}</span> : null}
          </div>

          <div className={styles.venue}>
            <strong>{show.venue || "Grateful Dead live archive"}</strong>
            {show.location ? <span>{show.location}</span> : null}
          </div>

          {show.showImage ? (
            <a className={styles.showVisual} href={show.deadNetHref || "#"} target="_blank" rel="noreferrer">
              <img src={show.showImage} alt={`${show.showDate} — ${show.venue || "Grateful Dead"}`} />
              <span>DEAD.NET SHOW ARCHIVE</span>
            </a>
          ) : null}

          {show.recordingTitle ? (
            <div className={styles.recording}>
              <span>FEATURED RECORDING</span>
              <strong>{show.recordingTitle}</strong>
            </div>
          ) : null}

          {show.setlist?.length && show.setlistSource === "Dead.net" ? (
            <div className={styles.setlist}>
              <div className={styles.setlistHead}>
                <span>SETLIST</span>
                <small>{show.setlist.length} songs{show.setlistSource ? ` · ${show.setlistSource}` : ""}</small>
              </div>
              {show.setlist.some((item) => item.section) ? (
                <div className={styles.setSections}>
                  {["SET 1", "SET 2", "ENCORE"].map((section) => {
                    const items = show.setlist?.filter((item) => item.section === section) || [];
                    if (!items.length) return null;
                    return (
                      <div className={styles.setSection} key={section}>
                        <h4>{section}</h4>
                        <ol>
                          {items.map((item, index) => (
                            <li key={`${section}-${item.title}-${index}`}>{item.title}</li>
                          ))}
                        </ol>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ol>
                  {show.setlist.map((item, index) => (
                    <li key={`${item.title}-${index}`}>{item.title}</li>
                  ))}
                </ol>
              )}
            </div>
          ) : (
            <p className={styles.note}>
              {show.note || "Dead.net setlist unavailable right now. Audio is still ready from Archive.org."}
            </p>
          )}

          <div className={styles.sourceRow}>
            <span>SHOW DATA · DEAD.NET</span>
            <span>AUDIO · ARCHIVE.ORG</span>
          </div>

          <div className={styles.actions}>
            <a className={styles.primary} href={show.href} target="_blank" rel="noreferrer">
              {show.live ? "Listen to featured recording" : "Open Archive"} ↗
            </a>
            {show.deadNetHref ? (
              <a href={show.deadNetHref} target="_blank" rel="noreferrer">Full show on Dead.net ↗</a>
            ) : null}
            <a href={show.searchHref} target="_blank" rel="noreferrer">Other recordings ↗</a>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}><div><p>GOOD OL&apos; GRATEFUL DEADCAST</p><h3>Latest episode.</h3></div></div>
          <a className={styles.featureLink} href={hub.podcast?.href || hub.podcastHome} target="_blank" rel="noreferrer">
            <small>{friendlyDate(hub.podcast?.date)}</small>
            <strong>{hub.podcast?.title || "Open the Good Ol' Grateful Deadcast"}</strong>
            <span>{hub.podcast?.description || "The official Grateful Dead podcast."}</span>
            <b>Listen ↗</b>
          </a>
          <a className={styles.textLink} href={hub.podcastHome} target="_blank" rel="noreferrer">Deadcast archive ↗</a>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}><div><p>DEAD FAMILY & ADJACENT</p><h3>What&apos;s happening around the music.</h3></div></div>
          <div className={styles.newsList}>
            {(hub.news.length ? hub.news : [{ title: "Open the latest news from Dead.net", href: hub.newsHome }]).slice(0, 3).map((item) => (
              <a key={`${item.href}-${item.title}`} href={item.href} target="_blank" rel="noreferrer"><strong>{item.title}</strong><span>Read ↗</span></a>
            ))}
          </div>
          <a className={styles.textLink} href={hub.newsHome} target="_blank" rel="noreferrer">More Dead family news ↗</a>
        </article>
      </div>
    </section>
  );
}
