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
  { tag: "MAJOR", name: "The Masters", detail: "Major championship", href: "https://www.masters.com/", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Masters_Tournament.svg" },
  { tag: "MAJOR", name: "PGA Championship", detail: "Major championship", href: "https://www.pgachampionship.com/", logo: "https://www.google.com/s2/favicons?domain=pgachampionship.com&sz=128" },
  { tag: "MAJOR", name: "U.S. Open", detail: "Major championship", href: "https://www.usopen.com/", logo: "https://www.google.com/s2/favicons?domain=usopen.com&sz=128" },
  { tag: "MAJOR", name: "The Open", detail: "Major championship", href: "https://www.theopen.com/", logo: "https://images.seeklogo.com/logo-png/46/1/the-open-championship-logo-png_seeklogo-462121.png" },
  { tag: "THE PLAYERS", name: "The Players", detail: "PGA TOUR", href: "https://www.theplayers.com/", logo: "https://www.google.com/s2/favicons?domain=theplayers.com&sz=128" },
  { tag: "PGA TOUR", name: "WM Phoenix Open", detail: "PGA TOUR", href: "https://wmphoenixopen.com/", logo: "https://images.seeklogo.com/logo-png/52/1/waste-management-inc-logo-png_seeklogo-528215.png" },
  { tag: "TEAM EVENT", name: "Ryder Cup", detail: "Team event", href: "https://www.rydercup.com/", logo: "https://www.google.com/s2/favicons?domain=rydercup.com&sz=128" },
  { tag: "TEAM EVENT", name: "Presidents Cup", detail: "Team event", href: "https://www.presidentscup.com/", logo: "https://www.google.com/s2/favicons?domain=presidentscup.com&sz=128" },
];

type Leader = { position: string; name: string; score: string; thru: string; today?: string };
type GolfData = { tournament: string; status: string; leaders: Leader[]; updated?: string; error?: string };


function FedExCupMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.fedexMark} ${compact ? styles.fedexMarkCompact : ""}`} aria-label="FedEx Cup">
      <div><span className={styles.fedPurple}>Fed</span><span className={styles.fedOrange}>Ex</span></div>
      <small>CUP</small>
    </div>
  );
}

export default function GolfRoom() {
  const [golf, setGolf] = useState<GolfData | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/golf-leaderboard", { cache: "no-store" });
        const data = await res.json();
        if (active) setGolf(data);
      } catch {
        if (active) setGolf({ tournament: "PGA TOUR", status: "Leaderboard unavailable", leaders: [] });
      }
    };
    load();
    const timer = window.setInterval(load, 120000);
    return () => { active = false; window.clearInterval(timer); };
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
              <small>{golf?.status || "Updating leaderboard"}</small>
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
              <div className={styles.leaderEmpty}>{golf?.error || "Fetching this week's leaderboard..."}</div>
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
          <div className={styles.fedexHead}><div><h2>Chase for the FedEx Cup.</h2><p className={styles.copy}>Keep the points race visible without turning the room into a statistics wall.</p></div><FedExCupMark /></div>
          <a className={styles.textLink} href="https://www.pgatour.com/fedexcup" target="_blank" rel="noreferrer">Open FedEx Cup standings ↗</a>
        </article>
      </section>

      <section className={styles.eventsPanel}>
        <div className={styles.sectionHead}><div><p className={styles.kicker}>THE BIG EVENTS</p><h2>Circle these weeks.</h2></div><span>Majors first. Then the ones worth making time for.</span></div>
        <div className={styles.eventGrid}>
          {events.map((event) => (
            <a className={styles.eventCard} href={event.href} target="_blank" rel="noreferrer" key={event.name}>
              <div className={styles.logoBox}><img src={event.logo} alt="" /></div>
              <div><small>{event.tag}</small><strong>{event.name}</strong><span>{event.detail}</span></div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.linksPanel}>
        <p className={styles.kicker}>LINKS &amp; RESOURCES</p>
        <div className={styles.linksGrid}>
          {links.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.label}>
              <img src={item.logo} alt="" /><strong>{item.label}</strong><small>{item.sub}</small><span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
