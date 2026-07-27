"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import styles from "./GameRoom.module.css";

type GameStatus = "playing" | "next" | "finished";
type Game = {
  id: string;
  title: string;
  platform: string;
  progress: string;
  status: GameStatus;
};

const STORAGE_KEY = "jaski-video-games-v1";

export default function GameRoom() {
  const [games, setGames] = useState<Game[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState<GameStatus | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setGames(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  }, [games, loaded]);

  const playing = games.filter(g => g.status === "playing");
  const next = games.filter(g => g.status === "next");
  const finished = games.filter(g => g.status === "finished");

  function addGame(e: FormEvent<HTMLFormElement>, status: GameStatus) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    if (!title) return;
    setGames(current => [...current, {
      id: crypto.randomUUID(),
      title,
      platform: String(fd.get("platform") || "").trim() || "Xbox",
      progress: String(fd.get("progress") || "").trim(),
      status,
    }]);
    e.currentTarget.reset();
    setAdding(null);
  }

  function saveEdit(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setGames(current => current.map(g => g.id === id ? {
      ...g,
      title: String(fd.get("title") || "").trim() || g.title,
      platform: String(fd.get("platform") || "").trim() || g.platform,
      progress: String(fd.get("progress") || "").trim(),
    } : g));
    setEditingId(null);
  }

  const move = (id: string, status: GameStatus) =>
    setGames(current => current.map(g => g.id === id ? {...g, status} : g));

  const remove = (id: string) =>
    setGames(current => current.filter(g => g.id !== id));

  function GameCard({game}: {game: Game}) {
    if (editingId === game.id) {
      return (
        <article className={styles.card}>
          <form className={styles.editForm} onSubmit={e => saveEdit(e, game.id)}>
            <label>Game<input name="title" defaultValue={game.title} required /></label>
            <label>Platform<input name="platform" defaultValue={game.platform} /></label>
            <label>Progress / Note<textarea name="progress" defaultValue={game.progress} placeholder="Chapter, mission, rank, what to do next..." /></label>
            <div className={styles.actions}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </article>
      );
    }
    return (
      <article className={styles.card}>
        <div className={styles.meta}><span>{game.platform}</span><span>{game.status === "playing" ? "PLAYING" : game.status === "next" ? "PLAY NEXT" : "FINISHED"}</span></div>
        <div><h3>{game.title}</h3><p>{game.progress || "No progress note yet."}</p></div>
        <div className={styles.actions}>
          {game.status === "next" && <button onClick={() => move(game.id, "playing")}>Start Playing</button>}
          {game.status === "playing" && <button onClick={() => move(game.id, "next")}>Play Later</button>}
          {game.status !== "finished" && <button onClick={() => move(game.id, "finished")}>Finished</button>}
          {game.status === "finished" && <button onClick={() => move(game.id, "playing")}>Replay</button>}
          <button onClick={() => setEditingId(game.id)}>Edit</button>
          <button className={styles.remove} onClick={() => remove(game.id)}>Remove</button>
        </div>
      </article>
    );
  }

  function AddForm({status}: {status: GameStatus}) {
    if (adding !== status) return null;
    return (
      <form className={styles.addForm} onSubmit={e => addGame(e, status)}>
        <input name="title" placeholder="Game title" required />
        <input name="platform" placeholder="Platform (Xbox, Switch, PC…)" />
        <input name="progress" placeholder="Progress / note (optional)" />
        <button type="submit">{status === "playing" ? "Add to Playing Now" : "Add to Play Next"}</button>
        <button type="button" onClick={() => setAdding(null)}>Cancel</button>
      </form>
    );
  }

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.topline}>
          <Link className={styles.back} href="/">← HOME</Link>
          <span className={styles.badge}>VIDEO GAMES</span>
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>PRESS START</p>
          <h1>Game Room.</h1>
          <p>What you are playing, what is next, and just enough gaming news to know what is worth your time.</p>
        </div>
        <div className={styles.orb}><span>J</span><small>PLAYER ONE</small></div>
        <div className={styles.heroFooter}><span>SPRINT 10 · COMPONENT 07</span><span>PLAY MORE. BROWSE LESS.</span></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div><p className={styles.kicker}>PLAYING NOW</p><h2>Pick up the controller.</h2></div>
          <button className={styles.primary} onClick={() => setAdding(adding === "playing" ? null : "playing")}>+ Add Game</button>
        </div>
        <AddForm status="playing" />
        <div className={styles.grid}>
          {playing.length ? playing.map(g => <GameCard game={g} key={g.id} />) :
            <div className={styles.empty}><strong>Nothing active yet.</strong><span>Add the game you are actually playing right now.</span></div>}
        </div>
      </section>

      <section className={styles.split}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div><p className={styles.kicker}>PLAY NEXT</p><h2>The short list.</h2></div>
            <button className={styles.secondary} onClick={() => setAdding(adding === "next" ? null : "next")}>+ Add</button>
          </div>
          <AddForm status="next" />
          <div className={styles.stack}>
            {next.length ? next.map(g => <GameCard game={g} key={g.id} />) :
              <p className={styles.quiet}>Keep this small: only games you genuinely want to play next.</p>}
          </div>
        </div>

        <div className={styles.panel}>
          <p className={styles.kicker}>WORTH KNOWING ABOUT</p>
          <h2>New & upcoming.</h2>
          <p className={styles.quiet}>A future home for notable releases and subscription additions—without turning the room into a gaming news feed.</p>
          <div className={styles.newsPlaceholders}>
            <span>NEW RELEASES</span><span>GAME PASS</span><span>PS PLUS</span>
          </div>
        </div>
      </section>

      {finished.length > 0 && (
        <section className={styles.finished}>
          <div><p className={styles.kicker}>FINISHED</p><h2>Roll credits.</h2></div>
          <div className={styles.finishedList}>{finished.map(g => <GameCard game={g} key={g.id} />)}</div>
        </section>
      )}
    </div>
  );
}
