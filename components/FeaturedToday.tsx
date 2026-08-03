"use client";

import { useEffect, useState } from "react";
import styles from "./FeaturedToday.module.css";

type FeatureItem = {
  lane: "WATCH" | "LISTEN" | "EXPLORE";
  title: string;
  detail: string;
  href: string;
  source?: string;
  date?: string;
};

type FeaturedPayload = {
  build?: string;
  requestId?: string;
  updatedAt: string;
  items: FeatureItem[];
};

function shortDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(d);
}

function tone(lane: FeatureItem["lane"]) {
  if (lane === "WATCH") return styles.watch;
  if (lane === "LISTEN") return styles.listen;
  return styles.explore;
}

export default function FeaturedToday() {
  const [data, setData] = useState<FeaturedPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    fetch(`/api/featured-today?build=17.14c&r=${requestId}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: FeaturedPayload) => {
        if (!cancelled) {
          console.info(
            "[Jaski Featured Today]",
            "build:",
            json.build,
            "request:",
            json.requestId
          );
          setData(json);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const items = data?.items?.slice(0, 3) || [];

  return (
    <section className={styles.section} aria-labelledby="featured-today-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>FEATURED TODAY</p>
          <h2 id="featured-today-title">A few things worth your attention.</h2>
        </div>

        <span className={styles.live}>
          {failed ? "QUIET" : data ? "LIVE" : "CHECKING"}
        </span>
      </div>

      {!data && !failed && (
        <div className={styles.loading}>Finding three worthwhile things…</div>
      )}

      {failed && (
        <div className={styles.loading}>
          Featured Today is quiet right now. The rest of Jaski is unaffected.
        </div>
      )}

      {items.length > 0 && (
        <div className={styles.grid}>
          {items.map((item, index) => (
            <a
              className={`${styles.card} ${tone(item.lane)}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              key={`${item.lane}-${item.href}-${index}`}
            >
              <div className={styles.cardTop}>
                <span>{item.lane}</span>
                <span>0{index + 1}</span>
              </div>

              <div className={styles.cardBody}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>

              <div className={styles.cardFooter}>
                <span>
                  {item.source || "Jaski"}
                  {item.date ? ` · ${shortDate(item.date)}` : ""}
                </span>
                <strong>Open ↗</strong>
              </div>
            </a>
          ))}
        </div>
      )}

      {data && (
        <p className={styles.updated}>
          Refreshed{" "}
          {new Date(data.updatedAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
          .
        </p>
      )}
    </section>
  );
}
