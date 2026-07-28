"use client";

import MyTeams from "./MyTeams";
import WorthWatching from "./WorthWatching";
import SportsBoard from "./SportsBoard";
import SportsNews from "./SportsNews";
import styles from "./SportsRoom.module.css";

export default function SportsRoom() {
  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>ST. LOUIS / TODAY / WHAT TO WATCH</p>
          <h1>Sports Room.</h1>
          <p className={styles.lede}>
            St. Louis first. Then the games worth your time. No wall of scores.
          </p>
        </div>

        <div className={styles.badge} aria-hidden="true">
          <span className={styles.badgeLetter}>S</span>
          <span>GAME ON</span>
        </div>

        <div className={styles.heroFooter}>
          <span>SPRINT 14.1 · LIVE FOUNDATION</span>
          <span>NO HOT TAKES. JUST THE GAMES.</span>
        </div>
      </section>

      <MyTeams />
      <WorthWatching />
      <SportsBoard />
      <SportsNews />
    </main>
  );
}
