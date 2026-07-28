import styles from "./PhishFeature.module.css";

export default function PhishFeature() {
  return (
    <section className={styles.shell}>
      <header className={styles.head}>
        <div>
          <p>#2 · PHISH</p>
          <h2>Phish.</h2>
          <span>The next stop in the Jam Room.</span>
        </div>
        <b>#2</b>
      </header>

      <div className={styles.grid}>
        <article className={styles.primary}>
          <p>LATEST SHOW</p>
          <h3>See the newest Phish show.</h3>
          <span>Current date, venue and official tour details.</span>
          <div className={styles.links}>
            <a href="https://phish.com/tours/" target="_blank" rel="noreferrer">Latest show ↗</a>
            <a href="https://www.livephish.com/" target="_blank" rel="noreferrer">Listen on LivePhish ↗</a>
          </div>
        </article>

        <article>
          <p>SETLISTS</p>
          <h3>What did they play?</h3>
          <span>Browse shows and setlists by date and venue.</span>
          <a href="https://phish.net/setlists/" target="_blank" rel="noreferrer">Open setlists ↗</a>
        </article>

        <article>
          <p>PHISH NEWS</p>
          <h3>What’s happening.</h3>
          <span>Tour, release and band updates.</span>
          <a href="https://phish.com/news/" target="_blank" rel="noreferrer">Latest Phish news ↗</a>
        </article>
      </div>
    </section>
  );
}
