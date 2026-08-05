"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "./quick-launch.module.css";
import "./quick-executive.css";

type Shortcut = {
  id: string;
  label: string;
  url: string;
};

const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    id: "together-cu",
    label: "Together CU",
    url: "https://www.togethercu.org/",
  },
  {
    id: "mag",
    label: "MAG Dashboard",
    url: "",
  },
  {
    id: "timeforce",
    label: "TimeForce",
    url: "https://www.timeforce.com/",
  },
  {
    id: "outlook",
    label: "Outlook",
    url: "https://outlook.office.com/",
  },
  {
    id: "cnb-stl",
    label: "CNB St. Louis",
    url: "https://www.cnbstl.com/",
  },
];

const STORAGE_KEY = "jaski.quickLaunch.utility.v1";

function validShortcut(value: unknown): value is Shortcut {
  if (!value || typeof value !== "object") return false;
  const item = value as Shortcut;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.url === "string"
  );
}

export default function QuickLaunchPage() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(DEFAULT_SHORTCUTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (Array.isArray(parsed) && parsed.every(validShortcut)) {
          setShortcuts(parsed);
        }
      }
    } catch {
      // Keep clean defaults if storage is malformed.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
  }, [shortcuts, storageReady]);

  useEffect(() => {
    if (!openMenuId) return;

    function dismissOnOutsideClick(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && !target.closest("[data-quick-menu]")) {
        setOpenMenuId(null);
      }
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenuId(null);
    }

    document.addEventListener("mousedown", dismissOnOutsideClick);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("mousedown", dismissOnOutsideClick);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [openMenuId]);

  function beginEdit(item: Shortcut) {
    setOpenMenuId(null);
    setEditingId(item.id);
    setDraftLabel(item.label);
    setDraftUrl(item.url);
    setAdding(false);
  }

  function saveEdit() {
    if (!editingId || !draftLabel.trim()) return;

    setShortcuts((current) =>
      current.map((item) =>
        item.id === editingId
          ? { ...item, label: draftLabel.trim(), url: draftUrl.trim() }
          : item
      )
    );

    setEditingId(null);
    setDraftLabel("");
    setDraftUrl("");
  }

  function removeShortcut(id: string) {
    setOpenMenuId(null);
    setShortcuts((current) => current.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function addShortcut() {
    if (!draftLabel.trim()) return;

    setShortcuts((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        label: draftLabel.trim(),
        url: draftUrl.trim(),
      },
    ]);

    setDraftLabel("");
    setDraftUrl("");
    setAdding(false);
  }

  function resetDefaults() {
    setOpenMenuId(null);
    setShortcuts(DEFAULT_SHORTCUTS);
    setEditingId(null);
    setAdding(false);
  }

  function logoUrl(item: Shortcut) {
    const knownLogos: Record<string, string> = {
      "together-cu": "https://www.togethercu.org/favicon.ico",
      mag: "https://www.google.com/s2/favicons?domain=exostar.com&sz=64",
      timeforce: "https://www.google.com/s2/favicons?domain=timeforce.com&sz=64",
      outlook: "https://outlook.office.com/favicon.ico",
      "cnb-stl": "https://www.cnbstl.com/favicon.ico",
    };

    if (knownLogos[item.id]) return knownLogos[item.id];
    if (!item.url) return "";

    try {
      const domain = new URL(item.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
    } catch {
      return "";
    }
  }

  return (
    <main className="app-shell quick-executive-shell">
      <Sidebar activePage="quick" />

      <section className="content-stage" aria-label="Quick Launch">
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>UTILITY DRAWER</p>
              <h1>Quick Launch.</h1>
              <p className={styles.subhead}>
                Necessary places. Out of sight until you need them.
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => {
                  setAdding(true);
                  setEditingId(null);
                  setDraftLabel("");
                  setDraftUrl("");
                }}
              >
                Add
              </button>
              <button type="button" onClick={resetDefaults}>
                Reset
              </button>
            </div>
          </header>

          <section className={styles.list} aria-label="Utility shortcuts">
            {shortcuts.map((item) => {
              const isEditing = editingId === item.id;

              if (isEditing) {
                return (
                  <article className={styles.editorRow} key={item.id}>
                    <input
                      value={draftLabel}
                      onChange={(event) => setDraftLabel(event.target.value)}
                      aria-label="Shortcut name"
                    />
                    <input
                      value={draftUrl}
                      onChange={(event) => setDraftUrl(event.target.value)}
                      placeholder="https://…"
                      aria-label="Shortcut URL"
                    />
                    <button type="button" onClick={saveEdit}>Save</button>
                    <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                  </article>
                );
              }

              return (
                <article className={styles.row} key={item.id}>
                  <div className={styles.identity}>
                    <span className={styles.logoHolder} aria-hidden="true">
                      <span className={styles.logoFallback}>{item.label.slice(0, 1).toUpperCase()}</span>
                      {logoUrl(item) ? (
                        <img
                          src={logoUrl(item)}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>
                        {item.url
                          ? item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
                          : "URL not set"}
                      </small>
                    </span>
                  </div>

                  <div className={styles.actions} data-quick-menu>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      <button type="button" onClick={() => beginEdit(item)}>
                        Set URL
                      </button>
                    )}
                    <div className={styles.menuWrap}>
                      <button
                        className={styles.menuTrigger}
                        type="button"
                        aria-label={`More actions for ${item.label}`}
                        aria-expanded={openMenuId === item.id}
                        aria-controls={`quick-menu-${item.id}`}
                        onClick={() => setOpenMenuId((current) => current === item.id ? null : item.id)}
                      >
                        <span aria-hidden="true">•••</span>
                      </button>
                      {openMenuId === item.id && (
                        <div className={styles.actionMenu} id={`quick-menu-${item.id}`} role="menu">
                          <button type="button" role="menuitem" onClick={() => beginEdit(item)}>Edit</button>
                          <button className={styles.removeAction} type="button" role="menuitem" onClick={() => removeShortcut(item.id)}>Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {adding && (
              <article className={styles.editorRow}>
                <input
                  value={draftLabel}
                  onChange={(event) => setDraftLabel(event.target.value)}
                  placeholder="Name"
                  aria-label="New shortcut name"
                  autoFocus
                />
                <input
                  value={draftUrl}
                  onChange={(event) => setDraftUrl(event.target.value)}
                  placeholder="https://…"
                  aria-label="New shortcut URL"
                />
                <button type="button" onClick={addShortcut}>Add</button>
                <button type="button" onClick={() => setAdding(false)}>Cancel</button>
              </article>
            )}
          </section>

          <footer className={styles.footer}>
            <span>Favorites stay personal. Quick Launch stays practical.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

