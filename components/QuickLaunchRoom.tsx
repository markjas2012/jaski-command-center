"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./QuickLaunchRoom.module.css";

type Shortcut = {
  id: string;
  label: string;
  url: string;
  note: string;
};

const KEY = "jaski-quick-launch-v1";

const DEFAULTS: Shortcut[] = [
  { id: "youtube-tv", label: "YouTube TV", url: "https://tv.youtube.com/", note: "Live TV" },
  { id: "plex", label: "Plex", url: "https://app.plex.tv/", note: "Library" },
  { id: "youtube", label: "YouTube", url: "https://www.youtube.com/", note: "Watch" },
  { id: "amazon", label: "Amazon", url: "https://www.amazon.com/", note: "Shop" },
  { id: "icloud", label: "iCloud", url: "https://www.icloud.com/", note: "Apple" },
  { id: "chatgpt", label: "ChatGPT", url: "https://chatgpt.com/", note: "AI" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/", note: "Social" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/", note: "Social" },
];

export default function QuickLaunchRoom() {
  const [items, setItems] = useState<Shortcut[]>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<Shortcut | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const label = editing.label.trim();
    let url = editing.url.trim();
    if (!label || !url) return;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    const next = { ...editing, label, url };
    if (editing.id) {
      setItems((all) => all.map((item) => item.id === editing.id ? next : item));
    } else {
      setItems((all) => [...all, { ...next, id: crypto.randomUUID() }]);
    }
    setEditing(null);
  }

  function remove(id: string) {
    setItems((all) => all.filter((item) => item.id !== id));
  }

  function resetDefaults() {
    setItems(DEFAULTS);
  }

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.kicker}>ONE-CLICK ACCESS</p>
          <h1>Quick Launch.</h1>
          <p>The places you actually go, without digging through bookmarks or opening another dashboard.</p>
        </div>
        <div className={styles.mark}><strong>↗</strong><small>GO SOMEWHERE</small></div>
        <div className={styles.foot}><span>SPRINT 10 · COMPONENT 10</span><span>ONE CLICK. DONE.</span></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>GO SOMEWHERE</p>
            <h2>Your shortcuts.</h2>
          </div>
          <div className={styles.headActions}>
            <button onClick={() => setEditing({ id: "", label: "", url: "", note: "" })}>+ Add Shortcut</button>
            <button className={styles.subtle} onClick={resetDefaults}>Reset Defaults</button>
          </div>
        </div>

        {editing && (
          <form className={styles.editor} onSubmit={save}>
            <label>Name<input autoFocus value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Facebook" /></label>
            <label>URL<input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://..." /></label>
            <label>Small label<input value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} placeholder="Social" /></label>
            <div className={styles.actions}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        )}

        <div className={styles.grid}>
          {items.map((item) => (
            <article className={styles.card} key={item.id}>
              <a href={item.url} target="_blank" rel="noreferrer" className={styles.launch}>
                <div className={styles.cardTop}><span>{item.note || "SHORTCUT"}</span><span>↗</span></div>
                <h3>{item.label}</h3>
                <p>{item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
              </a>
              <div className={styles.actions}>
                <button onClick={() => setEditing(item)}>Edit</button>
                <button className={styles.remove} onClick={() => remove(item.id)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
