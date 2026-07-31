import styles from "./StreamingRoom.module.css";
import { curateThree, curationScore } from "../lib/streamingCuration";
import { CardGrid } from "./CardDetail";

type TmdbTitle = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  media_type?: "movie" | "tv";
};

type TmdbDetails = TmdbTitle & {
  networks?: Array<{ name: string }>;
  origin_country?: string[];
  in_production?: boolean;
};

type Pick = {
  id: number;
  title: string;
  kind: "MOVIE" | "TV" | "DOCUMENTARY";
  date?: string;
  displayContext?: string;
  image?: string;
  score?: number;
  href: string;
  network?: string;
  overview?: string;
  voteAverage?: number;
  rawDate?: string;
  firstAirDate?: string;
};

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w780";

function tmdbHeaders(): HeadersInit | undefined {
  const token = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  return token ? { Authorization: `Bearer ${token}`, accept: "application/json" } : undefined;
}

function tmdbApiKey(): string | undefined {
  return process.env.TMDB_API_KEY?.trim() || undefined;
}

async function tmdb<T>(path: string): Promise<T | null> {
  const headers = tmdbHeaders();
  const apiKey = tmdbApiKey();
  if (!headers && !apiKey) return null;

  const separator = path.includes("?") ? "&" : "?";
  const url = apiKey ? `${TMDB_BASE}${path}${separator}api_key=${encodeURIComponent(apiKey)}` : `${TMDB_BASE}${path}`;

  try {
    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function titleOf(item: TmdbTitle): string {
  return item.title || item.name || "Untitled";
}

function imageOf(item: TmdbTitle): string | undefined {
  const path = item.backdrop_path || item.poster_path;
  return path ? `${TMDB_IMAGE}${path}` : undefined;
}

function dateOf(item: TmdbTitle): string | undefined {
  return item.release_date || item.first_air_date || undefined;
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}


function tvContext(item: TmdbTitle, source?: string) {
  const service = source || "TV";
  const currentYear = new Date().getFullYear();
  const firstYear = item.first_air_date ? Number(item.first_air_date.slice(0, 4)) : 0;

  if (firstYear === currentYear) return `New series - ${service}`;
  if (firstYear > 0 && firstYear < currentYear) return `Current / returning - ${service}`;
  return `Current series - ${service}`;
}

function pickFrom(item: TmdbTitle, kind: Pick["kind"], mediaType: "movie" | "tv", network?: string): Pick {
  return {
    id: item.id,
    title: titleOf(item),
    kind,
    date: formatDate(dateOf(item)),
    displayContext: mediaType === "tv" ? tvContext(item, network) : undefined,
    image: imageOf(item),
    score: item.vote_average,
    href: `https://www.themoviedb.org/${mediaType}/${item.id}`,
    network,
    overview: item.overview,
    voteAverage: item.vote_average,
    rawDate: dateOf(item),
    firstAirDate: item.first_air_date,
  };
}

const LINEAR_NETWORKS = ["ABC", "CBS", "NBC", "FOX", "The CW", "PBS"];
const STREAMING_NETWORKS = [
  "Netflix",
  "HBO",
  "Max",
  "Apple TV+",
  "Disney+",
  "Hulu",
  "Paramount+",
  "Peacock",
  "Amazon",
  "Prime Video",
];

function matchingNetwork(details: TmdbDetails, names: string[]): string | undefined {
  const networks = details.networks?.map((n) => n.name) ?? [];
  return networks.find((network) => names.some((name) => network.toLowerCase().includes(name.toLowerCase())));
}

function matchingLinearNetwork(details: TmdbDetails): string | undefined {
  const network = matchingNetwork(details, LINEAR_NETWORKS);
  if (!network) return undefined;

  const originCountries = details.origin_country?.map((country) => country.toUpperCase()) ?? [];
  if (!originCountries.includes("US")) return undefined;
  if (details.in_production !== true) return undefined;

  return network;
}

async function loadTelevisionShelves(): Promise<{ network: Pick[]; streaming: Pick[] }> {
  // Keep the proven streaming-show path unchanged: the first 18 weekly trending shows,
  // enriched with TMDB details and verified against the streaming-service list.
  const trending = await tmdb<{ results: TmdbTitle[] }>('/trending/tv/week?language=en-US');
  if (!trending?.results?.length) {
    return { network: [], streaming: [] };
  }

  const streamingCandidates = trending.results.slice(0, 18);
  const streamingDetails = await Promise.all(
    streamingCandidates.map(async (item) => ({ item, details: await tmdb<TmdbDetails>(`/tv/${item.id}?language=en-US`) }))
  );

  const validStreaming = streamingDetails.filter(
    (entry): entry is { item: TmdbTitle; details: TmdbDetails } => Boolean(entry.details)
  );

  const streamingEntries = validStreaming
    .map((entry) => ({
      ...entry,
      network: matchingNetwork(entry.details, STREAMING_NETWORKS),
    }))
    .filter((entry) => Boolean(entry.network));

  const curatedStreamingIds = new Set(
    curateThree(streamingEntries.map((entry) => entry.item))
      .map((item) => item.id)
  );

  const streaming = streamingEntries
    .filter((entry) => curatedStreamingIds.has(entry.item.id))
    .sort((a, b) => curationScore(b.item) - curationScore(a.item))
    .slice(0, 3)
    .map((entry) => pickFrom(entry.item, 'TV', 'tv', entry.network));

  const [trendingPage2, trendingPage3, onAirPage1, onAirPage2] = await Promise.all([
    tmdb<{ results: TmdbTitle[] }>('/trending/tv/week?language=en-US&page=2'),
    tmdb<{ results: TmdbTitle[] }>('/trending/tv/week?language=en-US&page=3'),
    tmdb<{ results: TmdbTitle[] }>('/tv/on_the_air?language=en-US&page=1'),
    tmdb<{ results: TmdbTitle[] }>('/tv/on_the_air?language=en-US&page=2'),
  ]);

  const networkPool = [
    ...trending.results,
    ...(trendingPage2?.results ?? []),
    ...(trendingPage3?.results ?? []),
    ...(onAirPage1?.results ?? []),
    ...(onAirPage2?.results ?? []),
  ];

  const seen = new Set<number>();
  const networkCandidates = networkPool
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, 60);

  const networkDetails = await Promise.all(
    networkCandidates.map(async (item) => ({ item, details: await tmdb<TmdbDetails>(`/tv/${item.id}?language=en-US`) }))
  );

  const linearEntries = networkDetails
    .filter((entry): entry is { item: TmdbTitle; details: TmdbDetails } => Boolean(entry.details))
    .map((entry) => ({
      ...entry,
      network: matchingLinearNetwork(entry.details),
    }))
    .filter((entry) => Boolean(entry.network));

  const curatedNetworkIds = new Set(
    curateThree(linearEntries.map((entry) => entry.item))
      .map((item) => item.id)
  );

  const network = linearEntries
    .filter((entry) => curatedNetworkIds.has(entry.item.id))
    .sort((a, b) => curationScore(b.item) - curationScore(a.item))
    .slice(0, 3)
    .map((entry) => pickFrom(entry.item, "TV", "tv", entry.network));

  return { network, streaming };
}

async function loadMovies(): Promise<Pick[]> {
  const data = await tmdb<{ results: TmdbTitle[] }>("/movie/now_playing?language=en-US&region=US&page=1");
  return curateThree(data?.results ?? [])
    .map((item) => pickFrom(item as TmdbTitle, "MOVIE", "movie"));
}

async function loadDocumentaries(): Promise<Pick[]> {
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);
  const gte = yearAgo.toISOString().slice(0, 10);
  const lte = today.toISOString().slice(0, 10);

  const data = await tmdb<{ results: TmdbTitle[] }>(
    `/discover/movie?language=en-US&region=US&sort_by=popularity.desc&with_genres=99&primary_release_date.gte=${gte}&primary_release_date.lte=${lte}&vote_count.gte=20&page=1`
  );

  return curateThree(data?.results ?? [], { documentary: true })
    .map((item) => pickFrom(item as TmdbTitle, "DOCUMENTARY", "movie"));
}

