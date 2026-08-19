export type TeamKey = 'cardinals' | 'blues' | 'city' | 'mizzou';

export type TeamCardData = {
  key: TeamKey;
  name: string;
  shortName: string;
  record?: string;
  state: 'pre' | 'in' | 'post' | 'unknown';
  label: 'LIVE NOW' | 'TODAY' | 'FINAL' | 'NEXT UP' | 'NO GAME';
  opponent?: string;
  opponentAbbr?: string;
  homeAway?: 'home' | 'away';
  startTime?: string;
  status?: string;
  network?: string;
  score?: string;
  latestResult?: string;
  latestResultAt?: string;
  latestTeamScore?: string;
  latestOpponentScore?: string;
  latestOpponentAbbr?: string;
  eventUrl?: string;
  source: 'espn';
  fetchedAt: string;
};

type TeamConfig = {
  key: TeamKey;
  name: string;
  shortName: string;
  sport: string;
  league: string;
  espnTeamId: string;
};

const TEAMS: TeamConfig[] = [
  { key: 'cardinals', name: 'St. Louis Cardinals', shortName: 'Cardinals', sport: 'baseball', league: 'mlb', espnTeamId: '24' },
  { key: 'blues', name: 'St. Louis Blues', shortName: 'Blues', sport: 'hockey', league: 'nhl', espnTeamId: '19' },
  { key: 'city', name: 'St. Louis CITY SC', shortName: 'CITY SC', sport: 'soccer', league: 'usa.1', espnTeamId: '21812' },
  { key: 'mizzou', name: 'Missouri Tigers', shortName: 'Mizzou', sport: 'football', league: 'college-football', espnTeamId: '142' },
];

const CENTRAL_TZ = 'America/Chicago';
const DAY_MS = 86_400_000;

function ymd(d: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CENTRAL_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '';
  return `${get('year')}${get('month')}${get('day')}`;
}

function centralDateKey(d: Date): string {
  return ymd(d);
}

