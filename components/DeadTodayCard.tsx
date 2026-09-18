"use client";

import { useEffect, useState } from "react";
import styles from "./DeadTodayCard.module.css";

type TodayPayload = {
  showDate: string; year?: string; venue: string; location?: string;
  href: string; searchHref: string; note: string; live: boolean; deadNetHref?: string;
};
type HubItem = { title: string; href: string; date?: string; description?: string };
type HubPayload = { podcast: HubItem | null; podcastHome: string; newsHome: string; news: HubItem[] };

const initialToday: TodayPayload = {
  showDate: "Today in Grateful Dead History", venue: "",
  href: "https://archive.org/details/GratefulDead",
  searchHref: "https://archive.org/details/GratefulDead",
  note: "Finding today’s featured recording...", live: false,
};
const initialHub: HubPayload = {
  podcast: null, news: [], podcastHome: "https://www.dead.net/deadcast",
  newsHome: "https://www.dead.net/features/news",
};
function friendlyDate(raw?: string) {
  if (!raw) return "Latest episode";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(date);
}
export default function DeadTodayCard() {
  const [show,setShow]=useState<TodayPayload>(initialToday);
  const [hub,setHub]=useState<HubPayload>(initialHub);
  useEffect(()=>{
    const c=new AbortController(); let active=true;
    fetch(`/api/dead-today?t=${Date.now()}`,{cache:"no-store",signal:c.signal})
      .then(r=>r.ok?r.json():Promise.reject()).then(d=>active&&setShow(d)).catch(()=>active&&setShow(initialToday));
    fetch(`/api/dead-hub?t=${Date.now()}`,{cache:"no-store",signal:c.signal})
      .then(r=>r.ok?r.json():Promise.reject()).then(d=>active&&setHub(d)).catch(()=>active&&setHub(initialHub));
    return()=>{active=false;c.abort();};
  },[]);
  return (
    <section className={styles.deadHub}>
      <header className={styles.heroHead}>
        <div><p>THE GRATEFUL DEAD</p><h2>Grateful Dead.</h2><span>The center of the Jam Room.</span></div>
        <span className={styles.crown}>GD · ARCHIVE 01</span>
      </header>
      <div className={styles.mainGrid}>
        <article className={styles.historyCard}>
          <span className={styles.kicker}>TODAY IN GRATEFUL DEAD HISTORY</span>
          <a className={styles.dateLink} href={show.deadNetHref || show.href} target="_blank" rel="noreferrer">
            <h3>{show.showDate}</h3>{show.year ? <span className={styles.year}>{show.year}</span> : null}
          </a>
          <div className={styles.venueBlock}>
            <strong>{show.venue || "Grateful Dead Live Archive"}</strong>
            {show.location ? <small>{show.location}</small> : null}
          </div>
          <div className={styles.actions}>
            <a className={styles.primary} href={show.href} target="_blank" rel="noreferrer">Archive.org ↗</a>
            {show.deadNetHref ? <a href={show.deadNetHref} target="_blank" rel="noreferrer">Dead.net ↗</a> : null}
          </div>
        </article>
        <article className={styles.hubCard}>
          <span className={styles.kicker}>GOOD OL&apos; GRATEFUL DEADCAST</span>
          <a className={styles.podcastLink} href={hub.podcast?.href || hub.podcastHome} target="_blank" rel="noreferrer">
            <small>{friendlyDate(hub.podcast?.date)}</small>
            <strong>{hub.podcast?.title || "Good Ol' Grateful Deadcast"}</strong>
            <b>Open ↗</b>
          </a>
          <a className={styles.textLink} href={hub.podcastHome} target="_blank" rel="noreferrer">Deadcast archive ↗</a>
        </article>
      </div>
    </section>
  );
}
