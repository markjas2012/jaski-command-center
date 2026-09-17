import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type ArchiveDoc = {
  identifier?: string;
  title?: string;
  date?: string;
  venue?: string;
  coverage?: string;
  downloads?: number;
  description?: string;
  source?: string;
};

type Track = {
  title: string;
  track?: string;
};

function centralMonthDay() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  return {
    mm: parts.find((p) => p.type === "month")?.value || "01",
    dd: parts.find((p) => p.type === "day")?.value || "01",
  };
}

function prettyDate(raw?: string) {
  if (!raw) return "Today in Grateful Dead History";
  const datePart = raw.slice(0, 10);
  const d = new Date(`${datePart}T12:00:00`);
  if (Number.isNaN(d.getTime())) return datePart;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function venueAndLocation(doc: ArchiveDoc) {
  const venue = String(doc.venue || "").trim();
  const location = String(doc.coverage || "").trim();
  return { venue, location };
}

function cleanText(value: unknown) {
  const raw = Array.isArray(value) ? value.join(" ") : String(value || "");
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function likelySongTitle(value: string) {
  return value
    .replace(/^\d+\s*[-.)]\s*/, "")
    .replace(/^(?:d|disc|track)\s*\d+\s*[-._ ]*/i, "")
    .replace(/\.(?:flac|mp3|ogg|shn)$/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function setlistFromMetadata(meta: any): Track[] {
  const files = Array.isArray(meta?.files) ? meta.files : [];
  const seen = new Set<string>();
  const tracks: Track[] = [];

  for (const file of files) {
    const format = String(file?.format || "").toLowerCase();
    const name = String(file?.name || "");
    const isAudio =
      format.includes("flac") ||
      format.includes("vbr mp3") ||
      format === "mp3" ||
      /\.(flac|mp3|ogg|shn)$/i.test(name);

    if (!isAudio) continue;

    let title = cleanText(file?.title);
    if (!title) title = likelySongTitle(name);

    title = likelySongTitle(title);

    if (
      !title ||
      title.length < 2 ||
      /^(crowd|tuning|intro|banter|encore break|dead air)$/i.test(title)
    ) {
      continue;
    }

    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    tracks.push({
      title,
      track: cleanText(file?.track),
    });
  }

  return tracks.slice(0, 40);
}

function highlightsFromSetlist(setlist: Track[]) {
  return setlist.slice(0, 4).map((item) => item.title);
}

async function runArchiveSearch(query: string) {
  const params = new URLSearchParams();
  params.set("q", query);
  for (const field of [
    "identifier",
    "title",
    "date",
    "venue",
    "coverage",
    "downloads",
    "description",
    "source",
  ]) {
    params.append("fl[]", field);
  }
  params.set("rows", "500");
  params.set("page", "1");
  params.set("output", "json");

  const res = await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "JaskiCommandCenter/13.5",
    },
  });

  if (!res.ok) throw new Error(`Archive ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.response?.docs) ? (json.response.docs as ArchiveDoc[]) : [];
}

function exactShowDates(mm: string, dd: string) {
  const years: number[] = [];
  for (let year = 1965; year <= 1995; year += 1) years.push(year);
  return years.map((year) => `${year}-${mm}-${dd}`);
}

async function searchArchive(mm: string, dd: string) {
  // Spertilo-style approach: resolve a calendar date against the full GD era,
  // then choose the best recording for a resolved show date.
  //
  // Using explicit dates avoids relying on Archive wildcard behavior, which is
  // inconsistent across metadata fields.
  const dateTerms = exactShowDates(mm, dd).map((date) => `date:${date}`);
  const query = `collection:GratefulDead AND (${dateTerms.join(" OR ")})`;
  const exact = await runArchiveSearch(query);

  if (exact.length) return exact;

  // Defensive fallback: identifiers commonly encode the performance date.
  return runArchiveSearch(
    `collection:GratefulDead AND identifier:gd*-${mm}-${dd}*`
  );
}

async function metadata(identifier: string) {
  const res = await fetch(`https://archive.org/metadata/${identifier}`, {
    cache: "no-store",
    headers: { Accept: "application/json", "User-Agent": "JaskiCommandCenter/13.3" },
  });

  if (!res.ok) return null;
  return res.json();
}

function inferredDate(doc: ArchiveDoc) {
  const direct = String(doc.date || "").match(/\b(19|20)\d{2}-\d{2}-\d{2}\b/)?.[0];
  if (direct) return direct;

  const haystack = `${doc.identifier || ""} ${doc.title || ""}`;
  const full = haystack.match(/\b((?:19|20)\d{2})-(\d{2})-(\d{2})\b/);
  if (full) return `${full[1]}-${full[2]}-${full[3]}`;

  const short = haystack.match(/\bgd(\d{2})-(\d{2})-(\d{2})\b/i);
  if (short) {
    const year = Number(short[1]) >= 60 ? `19${short[1]}` : `20${short[1]}`;
    return `${year}-${short[2]}-${short[3]}`;
  }

  return "";
}

