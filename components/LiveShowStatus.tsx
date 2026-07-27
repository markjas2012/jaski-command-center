"use client";

import { useEffect, useState } from "react";
import styles from "./LiveTV.module.css";

type Episode = {
  name?: string;
  season?: number | null;
  number?: number | null;
  airstamp?: string | null;
};

type StatusData = {
  found: boolean;
  title?: string;
  status?: string;
  network?: string;
  service?: string;
  next?: Episode | null;
  previous?: Episode | null;
};

function when(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function LiveShowStatus({ title }: { title: string }) {
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(`/api/tv-status?q=${encodeURIComponent(title)}`, { cache: "no-store" })
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((json) => !cancelled && setData(json))
        .catch(() => !cancelled && setData({ found: false }));
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [title]);

  if (!data) return <p className={styles.inlineMuted}>Checking schedule…</p>;
  if (!data.found) return <p className={styles.inlineMuted}>No live schedule match yet.</p>;

  if (data.next) {
    const ep = data.next;
    const number = ep.season && ep.number ? `S${ep.season} · E${ep.number}` : "Next episode";
    return (
      <p className={styles.inlineLive}>
        <span>UP NEXT</span> {number}{ep.airstamp ? ` · ${when(ep.airstamp)}` : ""}
      </p>
    );
  }

  return (
    <p className={styles.inlineMuted}>
      {data.status === "Ended" ? "Series ended." : "No future episode scheduled yet."}
    </p>
  );
}
