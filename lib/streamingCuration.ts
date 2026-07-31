// Sprint 17.10a - Worth Watching curation helpers
// Apply these helpers to TMDB result arrays before selecting the final 3 cards.

export type CuratableTitle = {
  id?: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  origin_country?: string[];
};

const DAY = 86400000;

function dateOf(item: CuratableTitle): number {
  const raw = item.release_date || item.first_air_date;
  if (!raw) return 0;
  const n = Date.parse(raw + "T12:00:00Z");
  return Number.isFinite(n) ? n : 0;
}

function ageDays(item: CuratableTitle, now = Date.now()): number {
  const d = dateOf(item);
  return d ? Math.max(0, (now - d) / DAY) : 9999;
}

function quality(item: CuratableTitle): number {
  const rating = item.vote_average || 0;
  const votes = item.vote_count || 0;
  // Damp tiny-sample ratings.
  return rating * Math.min(1, Math.log10(votes + 1) / 3);
}

function freshness(item: CuratableTitle): number {
  const age = ageDays(item);
  if (age <= 45) return 3.0;
  if (age <= 120) return 2.2;
  if (age <= 365) return 1.2;
  if (age <= 730) return 0.4;
  return -1.25;
}

function visual(item: CuratableTitle): number {
  return item.backdrop_path ? 0.8 : item.poster_path ? 0.25 : -2;
}

export function curationScore(item: CuratableTitle): number {
  return (
    quality(item) +
    freshness(item) +
    visual(item) +
    Math.min(2, (item.popularity || 0) / 100)
  );
}

export function curateThree(
  items: CuratableTitle[],
  opts: { documentary?: boolean; networkTV?: boolean } = {}
): CuratableTitle[] {
  const seen = new Set<string>();

  return items
    .filter((x) => {
      const label = (x.title || x.name || "").trim().toLowerCase();
      if (!label || seen.has(label)) return false;
      seen.add(label);

      if (!x.backdrop_path && !x.poster_path) return false;
      if ((x.vote_count || 0) < 75) return false;
      if ((x.vote_average || 0) < 6.5) return false;

      // Documentary genre = 99. Keep doc shelf genuinely documentary.
      if (opts.documentary && !(x.genre_ids || []).includes(99)) return false;

      return true;
    })
    .sort((a, b) => curationScore(b) - curationScore(a))
    .slice(0, 3);
}