function tapeScore(doc: ArchiveDoc) {
  const text = [
    doc.title || "",
    doc.identifier || "",
    doc.description || "",
    doc.source || "",
  ].join(" ").toLowerCase();

  let score = 0;

  // Prefer the kinds of sources listeners generally choose on the Time Machine.
  if (/\bmatrix\b/.test(text)) score += 80;
  if (/\bsoundboard\b|\bsbd\b/.test(text)) score += 70;
  if (/\bpre[- ]?fm\b|\bfm\b/.test(text)) score += 55;
  if (/\baud\b|\baudience\b/.test(text)) score += 20;

  // Penalize obvious lossy/derived or incomplete variants when metadata says so.
  if (/\bpartial\b|\bincomplete\b|\bmissing\b/.test(text)) score -= 40;
  if (/\bmp3\b/.test(text)) score -= 5;

  // Listener activity is a useful tie-breaker, but not the primary criterion.
  score += Math.min(20, Math.log10(Math.max(1, Number(doc.downloads || 0))) * 4);

  if (doc.venue) score += 3;
  if (doc.coverage) score += 2;

  return score;
}

function pickFeatured(docs: ArchiveDoc[]) {
  const usable = docs
    .filter((doc) => doc.identifier)
    .map((doc) => ({ ...doc, resolvedDate: inferredDate(doc) }))
    .filter((doc) => doc.resolvedDate);

  // First choose the latest historical performance date for this month/day.
  const dates = [...new Set(usable.map((doc) => doc.resolvedDate))].sort().reverse();
  const resolvedDate = dates[0] || "";
  const sameShow = usable.filter((doc) => doc.resolvedDate === resolvedDate);

  // Then choose the best tape for that show date, rather than simply the most-downloaded item.
  sameShow.sort((a, b) => tapeScore(b) - tapeScore(a));

  return { usable, pick: sameShow[0] };
}


function monthSlug(mm: string) {
  const months = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december",
  ];
  return months[Math.max(0, Math.min(11, Number(mm) - 1))];
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&gt;/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&#x2F;/gi, "/");
}

function deadNetShowHref(resolvedDate: string) {
  const [year, mm, dd] = resolvedDate.split("-");
  if (!year || !mm || !dd) return "";
  return `https://www.dead.net/show/${monthSlug(mm)}-${Number(dd)}-${year}`;
}

function htmlToLines(html: string) {
  const normalized = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(?:br|hr)\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h1|h2|h3|h4|h5|h6|section|article|ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeHtml(normalized)
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractDeadNetSetlist(html: string) {
  const lines = htmlToLines(html);

  // Dead.net show pages render "setlist" followed by one song per line, then "show date".
  const starts = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^setlist$/i.test(line));

  for (const { index } of starts) {
    const songs: { title: string }[] = [];

    for (const raw of lines.slice(index + 1)) {
      if (/^show date$/i.test(raw)) break;
      if (/^(venue|dead comment|show archive)$/i.test(raw)) break;

      const title = raw
        .replace(/^[-•*]\s*/, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!title || title.length < 2 || title.length > 90) continue;
      if (/^(submitted by|log in|register|permalink|user picture|image|member for)$/i.test(title)) continue;

      const key = title.toLowerCase();
      if (songs.some((song) => song.title.toLowerCase() === key)) continue;

      songs.push({ title });
      if (songs.length >= 40) break;
    }

    // A real Dead setlist should contain many songs; ignore tiny false-positive sections.
    if (songs.length >= 5) return songs;
  }

  return [];
}

function extractDeadNetImage(html: string) {
  const candidates = [
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1],
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1],
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1],
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)?.[1],
  ].filter(Boolean) as string[];

  for (const url of candidates) {
    const lower = url.toLowerCase();
    if (/^https?:\/\//i.test(url) && !/(logo|favicon|icon|avatar|default)/i.test(lower)) {
      return url;
    }
  }

  return "";
}

async function deadNetShow(resolvedDate: string) {
  const href = deadNetShowHref(resolvedDate);
  if (!href) return { href: "", setlist: [], image: "", fetched: false };

  try {
    const res = await fetch(href, {
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) JaskiCommandCenter/13.8",
      },
    });

    if (!res.ok) {
      return { href, setlist: [], image: "", fetched: false };
    }

    const html = await res.text();
    return {
      href,
      setlist: extractDeadNetSetlist(html),
      image: extractDeadNetImage(html),
      fetched: true,
    };
  } catch {
    return { href, setlist: [], image: "", fetched: false };
  }
}


