"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "./quick.module.css";

type UtilityLink = { id: string; label: string; href: string; note: string };

const DEFAULT_LINKS: UtilityLink[] = [
  { id: "together", label: "Together CU", href: "https://www.togethercu.org/", note: "Banking" },
  { id: "mag", label: "MAG Dashboard", href: "", note: "Work dashboard" },
  { id: "timeforce", label: "TimeForce", href: "https://time.myisolved.com/", note: "Timekeeping" },
  { id: "outlook", label: "Outlook", href: "https://outlook.office.com/mail/", note: "Work mail" },
  { id: "cnb", label: "CNB STL", href: "https://www.cnbstl.com/", note: "Banking" },
];

const STORAGE_KEY = "jaski.utilityLinks.v1";

export default function QuickLaunchPage() {
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLinks(JSON.parse(saved));
    } catch {}
  }, []);

  function save(next: UtilityLink[]) {
    setLinks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <main className="app-shell">
      <Sidebar activePage="home" />
      <section className="content-stage" aria-label="Quick Launch">
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>UTILITY DRAWER</p>
              <h1>Quick Launch</h1>
              <p className={styles.subhead}>The things you need access to, not the things you need to look at.</p>
            </div>
            <button className={styles.edit} onClick={() => setEditing(!editing)}>{editing ? "Done" : "Edit"}</button>
          </header>

          <div className={styles.list}>
            {links.map((item) => (
              <div className={styles.row} key={item.id}>
                <div className={styles.identity}>
                  <span className={styles.initial}>{item.label.charAt(0)}</span>
                  <span><strong>{item.label}</strong><small>{item.note}</small></span>
                </div>
                {editing ? (
                  <input
                    className={styles.urlInput}
                    value={item.href}
                    placeholder="Paste link"
                    aria-label={`${item.label} URL`}
                    onChange={(e) => save(links.map((link) => link.id === item.id ? { ...link, href: e.target.value } : link))}
                  />
                ) : item.href ? (
                  <a className={styles.open} href={item.href} target="_blank" rel="noreferrer">Open <span aria-hidden="true">↗</span></a>
                ) : (
                  <button className={styles.setLink} onClick={() => setEditing(true)}>Set link</button>
                )}
              </div>
            ))}
          </div>

          {editing && <p className={styles.editNote}>MAG is intentionally blank until its real dashboard address is entered. No guessed links.</p>}
        </div>
      </section>
    </main>
  );
}
