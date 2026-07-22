"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "jaski-quick-notes";

export default function QuickNotes() {
  const [note, setNote] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedNote = window.localStorage.getItem(STORAGE_KEY);

    if (savedNote !== null) {
      setNote(savedNote);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, note);
  }, [note, loaded]);

  return (
    <div className="space-y-2">
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Type anything you need to remember..."
        className="jaski-panel-soft min-h-32 w-full resize-y rounded-xl border p-3 text-sm outline-none"
      />

      <p className="jaski-muted text-xs">
        Saved automatically on this computer.
      </p>
    </div>
  );
}