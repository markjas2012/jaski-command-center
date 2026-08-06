"use client";

import { useEffect, useMemo, useState } from "react";
import FeaturedToday from "./FeaturedToday";

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

type Reflection = {
  source: string;
  quote: string;
  linkLabel: string;
  href: string;
};

const ST_LOUIS_WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=38.6270&longitude=-90.1994&current=temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago&forecast_days=1";

const reflections: Reflection[] = [
  { source: "Marcus Aurelius", quote: "You have power over your mind — not outside events. Realize this, and you will find strength.", linkLabel: "Read Meditations", href: "https://www.gutenberg.org/ebooks/2680" },
  { source: "Marcus Aurelius", quote: "The happiness of your life depends upon the quality of your thoughts.", linkLabel: "Read Meditations", href: "https://www.gutenberg.org/ebooks/2680" },
  { source: "Epictetus", quote: "It is not things themselves that trouble us, but our judgments about them.", linkLabel: "Explore Stoicism", href: "https://www.gutenberg.org/ebooks/45109" },
  { source: "Seneca", quote: "It is not that we have a short time to live, but that we waste much of it.", linkLabel: "Read Seneca", href: "https://www.gutenberg.org/ebooks/41476" },
];

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
          <path d="M32 6v9M32 49v9M6 32h9M49 32h9M13.5 13.5l6.3 6.3M44.2 44.2l6.3 6.3M50.5 13.5l-6.3 6.3M19.8 44.2l-6.3 6.3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
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

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
    const fallback = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    if (!weather) return fallback;

    const code = weather.weatherCode;
    const storming = [95, 96, 99].includes(code);
    const raining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
    const snowing = [71, 73, 75, 77, 85, 86].includes(code);
    const pleasant =
      weather.isDay &&
      [0, 1, 2].includes(code) &&
      weather.temperature >= 58 &&
      weather.temperature <= 80 &&
      weather.apparentTemperature <= 84 &&
      weather.wind <= 16 &&
      weather.rainChance < 40;

    if (storming) return "Stormy skies in St. Louis";
    if (snowing) return "A snowy St. Louis day";
    if (raining) return hour < 12 ? "A rainy start in St. Louis" : "Rainy skies in St. Louis";
    if (weather.temperature >= 90 || weather.apparentTemperature >= 92) return "A hot day ahead";
    if (weather.temperature >= 84 || weather.apparentTemperature >= 85) return "A warm day ahead";
    if (weather.temperature <= 32) return "A cold St. Louis day";
    if (pleasant) return day === 6 || day === 0 ? "Beautiful day to get outside" : "Great weather ahead";
    if (weather.rainChance >= 70 && hour < 18) return "Keep an eye on the rain";
    if (day === 5 && hour >= 12) return "Happy Friday";
    if (day === 6 || day === 0) return "Enjoy your weekend";
    return fallback;
  }, [now, weather]);

  const fullDate = now?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekday = now?.toLocaleDateString("en-US", { weekday: "long" });
  const shortDate = now?.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const dayIndex = now
    ? Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000)
    : 0;

  const reflection = reflections[Math.abs(dayIndex) % reflections.length];

  const temperature = weather ? `${weather.temperature}°` : "—";
  const condition = weatherError
    ? "Weather temporarily unavailable"
    : weather
      ? describeWeather(weather.weatherCode)
      : "Loading St. Louis weather…";

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

        
      </header>

      <div className="dashboard-divider" />

      <section className="home-command-grid" aria-label="Today at a glance">
        <article className="weather-compact">
          <div className="weather-compact-main">
            <div className="weather-icon-wrap">
              <WeatherIcon code={weather?.weatherCode ?? 2} isDay={weather?.isDay ?? true} />
            </div>
            <div>
              <p className="card-kicker">St. Louis weather</p>
              <div className="weather-temperature-row">
                <h2>{temperature}</h2>
                <p>{condition}</p>
              </div>
            </div>
          </div>

          <div className="weather-compact-stats">
            <div><span>High / Low</span><strong>{weather ? `${weather.high}° / ${weather.low}°` : "—"}</strong></div>
            <div><span>Feels like</span><strong>{weather ? `${weather.apparentTemperature}°` : "—"}</strong></div>
            <div><span>Rain</span><strong>{weather ? `${weather.rainChance}%` : "—"}</strong></div>
            <div><span>Sun</span><strong>{weather ? `${formatClockTime(weather.sunrise)} · ${formatClockTime(weather.sunset)}` : "—"}</strong></div>
          </div>

          <a className="weather-radar-link" href="https://radar.weather.gov/" target="_blank" rel="noreferrer">
            Open radar <span aria-hidden="true">↗</span>
          </a>
        </article>

        <article className="today-calendar-card">
          <div>
            <p className="card-kicker">Today</p>
            <h2>{weekday ?? "Today"}</h2>
            <p>{shortDate ?? "Today"} · Your calendars</p>
          </div>
          <div className="calendar-actions">
            <a href="https://calendar.google.com/" target="_blank" rel="noreferrer">Google Calendar ↗</a>
            <a href="https://outlook.live.com/calendar/" target="_blank" rel="noreferrer">Outlook Calendar ↗</a>
          </div>
        </article>

        <nav className="home-utility-card" aria-label="Daily tools">
          <p className="card-kicker">Daily tools</p>
          <a href="/quick-launch"><span className="utility-mark">Q</span><span><strong>Quick Launch</strong><small>Your favorite shortcuts</small></span><b>→</b></a>
          <a href="/notes"><span className="utility-mark">N</span><span><strong>Notes</strong><small>Open your notebook</small></span><b>→</b></a>
          <a href="https://www.audible.com/library/" target="_blank" rel="noreferrer"><span className="utility-mark">A</span><span><strong>Audible</strong><small>Your audiobook library</small></span><b>↗</b></a>
          <a href="https://www.icloud.com/reminders/" target="_blank" rel="noreferrer"><span className="utility-mark">G</span><span><strong>Grocery List</strong><small>Open Apple Reminders</small></span><b>↗</b></a>
        </nav>
      </section>

      <FeaturedToday />

      <section className="ritual-compact" aria-labelledby="ritual-title">
        <div className="ritual-heading">
          <div>
            <p className="dashboard-eyebrow">Your daily ritual</p>
            <h2 id="ritual-title">A quiet start.</h2>
          </div>
          <p>Wisdom and faith for the day ahead.</p>
        </div>

        <div className="ritual-compact-grid">
          <article className="ritual-reflection">
            <div>
              <p className="card-kicker">Today’s reflection · {reflection.source}</p>
              <blockquote>{reflection.quote}</blockquote>
            </div>
            <a href={reflection.href} target="_blank" rel="noreferrer">{reflection.linkLabel} ↗</a>
          </article>

          <a className="ritual-reading" href="https://bible.usccb.org/readings/calendar" target="_blank" rel="noreferrer">
            <span className="ritual-cross" aria-hidden="true">✝</span>
            <span><small>Today’s Catholic reading</small><strong>Daily Mass Readings</strong></span>
            <b>↗</b>
          </a>
        </div>
      </section>
    </div>
  );
}
