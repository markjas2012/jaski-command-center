const releases = [
  {
    artist: "Goose",
    title: "Fresh from the Soundboard",
    detail: "Featured live release",
    mark: "G",
    tone: "goose",
    href: "https://www.nugs.net/goose-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
  },
  {
    artist: "Billy Strings",
    title: "Latest Live Pick",
    detail: "Bluegrass without guardrails",
    mark: "B",
    tone: "billy",
    href: "https://www.nugs.net/billy-strings-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
  },
  {
    artist: "Phish",
    title: "From the Current Rotation",
    detail: "A deep-dive listening stop",
    mark: "P",
    tone: "phish",
    href: "https://www.livephish.com/",
  },
  {
    artist: "Umphrey’s McGee",
    title: "Newest Soundboard",
    detail: "Progressive improvisation",
    mark: "UM",
    tone: "umphreys",
    href: "https://www.nugs.net/umphreys-mcgee-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
  },
  {
    artist: "Daniel Donato",
    title: "Cosmic Country Pick",
    detail: "A road-tested live set",
    mark: "DD",
    tone: "donato",
    href: "https://www.nugs.net/daniel-donato-concerts-live-downloads-in-mp3-flac-or-online-music-streaming/",
  },
];

export default function NewReleases() {
  return (
    <section className="jam-section releases-section" aria-labelledby="new-releases-title">
      <div className="jam-section-heading">
        <div>
          <p className="jam-section-kicker">ON THE TURNTABLE</p>
          <h2 id="new-releases-title">New &amp; Noteworthy</h2>
          <p>Five doors into the newest live music worth exploring.</p>
        </div>
        <a className="jam-section-link" href="https://www.nugs.net/" target="_blank" rel="noreferrer">
          Browse Nugs ↗
        </a>
      </div>

      <div className="release-rail">
        {releases.map((release, index) => (
          <a
            className="release-card"
            href={release.href}
            key={release.artist}
            target="_blank"
            rel="noreferrer"
            style={{ "--release-index": index } as React.CSSProperties}
          >
            <div className={`release-art release-art-${release.tone}`}>
              <span className="release-art-mark">{release.mark}</span>
              <span className="release-art-ring" aria-hidden="true" />
              <span className="release-art-label">LIVE</span>
            </div>
            <div className="release-copy">
              <span className="release-artist">{release.artist}</span>
              <strong>{release.title}</strong>
              <span className="release-detail">{release.detail}</span>
              <span className="release-listen">Listen ↗</span>
            </div>
          </a>
        ))}
      </div>

      <p className="release-note">
        Sprint 10 starts with a curated rotation. Live release data can be connected after the room’s design is complete.
      </p>
    </section>
  );
}
