"use client";

import styles from "./HomeUtilities.module.css";

export default function HomeUtilities() {
  return (
    <section className={styles.wrap} aria-label="Quick utilities">
      <div className={styles.rule} />
      <div className={styles.row}>
        <a
          className={styles.utility}
          href="https://www.audible.com/library/"
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.icon} aria-hidden="true">A</span>
          <span>
            <strong>Audible</strong>
            <small>Your library</small>
          </span>
        </a>
      </div>
    </section>
  );
}
