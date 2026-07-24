"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WeatherPayload = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    is_day: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
};

type WeatherState = {
  temperature: number;
  apparentTemperature: number;
  high: number;
  low: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  wind: number;
  rainChance: number;
  sunrise: string;
  sunset: string;
  uv: number;
  updatedAt: Date;
};

type Favorite = {
  label: string;
  detail: string;
  href: string;
  mark: string;
};

type Reflection = {
  source: string;
  quote: string;
  linkLabel: string;
  href: string;
};

type DeadShow = {
  date: string;
  year: number;
  venue: string;
  city: string;
  highlights: string[];
  note: string;
  archiveHref: string;
  setlistHref: string;
};

const ST_LOUIS_WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=38.6270&longitude=-90.1994&current=temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago&forecast_days=1";

const defaultFavorites: Favorite[] = [
  { label: "DarkUFO", detail: "LOST news & archives", href: "https://www.darkufo.blogspot.com/", mark: "D" },
  { label: "Masters", detail: "Tournament home", href: "https://www.masters.com/", mark: "M" },
  { label: "YouTube TV", detail: "Live television", href: "https://tv.youtube.com/", mark: "Y" },
  { label: "Plex", detail: "Personal media", href: "https://app.plex.tv/", mark: "P" },
  { label: "Nugs", detail: "Live music", href: "https://www.nugs.net/", mark: "N" },
  { label: "Kindle", detail: "Your library", href: "https://read.amazon.com/", mark: "K" },
  { label: "PGA Tour", detail: "Leaderboard", href: "https://www.pgatour.com/leaderboard", mark: "G" },
  { label: "Radar", detail: "Storm tracking", href: "https://radar.weather.gov/", mark: "R" },
];

const reflections: Reflection[] = [
  {
    source: "Marcus Aurelius",
    quote: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    linkLabel: "Read Meditations",
    href: "https://www.gutenberg.org/ebooks/2680",
  },
  {
    source: "Marcus Aurelius",
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    linkLabel: "Read Meditations",
    href: "https://www.gutenberg.org/ebooks/2680",
  },
  {
    source: "Epictetus",
    quote: "It is not things themselves that trouble us, but our judgments about them.",
    linkLabel: "Explore Stoicism",
    href: "https://www.gutenberg.org/ebooks/45109",
  },
  {
    source: "Seneca",
    quote: "It is not that we have a short time to live, but that we waste much of it.",
    linkLabel: "Read Seneca",
    href: "https://www.gutenberg.org/ebooks/41476",
  },
];

const deadHistory: Record<string, DeadShow> = {
  "07-24": {
    date: "July 24",
    year: 1987,
    venue: "Oakland-Alameda County Coliseum Stadium",
    city: "Oakland, California",
    highlights: ["Jack Straw → Mississippi Half-Step", "Scarlet Begonias", "Playing in the Band"],
    note: "A Dylan & the Dead night later released as View from the Vault, Volume Four.",
    archiveHref: "https://archive.org/search?query=gd1987-07-24",
    setlistHref: "https://jerrybase.com/events/19870724-01",
  },
};

function buildDeadHistory(now: Date | null): DeadShow {
  const current = now ?? new Date();
  const key = `${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
  const known = deadHistory[key];
  if (known) return known;

  const dateLabel = current.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const archiveQuery = encodeURIComponent(`collection:GratefulDead ${dateLabel}`);
  return {
    date: dateLabel,
    year: 0,
    venue: "The Grateful Dead Archive",
    city: "Shows performed on this date",
    highlights: ["Explore recordings", "Compare eras", "Choose today’s listen"],
    note: "Open the archive and find a Grateful Dead performance connected to today’s date.",
    archiveHref: `https://archive.org/search?query=${archiveQuery}`,
    setlistHref: "https://jerrybase.com/",
  };
}

function describeWeather(code: number) {
  if (code === 0) return "Clear skies";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Current conditions";
}

function roundTemperature(value: number) {
  return Math.round(value);
}

