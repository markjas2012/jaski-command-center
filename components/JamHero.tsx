"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type JamShow = {
  year: number;
  venue: string;
  location: string;
  songs: string[];
  note: string;
};

const history: Record<string, JamShow[]> = {
  "07-24": [{
    year: 1987,
    venue: "Oakland-Alameda County Coliseum Stadium",
    location: "Oakland, California",
    songs: ["Jack Straw", "Mississippi Half-Step", "Scarlet Begonias"],
    note: "A Dylan & the Dead night later released as View from the Vault, Volume Four.",
  }],
  "07-27": [{
    year: 1973,
    venue: "Grand Prix Racecourse",
    location: "Watkins Glen, New York",
    songs: ["The Promised Land", "Bird Song", "Playing in the Band"],
    note: "The Dead's soundcheck at Watkins Glen became a celebrated performance in its own right.",
  }],
  "07-28": [{
    year: 1973,
    venue: "Grand Prix Racecourse",
    location: "Watkins Glen, New York",
    songs: ["Bertha", "Eyes of the World", "Sugar Magnolia"],
    note: "Summer Jam at Watkins Glen brought the Dead together with the Allman Brothers Band and The Band.",
  }],
};

function dateKey(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function displayDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function JamHero() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const show = useMemo(() => (history[dateKey(today)] ?? [])[0], [today]);

  return (
    <section className="jam-hero" aria-labelledby="jam-hero-title">
      <div className="jam-hero-glow jam-hero-glow-one" aria-hidden="true" />
      <div className="jam-hero-glow jam-hero-glow-two" aria-hidden="true" />

      <div className="jam-hero-topline">
        <Link className="jam-back-link" href="/">← Home</Link>
        <span className="jam-room-badge">THE JAM ROOM</span>
      </div>

      <div className="jam-hero-content">
        <div className="jam-hero-copy">
          <p className="jam-eyebrow">Today in Grateful Dead History</p>
          {show ? (
            <>
              <h1 id="jam-hero-title" className="jam-hero-title">{displayDate(today)}, {show.year}</h1>
              <p className="jam-venue">{show.venue}</p>
              <p className="jam-location">{show.location}</p>
              <div className="jam-setlist" aria-label="Featured songs">
                {show.songs.map((song) => <span key={song}>{song}</span>)}
              </div>
              <p className="jam-hero-note">{show.note}</p>
            </>
          ) : (
            <>
              <h1 id="jam-hero-title" className="jam-hero-title">{displayDate(today)}</h1>
              <p className="jam-venue">History entry coming soon.</p>
              <p className="jam-location">The room is now date-aware and refreshes automatically.</p>
              <p className="jam-hero-note">This date is not yet in the local verified show archive.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
