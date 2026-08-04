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

type RawgPlatform = {
  platform?: { name?: string };
};

type RawgGame = {
  id: number;
  name: string;
  released?: string | null;
  background_image?: string | null;
  genres?: { name?: string }[];
  platforms?: RawgPlatform[];
  parent_platforms?: RawgPlatform[];
  slug?: string;
};

type Release = {
  id: number | string;
  date: string;
  title: string;
  platforms: string[];
  note: string;
  image: string | null;
  href: string;
};


const scoreUpcomingGame = (game: RawgGame) => {
  let score = 0;

  const name = game.name?.toLowerCase() ?? "";
  const genres = (game.genres ?? []).map((genre) => genre.name.toLowerCase());
  const platforms = (game.parent_platforms ?? []).map((platform) => platform.platform.name.toLowerCase());

  // Prefer broadly relevant console / PC releases.
  if (platforms.some((platform) => ["playstation", "xbox", "pc", "nintendo"].includes(platform))) score += 4;

  // Favor the genres that most often represent major commercial releases.
  if (genres.some((genre) => ["action", "adventure", "role-playing-games-rpg", "shooter", "sports", "fighting", "racing", "strategy"].includes(genre))) score += 3;

  // Small bias toward titles that look like established / premium releases.
  if (name.includes("marvel")) score += 2;
  if (name.includes("star wars")) score += 2;
  if (name.includes("grand theft auto")) score += 3;
  if (name.includes("metal gear")) score += 2;
  if (name.includes("madden")) score += 2;
  if (name.includes("mafia")) score += 2;

  // De-prioritize obvious simulator / novelty / demo-style listings.
  if (name.includes("simulator")) score -= 3;
  if (name.includes("demo")) score -= 4;
  if (name.includes("prologue")) score -= 3;

  return score;
};


const FALLBACK_RELEASES: Release[] = [
  { id: "fallback-1", date: "AUG 04", title: "Beast of Reincarnation", platforms: ["PS5", "XBOX", "PC"], note: "Action RPG", image: null, href: "https://rawg.io/" },
  { id: "fallback-2", date: "AUG 06", title: "Marvel Tōkon: Fighting Souls", platforms: ["PS5", "PC"], note: "Fighting", image: null, href: "https://rawg.io/" },
  { id: "fallback-3", date: "AUG 13", title: "Madden NFL 27", platforms: ["PS5", "XBOX", "SWITCH 2", "PC"], note: "Sports", image: null, href: "https://rawg.io/" },
  { id: "fallback-4", date: "AUG 27", title: "Metal Gear Solid Master Collection Vol. 2", platforms: ["PS5", "XBOX", "SWITCH 2", "SWITCH", "PC"], note: "Collection", image: null, href: "https://rawg.io/" },
  { id: "fallback-5", date: "AUG 27", title: "Star Wars: Zero Company", platforms: ["PS5", "XBOX", "PC"], note: "Tactics", image: null, href: "https://rawg.io/" },
  { id: "fallback-6", date: "SEP 15", title: "Marvel’s Wolverine", platforms: ["PS5"], note: "Action", image: null, href: "https://rawg.io/" },
];

function formatReleaseDate(value?: string | null) {
  if (!value) return "TBA";
  const date = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", timeZone: "UTC" })
    .format(date)
    .toUpperCase();
}

function compactPlatform(name?: string) {
  if (!name) return null;
  const lower = name.toLowerCase();
  if (lower.includes("playstation 5")) return "PS5";
  if (lower.includes("playstation 4")) return "PS4";
  if (lower.includes("xbox series")) return "XBOX";
  if (lower === "xbox one") return "XBOX ONE";
  if (lower.includes("nintendo switch 2")) return "SWITCH 2";
  if (lower === "nintendo switch") return "SWITCH";
  if (lower === "pc") return "PC";
  return null;
}

