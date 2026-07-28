"use client";

import { useEffect, useState } from "react";
import styles from "./GolfRoom.module.css";

const links = [
  { label: "GOLF GALAXY", sub: "Golf Galaxy", href: "https://www.golfgalaxy.com/", logo: "https://www.google.com/s2/favicons?domain=golfgalaxy.com&sz=128" },
  { label: "LAB GOLF", sub: "LAB Golf", href: "https://labgolf.com/", logo: "https://inthegolfbag.com/wp-content/uploads/2024/03/lab-golf-logo.png" },
  { label: "SMITHWORKS", sub: "Smithworks", href: "https://smithworksgolf.com/", logo: "https://www.google.com/s2/favicons?domain=smithworksgolf.com&sz=128" },
  { label: "SCOTTY CAMERON", sub: "Scotty Cameron", href: "https://www.scottycameron.com/", logo: "https://www.google.com/s2/favicons?domain=scottycameron.com&sz=128" },
  { label: "TITLEIST", sub: "Titleist", href: "https://www.titleist.com/", logo: "https://www.google.com/s2/favicons?domain=titleist.com&sz=128" },
  { label: "PING", sub: "PING", href: "https://ping.com/", logo: "https://www.google.com/s2/favicons?domain=ping.com&sz=128" },
  { label: "TRUE LINKSWEAR", sub: "TRUE linkswear", href: "https://truelinkswear.com/", logo: "https://www.google.com/s2/favicons?domain=truelinkswear.com&sz=128" },
  { label: "PETER MILLAR", sub: "Peter Millar", href: "https://www.petermillar.com/", logo: "https://www.google.com/s2/favicons?domain=petermillar.com&sz=128" },
  { label: "FOOTJOY", sub: "FootJoy", href: "https://www.footjoy.com/", logo: "https://www.google.com/s2/favicons?domain=footjoy.com&sz=128" },
];

const events = [
  {
    tag: "MAJOR",
    name: "The Masters",
    detail: "Augusta National",
    dateLabel: "APR 9–12 · 2026",
    start: "2026-04-09T00:00:00",
    end: "2026-04-12T23:59:59",
    href: "https://www.masters.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Masters_Tournament.svg",
  },
  {
    tag: "MAJOR",
    name: "PGA Championship",
    detail: "Aronimink Golf Club",
    dateLabel: "MAY 14–17 · 2026",
    start: "2026-05-14T00:00:00",
    end: "2026-05-17T23:59:59",
    href: "https://www.pgachampionship.com/",
    logo: "https://www.google.com/s2/favicons?domain=pgachampionship.com&sz=128",
  },
  {
    tag: "MAJOR",
    name: "U.S. Open",
    detail: "Shinnecock Hills",
    dateLabel: "JUN 18–21 · 2026",
    start: "2026-06-18T00:00:00",
    end: "2026-06-21T23:59:59",
    href: "https://www.usopen.com/",
    logo: "https://www.google.com/s2/favicons?domain=usopen.com&sz=128",
  },
  {
    tag: "MAJOR",
    name: "The Open",
    detail: "Royal Birkdale",
    dateLabel: "JUL 16–19 · 2026",
    start: "2026-07-16T00:00:00",
    end: "2026-07-19T23:59:59",
    href: "https://www.theopen.com/",
    logo: "https://images.seeklogo.com/logo-png/46/1/the-open-championship-logo-png_seeklogo-462121.png",
  },
  {
    tag: "THE PLAYERS",
    name: "The Players",
    detail: "TPC Sawgrass",
    dateLabel: "MAR 12–15 · 2026",
    start: "2026-03-12T00:00:00",
    end: "2026-03-15T23:59:59",
    href: "https://www.theplayers.com/",
    logo: "https://www.google.com/s2/favicons?domain=theplayers.com&sz=128",
  },
  {
    tag: "PGA TOUR",
    name: "WM Phoenix Open",
    detail: "TPC Scottsdale",
    dateLabel: "FEB 5–8 · 2026",
    start: "2026-02-05T00:00:00",
    end: "2026-02-08T23:59:59",
    href: "https://wmphoenixopen.com/",
    logo: "https://images.seeklogo.com/logo-png/52/1/waste-management-inc-logo-png_seeklogo-528215.png",
  },
  {
    tag: "TEAM EVENT",
    name: "Ryder Cup",
    detail: "Adare Manor · Ireland",
    dateLabel: "SEP 17–19 · 2027",
    start: "2027-09-17T00:00:00",
    end: "2027-09-19T23:59:59",
    href: "https://www.rydercup.com/",
    logo: "https://www.google.com/s2/favicons?domain=rydercup.com&sz=128",
  },
  {
    tag: "TEAM EVENT",
    name: "Presidents Cup",
    detail: "Medinah Country Club",
    dateLabel: "SEP 24–27 · 2026",
    start: "2026-09-24T00:00:00",
    end: "2026-09-27T23:59:59",
    href: "https://www.presidentscup.com/",
    logo: "https://www.google.com/s2/favicons?domain=presidentscup.com&sz=128",
  },
];

