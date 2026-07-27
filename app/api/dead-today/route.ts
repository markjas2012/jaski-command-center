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

type CuratedShow = {
  showDate: string;
  venue: string;
  href: string;
  note: string;
};

const curatedByMonthDay: Record<string, CuratedShow> = {
  "07-27": {
    showDate: "July 27, 1994",
    venue: "Riverport Amphitheatre - Maryland Heights, Missouri",
    href: "https://archive.org/search?query=collection%3AGratefulDead%20AND%20date%3A1994-07-27",
    note: "A hometown-area Grateful Dead show from this date. Open the Archive results and pick a recording.",
  },
};

function prettyDate(raw?: string) {
  if (!raw) return "";
  const datePart = raw.slice(0, 10);
  const d = new Date(`${datePart}T12:00:00`);
  if (Number.isNaN(d.getTime())) return datePart;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function venueLine(doc: ArchiveDoc) {
  const venue = String(doc.venue || "").trim();
  const place = String(doc.coverage || "").trim();

  if (venue && place && venue.toLowerCase() !== place.toLowerCase()) {
    return `${venue} - ${place}`;
  }

  return venue || place || "";
}

async function searchArchive(query: string) {
  const params = new URLSearchParams();
  params.set("q", query);
  params.append("fl[]", "identifier");
  params.append("fl[]", "title");
  params.append("fl[]", "date");
  params.append("fl[]", "venue");
  params.append("fl[]", "coverage");
  params.append("fl[]", "downloads");
  params.set("rows", "50");
  params.set("page", "1");
  params.set("output", "json");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(
      `https://archive.org/advancedsearch.php?${params.toString()}`,
      {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "JaskiHomepage/12.3.5",
        },
      }
    );

    if (!res.ok) throw new Error(`Archive HTTP ${res.status}`);

    const json = await res.json();
    return Array.isArray(json?.response?.docs)
      ? (json.response.docs as ArchiveDoc[])
      : [];
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const key = `${mm}-${dd}`;

  // Guarantee an immediate useful result for dates we have curated.
  const curated = curatedByMonthDay[key];
  if (curated) {
    return NextResponse.json(
      {
        ...curated,
        live: true,
        diagnostic: "curated-date",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "X-Jaski-Sprint": "12.3.5",
        },
      }
    );
  }

  // For other dates, try one fast Archive query only.
  try {
    const docs = await searchArchive(
      `collection:GratefulDead AND date:????-${mm}-${dd}`
    );

    const usable = docs
      .filter((doc) => doc.identifier)
      .sort(
        (a, b) => Number(b.downloads || 0) - Number(a.downloads || 0)
      );

    const pick = usable[0];

    if (pick?.identifier) {
      return NextResponse.json(
        {
          showDate: prettyDate(pick.date) || "Grateful Dead - Today in history",
          venue: venueLine(pick),
          href: `https://archive.org/details/${pick.identifier}`,
          note: "A real Grateful Dead performance from this date, selected from the live archive.",
          live: true,
          diagnostic: `archive-live:${usable.length}`,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "X-Jaski-Sprint": "12.3.5",
          },
        }
      );
    }

    return NextResponse.json(
      {
        showDate: "Today in Grateful Dead history",
        venue: "",
        href: `https://archive.org/search?query=collection%3AGratefulDead%20AND%20date%3A%3F%3F%3F%3F-${mm}-${dd}`,
        note: "No automatic recording surfaced. Open today's Archive search.",
        live: false,
        diagnostic: "archive-empty",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "X-Jaski-Sprint": "12.3.5",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        showDate: "Today in Grateful Dead history",
        venue: "",
        href: `https://archive.org/search?query=collection%3AGratefulDead%20AND%20date%3A%3F%3F%3F%3F-${mm}-${dd}`,
        note: "The live lookup timed out. Open today's Archive search instead.",
        live: false,
        diagnostic: `archive-timeout:${String(error)}`,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "X-Jaski-Sprint": "12.3.5",
        },
      }
    );
  }
}