async function getUpcomingReleases(): Promise<{ releases: Release[]; live: boolean }> {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) return { releases: FALLBACK_RELEASES, live: false };

  const today = new Date();
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + 120);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("dates", `${iso(today)},${iso(end)}`);
  url.searchParams.set("ordering", "-added");
  url.searchParams.set("page_size", "40");
  url.searchParams.set("exclude_additions", "true");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      next: { revalidate: 21600 },
      signal: controller.signal,
    });
    if (!response.ok) return { releases: FALLBACK_RELEASES, live: false };
    const data = (await response.json()) as { results?: RawgGame[] };
    const releases = (data.results ?? [])
      .filter((game) => game.name && game.released && game.background_image)
      .map((game) => ({ game, relevance: scoreUpcomingGame(game) }))
      .sort((a, b) => {
        if (b.relevance !== a.relevance) return b.relevance - a.relevance;
        return (a.game.released ?? "").localeCompare(b.game.released ?? "");
      })
      .slice(0, 18)
      .sort((a, b) => (a.game.released ?? "").localeCompare(b.game.released ?? ""))
      .map(({ game }): Release => {
        const platforms = Array.from(new Set((game.platforms ?? []).map((item) => compactPlatform(item.platform?.name)).filter(Boolean))) as string[];
        return {
          id: game.id,
          date: formatReleaseDate(game.released),
          title: game.name,
          platforms: platforms.slice(0, 5),
          note: game.genres?.[0]?.name ?? "Upcoming",
          image: game.background_image ?? null,
          href: game.slug ? `https://rawg.io/games/${game.slug}` : "https://rawg.io/",
        };
      })
      .filter((game) => game.platforms.length > 0)
      .slice(0, 6);

    return releases.length >= 3
      ? { releases, live: true }
      : { releases: FALLBACK_RELEASES, live: false };
  } catch {
    return { releases: FALLBACK_RELEASES, live: false };
  } finally {
    clearTimeout(timeout);
  }
}

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



