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
};

type CuratedDate = {
  date: string;
  venue: string;
  fallbackHref: string;
  fallbackNote: string;
};

const curatedByMonthDay: Record<string, CuratedDate> = {
  "07-27": {
    date: "1994-07-27",
    venue: "Riverport Amphitheatre - Maryland Heights, Missouri",
    fallbackHref: "https://www.dead.net/show/july-27-1994",
    fallbackNote: "A hometown-area Grateful Dead show from this date. Open the official show archive.",
  },
};

function prettyDate(raw: string) {
  const d = new Date(`${raw.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return raw;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function venueLine(doc: ArchiveDoc, fallback: string) {
  const venue = String(doc.venue || "").trim();
  const place = String(doc.coverage || "").trim();
  if (venue && place && venue.toLowerCase() !== place.toLowerCase()) {
    return `${venue} - ${place}`;
  }
  return venue || place || fallback;
}

async function exactArchiveDate(date: string) {
  const params = new URLSearchParams();
  params.set("q", `collection:GratefulDead AND date:${date}`);
  for (const field of ["identifier", "title", "date", "venue", "coverage", "downloads"]) {
    params.append("fl[]", field);
  }
  params.set("rows", "50");
  params.set("output", "json");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1800);

  try {
    const res = await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "JaskiHomepage/12.4" },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const docs: ArchiveDoc[] = Array.isArray(json?.response?.docs) ? json.response.docs : [];

    const pick = docs
      .filter((doc) => doc.identifier)
      .sort((a, b) => Number(b.downloads || 0) - Number(a.downloads || 0))[0];

    return pick || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const now = new Date();
  const key = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const curated = curatedByMonthDay[key];

  if (curated) {
    const pick = await exactArchiveDate(curated.date);

    if (pick?.identifier) {
      return NextResponse.json({
        showDate: prettyDate(curated.date),
        venue: venueLine(pick, curated.venue),
        href: `https://archive.org/details/${pick.identifier}`,
        note: "A real recording from this date, selected from the live Archive.",
        live: true,
        diagnostic: "archive-specific",
      });
    }

    return NextResponse.json({
      showDate: prettyDate(curated.date),
      venue: curated.venue,
      href: curated.fallbackHref,
      note: curated.fallbackNote,
      live: true,
      diagnostic: "official-show-fallback",
    });
  }

  return NextResponse.json({
    showDate: "Today in Grateful Dead history",
    venue: "",
    href: "https://archive.org/details/GratefulDead",
    note: "Open the Archive and explore a show from today's date.",
    live: false,
    diagnostic: "uncurated-date",
  });
}