function formatClockTime(value: string) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const storm = [95, 96, 99].includes(code);
  const wet = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
  const snow = [71, 73, 75, 77, 85, 86].includes(code);
  const cloudy = [2, 3, 45, 48].includes(code);

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      {!storm && !wet && !snow && !cloudy && isDay && (
        <>
          <circle cx="32" cy="32" r="11" fill="currentColor" />
          <path d="M32 6v9M32 49v9M6 32h9M49 32h9M13.5 13.5l6.3 6.3M44.2 44.2l6.3 6.3M50.5 13.5l-6.3 6.3M19.8 44.2l-6.3 6.3" />
        </>
      )}
      {!storm && !wet && !snow && !cloudy && !isDay && (
        <path d="M43 43A22 22 0 0 1 23 11a22 22 0 1 0 20 32Z" fill="currentColor" />
      )}
      {(cloudy || wet || storm || snow) && (
        <>
          {isDay && (
            <>
              <circle cx="23" cy="22" r="8" fill="currentColor" opacity="0.95" />
              <path d="M23 7v6M8 22h6M12.5 11.5l4.2 4.2M33.5 11.5l-4.2 4.2" />
            </>
          )}
          <path d="M18 43h29a9 9 0 0 0 .9-17.95A14 14 0 0 0 22 28.5 8 8 0 0 0 18 43Z" fill="currentColor" />
        </>
      )}
      {wet && <path d="M24 49l-3 7M35 49l-3 7M46 49l-3 7" />}
      {storm && <path d="m35 45-7 10h6l-3 7 10-12h-6l4-5Z" fill="currentColor" />}
      {snow && <path d="M22 51h.01M33 55h.01M45 50h.01" strokeWidth="5" />}
    </svg>
  );
}

