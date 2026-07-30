import Link from "next/link";
import styles from "./FoodRoom.module.css";

const foodDoors = [
  {
    number: "01",
    kicker: "YOUR COLLECTION",
    title: "Recipe Book",
    copy: "The recipes worth keeping, collected in one place and ready for the kitchen.",
    meta: "Personal library",
    href: "/food/recipes",
    monogram: "R",
  },
  {
    number: "02",
    kicker: "COOKING VIEW",
    title: "Kitchen Mode",
    copy: "A focused cooking screen built for ingredients, steps, timers and hands-on use.",
    meta: "Cook without clutter",
    href: "/food/kitchen",
    monogram: "K",
  },
];

export default function FoodRoom() {
  return (
    <div className={styles.room}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>RECIPE BOOK / KITCHEN MODE / ST. LOUIS</p>
          <h1>Food.</h1>
          <p className={styles.lede}>
            The recipes we keep, the meals we make, and the places around St. Louis worth knowing about.
          </p>
          <div className={styles.heroStatus}>
            <span>ROOM 07</span>
            <span>PERSONAL COLLECTION</span>
            <span>LOCAL FIRST</span>
          </div>
        </div>
        <div className={styles.heroMark} aria-hidden="true">
          <span>F</span>
          <small>FOOD</small>
        </div>
      </header>

      <section className={styles.sectionIntro}>
        <div>
          <p className={styles.sectionLabel}>START HERE</p>
          <h2>Three ways into the room.</h2>
        </div>
        <p>Keep recipes personal. Make cooking simple. Keep an eye on the St. Louis table.</p>
      </section>

      <section className={styles.primaryGrid} aria-label="Food room destinations">
        {foodDoors.map((door) => (
          <Link href={door.href} className={styles.primaryCard} key={door.title}>
            <div className={styles.cardTopline}>
              <span>{door.number}</span>
              <span>{door.meta}</span>
            </div>
            <div className={styles.cardMark} aria-hidden="true">{door.monogram}</div>
            <div className={styles.cardCopy}>
              <p>{door.kicker}</p>
              <h3>{door.title}</h3>
              <span>{door.copy}</span>
            </div>
            <div className={styles.open}>Open <b>→</b></div>
          </Link>
        ))}

        <a
          href="https://www.saucemagazine.com/"
          target="_blank"
          rel="noreferrer"
          className={`${styles.primaryCard} ${styles.localCard}`}
        >
          <div className={styles.cardTopline}>
            <span>03</span>
            <span>St. Louis</span>
          </div>
          <div className={`${styles.cardMark} ${styles.localMark}`} aria-hidden="true">STL</div>
          <div className={styles.cardCopy}>
            <p>LOCAL TABLE</p>
            <h3>What&apos;s happening around town.</h3>
            <span>Restaurant openings, closings, new menus and the local food stories worth seeing.</span>
          </div>
          <div className={styles.sourceLine}>
            <span>Starting source</span>
            <strong>Sauce Magazine</strong>
          </div>
          <div className={styles.open}>Read Sauce <b>↗</b></div>
        </a>
      </section>

      <footer className={styles.footerLine}>
        <span>FOOD ROOM</span>
        <span>Recipe Book · Kitchen Mode · Local Table</span>
      </footer>
    </div>
  );
}
