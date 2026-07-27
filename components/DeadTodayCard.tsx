"use client";

import { useEffect, useState } from "react";

type DeadTodayPayload = {
  showDate: string;
  venue: string;
  href: string;
  note: string;
  live: boolean;
  diagnostic?: string;
};

const initial: DeadTodayPayload = {
  showDate: "Today in Grateful Dead history",
  venue: "",
  href: "https://archive.org/details/GratefulDead",
  note: "Finding a show from today's date...",
  live: false,
};

export default function DeadTodayCard() {
  const [show, setShow] = useState<DeadTodayPayload>(initial);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);

    fetch(`/api/dead-today?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`dead-today ${res.status}`);
        return res.json();
      })
      .then((data: DeadTodayPayload) => setShow(data))
      .catch(() =>
        setShow({
          showDate: "Today in Grateful Dead history",
          venue: "",
          href: "https://archive.org/details/GratefulDead",
          note: "The live lookup timed out. Open the archive instead.",
          live: false,
          diagnostic: "client-timeout",
        })
      )
      .finally(() => window.clearTimeout(timer));

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return (
    <a href={show.href} target="_blank" rel="noreferrer" style={{ display: "contents" }}>
      <span>ON THIS DAY</span>
      <h3>{show.showDate}</h3>
      {show.venue ? <p>{show.venue}</p> : null}
      <p>{show.note}</p>
      <strong>{show.live ? "Listen on Archive" : "Open Archive"} ↗</strong>
      {!show.live && show.diagnostic ? (
        <small style={{ opacity: 0.45, marginTop: 8 }}>
          12.3.5 · {show.diagnostic}
        </small>
      ) : null}
    </a>
  );
}
