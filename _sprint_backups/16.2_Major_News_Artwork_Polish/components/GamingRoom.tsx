import styles from "./GamingRoom.module.css";

type NewsItem = {
  source: string;
  label: string;
  headline: string;
  summary: string;
  href: string;
};

type Release = {
  date: string;
  title: string;
  platforms: string[];
  note: string;
};

const news: NewsItem[] = [
  {
    source: "PLAYSTATION",
    label: "NEW LOOK",
    headline: "Marvel’s Wolverine gets a fresh story trailer",
    summary: "Insomniac shared new story details, art, and composer information for the upcoming PS5 release.",
    href: "https://blog.playstation.com/2026/07/23/marvels-wolverine-story-trailer-new-art-composer-details-and-more/",
  },
  {
    source: "XBOX",
    label: "GAME PASS",
    headline: "Gears of War: Reloaded leads the latest Game Pass wave",
    summary: "Xbox’s July lineup added the rebuilt original Gears alongside more console, PC, handheld, and cloud releases.",
    href: "https://news.xbox.com/en-us/2026/07/07/xbox-game-pass-july-2026-wave-1/",
  },
  {
    source: "NINTENDO",
    label: "SWITCH 2",
    headline: "Nintendo’s latest Direct set up a busy Switch 2 slate",
    summary: "Ocarina of Time, Kingdom Hearts IV, Xenoblade Genesis and more were among the major Switch 2 reveals.",
    href: "https://www.nintendo.com/us/whatsnew/nintendo-direct-unveils-new-games-and-updates-for-nintendo-switch-2-and-nintendo-switch-including-the-legend-of-zelda-ocarina-of-time-kingdom-hearts-iv-xenoblade-genesis-and-more/",
  },
];

const releases: Release[] = [
  { date: "AUG 04", title: "Beast of Reincarnation", platforms: ["PS5", "XBOX", "PC"], note: "Action RPG" },
  { date: "AUG 06", title: "Marvel Tōkon: Fighting Souls", platforms: ["PS5", "PC"], note: "Fighting" },
  { date: "AUG 13", title: "Madden NFL 27", platforms: ["PS5", "XBOX", "SWITCH 2", "PC"], note: "Sports" },
  { date: "AUG 27", title: "Metal Gear Solid Master Collection Vol. 2", platforms: ["PS5", "XBOX", "SWITCH 2", "SWITCH", "PC"], note: "Collection" },
  { date: "AUG 27", title: "Star Wars: Zero Company", platforms: ["PS5", "XBOX", "PC"], note: "Tactics" },
  { date: "SEP 15", title: "Marvel’s Wolverine", platforms: ["PS5"], note: "Action" },
];

export default function GamingRoom() {
  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.gridGlow} />
        <p className={styles.eyebrow}>VIDEO GAMES / COMMAND CENTER</p>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>PLAY NEXT</p>
          <h1>Jaski Arcade</h1>
          <p className={styles.lede}>
            The big stories, what is coming next, and a home for the game server we are building.
          </p>
        </div>
        <div className={styles.heroMark} aria-hidden="true">
          <span>+</span>
          <strong>PLAY</strong>
          <small>JASKI GAMING</small>
        </div>
        <div className={styles.heroFooter}>
          <span>ALL PLATFORMS</span>
          <span>NO ENDLESS FEED.</span>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>MAJOR NEWS</p>
            <h2>What matters.</h2>
            <p className={styles.sectionCopy}>A few major stories across console and PC gaming.</p>
          </div>
          <span className={styles.count}>3 STORIES</span>
        </div>
        <div className={styles.newsGrid}>
          {news.map((item) => (
            <a className={styles.newsCard} href={item.href} target="_blank" rel="noreferrer" key={item.headline}>
              <div className={styles.newsTop}><span>{item.source}</span><span>{item.label}</span></div>
              <h3>{item.headline}</h3>
              <p>{item.summary}</p>
              <span className={styles.readMore}>READ STORY ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>UPCOMING RELEASES</p>
            <h2>Coming soon.</h2>
            <p className={styles.sectionCopy}>A cross-platform look at the next games worth knowing about.</p>
          </div>
          <span className={styles.count}>6 PICKS</span>
        </div>
        <div className={styles.releaseGrid}>
          {releases.map((game) => (
            <article className={styles.releaseCard} key={`${game.date}-${game.title}`}>
              <div className={styles.releaseDate}>{game.date}</div>
              <div className={styles.releaseBody}>
                <small>{game.note}</small>
                <h3>{game.title}</h3>
                <div className={styles.badges}>
                  {game.platforms.map((platform) => <span key={platform}>{platform}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.serverPanel}`}>
        <div className={styles.serverCopy}>
          <p className={styles.sectionEyebrow}>JASKI GAME SERVER</p>
          <h2>Your arcade is being built.</h2>
          <p>
            Placeholder for the emulator and game-streaming project. This becomes the front door for your library,
            Moonlight, RetroArch, server status, and remote play as the project comes online.
          </p>
          <span className={styles.status}><i /> PROJECT IN PROGRESS</span>
        </div>
        <div className={styles.serverVisual} aria-hidden="true">
          <div className={styles.serverCore}>J</div>
          <span>GAME SERVER</span>
          <small>COMING ONLINE</small>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>QUICK LAUNCH</p>
            <h2>Jump in.</h2>
            <p className={styles.sectionCopy}>The two gaming destinations that matter here.</p>
          </div>
        </div>
        <div className={styles.launchGrid}>
          <a className={styles.launchCard} href="https://www.xbox.com/" target="_blank" rel="noreferrer">
            <div className={styles.launchIcon}>X</div>
            <div><small>XBOX</small><strong>Xbox</strong><p>Console, Game Pass & cloud gaming</p></div>
            <span>↗</span>
          </a>
          <a className={styles.launchCard} href="https://store.steampowered.com/" target="_blank" rel="noreferrer">
            <div className={styles.launchIcon}>S</div>
            <div><small>PC</small><strong>Steam</strong><p>Your PC library and storefront</p></div>
            <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
