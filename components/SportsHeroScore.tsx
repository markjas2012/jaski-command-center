"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SportsHeroScore.module.css";

type TeamKey = "cardinals" | "blues" | "city" | "mizzou";

type ApiTeam = {
  key: TeamKey;
  shortName: string;
  state: "pre" | "in" | "post" | "unknown";
  label: "LIVE NOW" | "TODAY" | "FINAL" | "NEXT UP" | "NO GAME";
  opponentAbbr?: string;
  homeAway?: "home" | "away";
  score?: string;
  status?: string;
  latestResult?: string;
  eventUrl?: string;
};

type ApiPayload = { teams?: ApiTeam[] };

const order: TeamKey[] = ["cardinals", "blues", "city", "mizzou"];

function teamLabel(key: TeamKey) {
  if (key === "cardinals") return "CARDINALS";
  if (key === "blues") return "BLUES";
  if (key === "city") return "CITY SC";
  return "MIZZOU";
}

function ourAbbr(key: TeamKey) {
  return key === "mizzou" ? "MIZ" : "STL";
}

function normalizeScore(team: ApiTeam, raw?: string) {
  if (!raw) return "";

  // Existing feed examples include strings such as:
  // "L 1-13 vs BAL", "W 2-1 vs HOU", or already formatted score text.
  const compact = raw.replace(/\s+/g, " ").trim();

  const m = compact.match(
    /^[WLT]?\s*(\d+)\s*[-–—]\s*(\d+)\s+(?:vs\.?|@)\s+([A-Z0-9.]+)$/i
  );

  if (!m) return compact;

  const ourScore = m[1];
  const oppScore = m[2];
  const opp = m[3].toUpperCase();
  const ours = ourAbbr(team.key);

  // Scoreboard order: winner/high score first.
  const a = Number(ourScore);
  const b = Number(oppScore);

  if (Number.isFinite(a) && Number.isFinite(b) && a !== b) {
    return a > b
      ? `${ours} ${ourScore} — ${opp} ${oppScore}`
      : `${opp} ${oppScore} — ${ours} ${ourScore}`;
  }

  return `${ours} ${ourScore} — ${opp} ${oppScore}`;
}

function liveMatchup(team: ApiTeam) {
  if (!team.opponentAbbr) return team.shortName || teamLabel(team.key);
  const ours = ourAbbr(team.key);
  return team.homeAway === "away"
    ? `${ours} @ ${team.opponentAbbr}`
    : `${team.opponentAbbr} @ ${ours}`;
}

export default function SportsHeroScore() {
  const [payload, setPayload] = useState<ApiPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/sports/stl?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    })
      .then((response) =>
        response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))
      )
      .then((json: ApiPayload) => setPayload(json))
      .catch((error) => {
        if (error?.name !== "AbortError") setPayload({ teams: [] });
      });

    return () => controller.abort();
  }, []);

  const featured = useMemo(() => {
    const teams = [...(payload?.teams || [])].sort(
      (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
    );

    const live = teams.find(
      (team) => team.label === "LIVE NOW" || team.state === "in"
    );

    if (live) {
      return {
        mode: "LIVE NOW",
        team: teamLabel(live.key),
        matchup: liveMatchup(live),
        result: normalizeScore(live, live.score) || live.status || "Game in progress",
        href: live.eventUrl,
        live: true,
      };
    }

    const final = teams.find(
      (team) => team.label === "FINAL" && (team.score || team.latestResult)
    );

    if (final) {
      return {
        mode: "LATEST FINAL",
        team: teamLabel(final.key),
        matchup: "",
        result: normalizeScore(final, final.score || final.latestResult) || "Final",
        href: final.eventUrl,
        live: false,
      };
    }

    const recent = teams.find((team) => Boolean(team.latestResult));

    if (recent) {
      return {
        mode: "LATEST RESULT",
        team: teamLabel(recent.key),
        matchup: "",
        result: normalizeScore(recent, recent.latestResult),
        href: recent.eventUrl,
        live: false,
      };
    }

    return null;
  }, [payload]);

  if (!featured) return null;

  const content = (
    <>
      <span className={`${styles.kicker} ${featured.live ? styles.live : ""}`}>
        {featured.mode}
      </span>
      <span className={styles.team}>{featured.team}</span>
      {featured.matchup ? <span className={styles.matchup}>{featured.matchup}</span> : null}
      <strong className={styles.result}>{featured.result}</strong>
      {featured.href ? <span className={styles.open}>OPEN ↗</span> : null}
    </>
  );

  return featured.href ? (
    <a className={styles.strip} href={featured.href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <div className={styles.strip}>{content}</div>
  );
}
