"use client";

import { useEffect, useState } from "react";
import styles from "./JamListen.module.css";

type Item = {
  artist: string;
  title: string;
  venue?: string;
  location?: string;
  date?: string;
  href: string;
  searchHref?: string;
  ageDays?: number;
  fresh?: boolean;
};

type Feed = {
  video: Item[];
  audio: Item[];
  latest: Record<string, Item | null>;
  discovery?: Item[];
  updatedAt?: string;
};

const rotatingArtists = [
  "Billy Strings",
  "The String Cheese Incident",
  "The Disco Biscuits",
  "Joe Russo's Almost Dead",
  "Goose",
  "Umphrey's McGee",
];

function ShowCard({ item, fallbackLabel }: { item?: Item | null; fallbackLabel: string }) {
  if (!item) {
    const searchHref = `https://www.nugs.net/search/?q=${encodeURIComponent(fallbackLabel)}`;
    return (
      <a className={styles.showCard} href={searchHref} target="_blank" rel="noreferrer">
        <span className={styles.showArtist}>{fallbackLabel}</span>
        <strong>Check newest recordings</strong>
        <small>No recent dated show was found in the discovery window.</small>
        <b>Search nugs ↗</b>
      </a>
    );
  }

  const stale = item.fresh === false;
  return (
    <a className={styles.showCard} href={stale ? item.searchHref || item.href : item.href} target="_blank" rel="noreferrer">
      <span className={styles.showArtist}>{item.artist || fallbackLabel}</span>
      <strong>{stale ? "Check newest recordings" : item.venue || item.title}</strong>
      <small>
        {stale
          ? `${item.date || "Older result"} · newer dated show not verified`
          : [item.location, item.date].filter(Boolean).join(" · ") || "Latest on nugs"}
      </small>
      <b>{stale ? "Search nugs ↗" : "Listen ↗"}</b>
    </a>
  );
}

export default function JamListen() {
  const [feed, setFeed] = useState<Feed | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/jam-listen", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => active && setFeed(data))
      .catch(() => active && setFeed(null));
    return () => { active = false; };
  }, []);
  const discovery = feed?.discovery?.length
    ? feed.discovery
    : rotatingArtists.map((artist) => feed?.latest?.[artist]).filter((item): item is Item => Boolean(item));
  const seen = new Set(discovery.map((item) => item.artist));
  const missing = rotatingArtists.filter((artist) => !seen.has(artist));
  return (
    <section className={styles.wrap}>
      <div className={styles.latestHeading}>
        <div><p>DISCOVER LIVE</p><h3>What else is playing?</h3></div>
        <span>Newest verified shows first.</span>
      </div>
      <div className={styles.rotatingGrid}>
        {discovery.map((item) => <ShowCard key={item.artist} item={item} fallbackLabel={item.artist} />)}
        {missing.map((artist) => <ShowCard key={artist} item={null} fallbackLabel={artist} />)}
      </div>
    </section>
  );
}
