import Link from "next/link";
import styles from "./StreamingRoom.module.css";
import LiveStreamingRadar from "./LiveStreamingRadar";

const newStreaming = [
  { service: "STREAMING", title: "New This Week", copy: "Fresh arrivals across the services you already watch.", meta: "THE MAIN EVENT" },
  { service: "JASKI PICK", title: "What to Watch", copy: "A short list of worthwhile movies instead of an endless catalog.", meta: "CURATED" },
  { service: "TV + STREAMING", title: "New & Notable", copy: "Big premieres, returning seasons and shows worth noticing.", meta: "CURRENT" },
];

export default function StreamingRoom() {
  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.topline}>
          <Link href="/" className={styles.back}>← HOME</Link>
          <span className={styles.badge}>MOVIES + STREAMING</span>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.kicker}>WHAT SHOULD I WATCH?</p>
          <h1>Tonight.</h1>
          <p className={styles.lede}>
            New to streaming, worthwhile picks, and just enough theatrical news to know what is out there.
          </p>
        </div>

        <div className={styles.orb} aria-hidden="true">
          <span className={styles.play}>▶</span>
          <strong>JASKI</strong>
          <small>WATCH NEXT</small>
        </div>

        <div className={styles.footer}>
          <span>SPRINT 10 · COMPONENT 05</span>
          <span>LESS BROWSING. MORE WATCHING.</span>
        </div>
      </section>

      <LiveStreamingRadar />

      <section className={styles.utilityGrid}>
        <article className={styles.utility}>
          <p className={styles.kicker}>YOUR SERVICES</p>
          <h2>Go watch something.</h2>
          <p>Fast doors to the streaming services you are most likely to use.</p>
          <div className={styles.serviceLinks}>
            <a href="https://www.netflix.com/" target="_blank" rel="noreferrer">Netflix ↗</a>
            <a href="https://www.amazon.com/gp/video/storefront" target="_blank" rel="noreferrer">Prime Video ↗</a>
            <a href="https://www.max.com/" target="_blank" rel="noreferrer">Max ↗</a>
            <a href="https://www.hulu.com/" target="_blank" rel="noreferrer">Hulu ↗</a>
            <a href="https://www.disneyplus.com/" target="_blank" rel="noreferrer">Disney+ ↗</a>
            <a href="https://www.peacocktv.com/" target="_blank" rel="noreferrer">Peacock ↗</a>
          </div>
        </article>

        <article className={styles.utility}>
          <p className={styles.kicker}>THE POINT</p>
          <h2>Less browsing.</h2>
          <p>Live release coverage stays focused on what is newly available or worth noticing — not a giant catalog.</p>
          <span className={styles.status}>STREAMING FIRST · THEATERS SECOND</span>
        </article>
      </section>
    </div>
  );
}
