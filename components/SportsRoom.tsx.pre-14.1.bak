"use client";

import MyTeams from "./MyTeams";
import WorthWatching from "./WorthWatching";
import SportsBoard from "./SportsBoard";
import styles from "./SportsRoom.module.css";

const quickLinks = [
  { label: "ESPN", detail: "Scores & schedules", href: "https://www.espn.com/" },
  { label: "MLB", detail: "Baseball scores & standings", href: "https://www.mlb.com/" },
  { label: "NFL", detail: "Football scores & schedule", href: "https://www.nfl.com/" },
  { label: "NCAA", detail: "College sports", href: "https://www.ncaa.com/" },
];

export default function SportsRoom() {
  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>SCORES / SCHEDULES / WHAT TO WATCH</p>
          <h1>Sports Room.</h1>
          <p className={styles.lede}>
            The games that matter, the scores you need, and a clean place to see what’s on.
          </p>
        </div>

        <div className={styles.badge} aria-hidden="true">
          <span className={styles.badgeLetter}>S</span>
          <span>GAME ON</span>
        </div>

        <div className={styles.heroFooter}>
          <span>SPRINT 13 · ROOM 02</span>
          <span>NO HOT TAKES. JUST THE GAMES.</span>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.primaryCard}>
          <p className={styles.cardKicker}>QUICK BOARD</p>
          <h2>Find the game fast.</h2>
          <p>
            Scores, schedules, and standings without turning this into another giant sports feed.
          </p>

          <div className={styles.linkGrid}>
            {quickLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                <span className={styles.linkMark}>{item.label.slice(0, 1)}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <b>↗</b>
              </a>
            ))}
          </div>
        </article>

        <div className={styles.sideGrid}>
          <a className={styles.sideCard} href="https://www.espn.com/watch/" target="_blank" rel="noreferrer">
            <span className={styles.cardKicker}>TONIGHT</span>
            <h3>What’s worth watching.</h3>
            <p>Open the full ESPN watch guide when you want the complete slate.</p>
            <strong>Open ESPN ↗</strong>
          </a>

          <a className={styles.sideCard} href="https://www.espn.com/scores" target="_blank" rel="noreferrer">
            <span className={styles.cardKicker}>SCORES</span>
            <h3>Check the board.</h3>
            <p>Jump straight to live scores, finished games, and the next slate.</p>
            <strong>View scores ↗</strong>
          </a>
        </div>
      </section>

      <MyTeams />
      <WorthWatching />
      <SportsBoard />
    </main>
  );
}
