"use client";

import { useMemo } from "react";

type ShowPick = {
  artist: string;
  date: string;
  venue: string;
  city: string;
  note: string;
  href: string;
};

const picks: ShowPick[] = [
  {
    artist: "Grateful Dead",
    date: "May 8, 1977",
    venue: "Barton Hall · Cornell University",
    city: "Ithaca, New York",
    note: "A legendary spring '77 show and an easy choice when you just want to put something great on.",
    href: "https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf",
  },
  {
    artist: "Grateful Dead",
    date: "August 27, 1972",
    venue: "Old Renaissance Faire Grounds",
    city: "Veneta, Oregon",
    note: "Sun-baked, loose, and expansive. One of the classic outdoor Dead shows.",
    href: "https://archive.org/details/gd72-08-27.sbd.braverman.16582.sbeok.shnf",
  },
  {
    artist: "Grateful Dead",
    date: "March 29, 1990",
    venue: "Nassau Coliseum",
    city: "Uniondale, New York",
    note: "Branford Marsalis joins in and the band opens up. A fantastic late-era recommendation.",
    href: "https://archive.org/details/gd90-03-29.sbd.nawrocki.3384.sbeok.shnf",
  },
  {
    artist: "Grateful Dead",
    date: "September 21, 1972",
    venue: "The Spectrum",
    city: "Philadelphia, Pennsylvania",
    note: "Deep 1972 playing with plenty of room to wander. Great when you want a longer listen.",
    href: "https://archive.org/details/gd72-09-21.sbd.masse.7296.sbeok.shnf",
  },
  {
    artist: "Grateful Dead",
    date: "October 9, 1989",
    venue: "Hampton Coliseum",
    city: "Hampton, Virginia",
    note: "The Warlocks return to Hampton. Big energy, famous song revivals, and a great crowd.",
    href: "https://archive.org/details/gd89-10-09.sbd.serafin.7721.sbeok.shnf",
  },
  {
    artist: "Grateful Dead",
    date: "June 10, 1973",
    venue: "RFK Stadium",
    city: "Washington, D.C.",
    note: "A huge summer '73 show with long-form improvisation and a relaxed outdoor feel.",
    href: "https://archive.org/details/gd73-06-10.sbd.hollister.174.sbeok.shnf",
  },
  {
    artist: "Grateful Dead",
    date: "July 17, 1989",
    venue: "Alpine Valley Music Theatre",
    city: "East Troy, Wisconsin",
    note: "Peak summer '89 Dead: powerful, polished, and easy to recommend.",
    href: "https://archive.org/details/gd89-07-17.sbd.clugston.6870.sbeok.shnf",
  },
];

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export default function ListenNext() {
  const pick = useMemo(() => picks[dayOfYear() % picks.length], []);

  return (
    <>
      <span>LISTEN NEXT</span>
      <h3>{pick.artist} — {pick.date}</h3>
      <p>{pick.venue}</p>
      <p>{pick.city}</p>
      <p>{pick.note}</p>
      <strong>Listen on Archive ↗</strong>
    </>
  );
}

export function getListenNextHref() {
  return picks[dayOfYear() % picks.length].href;
}
