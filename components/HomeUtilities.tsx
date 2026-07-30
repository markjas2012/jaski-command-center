"use client";

import Link from "next/link";
import styles from "./HomeUtilities.module.css";

export default function HomeUtilities() {
  return (
    <section className={styles.wrap} aria-label="Quick utilities">
      <div className={styles.rule} />
      <div className={styles.row}>
        <Link className={styles.utility} href="/remote">
          <span className={styles.icon} aria-hidden="true">⌁</span>
          <span>
            <strong>Remote</strong>
            <small>Home controls</small>
          </span>
        </Link>

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