type SectionedSong = {
  title: string;
  section?: string;
};

const SET_BREAK_OVERRIDES: Record<string, { set2StartsAt: string; encoreStartsAt?: string }> = {
  // Red Rocks — July 28, 1982
  "1982-07-28": {
    set2StartsAt: "Man Smart/Woman Smarter",
    encoreStartsAt: "Baby Blue",
  },
};

function normalizeSongForMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/it's all over now[, ]*/g, "")
    .replace(/man smart[, ]*woman smarter/g, "man smart/woman smarter")
    .replace(/woman smarter/g, "man smart/woman smarter")
    .replace(/[^a-z0-9/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyKnownSetBreaks(resolvedDate: string, songs: { title: string }[]) {
  const rule = SET_BREAK_OVERRIDES[resolvedDate];
  if (!rule) return songs as SectionedSong[];

  const set2Needle = normalizeSongForMatch(rule.set2StartsAt);
  const encoreNeedle = normalizeSongForMatch(rule.encoreStartsAt || "");

  let section = "SET 1";

  return songs.map((song) => {
    const key = normalizeSongForMatch(song.title);

    if (set2Needle && key === set2Needle) section = "SET 2";
    if (encoreNeedle && key.includes(encoreNeedle)) section = "ENCORE";

    return { ...song, section };
  });
}

export async function GET() {
  const { mm, dd } = centralMonthDay();
  const searchHref =
    `https://archive.org/search?query=${encodeURIComponent(
      `collection:GratefulDead AND identifier:gd*-${mm}-${dd}*`
    )}`;

  try {
    const docs = await searchArchive(mm, dd);
    const { usable, pick } = pickFeatured(docs);

    if (!pick?.identifier) {
      return NextResponse.json({
        showDate: "Today in Grateful Dead History",
        venue: "",
        location: "",
        href: searchHref,
        searchHref,
        note: "No featured recording surfaced automatically. Browse every show attached to today’s date.",
        recordings: 0,
        highlights: [],
        setlist: [],
        recordingTitle: "",
        deadNetHref: "",
        showImage: "",
        setlistSource: "",
        archiveTrackCount: 0,
        deadNetFetched: false,
        audioSource: "",
        live: false,
      });
    }

    const meta = await metadata(pick.identifier).catch(() => null);
    const { venue, location } = venueAndLocation(pick);
    const showDate = prettyDate((pick as any).resolvedDate || pick.date);
    const year = String((pick as any).resolvedDate || pick.date || "").slice(0, 4);
    const archiveTracks = setlistFromMetadata(meta);
    const recordingTitle = cleanText(meta?.metadata?.title || pick.title || "");
    const resolvedDate = String((pick as any).resolvedDate || pick.date || "");
    const official = await deadNetShow(resolvedDate);

    // Locked source split:
    // Dead.net = what the user sees about the show.
    // Archive.org = the recording/listening layer.
    //
    // Dead.net often provides a clean song list without explicit set headings.
    // Preserve its song list and layer verified set-break metadata on top when known.
    const setlist = applyKnownSetBreaks(resolvedDate, official.setlist);

    return NextResponse.json({
      showDate,
      year,
      venue: venue || pick.title || "Grateful Dead",
      location,
      href: `https://archive.org/details/${pick.identifier}`,
      searchHref,
      deadNetHref: official.href || deadNetShowHref(resolvedDate),
      showImage: official.image,
      deadNetFetched: official.fetched,
      note: setlist.length
        ? `${setlist.length} songs · setlist from Dead.net.`
        : "Dead.net setlist is temporarily unavailable. The featured Archive recording is still ready to play.",
      recordings: usable.length,
      highlights: highlightsFromSetlist(setlist),
      setlist,
      setlistSource: setlist.length ? "Dead.net" : "",
      archiveTrackCount: archiveTracks.length,
      recordingTitle,
      audioSource: cleanText(meta?.metadata?.source || pick.source || ""),
      live: true,
    });
  } catch {
    return NextResponse.json({
      showDate: "Today in Grateful Dead History",
      venue: "",
      location: "",
      href: searchHref,
      searchHref,
      note: "The Archive lookup is temporarily unavailable. Browse every show attached to today’s date.",
      recordings: 0,
      highlights: [],
      setlist: [],
      recordingTitle: "",
      deadNetHref: "",
      showImage: "",
      setlistSource: "",
      archiveTrackCount: 0,
      deadNetFetched: false,
      audioSource: "",
      live: false,
    });
  }
}