export default async function GamingRoom() {
  const { releases, live } = await getUpcomingReleases();

  return (
    <main className={styles.room}>
      <section className={`${styles.hero} ${styles.compactHero}`}>
        <div className={styles.gridGlow} />
        <div className={styles.heroBar}>
          <div className={styles.compactHeroCopy}>
            <p className={styles.eyebrow}>VIDEO GAMES / COMMAND CENTER</p>
            <h1>Jaski Arcade</h1>
            <p className={styles.lede}>What matters, what is next, and one front door to play.</p>
          </div>
          <a className={styles.playniteLaunch} href="https://playnite.link/" target="_blank" rel="noreferrer">
            <span className={styles.playniteIcon}>P</span>
            <div>
              <small>JASKI GAME SERVER</small>
              <strong>Launch Playnite</strong>
              <p>Your controller-first arcade.</p>
            </div>
            <b>OPEN ↗</b>
          </a>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.newsPanel}`}>
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

      <section className={`${styles.panel} ${styles.fightPanel}`}>
        <div className={styles.fightDecor} aria-hidden="true">
          <span className={styles.tourneyFlyer}>TOURNEY<br /><b>SAT 9PM</b><br />STREET FIGHTER<br />KILLER INSTINCT</span>
          <span className={styles.rulesFlyer}>KEEP IT<br /><b>CASUAL</b><br /><small>NO SALT<br />NO CHEATING<br />JUST GAMES</small></span>
          <span className={styles.smileySticker}>:)</span>
        </div>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>FIGHT NIGHT</p>
            <h2>The tournament desk.</h2>
            <p className={styles.sectionCopy}>Fighting-game news, brackets, and live streams without the endless feed.</p>
          </div>
          <span className={styles.count}>FGC / ESPORTS</span>
        </div>

        <div className={styles.fightGrid}>
          <a className={`${styles.fightCard} ${styles.fightFeatured}`} href="https://www.start.gg/search/tournaments" target="_blank" rel="noreferrer">
            <div className={styles.fightTop}><span>TOURNAMENTS</span><b>START.GG</b></div>
            <h3>Find the next bracket.</h3>
            <p>Major events and community tournaments for Mortal Kombat, Killer Instinct, Street Fighter, Tekken, and more.</p>
            <div className={styles.gameTags}><span>MK</span><span>KI</span><span>SF</span><span>TEKKEN</span><span>SOULCALIBUR</span></div>
            <strong className={styles.fightAction}>BROWSE EVENTS ↗</strong>
          </a>

          <div className={`${styles.fightCard} ${styles.eventHubsCard}`}>
            <div className={styles.fightTop}><span>FIGHT LAB</span><b>EVENTHUBS</b></div>
            <h3>Know the matchup.</h3>
            <p>Tier boards, tournament results, and the changes shaping the fighting games you follow.</p>
            <div className={styles.eventHubsLinks}>
              <a href="https://www.eventhubs.com/tiers/" target="_blank" rel="noreferrer">
                <span><small>RANKINGS</small>Tier Lists</span><b>↗</b>
              </a>
              <a href="https://www.eventhubs.com/news/" target="_blank" rel="noreferrer">
                <span><small>RESULTS + NEWS</small>FGC Headlines</span><b>↗</b>
              </a>
            </div>
            <a className={styles.eventHubsLaunch} href="https://www.eventhubs.com/" target="_blank" rel="noreferrer">
              <span className={styles.eventHubsIcon}>E</span>
              <span><small>FIGHTING GAME HUB</small><strong>Open EventHubs</strong></span>
              <b>OPEN ↗</b>
            </a>
          </div>

          <div className={`${styles.fightCard} ${styles.twitchCard}`}>
            <div className={styles.fightTop}><span>WATCH LIVE</span><b>TWITCH</b></div>
            <h3>Enter the arena.</h3>
            <p>Jump directly to the fighting-game directories currently worth checking.</p>
            <div className={styles.twitchLinks}>
              <a href="https://www.twitch.tv/directory/category/mortal-kombat-1" target="_blank" rel="noreferrer">Mortal Kombat <span>↗</span></a>
              <a href="https://www.twitch.tv/directory/category/street-fighter-6" target="_blank" rel="noreferrer">Street Fighter 6 <span>↗</span></a>
              <a href="https://www.twitch.tv/directory/category/tekken-8" target="_blank" rel="noreferrer">Tekken 8 <span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.releasePanel}`}>
        <div className={styles.releaseMarks} aria-hidden="true"><span>♛</span><b>ϟ</b></div>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>UPCOMING RELEASES</p>
            <h2>Coming soon.</h2>
            <p className={styles.sectionCopy}>A cross-platform look at the next games worth knowing about.</p>
          </div>
          <span className={styles.count}>3 PICKS</span>
        </div>
        <div className={styles.releaseGrid}>
          {releases.slice(0, 3).map((game) => (
            <a className={styles.releaseCard} href={game.href} target="_blank" rel="noreferrer" key={game.id}>
              <div
                className={`${styles.releaseArt} ${!game.image ? styles.releaseArtFallback : ""}`}
                style={game.image ? { backgroundImage: `linear-gradient(180deg,rgba(3,8,16,.02),rgba(3,8,16,.10)),url(${JSON.stringify(game.image)})` } : undefined}
                aria-hidden="true"
              >
                <span className={styles.releaseDate}>{game.date}</span>
              </div>
              <div className={styles.releaseBody}>
                <small>{game.note}</small>
                <h3>{game.title}</h3>
                <div className={styles.badges}>
                  {game.platforms.map((platform) => <span key={platform}>{platform}</span>)}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className={styles.releaseSource}>
          <span>{live ? "LIVE RELEASE DATA" : "FALLBACK RELEASE LIST"}</span>
          <a href="https://rawg.io/" target="_blank" rel="noreferrer">Data & artwork via RAWG ↗</a>
        </div>
      </section>

    </main>
  );
}
