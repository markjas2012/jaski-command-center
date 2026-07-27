import Link from "next/link";
import CollegeFootballLive from "./CollegeFootballLive";
import StLouisLatestScores from "./StLouisLatestScores";

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

const college = [
  {
    name: "Ohio State",
    eyebrow: "BIG TEN FOOTBALL",
    mark: "O",
    title: "Go Bucks.",
    body: "Buckeye football schedule, game center, roster, news, and the road through the Big Ten.",
    href: "https://ohiostatebuckeyes.com/sports/football",
    schedule: "https://ohiostatebuckeyes.com/sports/football/schedule",
    background: "linear-gradient(135deg,#7b0d1b,#ba0c2f)",
  },
  {
    name: "Mizzou",
    eyebrow: "SEC · MISSOURI",
    mark: "M",
    title: "M-I-Z.",
    body: "Missouri athletics with football front and center, plus the rest of the Tigers.",
    href: "https://mutigers.com/",
    schedule: "https://mutigers.com/sports/football/schedule",
    background: "linear-gradient(135deg,#171717,#6f5a16)",
  },
  {
    name: "SEC Football",
    eyebrow: "SOUTHEASTERN CONFERENCE",
    mark: "SEC",
    title: "Saturday lives here.",
    body: "Conference schedule, marquee games, SEC headlines, and the weekly college football picture.",
    href: "https://www.secsports.com/schedule/football",
    schedule: "https://www.secsports.com/schedule/football",
    background: "linear-gradient(135deg,#17365f,#305e8c)",
  },
];

export default function StLouisSports() {
  const sectionStyle = {
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: "28px",
    background: "#111318",
    color: "#f7f2ea",
    padding: "34px 34px 38px",
  } as const;

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: "14px",
  } as const;

  return (
    <div className="sports-page">
      <section className="sports-hero" aria-labelledby="sports-title">
        <div className="sports-glow sports-glow-one" aria-hidden="true" />
        <div className="sports-glow sports-glow-two" aria-hidden="true" />

        <div className="sports-topline">
          <Link className="sports-back" href="/">← Home</Link>
          <span className="sports-badge">SPORTS</span>
        </div>

        <div className="sports-hero-copy">
          <p className="sports-eyebrow">LATEST RESULTS</p>
          <h1 id="sports-title">Last<br />Score.</h1>
          <p className="sports-intro">
            The latest final for the Cardinals, Blues, and CITY — right at the top of Sports.
          </p>
        </div>

        <StLouisLatestScores />

        <div className="sports-hero-footer">
          <span>SPRINT 10 · SPORTS</span>
          <span>St. Louis + College Football.</span>
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

      <section style={sectionStyle} aria-labelledby="college-title">
        <div style={{ marginBottom: 25 }}>
          <p style={{ margin: "0 0 16px", color: "#d6a85d", fontSize: 10, fontWeight: 900, letterSpacing: ".18em" }}>
            COLLEGE FOOTBALL
          </p>
          <h2 id="college-title" style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 500 }}>
            Saturday Football
          </h2>
          <p style={{ margin: "8px 0 0", color: "rgba(247,242,234,.55)", fontSize: 12 }}>
            Ohio State. Mizzou. The SEC. The college football you actually care about.
          </p>
        </div>

        <div style={gridStyle} className="college-hotfix-grid">
          {college.map((team) => (
            <article
              key={team.name}
              style={{
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.11)",
                borderRadius: 20,
                background: "#191b21",
              }}
            >
              <a href={team.href} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                <div
                  style={{
                    minHeight: 172,
                    display: "grid",
                    placeItems: "center",
                    position: "relative",
                    background: team.background,
                  }}
                >
                  <span style={{ position: "absolute", left: 16, top: 14, fontSize: 8, fontWeight: 900, letterSpacing: ".18em", color: "rgba(255,255,255,.75)" }}>
                    {team.eyebrow}
                  </span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: team.mark === "SEC" ? 42 : 54, fontWeight: 700 }}>
                    {team.mark}
                  </span>
                </div>

                <div style={{ padding: "20px 20px 14px" }}>
                  <span style={{ color: "#d6a85d", fontSize: 9, fontWeight: 900, letterSpacing: ".14em" }}>
                    {team.name.toUpperCase()}
                  </span>
                  <strong style={{ display: "block", marginTop: 8, fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 500 }}>
                    {team.title}
                  </strong>
                  <p style={{ minHeight: 50, margin: "10px 0 0", color: "rgba(247,242,234,.55)", fontSize: 11, lineHeight: 1.5 }}>
                    {team.body}
                  </p>
                </div>
              </a>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 20px 20px" }}>
                <a href={team.href} target="_blank" rel="noreferrer" style={{ padding: "10px 11px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, color: "#f7f2ea", fontSize: 9, fontWeight: 800, textAlign: "center", textDecoration: "none" }}>
                  Team Home ↗
                </a>
                <a href={team.schedule} target="_blank" rel="noreferrer" style={{ padding: "10px 11px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, color: "#f7f2ea", fontSize: 9, fontWeight: 800, textAlign: "center", textDecoration: "none" }}>
                  Schedule ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CollegeFootballLive />

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
