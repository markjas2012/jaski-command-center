import styles from "./GameManuals.module.css";

const manuals = [
  { title: "Mortal Kombat Kombo Bible", detail: "Master 60 · Final locked glossary", file: "mk-kombo-bible.pdf", badge: "MK" },
  { title: "Killer Instinct Guide", detail: "Master 60 · Full audit", file: "killer-instinct.pdf", badge: "KI" },
  { title: "Mortal Kombat (1992)", detail: "Two-page guide", file: "mortal-kombat-1992.pdf", badge: "I" },
  { title: "Mortal Kombat II", detail: "Arcade · Two-page guide", file: "mortal-kombat-ii.pdf", badge: "II" },
  { title: "UMK3 / Mortal Kombat Trilogy", detail: "Combined quick reference", file: "umk3-trilogy.pdf", badge: "III" },
];

export default function GameManuals() {
  return (
    <section className={styles.shelf} aria-labelledby="game-manuals-title">
      <header className={styles.heading}>
        <h2 id="game-manuals-title">Game Manuals</h2>
        <span>5 GUIDES · PDF</span>
      </header>
      <div className={styles.grid}>
        {manuals.map((manual) => (
          <article className={styles.card} key={manual.file}>
            <span className={styles.badge} aria-hidden="true">{manual.badge}</span>
            <h3>{manual.title}</h3>
            <p>{manual.detail}</p>
            <div className={styles.actions}>
              <a href={`/manuals/${manual.file}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${manual.title} in a new tab`}>Open Manual</a>
              <a href={`/manuals/${manual.file}`} download aria-label={`Download ${manual.title} PDF`}>Download</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
