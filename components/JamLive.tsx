"use client";

import { useEffect, useState } from "react";
import styles from "./JamLive.module.css";

type Story = { title: string; source: string; href: string; date?: string };
type JamFeed = { updatedAt: string; stories: Story[] };

const fallback: Story[] = [
  { title: "JamBase — latest jam-band news", source: "JamBase", href: "https://www.jambase.com/" },
  { title: "Relix — music news and interviews", source: "Relix", href: "https://relix.com/" },
  { title: "Live For Live Music — current coverage", source: "Live For Live Music", href: "https://liveforlivemusic.com/" },
];

export default function JamLive() {
  const [feed, setFeed] = useState<JamFeed | null>(null);

  useEffect(() => {
    fetch("/api/jam-feed", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setFeed)
      .catch(() => setFeed({ updatedAt: "", stories: fallback }));
  }, []);

  const stories = feed?.stories?.length ? feed.stories.slice(0, 3) : fallback;

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>NOW PLAYING</p>
          <h2>What’s happening in the Jam Room.</h2>
        </div>
        <span>{feed?.updatedAt ? `Updated ${feed.updatedAt}` : "Current links"}</span>
      </div>

      <div className={styles.grid}>
        {stories.map((story) => (
          <a key={story.href + story.title} className={styles.story} href={story.href} target="_blank" rel="noreferrer">
            <span className={styles.source}>{story.source}</span>
            <h3>{story.title}</h3>
            <div>
              <small>{story.date || "Latest"}</small>
              <b>Open ↗</b>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.dead}>
        <div>
          <p>GRATEFUL DEAD · TODAY</p>
          <h2>Find the show attached to today’s date.</h2>
          <span>
            Jump straight into the live archive, then choose the year, venue, and recording that sounds right.
          </span>
        </div>
        <a href="https://archive.org/details/GratefulDead" target="_blank" rel="noreferrer">
          Explore today’s shows ↗
        </a>
      </div>
    </section>
  );
}