async function loadUpcoming(excludeIds: Set<number> = new Set()): Promise<Pick[]> {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + 90);
  const gte = today.toISOString().slice(0, 10);
  const lte = end.toISOString().slice(0, 10);

  // Early bucket: 0-30 days
  const early30 = new Date(today);
  early30.setDate(today.getDate() + 30);
  const earlyLte = early30.toISOString().slice(0, 10);

  // Mid bucket: 30-60 days
  const mid60 = new Date(today);
  mid60.setDate(today.getDate() + 60);
  const midLte = mid60.toISOString().slice(0, 10);

  // Late bucket: 60-90 days
  const lateLte = lte;

  // Expand movie sources across three date buckets using discover for better coverage
  // Expand TV sources across two pages and include on_the_air for new premieres
  const [movEarly, movMid, movLate, tvDiscover1, tvDiscover2, tvOnAir] = await Promise.all([
    tmdb<{ results: TmdbTitle[] }>(`/discover/movie?language=en-US&region=US&sort_by=popularity.desc&release_date.gte=${gte}&release_date.lte=${earlyLte}&page=1`),
    tmdb<{ results: TmdbTitle[] }>(`/discover/movie?language=en-US&region=US&sort_by=popularity.desc&release_date.gte=${early30.toISOString().slice(0, 10)}&release_date.lte=${midLte}&page=1`),
    tmdb<{ results: TmdbTitle[] }>(`/discover/movie?language=en-US&region=US&sort_by=popularity.desc&release_date.gte=${mid60.toISOString().slice(0, 10)}&release_date.lte=${lateLte}&page=1`),
    tmdb<{ results: TmdbTitle[] }>(`/discover/tv?language=en-US&sort_by=first_air_date.asc&first_air_date.gte=${gte}&first_air_date.lte=${lte}&vote_count.gte=5&page=1`),
    tmdb<{ results: TmdbTitle[] }>(`/discover/tv?language=en-US&sort_by=first_air_date.asc&first_air_date.gte=${gte}&first_air_date.lte=${lte}&vote_count.gte=5&page=2`),
    tmdb<{ results: TmdbTitle[] }>(`/tv/on_the_air?language=en-US&sort_by=first_air_date.asc&page=1`),
  ]);

  // Deduplicate by ID before scoring
  const seen = new Set<number>();
  const allCandidates = [
    ...(movEarly?.results ?? []).map((item) => ({ item, type: "movie" as const })),
    ...(movMid?.results ?? []).map((item) => ({ item, type: "movie" as const })),
    ...(movLate?.results ?? []).map((item) => ({ item, type: "movie" as const })),
    ...(tvDiscover1?.results ?? []).map((item) => ({ item, type: "tv" as const })),
    ...(tvDiscover2?.results ?? []).map((item) => ({ item, type: "tv" as const })),
    ...(tvOnAir?.results ?? []).map((item) => ({ item, type: "tv" as const })),
  ].filter(({ item }) => {
    if (seen.has(item.id) || excludeIds.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  const candidates = allCandidates
    .map((entry) => {
      const item = entry.item;
      // Reuse 17.12 quality score: popularity + dampened vote_average
      const popularity = item.popularity ?? 0;
      const engagement = Math.log10((item.vote_count ?? 0) + 1);
      const ratingDamped = (item.vote_average ?? 0) * Math.min(1, engagement / 2.5);
      const score = popularity + ratingDamped;

      return {
        ...entry,
        dateValue: dateOf(item),
        score,
      };
    })
    .filter(({ dateValue }) => Boolean(dateValue))
    .filter(({ dateValue }) => {
      if (!dateValue) return false;
      const parsed = new Date(`${dateValue}T12:00:00`);
      return !Number.isNaN(parsed.getTime()) && parsed >= today && parsed <= end;
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (candidates.length === 0) return [];

  const selected: typeof candidates = [];
  const seenDates = new Set<string>();

  for (const candidate of candidates) {
    if (selected.length >= 6) break;

    const candidateDate = candidate.dateValue;
    const isNewDate = !seenDates.has(candidateDate ?? "");

    if (selected.length < 4 || isNewDate) {
      selected.push(candidate);
      seenDates.add(candidateDate ?? "");
    }
  }

  if (selected.length < 6 && candidates.length > selected.length) {
    for (const candidate of candidates) {
      if (selected.length >= 6) break;
      if (!selected.find((s) => s.item.id === candidate.item.id)) {
        selected.push(candidate);
      }
    }
  }

  return selected
    .sort((a, b) => (a.dateValue ?? "").localeCompare(b.dateValue ?? ""))
    .slice(0, 6)
    .map(({ item, type }) => pickFrom(item, type === "movie" ? "MOVIE" : "TV", type));
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className={styles.liveUnavailableCompact}>
      <span>LIVE SOURCE UNAVAILABLE</span>
      <strong>{label}</strong>
      <p>Nothing guessed or hard-coded is being substituted.</p>
    </div>
  );
}

function LiveCards({ picks }: { picks: Pick[] }) {
  if (!picks.length) return <EmptyState label="No verified current picks are available right now." />;

  return <CardGrid picks={picks} />;
}

export default async function StreamingRoom() {
  const hasTmdb = Boolean(process.env.TMDB_READ_ACCESS_TOKEN?.trim() || process.env.TMDB_API_KEY?.trim());

  const [movies, documentaries, television] = hasTmdb
    ? await Promise.all([loadMovies(), loadDocumentaries(), loadTelevisionShelves()])
    : [[], [], { network: [], streaming: [] }];

  const existingIds = new Set<number>([
    ...movies.map((pick) => pick.id),
    ...documentaries.map((pick) => pick.id),
    ...television.network.map((pick) => pick.id),
    ...television.streaming.map((pick) => pick.id),
  ]);

  const upcoming = hasTmdb ? await loadUpcoming(existingIds) : [];

  const shelves = [
    { title: "Movies", subtitle: "Feature films worth the time.", picks: movies },
    { title: "Network Television", subtitle: "Current television worth tuning in for.", picks: television.network },
    { title: "Documentaries", subtitle: "Nonfiction worth sitting down for.", picks: documentaries },
    { title: "Streaming Shows", subtitle: "The strongest series across your services.", picks: television.streaming },
  ];

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.glowOne} aria-hidden="true" />
        <div className={styles.glowTwo} aria-hidden="true" />
        <div className={styles.eyebrow}>YOUR ENTERTAINMENT / ONE PLACE</div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>STREAMING</p>
          <h1>What are we watching?</h1>
          <p className={styles.lede}>Your services, your library, and the things actually worth watching - without browsing ten apps first.</p>
        </div>
        <div className={styles.signal} aria-hidden="true">
          <span className={styles.signalRing} />
          <span className={styles.play}>▶</span>
          <strong>ON</strong>
          <small>JASKI STREAMING</small>
        </div>
        <div className={styles.footer}>
          <span>SPRINT 17.10g - NETWORK TV SOURCE REPAIR</span>
          <span>LESS BROWSING. MORE WATCHING.</span>
        </div>
      </section>

      <section className={styles.tonight}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>WORTH WATCHING</p>
            <h2>Worth your time.</h2>
            <p className={styles.sectionCopy}>Movies, network television, documentaries, and streaming shows - four clean shelves.</p>
          </div>
          <span className={styles.pickCount}>{hasTmdb ? "LIVE - TMDB" : "TMDB TOKEN NEEDED"}</span>
        </div>

        <div className={styles.worthShelves}>
          {shelves.map((group) => (
            <section className={styles.worthShelf} key={group.title}>
              <div className={styles.worthShelfHead}>
                <div>
                  <span>WORTH WATCHING</span>
                  <h3>{group.title}</h3>
                  <p>{group.subtitle}</p>
                </div>
                <small>{group.picks.length ? `${group.picks.length} LIVE PICKS` : "LIVE ONLY"}</small>
              </div>
              <LiveCards picks={group.picks} />
            </section>
          ))}
        </div>
      </section>

      <section className={styles.newComing}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>NEW & COMING</p>
            <h2>What's next.</h2>
            <p className={styles.sectionCopy}>Verified upcoming movie releases and new TV premieres over the next 90 days.</p>
          </div>
          <span className={styles.pickCount}>{upcoming.length ? `${upcoming.length} UPCOMING` : "LIVE ONLY"}</span>
        </div>
        <LiveCards picks={upcoming} />
      </section>

      <section className={styles.services}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>MY SERVICES</p>
            <h2>Where you watch.</h2>
            <p className={styles.sectionCopy}>Your streaming shelf - one clean place to jump into the services you already use.</p>
          </div>
          <span className={styles.pickCount}>12 SERVICES</span>
        </div>

        <div className={styles.serviceGrid}>
          {[
            ["YouTube TV","LIVE TV","https://tv.youtube.com/","/streaming-logos/youtubetv.svg"],
            ["YouTube","VIDEO","https://www.youtube.com/","/streaming-logos/youtube.svg"],
            ["Paramount+","STREAMING","https://www.paramountplus.com/","/streaming-logos/paramountplus.svg"],
            ["Max","STREAMING","https://www.max.com/","/streaming-logos/max.svg"],
            ["Disney+","STREAMING","https://www.disneyplus.com/","/streaming-logos/disneyplus.svg"],
            ["Hulu","STREAMING","https://www.hulu.com/","/streaming-logos/hulu.svg"],
            ["ESPN","SPORTS","https://www.espn.com/watch/","/streaming-logos/espn.svg"],
            ["Discovery+","STREAMING","https://www.discoveryplus.com/","/streaming-logos/discoveryplus.svg"],
            ["Peacock","STREAMING","https://www.peacocktv.com/","/streaming-logos/peacock.svg"],
            ["Prime Video","STREAMING","https://www.primevideo.com/","/streaming-logos/primevideo.svg"],
            ["Netflix","STREAMING","https://www.netflix.com/","/streaming-logos/netflix.svg"],
            ["Apple TV","LIBRARY + TV","https://tv.apple.com/","/streaming-logos/appletv.svg"],
          ].map(([name,kind,href,logo]) => (
            <a className={styles.serviceCard} href={href} target="_blank" rel="noreferrer" key={name}>
              <span className={styles.serviceMark}><img src={logo} alt="" aria-hidden="true" /></span>
              <span className={styles.serviceText}><strong>{name}</strong><small>{kind}</small></span>
              <span className={styles.serviceArrow}>↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.libraryShelf}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>FROM YOUR LIBRARY</p>
            <h2>Already yours.</h2>
            <p className={styles.sectionCopy}>Movies and shows you own - separate from whatever happens to be streaming this month.</p>
          </div>
          <span className={styles.pickCount}>5 OWNED</span>
        </div>

        <div className={styles.libraryGrid}>
          {[
            ["The Dark Knight","APPLE TV",styles.libraryOne],
            ["Gladiator","PRIME VIDEO",styles.libraryTwo],
            ["The Godfather","APPLE TV",styles.libraryThree],
            ["Heat","PRIME VIDEO",styles.libraryFour],
            ["Top Gun: Maverick","APPLE TV",styles.libraryFive],
          ].map(([title,service,art]) => (
            <article className={`${styles.libraryCard} ${art}`} key={title}>
              <div className={styles.libraryShade} />
              <div className={styles.libraryTop}><span>{service}</span><span className={styles.ownedBadge}>OWNED</span></div>
              <div className={styles.libraryBottom}><small>MOVIE</small><h3>{title}</h3><span>Purchased</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
