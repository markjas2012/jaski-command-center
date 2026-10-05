import { NextResponse } from "next/server";
import { BILLY_ARCHIVE, BILLY_TOUR, parseBillyLatest, parseBillyTour } from "@/lib/billy-shows";
export const dynamic = "force-dynamic";
async function page(url: string) {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(9000), headers: { "User-Agent": "Mozilla/5.0 JaskiCommandCenter", Accept: "text/html" } });
  if (!response.ok) throw new Error(`Source returned ${response.status}`);
  return response.text();
}
export async function GET() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const [archive, tour] = await Promise.allSettled([page(BILLY_ARCHIVE), page(BILLY_TOUR)]);
  return NextResponse.json({ latest: archive.status === "fulfilled" ? parseBillyLatest(archive.value, today) : null, next: tour.status === "fulfilled" ? parseBillyTour(tour.value, today) : null }, { headers: { "Cache-Control": "no-store" } });
}
