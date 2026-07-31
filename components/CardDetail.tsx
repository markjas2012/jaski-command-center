"use client";

import { useEffect, useState } from "react";
import styles from "./StreamingRoom.module.css";

type Pick = {
  id: number;
  title: string;
  kind: "MOVIE" | "TV" | "DOCUMENTARY";
  date?: string;
  displayContext?: string;
  image?: string;
  score?: number;
  href: string;
  network?: string;
  overview?: string;
  voteAverage?: number;
  rawDate?: string;
  firstAirDate?: string;
};

export function CardGrid({ picks }: { picks: Pick[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedPick = picks.find((p) => p.id === selectedId);

  return (
    <>
      <div className={styles.liveCardRow}>
        {picks.map((pick) => (
          <button
            className={styles.liveCard}
            onClick={() => setSelectedId(pick.id)}
            key={`${pick.kind}-${pick.id}`}
            type="button"
            aria-label={`${pick.title} details`}
          >
            {pick.image ? (
              <img src={pick.image} alt="" aria-hidden="true" />
            ) : (
              <div className={styles.liveCardNoArt} />
            )}
            <div className={styles.liveCardShade} />
            <div className={styles.liveCardTop}>
              <span>{pick.network || pick.kind}</span>
              {pick.score && pick.score > 0 ? <small>{pick.score.toFixed(1)}</small> : null}
            </div>
            <div className={styles.liveCardBottom}>
              <h4>{pick.title}</h4>
              <span>{pick.displayContext || pick.date || "CURRENT"}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedPick && (
        <CardDetailModal
          pick={selectedPick}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}

function CardDetailModal({ pick, onClose }: { pick: Pick; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div
        className={styles.detailBackdrop}
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close details"
      />
      <div
        className={styles.detailModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`card-detail-title-${pick.kind}-${pick.id}`}
      >
        <button
          className={styles.detailClose}
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          ✕
        </button>

        {pick.image && (
          <div className={styles.detailBackdropImage}>
            <img src={pick.image} alt="" aria-hidden="true" />
            <div className={styles.detailImageShade} />
          </div>
        )}

        <div className={styles.detailContent}>
          <div className={styles.detailMeta}>
            <span className={styles.detailKind}>{pick.kind}</span>
            {pick.network && <span className={styles.detailNetwork}>{pick.network}</span>}
          </div>

          <h2
            className={styles.detailTitle}
            id={`card-detail-title-${pick.kind}-${pick.id}`}
          >
            {pick.title}
          </h2>

          <div className={styles.detailStats}>
            {pick.voteAverage && pick.voteAverage > 0 && (
              <span className={styles.detailRating}>
                Rating: {pick.voteAverage.toFixed(1)} / 10
              </span>
            )}
            {pick.date && <span className={styles.detailDate}>{pick.date}</span>}
            {pick.displayContext && !pick.date && (
              <span className={styles.detailContext}>{pick.displayContext}</span>
            )}
          </div>

          {pick.overview && (
            <p className={styles.detailOverview}>{pick.overview}</p>
          )}
        </div>
      </div>
    </>
  );
}
