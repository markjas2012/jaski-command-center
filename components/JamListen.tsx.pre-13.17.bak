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

function Exclusive({
  label,
  sub,
  items,
  href,
}: {
  label: string;
  sub: string;
  items: Item[];
  href: string;
}) {
  return (
    <article className={styles.exclusive}>
      <div className={styles.exclusiveHead}>
        <div>
          <span>{label}</span>
          <h3>{sub}</h3>
        </div>
        <a href={href} target="_blank" rel="noreferrer">Open nugs ↗</a>
      </div>

      <div className={styles.exclusiveItems}>
        {(items.length ? items.slice(0, 2) : [null, null]).map((item, index) =>
          item ? (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
              <small>{item.artist || "NUGS"}</small>
              <strong>{item.venue || item.title}</strong>
              <span>{[item.location, item.date].filter(Boolean).join(" · ") || "Recently added"}</span>
              <b>↗</b>
            </a>
          ) : (
            <div className={styles.exclusivePlaceholder} key={index}>
              <small>NUGS</small>
              <strong>Recent exclusive</strong>
              <span>Open nugs for the newest release.</span>
            </div>
          )
        )}
      </div>
    </article>
  );
}

export default function JamListen() {
  const [feed, setFeed] = useState<Feed | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/jam-listen", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`jam-listen ${res.status}`);
        return res.json();
      })
      .then((data) => active && setFeed(data))
      .catch(() => active && setFeed(null));

    return () => {
      active = false;
    };
  }, []);

  const discovery = feed?.discovery?.length
    ? feed.discovery
    : rotatingArtists.map((artist) => feed?.latest?.[artist]).filter((item): item is Item => Boolean(item));
  const seen = new Set(discovery.map((item) => item.artist));
  const missing = rotatingArtists.filter((artist) => !seen.has(artist));

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>LISTEN NOW</p>
          <h2>Put something good on.</h2>
        </div>
        <span>{feed?.updatedAt ? `Updated ${feed.updatedAt}` : "Nugs video, audio & latest shows"}</span>
      </div>

      <div className={`${styles.exclusiveGrid} ${styles.compactListenNow}`}>
        <Exclusive
          label="NUGS.TV"
          sub="Recent video exclusives."
          items={feed?.video || []}
          href="https://www.nugs.net/watch-live-music/"
        />
        <Exclusive
          label="NUGS.NET"
          sub="Recent audio exclusives."
          items={feed?.audio || []}
          href="https://www.nugs.net/recentlyadded.html"
        />
      </div>

      <div className={styles.latestHeading}>
        <div>
          <p>DISCOVER LIVE</p>
          <h3>What else is playing?</h3>
        </div>
        <span>Newest verified shows first. Older results fall to the back.</span>
      </div>

      <div className={styles.rotatingGrid}>
        {discovery.map((item) => (
          <ShowCard key={item.artist} item={item} fallbackLabel={item.artist} />
        ))}
        {missing.map((artist) => (
          <ShowCard key={artist} item={null} fallbackLabel={artist} />
        ))}
      </div>
    </section>
  );
}
