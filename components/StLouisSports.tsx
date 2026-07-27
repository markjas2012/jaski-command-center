import Link from "next/link";

const teams = [
  {
    name: "Cardinals",
    league: "MLB",
    mark: "STL",
    line: "Baseball lives here.",
    detail: "Scores, schedule, roster, standings, and the road to October.",
    href: "https://www.mlb.com/cardinals",
    tone: "cardinals",
  },
  {
    name: "Blues",
    league: "NHL",
    mark: "♪",
    line: "The Note.",
    detail: "Game center, schedule, standings, roster, and Blues news.",
    href: "https://www.nhl.com/blues/",
    tone: "blues",
  },
  {
    name: "CITY SC",
    league: "MLS",
    mark: "CITY",
    line: "St. Louis is a soccer city.",
    detail: "Matches, table, club news, and everything CITYPARK.",
    href: "https://www.stlcitysc.com/",
    tone: "city",
  },
];

const quickLinks = [
  { label: "ESPN STL", href: "https://www.espn.com/" },
  { label: "101 ESPN", href: "https://www.101espn.com/" },
  { label: "St. Louis Post-Dispatch", href: "https://www.stltoday.com/sports/" },
  { label: "The Athletic", href: "https://www.nytimes.com/athletic/" },
];

export default function StLouisSports() {
  return (
    <div className="sports-page">
      <section className="sports-hero" aria-labelledby="sports-title">
        <div className="sports-glow sports-glow-one" aria-hidden="true" />
        <div className="sports-glow sports-glow-two" aria-hidden="true" />

        <div className="sports-topline">
          <Link className="sports-back" href="/">← Home</Link>
          <span className="sports-badge">ST. LOUIS SPORTS</span>
        </div>

        <div className="sports-hero-copy">
          <p className="sports-eyebrow">THE HOME TEAM</p>
          <h1 id="sports-title">St. Louis<br />Sports.</h1>
          <p className="sports-intro">
            Cardinals red. Blues blue. CITY red. One room for the teams that make St. Louis feel like St. Louis.
          </p>
          <div className="sports-hero-actions">
            <a href="https://www.mlb.com/cardinals" target="_blank" rel="noreferrer">Cardinals ↗</a>
            <a href="https://www.nhl.com/blues/" target="_blank" rel="noreferrer">Blues ↗</a>
            <a href="https://www.stlcitysc.com/" target="_blank" rel="noreferrer">CITY SC ↗</a>
          </div>
        </div>

        <div className="sports-skyline" aria-hidden="true">
          <span className="sports-arch">⌒</span>
          <span className="sports-city-label">STL</span>
          <span className="sports-city-sub">HOME FIELD</span>
        </div>

        <div className="sports-hero-footer">
          <span>SPRINT 10 · COMPONENT 03</span>
          <span>Three teams. One city.</span>
        </div>
      </section>

      <section className="sports-team-section" aria-labelledby="teams-title">
        <div className="sports-section-heading">
          <div>
            <p className="sports-section-kicker">YOUR TEAMS</p>
            <h2 id="teams-title">The St. Louis Three</h2>
            <p>Fast doors to the official home of each club.</p>
          </div>
        </div>

        <div className="sports-team-grid">
          {teams.map((team) => (
            <a
              className={`sports-team-card sports-team-${team.tone}`}
              href={team.href}
              key={team.name}
              target="_blank"
              rel="noreferrer"
            >
              <div className="sports-team-art">
                <span className="sports-team-league">{team.league}</span>
                <span className="sports-team-mark">{team.mark}</span>
              </div>
              <div className="sports-team-copy">
                <span className="sports-team-name">{team.name}</span>
                <strong>{team.line}</strong>
                <p>{team.detail}</p>
                <span className="sports-team-link">Open team home ↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="sports-pulse" aria-labelledby="pulse-title">
        <div>
          <p className="sports-section-kicker">AROUND TOWN</p>
          <h2 id="pulse-title">St. Louis Sports Pulse</h2>
          <p>Local voices and broader coverage, one click away.</p>
        </div>
        <div className="sports-pulse-links">
          {quickLinks.map((link) => (
            <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
              {link.label}<span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
