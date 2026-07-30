import Link from "next/link";
import styles from "./FoodRoom.module.css";

export default function FoodRoom() {
  return (
    <div className={styles.room}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>RECIPES / COOK / ST. LOUIS</p>
          <h1>Food.</h1>
          <p className={styles.lede}>The recipes we keep, the meals we make, and what’s happening around town.</p>
        </div>
        <div className={styles.mark} aria-hidden="true">F</div>
      </header>

      <section className={styles.grid} aria-label="Food room">
        <Link href="/food/recipes" className={styles.card}>
          <span className={styles.number}>01</span>
          <div><p>YOUR COLLECTION</p><h2>Recipe Book</h2><span>Recipes worth keeping, organized your way.</span></div>
          <b>›</b>
        </Link>
        <Link href="/food/kitchen" className={styles.card}>
          <span className={styles.number}>02</span>
          <div><p>COOKING VIEW</p><h2>Kitchen Mode</h2><span>Big, focused, hands-on cooking mode.</span></div>
          <b>›</b>
        </Link>
        <a href="https://www.saucemagazine.com/" target="_blank" rel="noreferrer" className={`${styles.card} ${styles.local}`}>
          <span className={styles.number}>03</span>
          <div><p>ST. LOUIS</p><h2>Local Table</h2><span>Restaurant openings, closings, menus and news.</span><em>Featuring Sauce Magazine</em></div>
          <b>↗</b>
        </a>
      </section>
      <p className={styles.note}>Sprint 17.1 establishes the room. Recipe Book, Kitchen Mode and live Local Table content build from here.</p>
    </div>
  );
}
