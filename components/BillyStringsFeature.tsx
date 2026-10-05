"use client";

import { useEffect, useState } from "react";
import styles from "./WidespreadPanicFeature.module.css";

type Show = { date?: string; venue?: string; title?: string; location?: string; href: string; fresh?: boolean };
type Feed = { latest?: Record<string, Show | null> };
const recordings = "https://www.nugs.net/billy-strings-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/";
const tour = "https://www.billystrings.com/tour";

function showDate(value?: string) {
  const match = value?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) return null;
  const year = +match[3] < 100 ? 2000 + +match[3] : +match[3];
  const date = new Date(year, +match[1] - 1, +match[2]);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function BillyStringsFeature() {
  const [feed, setFeed] = useState<Feed | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/jam-listen", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => { if (active) setFeed(data); })
      .catch(() => { if (active) setFeed(null); });
    return () => { active = false; };
  }, []);
  const candidate = feed?.latest?.["Billy Strings"];
  const date = showDate(candidate?.date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  // Scheduled recordings must not appear as already played shows.
  const latest = candidate && date && date <= today && candidate.fresh !== false ? candidate : null;
  const label = latest && date
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
    : "Browse recordings";
  return (
    <section className={styles.shell} aria-label="Billy Strings shows">
      <div className={styles.identity}><p>#4 · BILLY STRINGS</p><h2>Billy Strings.</h2></div>
      <div className={styles.shows}>
        <a className={styles.row} href={latest?.href || recordings} target="_blank" rel="noreferrer">
          <span>LATEST SHOW</span><strong>{label}</strong>
          <b>{latest?.venue || latest?.title || "Billy Strings on nugs"}</b>
          <small>{latest?.location || "Live show recordings"}</small><em>Listen ↗</em>
        </a>
        <a className={styles.row} href={tour} target="_blank" rel="noreferrer">
          <span>NEXT SHOW</span><strong>Upcoming shows</strong><b>Billy Strings Tour</b>
          <small>Official tour schedule</small><em>View Tour ↗</em>
        </a>
      </div>
    </section>
  );
}
