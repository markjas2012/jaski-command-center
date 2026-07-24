"use client";

import Link from "next/link";

export default function JamHero() {
  return (
    <section className="jam-hero" aria-labelledby="jam-hero-title">
      <div className="jam-hero-glow jam-hero-glow-one" aria-hidden="true" />
      <div className="jam-hero-glow jam-hero-glow-two" aria-hidden="true" />

      <div className="jam-hero-topline">
        <Link className="jam-back-link" href="/">
          ← Home
        </Link>
        <span className="jam-room-badge">THE JAM ROOM</span>
      </div>

      <div className="jam-hero-content">
        <div className="jam-hero-copy">
          <p className="jam-eyebrow">Today in Grateful Dead History</p>
          <h1 id="jam-hero-title">July 24, 1987</h1>
          <p className="jam-venue">Oakland-Alameda County Coliseum Stadium</p>
          <p className="jam-location">Oakland, California</p>

          <div className="jam-setlist" aria-label="Featured songs">
            <span>Jack Straw → Mississippi Half-Step</span>
            <span>Scarlet Begonias</span>
            <span>Playing in the Band</span>
          </div>

          <p className="jam-hero-note">
            A Dylan &amp; the Dead night later released as View from the Vault, Volume Four.
          </p>

          <div className="jam-hero-actions">
            <a href="https://archive.org/search?query=gd1987-07-24" target="_blank" rel="noreferrer">
              ▶ Listen on Archive
            </a>
            <a href="https://jerrybase.com/events/19870724-01" target="_blank" rel="noreferrer">
              View Setlist ↗
            </a>
          </div>
        </div>

        <div className="jam-poster" aria-hidden="true">
          <span className="jam-poster-rose">🌹</span>
          <span className="jam-poster-title">GRATEFUL DEAD</span>
          <span className="jam-poster-date">07 · 24 · 87</span>
          <span className="jam-poster-city">OAKLAND</span>
        </div>
      </div>

      <div className="jam-hero-footer">
        <span>SPRINT 10 · COMPONENT 02</span>
        <span>Now spinning: New & Noteworthy.</span>
      </div>
    </section>
  );
}
