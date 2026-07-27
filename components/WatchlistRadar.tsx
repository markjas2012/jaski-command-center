"use client";

import { useEffect, useState } from "react";
import styles from "./LiveTV.module.css";

type Episode = {
  name?: string;
  season?: number | null;
  number?: number | null;
  airstamp?: string | null;
};

type Item = {
  found: boolean;
  query: string;
  title?: string;
  status?: string;
  network?: string;
  service?: string;
  next?: Episode | null;
};

function when(value?: string | null) {
  if (!value) return "Date TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Date TBD";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function WatchlistRadar({ titles }: { titles: string[] }) {
  const [items, setItems] = useState<Item[]>([]);
  const key = titles.join("|");

  useEffect(() => {
    let cancelled = false;

    if (!titles.length) {
      setItems([]);
      return;
    }

    Promise.all(
      titles.slice(0, 8).map((title) =>
        fetch(`/api/tv-status?q=${encodeURIComponent(title)}`, { cache: "no-store" })
          .then((res) => res.ok ? res.json() : { found: false, query: title })
          .catch(() => ({ found: false, query: title }))
      )
    ).then((result) => {
      if (!cancelled) setItems(result);
    });

    return () => { cancelled = true; };
  }, [key]);

  const upcoming = items
    .filter((item) => item.found && item.next?.airstamp)
    .sort((a, b) => +new Date(a.next!.airstamp!) - +new Date(b.next!.airstamp!));

  return (
    <>
      <p className={styles.kicker}>WATCHLIST RADAR</p>
      <h2 className={styles.radarTitle}>What&apos;s next.</h2>

      {!titles.length && (
        <p className={styles.radarEmpty}>Add a show and its next scheduled episode can appear here.</p>
      )}

      {titles.length > 0 && items.length === 0 && (
        <p className={styles.radarEmpty}>Checking your watch list…</p>
      )}

      {items.length > 0 && upcoming.length === 0 && (
        <p className={styles.radarEmpty}>Nothing on your current watch list has a future episode posted yet.</p>
      )}

      <div className={styles.radarList}>
        {upcoming.slice(0, 4).map((item) => (
          <div className={styles.radarRow} key={item.query}>
            <div>
              <strong>{item.title || item.query}</strong>
              <p>
                {item.next?.season && item.next?.number
                  ? `Season ${item.next.season} · Episode ${item.next.number}`
                  : item.next?.name || "Next episode"}
              </p>
            </div>
            <span>{when(item.next?.airstamp)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
