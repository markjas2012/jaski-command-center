"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "jaski-theme";
const CHANGE_EVENT = "jaski-theme-change";

// Add future themes here; unknown saved values safely use Original.
const themes = ["original", "blue-ice"] as const;
type Theme = (typeof themes)[number];

function getTheme(): Theme {
  const value = document.documentElement.dataset.jaskiTheme;
  return themes.find((theme) => theme === value) ?? "original";
}

function subscribe(onChange: () => void) {
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    document.documentElement.dataset.jaskiTheme =
      themes.find((theme) => theme === event.newValue) ?? "original";
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", syncStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", syncStorage);
  };
}

export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "original");
  const enabled = theme === "blue-ice";

  function toggleTheme() {
    const next: Theme = enabled ? "original" : "blue-ice";
    document.documentElement.dataset.jaskiTheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The switch still works when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <div className="theme-control">
      <span className="theme-control-label">APPEARANCE</span>
      <button className="theme-switch" type="button" role="switch"
        aria-checked={enabled} aria-label="Blue Ice theme" onClick={toggleTheme}>
        <span className="theme-switch-copy"><strong>Blue Ice</strong><small>Minimalist theme</small></span>
        <span className="theme-switch-track" aria-hidden="true"><span /></span>
      </button>
    </div>
  );
}
