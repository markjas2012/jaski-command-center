"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./MyTeams.module.css";

type ApiTeam = {
  key: "cardinals" | "blues" | "city" | "mizzou";
  name: string;
  shortName: string;
  record?: string;
  state: "pre" | "in" | "post" | "unknown";
  label: "LIVE NOW" | "TODAY" | "FINAL" | "NEXT UP" | "NO GAME";
  opponent?: string;
  opponentAbbr?: string;
  homeAway?: "home" | "away";
  startTime?: string;
  status?: string;
  network?: string;
  score?: string;
  latestResult?: string;
  eventUrl?: string;
  source: "espn";
  fetchedAt: string;
};

type ApiPayload = {
  teams: ApiTeam[];
  generatedAt?: string;
};

type TeamCard = {
  key: ApiTeam["key"];
  team: string;
  league: string;
  mark: string;
  logo?: string;
  state: "LIVE" | "TODAY" | "FINAL" | "NEXT" | "OFF";
  headline: string;
  detail: string;
  href: string;
  record?: string;
  recent?: string;
};

const CENTRAL_TZ = "America/Chicago";

const identity: Record<ApiTeam["key"], { league: string; mark: string; href: string; logo: string }> = {
  cardinals: {
    league: "MLB",
    mark: "STL",
    logo: "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png",
    href: "https://www.espn.com/mlb/team/_/name/stl/st-louis-cardinals",
  },
  blues: {
    league: "NHL",
    mark: "STL",
    logo: "https://a.espncdn.com/i/teamlogos/nhl/500/stl.png",
    href: "https://www.espn.com/nhl/team/_/name/stl/st-louis-blues",
  },
  city: {
    league: "MLS",
    mark: "CITY",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/21812.png",
    href: "https://www.espn.com/soccer/club/_/id/21812/st-louis-city-sc",
  },
  mizzou: {
    league: "NCAA",
    mark: "M",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/142.png",
    href: "https://www.espn.com/college-football/team/_/id/142/missouri-tigers",
  },
};

const fallback: TeamCard[] = [
  { key: "cardinals", team: "Cardinals", league: "MLB", mark: "STL", state: "OFF", headline: "Cardinals", detail: "Schedule data unavailable right now.", href: identity.cardinals.href },
  { key: "blues", team: "Blues", league: "NHL", mark: "STL", state: "OFF", headline: "Blues", detail: "Schedule data unavailable right now.", href: identity.blues.href },
  { key: "city", team: "CITY SC", league: "MLS", mark: "CITY", state: "OFF", headline: "CITY SC", detail: "Schedule data unavailable right now.", href: identity.city.href },
  { key: "mizzou", team: "Mizzou", league: "NCAA", mark: "M", state: "OFF", headline: "Mizzou", detail: "Schedule data unavailable right now.", href: identity.mizzou.href },
];

function formatWhen(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function matchup(team: ApiTeam) {
  if (!team.opponentAbbr) return team.shortName;

  const mine = team.key === "mizzou" ? "MIZ" : team.key === "city" ? "STL" : "STL";
  return team.homeAway === "away"
    ? `${mine} @ ${team.opponentAbbr}`
    : `${team.opponentAbbr} @ ${mine}`;
}

function detailFor(team: ApiTeam) {
  const pieces: string[] = [];
  const when = formatWhen(team.startTime);

  if (team.label === "LIVE NOW" || team.label === "FINAL") {
    if (team.score) pieces.push(team.score);
    if (team.status) pieces.push(team.status);
  } else if (when) {
    pieces.push(when);
  }

  if (team.network) pieces.push(team.network);

  return pieces.join(" · ") || "Open for schedule details.";
}

function toCard(team: ApiTeam): TeamCard {
  const meta = identity[team.key];
  const state: TeamCard["state"] =
    team.label === "LIVE NOW" ? "LIVE" :
    team.label === "TODAY" ? "TODAY" :
    team.label === "FINAL" ? "FINAL" :
    team.label === "NEXT UP" ? "NEXT" : "OFF";

  return {
    key: team.key,
    team: team.shortName,
    league: meta.league,
    mark: meta.mark,
    logo: meta.logo,
    state,
    headline: team.label === "NO GAME" ? team.shortName : matchup(team),
    detail: team.label === "NO GAME" ? "No scheduled game found in the current feed." : detailFor(team),
    href: team.eventUrl || meta.href,
    record: team.record,
    recent: team.latestResult,
  };
}

function stateLabel(state: TeamCard["state"]) {
  if (state === "LIVE") return "LIVE NOW";
  if (state === "TODAY") return "TODAY";
  if (state === "FINAL") return "FINAL";
  if (state === "NEXT") return "NEXT UP";
  return "TEAM";
}

export default function MyTeams() {
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/sports/stl?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json: ApiPayload) => {
        setPayload(json);
        setFailed(false);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      });

    return () => controller.abort();
  }, []);

  const teams = useMemo(() => {
    if (!payload?.teams?.length) return fallback;
    const cards = payload.teams.map(toCard);
    const order: ApiTeam["key"][] = ["cardinals", "blues", "city", "mizzou"];
    return cards.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  }, [payload]);

  const updated = payload?.generatedAt
    ? formatWhen(payload.generatedAt)
    : payload?.teams?.[0]?.fetchedAt
      ? formatWhen(payload.teams[0].fetchedAt)
      : "";

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div>
          <p>MY TEAMS</p>
          <h2>St. Louis first.</h2>
          <small>Next game, record, and the latest result when the feed has it.</small>
        </div>
        <span>{updated ? `Updated ${updated}` : failed ? "Live feed temporarily unavailable" : "Cardinals · Blues · CITY SC · Mizzou"}</span>
      </div>

      <div className={styles.grid}>
        {teams.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
          >
            <div className={styles.identity}>
              <span className={styles.mark}>
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt=""
                    aria-hidden="true"
                    style={{ width: "38px", height: "38px", objectFit: "contain", display: "block" }}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = "inline";
                    }}
                  />
                ) : null}
                <span style={{ display: item.logo ? "none" : "inline" }}>{item.mark}</span>
              </span>
              <div>
                <small>{item.league}</small>
                <strong>{item.team}</strong>
              </div>
            </div>

            <div className={styles.game}>
              <span className={item.state === "LIVE" ? styles.live : styles.state}>
                {stateLabel(item.state)}
              </span>
              <h3>{item.headline}</h3>
              <p>{item.detail}</p>

              {(item.record || item.recent) ? (
                <div className={styles.meta}>
                  {item.record ? (
                    <span>
                      <small>RECORD</small>
                      <b>{item.record}</b>
                    </span>
                  ) : null}
                  {item.recent ? (
                    <span>
                      <small>LAST</small>
                      <b>{item.recent}</b>
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <b className={styles.open}>Open ↗</b>
          </a>
        ))}
      </div>
    </section>
  );
}
