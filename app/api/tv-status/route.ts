import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AnyObject = Record<string, any>;

function episode(value: AnyObject | undefined | null) {
  if (!value) return null;
  return {
    id: value.id,
    name: value.name || "",
    season: value.season ?? null,
    number: value.number ?? null,
    airdate: value.airdate || null,
    airtime: value.airtime || null,
    airstamp: value.airstamp || null,
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ found: false, error: "Missing show title." }, { status: 400 });
  }

  try {
    const url =
      `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(q)}` +
      `&embed[]=nextepisode&embed[]=previousepisode`;

    const res = await fetch(url, {
      headers: { "User-Agent": "JaskiHomepage/1.0" },
      next: { revalidate: 3600 },
    });

    if (res.status === 404) {
      return NextResponse.json({ found: false, query: q });
    }
    if (!res.ok) throw new Error(`TVmaze returned ${res.status}`);

    const show = await res.json();
    const embedded = show?._embedded || {};

    return NextResponse.json({
      found: true,
      query: q,
      title: show?.name || q,
      status: show?.status || "",
      network: show?.network?.name || "",
      service: show?.webChannel?.name || "",
      premiered: show?.premiered || null,
      ended: show?.ended || null,
      next: episode(embedded.nextepisode),
      previous: episode(embedded.previousepisode),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("TV status lookup failed:", error);
    return NextResponse.json(
      { found: false, query: q, error: "Live TV schedule unavailable." },
      { status: 503 }
    );
  }
}
