import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Highlight = { label: string; href?: string };

type Candidate = {
  artist: string;
  date?: string;
  venue?: string;
  location?: string;
  title?: string;
  source?: string;
  href: string;
  weight: number;
  why?: string;
  highlights?: Highlight[];
  artwork?: string;
  visualKey?: "dead" | "phish" | "panic" | "discovery";
};

const candidates: Candidate[] = [
  {
    artist: "Grateful Dead", date: "May 8, 1977", venue: "Barton Hall", location: "Ithaca, NY",
    title: "Cornell ’77", source: "ARCHIVE.ORG",
    href: "https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf",
    artwork: "https://archive.org/services/img/gd77-05-08.sbd.hicks.4982.sbeok.shnf",
    visualKey: "dead", weight: 6,
    why: "One of the defining live Dead recordings: patient, spacious playing with the band completely locked in.",
    highlights: [{label:"Scarlet Begonias → Fire on the Mountain"},{label:"Morning Dew"},{label:"Not Fade Away"}],
  },
  {
    artist: "Grateful Dead", date: "August 27, 1972", venue: "Old Renaissance Faire Grounds", location: "Veneta, OR",
    title: "Sunshine Daydream", source: "ARCHIVE.ORG",
    href: "https://archive.org/details/gd1972-08-27.sbd.miller.110412.flac16",
    artwork: "https://archive.org/services/img/gd1972-08-27.sbd.miller.110412.flac16",
    visualKey: "dead", weight: 6,
    why: "A hot, loose outdoor show with some of the band's most exploratory 1972 playing.",
    highlights: [{label:"Dark Star"},{label:"Playing in the Band"},{label:"Bird Song"}],
  },
  {
    artist: "Grateful Dead", date: "February 18, 1971", venue: "Capitol Theatre", location: "Port Chester, NY",
    title: "Beautiful Jam", source: "ARCHIVE.ORG",
    href: "https://archive.org/details/gd1971-02-18.sbd.miller.111793.flac16",
    artwork: "https://archive.org/services/img/gd1971-02-18.sbd.miller.111793.flac16",
    visualKey: "dead", weight: 6,
    why: "The famous Beautiful Jam emerges naturally out of Dark Star — lyrical, patient and unlike anything else in the catalog.",
    highlights: [{label:"Dark Star"},{label:"Beautiful Jam"},{label:"Wharf Rat"}],
  },
  {
    artist: "Phish", date: "December 31, 1995", venue: "Madison Square Garden", location: "New York, NY",
    title: "New Year’s Eve 1995", source: "PHISH.IN",
    href: "https://phish.in/1995-12-31", visualKey: "phish", weight: 5,
    why: "Peak mid-’90s Phish: precision, weirdness and huge improvisation on the band's biggest stage.",
    highlights: [
      {label:"Reba",href:"https://phish.in/1995-12-31/reba"},
      {label:"Mike's Song",href:"https://phish.in/1995-12-31/mikes-song"},
      {label:"You Enjoy Myself",href:"https://phish.in/1995-12-31/you-enjoy-myself"}
    ],
  },
  {
    artist: "Phish", date: "November 17, 1997", venue: "McNichols Sports Arena", location: "Denver, CO",
    title: "Denver ’97", source: "PHISH.IN",
    href: "https://phish.in/1997-11-17", visualKey: "phish", weight: 5,
    why: "The fall ’97 funk sound at full strength — deep grooves, patient transitions and monster second-set energy.",
    highlights: [
      {label:"Ghost",href:"https://phish.in/1997-11-17/ghost"},
      {label:"Tweezer",href:"https://phish.in/1997-11-17/tweezer"},
      {label:"Johnny B. Goode",href:"https://phish.in/1997-11-17/johnny-b-goode"}
    ],
  },
  {
    artist: "Widespread Panic", date: "April 3, 1996", venue: "Von Braun Civic Center", location: "Huntsville, AL",
    title: "Huntsville ’96", source: "PANICSTREAMS",
    href: "https://www.panicstream.com/vault/widespread-panic-04031996-huntsville-al/",
    visualKey: "panic", weight: 4,
    why: "Classic Panic in Alabama: heavy Southern groove, huge room energy and the band stretching songs without losing the pulse.",
    highlights: [{label:"Driving Song"},{label:"Chilly Water"},{label:"Can't Find My Way Home"}],
  },
  {
    artist:"Billy Strings",title:"Latest live recording",source:"NUGS",
    href:"https://www.nugs.net/billy-strings-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
    visualKey:"discovery",weight:2,why:"A rotating chance to hear what one of the Jam Room's best current live acts is doing right now.",
    highlights:[{label:"Latest show"},{label:"Extended jams"},{label:"Bluegrass fire"}]
  },
  {
    artist:"The String Cheese Incident",title:"Latest live recording",source:"NUGS",
    href:"https://www.nugs.net/the-string-cheese-incident-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
    visualKey:"discovery",weight:2,why:"Cheese can move from bluegrass to funk to electronic improv in a single set — perfect discovery territory.",
    highlights:[{label:"Latest show"},{label:"Big transitions"},{label:"Dance-floor jams"}]
  },
  {
    artist:"Goose",title:"Latest live recording",source:"BANDCAMP",
    href:"https://goosetheband.bandcamp.com/",visualKey:"discovery",weight:2,
    why:"A current snapshot of Goose's evolving live sound, with polished songs opening into patient improvisation.",
    highlights:[{label:"Latest show"},{label:"Extended improv"},{label:"Modern jam"}]
  },
  {
    artist:"Umphrey's McGee",title:"Latest live recording",source:"NUGS",
    href:"https://www.nugs.net/umphreys-mcgee-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
    visualKey:"discovery",weight:2,why:"For the days when the Jam Room needs precision, heaviness and left-turn improvisation.",
    highlights:[{label:"Latest show"},{label:"Jimmy Stewart"},{label:"Prog-meets-jam"}]
  },
];

function weightedPool() {
  return candidates.flatMap((candidate) => Array.from({ length: candidate.weight }, () => candidate));
}

function dayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function genericArtwork(url?: string) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("archive.org/services/img/") ||
    lower.includes("default") ||
    lower.includes("placeholder") ||
    lower.includes("logo") ||
    lower.includes("favicon")
  );
}

async function sourceArtwork(candidate: Candidate) {
  if (candidate.artwork && !genericArtwork(candidate.artwork)) return candidate.artwork;

  // Only trust artwork exposed by the actual listening source.
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(candidate.href, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 JaskiCommandCenter/13.23" },
    });
    clearTimeout(timer);
    if (!res.ok) return undefined;

    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const image = match?.[1];
    return genericArtwork(image) ? undefined : image;
  } catch {
    return undefined;
  }
}

export async function GET() {
  const pool = weightedPool();
  const pick = { ...pool[dayIndex() % pool.length] };
  pick.artwork = await sourceArtwork(pick);

  return NextResponse.json({
    updatedAt: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "short",
      day: "numeric",
    }).format(new Date()),
    pick,
  });
}
