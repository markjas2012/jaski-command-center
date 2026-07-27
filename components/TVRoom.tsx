"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import styles from "./TVRoom.module.css";

type Show = {
  id: string;
  title: string;
  service: string;
  season: number;
  episode: number;
  status: "watching" | "finished";
};

const STORAGE_KEY = "jaski-currently-watching-v1";

export default function TVRoom() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setShows(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shows));
  }, [shows, loaded]);

  function addShow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const service = String(data.get("service") || "").trim();
    if (!title) return;

    setShows((current) => [...current, {
      id: crypto.randomUUID(),
      title,
      service: service || "Streaming",
      season: Math.max(1, Number(data.get("season")) || 1),
      episode: Math.max(1, Number(data.get("episode")) || 1),
      status: "watching",
    }]);

    event.currentTarget.reset();
    setAdding(false);
  }

  function saveEdit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const service = String(data.get("service") || "").trim();

    setShows((current) => current.map((show) =>
      show.id === id ? {
        ...show,
        title: title || show.title,
        service: service || "Streaming",
        season: Math.max(1, Number(data.get("season")) || 1),
        episode: Math.max(1, Number(data.get("episode")) || 1),
      } : show
    ));
    setEditingId(null);
  }

  function advance(id: string) {
    setShows((current) => current.map((show) =>
      show.id === id ? { ...show, episode: show.episode + 1 } : show
    ));
  }

  function finish(id: string) {
    setShows((current) => current.map((show) =>
      show.id === id ? { ...show, status: "finished" } : show
    ));
    setEditingId(null);
  }

  function resume(id: string) {
    setShows((current) => current.map((show) =>
      show.id === id ? { ...show, status: "watching" } : show
    ));
  }

  function remove(id: string) {
    setShows((current) => current.filter((show) => show.id !== id));
    if (editingId === id) setEditingId(null);
  }

  const watching = shows.filter((show) => show.status === "watching");
  const finished = shows.filter((show) => show.status === "finished");

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.topline}>
          <Link href="/" className={styles.back}>← HOME</Link>
          <span className={styles.badge}>TV SHOWS</span>
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>WHAT ARE WE WATCHING?</p>
          <h1>On Tonight.</h1>
          <p>Your personal watch list. Keep your place, advance an episode, and move finished shows out of the way.</p>
        </div>
        <div className={styles.orb} aria-hidden="true"><span>TV</span><small>WATCH NEXT</small></div>
        <div className={styles.heroFooter}><span>SPRINT 10 · COMPONENT 06</span><span>YOUR SHOWS. YOUR PLACE.</span></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div><p className={styles.kicker}>CURRENTLY WATCHING</p><h2>Pick up where you left off.</h2></div>
          <button className={styles.addButton} onClick={() => setAdding((v) => !v)}>+ Add Show</button>
        </div>

        {adding && (
          <form className={styles.form} onSubmit={addShow}>
            <input name="title" placeholder="Show name" required />
            <input name="service" placeholder="Service (Hulu, Max, Netflix…)" />
            <input name="season" type="number" min="1" defaultValue="1" aria-label="Season" />
            <input name="episode" type="number" min="1" defaultValue="1" aria-label="Episode" />
            <button type="submit">Add to Watching</button>
          </form>
        )}

        <div className={styles.showGrid}>
          {watching.length === 0 ? (
            <div className={styles.empty}>
              <strong>Nothing tracked yet.</strong>
              <span>Add the shows you are actually watching right now.</span>
            </div>
          ) : watching.map((show) => (
            <article className={styles.showCard} key={show.id}>
              {editingId === show.id ? (
                <form className={styles.editForm} onSubmit={(e) => saveEdit(e, show.id)}>
                  <label>Show<input name="title" defaultValue={show.title} required /></label>
                  <label>Service<input name="service" defaultValue={show.service} /></label>
                  <div className={styles.editNumbers}>
                    <label>Season<input name="season" type="number" min="1" defaultValue={show.season} /></label>
                    <label>Episode<input name="episode" type="number" min="1" defaultValue={show.episode} /></label>
                  </div>
                  <div className={styles.actions}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={styles.meta}><span>{show.service}</span><span>WATCHING</span></div>
                  <div><h3>{show.title}</h3><p>Season {show.season} · Episode {show.episode}</p></div>
                  <div className={styles.actions}>
                    <button onClick={() => advance(show.id)}>Watched → E{show.episode + 1}</button>
                    <button onClick={() => setEditingId(show.id)}>Edit</button>
                    <button onClick={() => finish(show.id)}>Finished</button>
                    <button className={styles.remove} onClick={() => remove(show.id)}>Remove</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lower}>
        <article className={styles.smallPanel}>
          <p className={styles.kicker}>UP NEXT</p>
          <h2>{watching[0] ? watching[0].title : "Your next episode."}</h2>
          <p>{watching[0] ? `Season ${watching[0].season} · Episode ${watching[0].episode}` : "Your first active show will appear here."}</p>
        </article>
        <article className={styles.smallPanel}>
          <p className={styles.kicker}>NEW THIS WEEK</p>
          <h2>Worth knowing about.</h2>
          <p>Reserved for current premieres, returning seasons, and episodes relevant to your watch list.</p>
        </article>
      </section>

      {finished.length > 0 && (
        <section className={styles.finished}>
          <div><p className={styles.kicker}>RECENTLY FINISHED</p><h2>Done, but not forgotten.</h2></div>
          <div className={styles.finishedList}>
            {finished.map((show) => (
              <div key={show.id}>
                <span><strong>{show.title}</strong> · {show.service}</span>
                <span><button onClick={() => resume(show.id)}>Resume</button><button onClick={() => remove(show.id)}>Remove</button></span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
