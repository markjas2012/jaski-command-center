"use client";

import { useMemo } from "react";

type Pick = {
  title: string;
  body: string;
  href: string;
};

const picks: Pick[] = [
  {
    title: "Grateful Dead - May 8, 1977",
    body: "Barton Hall - Cornell University - Ithaca, New York. A legendary spring '77 show and an easy choice when you just want to put something great on.",
    href: "https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf",
  },
  {
    title: "Grateful Dead - August 27, 1972",
    body: "Old Renaissance Faire Grounds - Veneta, Oregon. Sun-baked, loose, and expansive - one of the classic outdoor Dead shows.",
    href: "https://archive.org/details/gd72-08-27.sbd.braverman.16582.sbeok.shnf",
  },
  {
    title: "Grateful Dead - March 29, 1990",
    body: "Nassau Coliseum - Uniondale, New York. Branford Marsalis joins in and the band opens up - a fantastic late-era recommendation.",
    href: "https://archive.org/details/gd90-03-29.sbd.nawrocki.3384.sbeok.shnf",
  },
  {
    title: "Grateful Dead - September 21, 1972",
    body: "The Spectrum - Philadelphia, Pennsylvania. Deep 1972 playing with plenty of room to wander.",
    href: "https://archive.org/details/gd72-09-21.sbd.masse.7296.sbeok.shnf",
  },
  {
    title: "Grateful Dead - October 9, 1989",
    body: "Hampton Coliseum - Hampton, Virginia. The Warlocks return to Hampton with huge energy and famous song revivals.",
    href: "https://archive.org/details/gd89-10-09.sbd.serafin.7721.sbeok.shnf",
  },
  {
    title: "Grateful Dead - June 10, 1973",
    body: "RFK Stadium - Washington, D.C. A huge summer '73 show with long-form improvisation and a relaxed outdoor feel.",
    href: "https://archive.org/details/gd73-06-10.sbd.hollister.174.sbeok.shnf",
  },
  {
    title: "Grateful Dead - July 17, 1989",
    body: "Alpine Valley Music Theatre - East Troy, Wisconsin. Peak summer '89 Dead: powerful, polished, and easy to recommend.",
    href: "https://archive.org/details/gd89-07-17.sbd.clugston.6870.sbeok.shnf",
  },
];

function dayNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export default function ListenNextCard() {
  const pick = useMemo(() => {
    // 3-step jump through a 7-item list means adjacent days never repeat
    // and the full set cycles before returning.
    const index = (dayNumber() * 3) % picks.length;
    return picks[index];
  }, []);

  return (
    <a href={pick.href} target="_blank" rel="noreferrer" style={{ display: "contents" }}>
      <span>LISTEN NEXT</span>
      <h3>{pick.title}</h3>
      <p>{pick.body}</p>
      <strong>Listen on Archive ↗</strong>
    </a>
  );
}
