import styles from "./GamingRoom.module.css";

import GameManuals from "./GameManuals";
import { getGamingNews } from "../lib/gaming-news";
import { upcomingGamePriority } from "../lib/gaming-preferences";

type RawgPlatform = {
  platform?: { name?: string };
};

type RawgGame = {
  id: number;
  added?: number;
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


const scoreUpcomingGame = upcomingGamePriority;


const FALLBACK_RELEASES: Release[] = [];

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
  url.searchParams.set("page_size", "100");
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
      .filter((game) => game.name && game.released && game.released >= iso(today) && game.background_image)
      .map((game) => ({ game, relevance: scoreUpcomingGame(game) }))
      .filter(({ relevance }) => relevance > 0)
      .sort((a, b) => {
        if (b.relevance !== a.relevance) return b.relevance - a.relevance;
        return (a.game.released ?? "").localeCompare(b.game.released ?? "");
      })
      .slice(0, 6)
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

    return releases.length > 0
      ? { releases, live: true }
      : { releases: FALLBACK_RELEASES, live: false };
  } catch {
    return { releases: FALLBACK_RELEASES, live: false };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function GamingRoom() {
  const [{ releases, live }, news] = await Promise.all([getUpcomingReleases(), getGamingNews()]);

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
          <a className={styles.playniteLaunch} href="https://es-de.org/" target="_blank" rel="noreferrer">
            <span className={styles.playniteIcon}>ES</span>
            <div>
              <small>JASKI GAME SERVER</small>
              <strong>EmulationStation-DE</strong>
              <p>Your controller-first game library.</p>
            </div>
            <b>OPEN â†—</b>
          </a>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.newsPanel}`}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>MAJOR NEWS</p>
            <h2>What matters.</h2>
            <p className={styles.sectionCopy}>Major games, fighting, sports, and hardware from Xbox Wire and PlayStation Blog.</p>
          </div>
          <span className={styles.count}>{news.length} STORIES</span>
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
              <div className={styles.newsArt}
                style={{ background: item.image ? `linear-gradient(180deg,transparent,rgba(3,8,16,.65)),url(${JSON.stringify(item.image)}) center/cover` : "linear-gradient(135deg,#18334f,#0a1424)" }} aria-hidden="true">
                <span className={styles.artWord}>{item.artLabel}</span>
                <i className={styles.artMark} />
              </div>
              <div className={styles.newsContent}>
                <div className={styles.newsTop}><span>{item.source}</span><span>{item.label}</span></div>
                <h3>{item.headline}</h3>
                <p>{item.summary}</p>
                <span className={styles.readMore}>READ STORY â†—</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.fightLinksPanel}`}>
        <div className={styles.fightLinksHead}>
          <span>FIGHTING GAMES</span>
          <strong>Quick links.</strong>
        </div>
        <div className={styles.fightQuickLinks}>
          <a href="https://www.start.gg/search/tournaments" target="_blank" rel="noreferrer">Start.gg ↗</a>
          <a href="https://www.eventhubs.com/tiers/" target="_blank" rel="noreferrer">EventHubs ↗</a>
          <a href="https://www.twitch.tv/directory/category/mortal-kombat-1" target="_blank" rel="noreferrer">Mortal Kombat on Twitch ↗</a>
          <a href="https://www.twitch.tv/directory/category/street-fighter-6" target="_blank" rel="noreferrer">Street Fighter 6 on Twitch ↗</a>
          <a href="https://www.twitch.tv/directory/category/tekken-8" target="_blank" rel="noreferrer">Tekken 8 on Twitch ↗</a>
        </div>
      </section>

      <GameManuals />

      <section className={`${styles.panel} ${styles.releasePanel}`}>
        <div className={styles.releaseMarks} aria-hidden="true"><span>â™›</span><b>ÏŸ</b></div>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>UPCOMING RELEASES</p>
            <h2>Coming soon.</h2>
            <p className={styles.sectionCopy}>Major releases, fighting games, and sports games worth watching.</p>
          </div>
          <span className={styles.count}>{Math.min(releases.length, 3)} PICKS</span>
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
        {!live && <p className={styles.sectionCopy}>No matching upcoming releases are available right now. <a href="https://rawg.io/games" target="_blank" rel="noreferrer">Browse current games ↗</a></p>}
        <div className={styles.releaseSource}>
          <span>{live ? "LIVE RELEASE DATA" : "RELEASE FEED UNAVAILABLE"}</span>
          <a href="https://rawg.io/" target="_blank" rel="noreferrer">Data & artwork via RAWG â†—</a>
        </div>
      </section>

    </main>
  );
}