function eventDate(event: any): Date | undefined {
  const raw = event?.date ?? event?.competitions?.[0]?.date;
  if (!raw) return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function stateOf(event: any): 'pre' | 'in' | 'post' | 'unknown' {
  const s = event?.status?.type?.state ?? event?.competitions?.[0]?.status?.type?.state;
  return s === 'pre' || s === 'in' || s === 'post' ? s : 'unknown';
}

function competitors(event: any) {
  return event?.competitions?.[0]?.competitors ?? [];
}

function teamId(c: any): string {
  return String(c?.team?.id ?? c?.id ?? '');
}

function teamAbbr(c: any): string | undefined {
  return c?.team?.abbreviation ?? c?.team?.shortDisplayName ?? c?.team?.displayName;
}

function score(c: any): string | undefined {
  const v = c?.score;
  return v === undefined || v === null || v === '' ? undefined : String(v);
}

function record(c: any): string | undefined {
  const r = c?.records?.find((x: any) => x?.type === 'total') ?? c?.records?.[0];
  return r?.summary;
}

function network(event: any): string | undefined {
  const broadcasts = event?.competitions?.[0]?.broadcasts ?? [];
  const names: string[] = broadcasts.flatMap((b: any) => b?.names ?? []).filter(Boolean);
  return names.length ? [...new Set(names)].join(', ') : undefined;
}

function statusText(event: any): string | undefined {
  return event?.status?.type?.shortDetail ?? event?.status?.type?.detail ??
    event?.competitions?.[0]?.status?.type?.shortDetail ?? event?.competitions?.[0]?.status?.type?.detail;
}

function eventUrl(event: any): string | undefined {
  const link = (event?.links ?? []).find((l: any) => l?.href)?.href;
  return link || undefined;
}

function describeMatch(event: any, cfg: TeamConfig) {
  const comps = competitors(event);
  const mine = comps.find((c: any) => teamId(c) === cfg.espnTeamId);
  const opp = comps.find((c: any) => teamId(c) !== cfg.espnTeamId);
  if (!mine || !opp) return {};
  const homeAway = mine?.homeAway === 'home' ? 'home' : mine?.homeAway === 'away' ? 'away' : undefined;
  return {
    opponent: opp?.team?.displayName ?? opp?.team?.shortDisplayName,
    opponentAbbr: teamAbbr(opp),
    homeAway,
    record: record(mine),
    mineScore: score(mine),
    oppScore: score(opp),
  };
}

async function fetchJson(url: string): Promise<any | undefined> {
  try {
    const r = await fetch(url, { next: { revalidate: 120 }, headers: { Accept: 'application/json' } });
    if (!r.ok) return undefined;
    return await r.json();
  } catch {
    return undefined;
  }
}

async function fetchWindow(cfg: TeamConfig, start: Date, end: Date): Promise<any[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${cfg.sport}/${cfg.league}/scoreboard?dates=${ymd(start)}-${ymd(end)}&limit=200`;
  const data = await fetchJson(url);
  const events = Array.isArray(data?.events) ? data.events : [];
  return events.filter((e: any) => competitors(e).some((c: any) => teamId(c) === cfg.espnTeamId));
}

function dedupe(events: any[]): any[] {
  const seen = new Set<string>();
  return events.filter(e => {
    const k = String(e?.id ?? `${e?.date}-${e?.name}`);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function eventsFor(cfg: TeamConfig): Promise<any[]> {
  const now = new Date();
  const pastStart = new Date(now.getTime() - 8 * DAY_MS);
  const nearEnd = new Date(now.getTime() + 45 * DAY_MS);
  let events = await fetchWindow(cfg, pastStart, nearEnd);

  // Out-of-season schedules (NHL/CFB especially) may begin farther out.
  const future = events.filter(e => (eventDate(e)?.getTime() ?? 0) >= now.getTime() - 6 * 60 * 60 * 1000);
  if (!future.length) {
    const farEnd = new Date(now.getTime() + 180 * DAY_MS);
    events = dedupe([...events, ...(await fetchWindow(cfg, now, farEnd))]);
  }
  return events.sort((a, b) => (eventDate(a)?.getTime() ?? 0) - (eventDate(b)?.getTime() ?? 0));
}

function latestCompleted(events: any[], cfg: TeamConfig, now: Date) {
  const done = events.filter(e => stateOf(e) === 'post' && (eventDate(e)?.getTime() ?? 0) <= now.getTime());
  const e = done[done.length - 1];
  if (!e) return undefined;
  const m = describeMatch(e, cfg);
  if (!m.mineScore || !m.oppScore || !m.opponentAbbr) return undefined;
  const a = Number(m.mineScore), b = Number(m.oppScore);
  const wl = Number.isFinite(a) && Number.isFinite(b) ? (a > b ? 'W' : a < b ? 'L' : 'T') : '';
  return {
    summary: `${wl ? wl + ' ' : ''}${m.mineScore}-${m.oppScore} vs ${m.opponentAbbr}`,
    at: eventDate(e)?.toISOString(),
    mineScore: m.mineScore,
    opponentScore: m.oppScore,
    opponentAbbr: m.opponentAbbr,
  };
}

function chooseEvent(events: any[], now: Date): any | undefined {
  const today = centralDateKey(now);
  const live = events.find(e => stateOf(e) === 'in');
  if (live) return live;

  // A completed game remains the featured game for its local calendar date.
  const todays = events.filter(e => eventDate(e) && centralDateKey(eventDate(e)!) === today);
  const todaysPost = todays.filter(e => stateOf(e) === 'post').at(-1);
  if (todaysPost) return todaysPost;
  const todaysPre = todays.find(e => stateOf(e) === 'pre');
  if (todaysPre) return todaysPre;

  return events.find(e => stateOf(e) === 'pre' && (eventDate(e)?.getTime() ?? 0) > now.getTime() - 60_000);
}

function toCard(cfg: TeamConfig, events: any[]): TeamCardData {
  const now = new Date();
  const selected = chooseEvent(events, now);
  const latest = latestCompleted(events, cfg, now);
  const fetchedAt = now.toISOString();

  if (!selected) {
    return {
      key: cfg.key,
      name: cfg.name,
      shortName: cfg.shortName,
      state: 'unknown',
      label: 'NO GAME',
      latestResult: latest?.summary,
      latestResultAt: latest?.at,
      latestTeamScore: latest?.mineScore,
      latestOpponentScore: latest?.opponentScore,
      latestOpponentAbbr: latest?.opponentAbbr,
      source: 'espn',
      fetchedAt,
    };
  }

  const d = eventDate(selected);
  const state = stateOf(selected);
  const m = describeMatch(selected, cfg);
  const isToday = d ? centralDateKey(d) === centralDateKey(now) : false;
  const label: TeamCardData['label'] = state === 'in' ? 'LIVE NOW' : state === 'post' && isToday ? 'FINAL' : isToday ? 'TODAY' : 'NEXT UP';
  const sc = m.mineScore !== undefined && m.oppScore !== undefined && m.opponentAbbr ? `${m.mineScore}-${m.oppScore}` : undefined;

  return {
    key: cfg.key,
    name: cfg.name,
    shortName: cfg.shortName,
    record: m.record,
    state,
    label,
    opponent: m.opponent,
    opponentAbbr: m.opponentAbbr,
    homeAway:
  m.homeAway === "home" || m.homeAway === "away"
    ? m.homeAway
    : undefined,
    startTime: d?.toISOString(),
    status: statusText(selected),
    network: network(selected),
    score: sc,
    latestResult: latest?.summary,
    latestResultAt: latest?.at,
    latestTeamScore: latest?.mineScore,
    latestOpponentScore: latest?.opponentScore,
    latestOpponentAbbr: latest?.opponentAbbr,
    eventUrl: eventUrl(selected),
    source: 'espn',
    fetchedAt,
  };
}

export async function getStLouisTeams(): Promise<TeamCardData[]> {
  const rows = await Promise.all(TEAMS.map(async cfg => toCard(cfg, await eventsFor(cfg))));
  return rows;
}
