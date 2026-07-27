"use client";
import JamLive from "./JamLive";
import styles from "./JamHero.module.css";

const quickLinks = [
  { label: "Nugs", detail: "Live shows & archives", href: "https://www.nugs.net/" },
  { label: "Relix", detail: "Jam-band news & culture", href: "https://relix.com/" },
  { label: "JamBase", detail: "Tour news & setlists", href: "https://www.jambase.com/" },
  { label: "Archive", detail: "Grateful Dead recordings", href: "https://archive.org/details/GratefulDead" },
];

const spotlight = [
  {
    kicker: "ON THIS DAY",
    title: "Today in Grateful Dead history",
    body: "A daily door into one show, one date, and one good reason to hit play.",
    href: "https://archive.org/details/GratefulDead",
    cta: "Open the archive",
  },
  {
    kicker: "LISTEN NEXT",
    title: "One show worth your time",
    body: "A rotating recommendation slot for a Dead show, Phish set, or Umphrey's night.",
    href: "https://www.nugs.net/",
    cta: "Start listening",
  },
];

export default function JamHero() {
  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>LIVE MUSIC / ARCHIVE / SETLISTS</p>
          <h1>Jam Room.</h1>
          <p className={styles.lede}>
            Grateful Dead history, current jam-band news, and the next show worth putting on.
          </p>
        </div>

        <div className={styles.badge} aria-hidden="true">
          <span className={styles.badgeLetter}>J</span>
          <span>LISTEN DEEPER</span>
        </div>

        <div className={styles.heroFooter}>
          <span>SPRINT 12 · ROOM 01</span>
          <span>NO ALGORITHM. JUST GOOD SHOWS.</span>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.primaryCard}>
          <p className={styles.cardKicker}>TONIGHT'S DOORWAY</p>
          <h2>Put something good on.</h2>
          <p>
            A clean starting point for the music you already care about—without turning this into
            another endless feed.
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

        <div className={styles.spotlightGrid}>
          {spotlight.map((item) => (
            <a
              className={styles.spotlightCard}
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.cardKicker}>{item.kicker}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <strong>{item.cta} ↗</strong>
            </a>
          ))}
              </div>
    </section>

    <JamLive />
  </main>
);
}
