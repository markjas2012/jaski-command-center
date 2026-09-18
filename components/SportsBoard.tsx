"use client";

import styles from "./SportsBoard.module.css";

export default function SportsBoard() {
  return (
    <section className={styles.board}>
      <div className={styles.utility}>
        <div>
          <p>FULL BOARD</p>
          <h3>League links.</h3>
          <span>Jump straight to the complete scoreboards and schedules.</span>
        </div>
        <div className={styles.utilityLinks}>
          <a href="https://www.espn.com/scores" target="_blank" rel="noreferrer">ESPN ↗</a>
          <a href="https://www.mlb.com/scores" target="_blank" rel="noreferrer">MLB ↗</a>
          <a href="https://www.nfl.com/schedules/" target="_blank" rel="noreferrer">NFL ↗</a>
          <a href="https://www.nba.com/schedule" target="_blank" rel="noreferrer">NBA ↗</a>
          <a href="https://www.nhl.com/schedule" target="_blank" rel="noreferrer">NHL ↗</a>
          <a href="https://www.ncaa.com/scoreboard" target="_blank" rel="noreferrer">NCAA ↗</a>
        </div>
      </div>
    </section>
  );
}
