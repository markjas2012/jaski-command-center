"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./DashboardVerification.module.css";

type CheckState = "waiting" | "running" | "pass" | "warn" | "fail";
type RouteCheck = { label: string; path: string; state: CheckState; detail: string };

const ROUTES = [
  ["Home", "/"], ["Jam Room", "/jam"], ["Sports", "/sports"],
  ["Golf", "/golf"], ["Streaming", "/streaming"], ["Jaski Arcade", "/games"],
  ["Food", "/food"], ["Recipe Book", "/food/recipes"], ["Kitchen Mode", "/food/kitchen"],
  ["Notes", "/notes"], ["Quick Launch", "/quick-launch"],
] as const;

const FEEDS = [
  ["Homepage features", "/api/featured-today"],
  ["Jam feed", "/api/jam-feed"],
  ["Sports board", "/api/sports-board"],
  ["Golf leaderboard", "/api/golf-leaderboard"],
  ["Streaming radar", "/api/streaming-radar"],
  ["St. Louis food", "/api/food/local-table"],
] as const;

const MANUAL = [
  "Sidebar links open the correct seven rooms; Notes remains absent from the sidebar.",
  "Daily Tools opens Quick Launch and Notes, and launches Audible and Apple Reminders correctly.",
  "No Remote card, navigation item, route, or dead link appears anywhere.",
  "Home remains a compact one-screen lodge dashboard with no clipping or overlap.",
  "Jam, Sports, Golf, Streaming, and Arcade live content loads without a broken layout.",
  "Recipe Book add/edit/search/favorite/backup/restore and Kitchen Mode controls still work.",
  "Notes switches between spiral, dot grid, and black-and-white DOS modes and saves locally.",
  "Desktop browser shows no red Next.js overlay and DevTools Console has no recurring errors.",
  "At a narrow/mobile width, cards stack cleanly and no horizontal scrolling appears.",
  "Images load sharply, links are readable, and completed room artwork has not regressed.",
] as const;

const STORAGE_KEY = "jaski.dashboard.verify.17.26a";

export default function DashboardVerification() {
  const [routes, setRoutes] = useState<RouteCheck[]>(() => ROUTES.map(([label, path]) => ({ label, path, state: "waiting", detail: "Not checked" })));
  const [feeds, setFeeds] = useState<RouteCheck[]>(() => FEEDS.map(([label, path]) => ({ label, path, state: "waiting", detail: "Not checked" })));
  const [manual, setManual] = useState<boolean[]>(() => MANUAL.map(() => false));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved) && saved.length === MANUAL.length) setManual(saved.map(Boolean));
    } catch { /* a damaged checklist should never block verification */ }
  }, []);

  const completed = manual.filter(Boolean).length;
  const routePasses = routes.filter((item) => item.state === "pass").length;
  const feedPasses = feeds.filter((item) => item.state === "pass").length;
  const overall = useMemo(() => {
    if (routes.some((item) => item.state === "fail")) return "ACTION NEEDED";
    if (routePasses === routes.length && completed === MANUAL.length) return "READY TO LOCK";
    if (busy) return "CHECKING";
    return "VERIFICATION OPEN";
  }, [routes, routePasses, completed, busy]);

  async function testGroup(items: typeof ROUTES | typeof FEEDS, setter: typeof setRoutes, optional: boolean) {
    setter(items.map(([label, path]) => ({ label, path, state: "running", detail: "Checking…" })));
    const results = await Promise.all(items.map(async ([label, path]) => {
      const started = performance.now();
      try {
        const response = await fetch(path, { cache: "no-store", signal: AbortSignal.timeout(12000) });
        const ms = Math.round(performance.now() - started);
        if (response.ok) return { label, path, state: "pass" as const, detail: `${response.status} · ${ms} ms` };
        return { label, path, state: optional ? "warn" as const : "fail" as const, detail: `${response.status} response` };
      } catch (error) {
        return { label, path, state: optional ? "warn" as const : "fail" as const, detail: error instanceof Error ? error.message : "Request failed" };
      }
    }));
    setter(results);
  }

  async function runAll() {
    setBusy(true);
    await testGroup(ROUTES, setRoutes, false);
    await testGroup(FEEDS, setFeeds, true);
    setBusy(false);
  }

  function toggle(index: number) {
    setManual((current) => {
      const next = current.map((value, itemIndex) => itemIndex === index ? !value : value);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function reset() {
    const empty = MANUAL.map(() => false);
    setManual(empty);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    setRoutes(ROUTES.map(([label, path]) => ({ label, path, state: "waiting", detail: "Not checked" })));
    setFeeds(FEEDS.map(([label, path]) => ({ label, path, state: "waiting", detail: "Not checked" })));
  }

  return <section className={styles.board}>
    <header className={styles.hero}>
      <div>
        <p className={styles.kicker}>SPRINT 17.26A · FINAL WALK-THROUGH</p>
        <h1>Jaski House Check.</h1>
        <p>One quiet control room for every finished space.</p>
      </div>
      <div className={styles.seal}><span>{overall}</span><strong>{routePasses}/{routes.length}</strong><small>ROOMS ONLINE</small></div>
    </header>

    <div className={styles.toolbar}>
      <button onClick={runAll} disabled={busy}>{busy ? "Checking the house…" : "Run automated checks"}</button>
      <button className={styles.secondary} onClick={reset}>Reset checklist</button>
      <p><i /> Browser checklist saved locally</p>
    </div>

    <section className={styles.panel}>
      <div className={styles.heading}><div><p className={styles.kicker}>AUTOMATED</p><h2>Every door opens.</h2></div><span>{routePasses}/{routes.length} routes</span></div>
      <div className={styles.grid}>{routes.map((item) => <CheckCard key={item.path} item={item} />)}</div>
    </section>

    <section className={styles.panel}>
      <div className={styles.heading}><div><p className={styles.kicker}>LIVE SOURCES</p><h2>The rooms have a pulse.</h2></div><span>{feedPasses}/{feeds.length} responding</span></div>
      <p className={styles.note}>A feed warning can mean its outside provider is temporarily unavailable; it does not fail the room itself.</p>
      <div className={styles.grid}>{feeds.map((item) => <CheckCard key={item.path} item={item} />)}</div>
    </section>

    <section className={styles.panel}>
      <div className={styles.heading}><div><p className={styles.kicker}>HANDS-ON ACCEPTANCE</p><h2>Walk the finished house.</h2></div><span>{completed}/{MANUAL.length} complete</span></div>
      <div className={styles.list}>{MANUAL.map((label, index) => <label key={label} className={manual[index] ? styles.done : ""}>
        <input type="checkbox" checked={manual[index]} onChange={() => toggle(index)} /><span>{label}</span>
      </label>)}</div>
    </section>

    <footer className={styles.footer}>
      <span>PRIVATE LODGE · ST. LOUIS</span>
      <nav><a href="/">Home</a><a href="/food/verify">Food verification</a><a href="#top">Top</a></nav>
    </footer>
  </section>;
}

function CheckCard({ item }: { item: RouteCheck }) {
  return <a href={item.path} target="_blank" rel="noreferrer" className={`${styles.card} ${styles[item.state]}`}>
    <span className={styles.status}>{item.state === "pass" ? "✓" : item.state === "fail" ? "!" : item.state === "warn" ? "~" : item.state === "running" ? "…" : "○"}</span>
    <span><strong>{item.label}</strong><small>{item.path}</small></span>
    <em>{item.detail}</em>
  </a>;
}
