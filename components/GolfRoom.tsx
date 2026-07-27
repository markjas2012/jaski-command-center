import Link from "next/link";
import styles from "./GolfRoom.module.css";

const quickLinks = [
  { label: "PGA Tour", href: "https://www.pgatour.com/" },
  { label: "The Masters", href: "https://www.masters.com/" },
  { label: "USGA", href: "https://www.usga.org/" },
  { label: "GHIN", href: "https://www.ghin.com/" },
];

const golfWorld = [
  {
    eyebrow: "WATCH",
    title: "This Week in Golf",
    body: "A clean landing zone for the tournament you care about right now.",
    tag: "TOUR",
  },
  {
    eyebrow: "READ",
    title: "Golf Stories",
    body: "Long-form golf, architecture, equipment and the good stuff between tournaments.",
    tag: "JOURNAL",
  },
  {
    eyebrow: "PLAY",
    title: "Local Golf",
    body: "Your future home for St. Louis-area courses, tee-time shortcuts and favorite tracks.",
    tag: "STL",
  },
];

export default function GolfRoom() {
  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link href="/" className={styles.back}>
            ← HOME
          </Link>

          <p className={styles.kicker}>THE GAME</p>
          <h1 className={styles.title}>Golf.</h1>
          <p className={styles.subtitle}>
            Tournaments, courses, stories and the places you actually go.
          </p>

          <div className={styles.actions}>
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={styles.action}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div className={styles.mark} aria-hidden="true">
          <div className={styles.flag}>
            <span className={styles.pole} />
            <span className={styles.flagShape} />
            <span className={styles.cup} />
          </div>
          <span className={styles.markText}>GOLF</span>
          <span className={styles.markSub}>THE NEXT TEE</span>
        </div>

        <div className={styles.heroFooter}>
          <span>SPRINT 10 · COMPONENT 04</span>
          <span>PLAY THE NEXT ONE.</span>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionKicker}>YOUR GOLF WORLD</p>
        <h2 className={styles.sectionTitle}>Everything golf. Nothing noisy.</h2>
        <p className={styles.sectionIntro}>
          This room starts simple and gives future golf components a permanent home.
        </p>

        <div className={styles.cards}>
          {golfWorld.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.cardTop}>
                <span>{item.eyebrow}</span>
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
