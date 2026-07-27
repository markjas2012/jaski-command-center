import Link from "next/link";
import styles from "./StreamingRoom.module.css";

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

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>NEW TO STREAMING</p>
            <h2>Start here.</h2>
          </div>
          <span className={styles.week}>THIS WEEK</span>
        </div>

        <div className={styles.cards}>
          {newStreaming.map((item, index) => (
            <article className={`${styles.card} ${index === 0 ? styles.featured : ""}`} key={item.title}>
              <div className={styles.cardMeta}><span>{item.service}</span><span>{item.meta}</span></div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.utilityGrid}>
        <article className={styles.utility}>
          <p className={styles.kicker}>LEAVING SOON</p>
          <h2>Watch it before it goes.</h2>
          <p>A future live list for worthwhile titles disappearing from your streaming services.</p>
          <span className={styles.status}>CONTENT FEED NEXT</span>
        </article>

        <article className={styles.utility}>
          <p className={styles.kicker}>IN THEATERS</p>
          <h2>Just the highlights.</h2>
          <p>A small blip for notable theatrical releases — no showtimes, ticket clutter, or giant theater guide.</p>
          <span className={styles.status}>2–4 NOTABLE RELEASES</span>
        </article>
      </section>
    </div>
  );
}
