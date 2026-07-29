import styles from "./GamingRoom.module.css";

type NewsItem = {
  source: string;
  label: string;
  headline: string;
  summary: string;
  href: string;
  art: "wolverine" | "halo" | "splatoon";
  artLabel: string;
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
    label: "STORY TRAILER",
    headline: "Marvel’s Wolverine sharpens the focus for September",
    summary: "Insomniac revealed a new story trailer, more character details, and the score behind its September 15 PS5 release.",
    href: "https://blog.playstation.com/2026/07/23/marvels-wolverine-story-trailer-new-art-composer-details-and-more/",
    art: "wolverine",
    artLabel: "LOGAN / SEP 15",
  },
  {
    source: "XBOX",
    label: "OUT NOW",
    headline: "Halo: Campaign Evolved brings the original fight forward",
    summary: "The Combat Evolved campaign has been rebuilt with updated visuals, refined controls, new prequel missions, and Game Pass support.",
    href: "https://news.xbox.com/en-us/2026/07/24/next-week-on-xbox-new-games-for-july-27-to-31/",
    art: "halo",
    artLabel: "HALO / JUL 28",
  },
  {
    source: "NINTENDO",
    label: "SWITCH 2",
    headline: "Splatoon Raiders opens a new single-player hunt",
    summary: "Nintendo’s new Switch 2 exclusive sends players to the Spirhalite Islands with Deep Cut for a treasure-focused solo adventure.",
    href: "https://www.nintendo.com/us/whatsnew/",
    art: "splatoon",
    artLabel: "RAIDERS / OUT NOW",
  },
]

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
          {news.map((item, index) => (
            <a
              className={`${styles.newsCard} ${styles[`newsCard${index + 1}`]}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              key={item.headline}
            >
              <div className={`${styles.newsArt} ${styles[item.art]}`} aria-hidden="true">
                <span className={styles.artWord}>{item.artLabel}</span>
                <i className={styles.artMark} />
              </div>
              <div className={styles.newsContent}>
                <div className={styles.newsTop}><span>{item.source}</span><span>{item.label}</span></div>
                <h3>{item.headline}</h3>
                <p>{item.summary}</p>
                <span className={styles.readMore}>READ STORY ↗</span>
              </div>
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