type Leader = { position: string; name: string; score: string; thru: string; today?: string };
type GolfData = { tournament: string; status: string; leaders: Leader[]; updated?: string; error?: string };
type FedExRow = { rank: number; name: string; points: string };
type FedExData = { standings: FedExRow[]; available: boolean; updated?: string };
type NextEventData = {
  available: boolean;
  name?: string;
  dateLabel?: string;
  venue?: string;
  location?: string;
  daysUntil?: number;
  href?: string;
  updated?: string;
};
type NewsStory = {
  headline: string;
  description: string;
  href: string;
  source: string;
};
type GolfNewsData = {
  stories: NewsStory[];
  available: boolean;
  updated?: string;
};


function FedExCupMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.fedexMark} ${compact ? styles.fedexMarkCompact : ""}`} aria-label="FedEx Cup">
      <div><span className={styles.fedPurple}>Fed</span><span className={styles.fedOrange}>Ex</span></div>
      <small>CUP</small>
    </div>
  );
}


function centralDayNumber(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function isoDayNumber(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function updatedLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}


async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export default function GolfRoom() {
  const [golf, setGolf] = useState<GolfData | null>(null);
  const [fedex, setFedex] = useState<FedExData | null>(null);
  const [nextEvent, setNextEvent] = useState<NextEventData | null>(null);
  const [golfNews, setGolfNews] = useState<GolfNewsData | null>(null);

  const now = new Date();
  const todayDay = centralDayNumber(now);

  const upcoming = events
    .filter((event) => isoDayNumber(event.end) >= todayDay)
    .sort((a, b) => isoDayNumber(a.start) - isoDayNumber(b.start));
  const nextEventName = upcoming[0]?.name ?? "";

  const eventState = (event: (typeof events)[number]) => {
    const startDay = isoDayNumber(event.start);
    const endDay = isoDayNumber(event.end);

    if (todayDay >= startDay && todayDay <= endDay) return "LIVE";
    if (event.name === nextEventName) return "NEXT UP";
    if (todayDay > endDay) return "COMPLETE";
    return "UPCOMING";
  };

  const eventCountdown = (event: (typeof events)[number]) => {
    const startDay = isoDayNumber(event.start);
    const endDay = isoDayNumber(event.end);

    if (todayDay > endDay) return "FINAL";
    if (todayDay >= startDay) return "IN PROGRESS";

    const days = Math.max(1, startDay - todayDay);
    return days === 1 ? "1 DAY" : `${days} DAYS`;
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchJson<GolfData>("/api/golf-leaderboard");
        if (active) setGolf(data);
      } catch {
        if (active) setGolf({ tournament: "PGA TOUR", status: "Leaderboard unavailable", leaders: [] });
      }
    };
    const loadFedEx = async () => {
      try {
        const data = await fetchJson<FedExData>("/api/fedex-cup");
        if (active) setFedex(data);
      } catch {
        if (active) setFedex({ standings: [], available: false });
      }
    };

    const loadNextEvent = async () => {
      try {
        const data = await fetchJson<NextEventData>("/api/golf-next-event");
        if (active) setNextEvent(data);
      } catch {
        if (active) setNextEvent({ available: false });
      }
    };

    const loadGolfNews = async () => {
      try {
        const data = await fetchJson<GolfNewsData>("/api/golf-news");
        if (active) setGolfNews(data);
      } catch {
        if (active) setGolfNews({ stories: [], available: false });
      }
    };

    load();
    loadFedEx();
    loadNextEvent();
    loadGolfNews();

    const timer = window.setInterval(load, 120000);
    const fedexTimer = window.setInterval(loadFedEx, 900000);
    const nextEventTimer = window.setInterval(loadNextEvent, 1800000);
    const newsTimer = window.setInterval(loadGolfNews, 900000);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.clearInterval(fedexTimer);
      window.clearInterval(nextEventTimer);
      window.clearInterval(newsTimer);
    };
  }, []);

  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>PGA TOUR / MAJORS / TEAM GOLF</p>
          <h1>Golf Room.</h1>
          <p className={styles.heroCopy}>This week on Tour, the tournaments that matter most, and the season-long chase to East Lake.</p>
        </div>
        <div className={styles.heroMark} aria-hidden="true">
          <img src="https://www.liblogo.com/img-logo/pg7180p07c-pga-tour-logo-pga-tour-logo-png-transparent-amp-svg-vector-freebie-supply.png" alt="" />
        </div>
        <div className={styles.heroFooter}><span>SPRINT 14 · ROOM 03</span><span>PGA · WGC ONLY.</span></div>
      </section>

      <section className={styles.topGrid}>
        <article className={styles.panel}>
          <p className={styles.kicker}>THIS WEEK</p>
          <h2>Follow the tournament.</h2>
          <p className={styles.copy}>Live PGA TOUR scoring, kept compact so the room stays about the week that matters.</p>
          <div className={styles.liveBoard}>
            <div className={styles.liveHead}>
              <div><span className={styles.liveDot}></span><strong>{golf?.tournament || "Loading PGA TOUR..."}</strong></div>
              <small>{golf?.status || "Updating leaderboard"}{golf?.updated ? ` · ${updatedLabel(golf.updated)}` : ""}</small>
            </div>
            {golf?.leaders?.length ? (
              <div className={styles.leaderRows}>
                {golf.leaders.slice(0, 8).map((p, i) => (
                  <div className={styles.leaderRow} key={`${p.name}-${i}`}>
                    <b>{p.position || String(i + 1)}</b>
                    <strong>{p.name}</strong>
                    <span>{p.today || ""}</span>
                    <em>{p.thru || ""}</em>
                    <i>{p.score}</i>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.leaderEmpty}>
                <span>{golf?.error || "Fetching this week's leaderboard..."}</span>
                {golf ? (
                  <a href="https://www.pgatour.com/leaderboard" target="_blank" rel="noreferrer">
                    Open PGA TOUR leaderboard ↗
                  </a>
                ) : null}
              </div>
            )}
          </div>
          <div className={styles.quickGrid}>
            <a href="https://www.pgatour.com/" target="_blank" rel="noreferrer"><img src="https://www.liblogo.com/img-logo/pg7180p07c-pga-tour-logo-pga-tour-logo-png-transparent-amp-svg-vector-freebie-supply.png" alt="PGA TOUR"/><span><strong>PGA TOUR</strong><small>Schedule, leaderboard &amp; results</small></span><i>↗</i></a>
            <a href="https://www.pgatour.com/leaderboard" target="_blank" rel="noreferrer"><b>L</b><span><strong>LEADERBOARD</strong><small>This week on the PGA Tour</small></span><i>↗</i></a>
            <a href="https://www.pgatour.com/fedexcup" target="_blank" rel="noreferrer"><FedExCupMark compact /><span><strong>FEDEX CUP</strong><small>Season-long points race</small></span><i>↗</i></a>
            <a href="https://www.pgatour.com/tournaments" target="_blank" rel="noreferrer"><b>M</b><span><strong>MAJORS</strong><small>The four that matter most</small></span><i>↗</i></a>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.fedex}`}>
          <p className={styles.kicker}>SEASON LONG</p>
          <div className={styles.fedexHead}><div><h2>Chase for the FedEx Cup.</h2><p className={styles.copy}>The top of the points race, without turning the room into a statistics wall.</p></div><FedExCupMark /></div>

          <div className={styles.fedexStandings}>
            {fedex?.available && fedex.standings.length ? (
              fedex.standings.map((player) => (
                <div className={styles.fedexRow} key={`${player.rank}-${player.name}`}>
                  <b>{player.rank}</b>
                  <strong>{player.name}</strong>
                  <span>{player.points} pts</span>
                </div>
              ))
            ) : (
              <div className={styles.fedexEmpty}>
                <span>{fedex ? "Live FedEx Cup standings are temporarily unavailable." : "Loading FedEx Cup standings..."}</span>
                {fedex ? (
                  <a href="https://www.pgatour.com/fedexcup/official" target="_blank" rel="noreferrer">
                    Open official standings ↗
                  </a>
                ) : null}
              </div>
            )}
          </div>

          <div className={styles.feedFooter}>
            <a className={styles.textLink} href="https://www.pgatour.com/fedexcup/official" target="_blank" rel="noreferrer">Open full FedEx Cup standings ↗</a>
            {fedex?.updated ? <span>Updated {updatedLabel(fedex.updated)}</span> : null}
          </div>
        </article>
      </section>

      <section className={styles.golfNowGrid}>
        <article className={styles.newsPanel}>
          <div className={styles.newsHeader}>
            <div>
              <p className={styles.kicker}>GOLF NEWS</p>
              <h2>What matters.</h2>
            </div>
            <span>PGA TOUR · MAJORS · TEAM GOLF{golfNews?.updated ? ` · ${updatedLabel(golfNews.updated)}` : ""}</span>
          </div>

          {golfNews?.available && golfNews.stories.length ? (
            <div className={styles.newsList}>
              {golfNews.stories.map((story, index) => (
                <a
                  className={styles.newsStory}
                  href={story.href}
                  target="_blank"
                  rel="noreferrer"
                  key={`${story.headline}-${index}`}
                >
                  <div className={styles.newsRank}>{String(index + 1).padStart(2, "0")}</div>
                  <div className={styles.newsCopy}>
                    <small>{story.source}</small>
                    <strong>{story.headline}</strong>
                    {story.description ? <p>{story.description}</p> : null}
                  </div>
                  <b>↗</b>
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.newsEmpty}>
              <span>Golf news is temporarily unavailable.</span>
              <a href="https://www.espn.com/golf/" target="_blank" rel="noreferrer">
                Open ESPN Golf ↗
              </a>
            </div>
          )}
        </article>

        <article className={styles.nextPanel}>
          <p className={styles.kicker}>COMING UP</p>
          <h2>Next on Tour.</h2>

          {nextEvent?.available ? (
            <a
              className={styles.nextCard}
              href={nextEvent.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.nextCountdown}>
                <strong>{nextEvent.daysUntil === 0 ? "TODAY" : `${nextEvent.daysUntil} DAYS`}</strong>
                <span>UNTIL FIRST TEE</span>
              </div>

              <div className={styles.nextDetails}>
                <small>{nextEvent.dateLabel}</small>
                <h3>{nextEvent.name}</h3>
                <p>{[nextEvent.venue, nextEvent.location].filter(Boolean).join(" · ")}</p>
              </div>

              <div className={styles.nextFooter}>
                {nextEvent?.updated ? <span>Updated {updatedLabel(nextEvent.updated)}</span> : <span />}
                <b className={styles.nextArrow}>↗</b>
              </div>
            </a>
          ) : (
            <div className={styles.nextEmpty}>
              <span>Next-event details are temporarily unavailable.</span>
              <a href="https://www.pgatour.com/schedule" target="_blank" rel="noreferrer">
                Open PGA TOUR schedule ↗
              </a>
            </div>
          )}
        </article>
      </section>

      <section className={styles.eventsPanel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>THE BIG EVENTS</p>
            <h2>Circle these weeks.</h2>
          </div>
          <span>Majors first. Then the events worth clearing the calendar for.</span>
        </div>

        <div className={styles.eventGrid}>
          {events.map((event) => {
            const state = eventState(event);
            const isNext = state === "NEXT UP" || state === "LIVE";

            return (
              <a
                className={`${styles.eventCard} ${isNext ? styles.eventCardNext : ""} ${state === "COMPLETE" ? styles.eventCardPast : ""}`}
                href={event.href}
                target="_blank"
                rel="noreferrer"
                key={event.name}
              >
                <div className={styles.logoBox}><img src={event.logo} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} /><span>{event.name.slice(0, 1)}</span></div>
                <div className={styles.eventBody}>
                  <div className={styles.eventTopline}>
                    <small>{event.tag}</small>
                    <em className={isNext ? styles.eventStateHot : styles.eventState}>{state}</em>
                  </div>
                  <strong>{event.name}</strong>
                  <span>{event.detail}</span>
                  <div className={styles.eventMeta}>
                    <b className={styles.eventDate}>{event.dateLabel}</b>
                    <span className={styles.eventCountdown}>{eventCountdown(event)}</span>
                  </div>
                </div>
                <span className={styles.eventArrow}>↗</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className={styles.linksPanel}>
        <p className={styles.kicker}>LINKS &amp; RESOURCES</p>
        <div className={styles.linksGrid}>
          {links.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>
              <span className={styles.resourceLogo}><img src={item.logo} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} /><b>{item.label.slice(0, 1)}</b></span><strong>{item.label}</strong><small>{item.sub}</small><span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