export default function LiveDashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>(defaultFavorites);
  const [editingFavorites, setEditingFavorites] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("jaski-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved) as Favorite[]);
      } catch {
        setFavorites(defaultFavorites);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("jaski-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        setWeatherError(false);
        const response = await fetch(ST_LOUIS_WEATHER_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);

        const data = (await response.json()) as WeatherPayload;

        setWeather({
          temperature: roundTemperature(data.current.temperature_2m),
          apparentTemperature: roundTemperature(data.current.apparent_temperature),
          high: roundTemperature(data.daily.temperature_2m_max[0]),
          low: roundTemperature(data.daily.temperature_2m_min[0]),
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
          humidity: Math.round(data.current.relative_humidity_2m),
          wind: Math.round(data.current.wind_speed_10m),
          rainChance: Math.round(data.daily.precipitation_probability_max[0]),
          sunrise: data.daily.sunrise[0],
          sunset: data.daily.sunset[0],
          uv: Math.round(data.daily.uv_index_max[0]),
          updatedAt: new Date(),
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
        setWeatherError(true);
      }
    }

    loadWeather();
    const refreshTimer = window.setInterval(loadWeather, 15 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, []);

  const greeting = useMemo(() => {
    const hour = now?.getHours() ?? 12;
    const day = now?.getDay();

    if (weather?.rainChance && weather.rainChance >= 65) return "Rain may be part of the plan";
    if (weather && weather.temperature >= 58 && weather.temperature <= 78 && weather.wind <= 14) {
      return day === 6 || day === 0 ? "Beautiful day to get outside" : "Great weather ahead";
    }
    if (day === 5 && hour >= 12) return "Happy Friday";
    if (day === 6 || day === 0) return "Enjoy your weekend";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, [now, weather]);

  const fullDate = now?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekday = now?.toLocaleDateString("en-US", { weekday: "long" });
  const shortDate = now?.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const time = now?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  const dayIndex = now
    ? Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000)
    : 0;

  const reflection = reflections[Math.abs(dayIndex) % reflections.length];
  const deadShow = buildDeadHistory(now);

  const temperature = weather ? `${weather.temperature}°` : "—";
  const condition = weatherError
    ? "Weather temporarily unavailable"
    : weather
      ? describeWeather(weather.weatherCode)
      : "Loading St. Louis weather…";

  const minuteAge = weather
    ? Math.max(0, Math.floor((Date.now() - weather.updatedAt.getTime()) / 60000))
    : 0;

  function moveFavorite(index: number, direction: -1 | 1) {
    setFavorites((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function resetFavorites() {
    setFavorites(defaultFavorites);
  }

  const hour = now?.getHours() ?? 12;
  const dayPart = hour < 11 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";

  return (
    <div className={`dashboard dashboard-${dayPart} ${weather?.isDay === false ? "dashboard-night" : ""}`}>
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Personal dashboard</p>
          <h1>{greeting}, Mark</h1>
          <p className="dashboard-date">{fullDate ?? "Loading today…"}</p>
        </div>

        <div className="dashboard-status">
          <strong>{temperature}</strong>
          <span>{time ?? "Loading time…"}</span>
          <small>{weather ? `${condition} · updated ${minuteAge} min ago` : condition}</small>
        </div>
      </header>

      <div className="dashboard-divider" />

      <section className="dashboard-layout" aria-label="Dashboard overview">
        <article className="weather-hero">
          <div className="weather-hero-top">
            <div>
              <p className="card-kicker">Live weather</p>
              <h2>{temperature}</h2>
              <p className="weather-condition">{condition}</p>
            </div>

            <div className="weather-icon-wrap">
              <WeatherIcon code={weather?.weatherCode ?? 2} isDay={weather?.isDay ?? true} />
            </div>
          </div>

          <div className="weather-details">
            <div><span>High</span><strong>{weather ? `${weather.high}°` : "—"}</strong></div>
            <div><span>Low</span><strong>{weather ? `${weather.low}°` : "—"}</strong></div>
            <div><span>Feels like</span><strong>{weather ? `${weather.apparentTemperature}°` : "—"}</strong></div>
          </div>

          <div className="weather-extra-grid">
            <div><span>Rain</span><strong>{weather ? `${weather.rainChance}%` : "—"}</strong></div>
            <div><span>Humidity</span><strong>{weather ? `${weather.humidity}%` : "—"}</strong></div>
            <div><span>Wind</span><strong>{weather ? `${weather.wind} mph` : "—"}</strong></div>
            <div><span>UV</span><strong>{weather ? weather.uv : "—"}</strong></div>
            <div><span>Sunrise</span><strong>{weather ? formatClockTime(weather.sunrise) : "—"}</strong></div>
            <div><span>Sunset</span><strong>{weather ? formatClockTime(weather.sunset) : "—"}</strong></div>
          </div>

          <div className="weather-hero-footer">
            <div>
              <strong>St. Louis, Missouri</strong>
              <span>Updates every 15 minutes</span>
            </div>

            <a href="https://radar.weather.gov/" target="_blank" rel="noreferrer">
              Open radar <span aria-hidden="true">↗</span>
            </a>
          </div>

          <a className="weather-attribution" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Weather data by Open-Meteo
          </a>
        </article>

        <div className="detail-card-grid">
          <article className="detail-card detail-card-live">
            <div className="detail-card-body">
              <p className="card-kicker">Calendar</p>
              <h2>{weekday ?? "Today"}</h2>
              <p className="detail-card-copy">{shortDate ?? "Today"} · Your personal calendars</p>
              <div className="card-actions">
                <a href="https://www.icloud.com/calendar/" target="_blank" rel="noreferrer">iCloud ↗</a>
                <a href="https://outlook.live.com/calendar/" target="_blank" rel="noreferrer">Outlook ↗</a>
              </div>
            </div>
          </article>

          <article className="detail-card detail-card-live">
            <div className="detail-card-body">
              <p className="card-kicker">Golf</p>
              <h2>Live PGA</h2>
              <p className="detail-card-copy">Current leaderboard, tee times, and season standings.</p>
              <div className="card-actions">
                <a href="https://www.pgatour.com/leaderboard" target="_blank" rel="noreferrer">Leaderboard ↗</a>
                <a href="https://www.pgatour.com/tournaments/schedule" target="_blank" rel="noreferrer">Schedule ↗</a>
                <a href="https://www.ghin.com/" target="_blank" rel="noreferrer">GHIN ↗</a>
              </div>
            </div>
          </article>

          <article className="detail-card detail-card-live">
            <div className="detail-card-body">
              <p className="card-kicker">What’s new</p>
              <h2>Watch & Listen</h2>
              <p className="detail-card-copy">Fresh destinations for movies, television, games, and live music.</p>
              <div className="card-actions">
                <a href="https://www.justwatch.com/" target="_blank" rel="noreferrer">New Releases ↗</a>
                <a href="https://www.nugs.net/" target="_blank" rel="noreferrer">Nugs ↗</a>
                <a href="https://www.ign.com/upcoming/games" target="_blank" rel="noreferrer">Games ↗</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="favorites-section" aria-labelledby="favorites-title">
        <div className="favorites-heading">
          <div>
            <p className="dashboard-eyebrow">One-click access</p>
            <h2 id="favorites-title">Favorites</h2>
          </div>

          <div className="favorites-tools">
            <button type="button" onClick={() => setEditingFavorites((value) => !value)}>
              {editingFavorites ? "Done" : "Edit Favorites"}
            </button>
            {editingFavorites && (
              <button type="button" onClick={resetFavorites}>
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="favorites-grid">
          {favorites.map((favorite, index) => (
            <div className="favorite-wrap" key={favorite.label}>
              <a className="favorite-tile" href={favorite.href} target="_blank" rel="noreferrer">
                <span className="favorite-mark" aria-hidden="true">{favorite.mark}</span>
                <span className="favorite-copy">
                  <strong>{favorite.label}</strong>
                  <span>{favorite.detail}</span>
                </span>
                <span className="favorite-arrow" aria-hidden="true">↗</span>
              </a>

              {editingFavorites && (
                <div className="favorite-controls">
                  <button type="button" onClick={() => moveFavorite(index, -1)} aria-label={`Move ${favorite.label} left`}>←</button>
                  <button type="button" onClick={() => moveFavorite(index, 1)} aria-label={`Move ${favorite.label} right`}>→</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="smile-section exploration-section" aria-labelledby="smile-title">
        <div className="smile-heading">
          <div>
            <p className="dashboard-eyebrow">Your daily ritual</p>
            <h2 id="smile-title">Things Worth Exploring Today</h2>
          </div>
          <p>Wisdom, faith, and one trip into Grateful Dead history.</p>
        </div>

        <div className="exploration-grid">
          <article className="reflection-card sprint9-card fade-in-card">
            <div className="smile-card-top">
              <span className="smile-mark">“</span>
              <p className="card-kicker">Today’s reflection</p>
            </div>

            <blockquote>{reflection.quote}</blockquote>

            <div className="smile-card-footer">
              <span>— {reflection.source}</span>
              <a href={reflection.href} target="_blank" rel="noreferrer">
                {reflection.linkLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>

          <article className="reading-card sprint9-card fade-in-card">
            <div className="reading-icon" aria-hidden="true">✝</div>
            <div>
              <p className="card-kicker">Today’s Catholic reading</p>
              <h3>Daily Mass Readings</h3>
              <p>Begin the day with today’s Scripture readings and Gospel.</p>
            </div>
            <a href="https://bible.usccb.org/readings/calendar" target="_blank" rel="noreferrer">
              Open today’s readings <span aria-hidden="true">↗</span>
            </a>
          </article>

          <article className="dead-history-card sprint9-card fade-in-card">
            <Link className="dead-room-link" href="/jam" aria-label="Open the Jam Room">
              Enter the Jam Room <span aria-hidden="true">→</span>
            </Link>
            <div className="dead-card-header">
              <span className="dead-badge">ON THIS DAY</span>
              <span className="dead-rose" aria-hidden="true">🌹</span>
            </div>

            <div>
              <p className="card-kicker">Today in Grateful Dead History</p>
              <h3>{deadShow.date}{deadShow.year ? `, ${deadShow.year}` : ""}</h3>
              <p className="dead-venue">{deadShow.venue}</p>
              <p className="dead-city">{deadShow.city}</p>
            </div>

            <ul className="dead-highlights">
              {deadShow.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>

            <p className="dead-note">{deadShow.note}</p>

            <div className="dead-actions">
              <a href={deadShow.archiveHref} target="_blank" rel="noreferrer">Listen on Archive ↗</a>
              <a href={deadShow.setlistHref} target="_blank" rel="noreferrer">View setlist ↗</a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
