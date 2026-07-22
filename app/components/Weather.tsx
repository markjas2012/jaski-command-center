"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  description: string;
  city: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWeather() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          throw new Error("Weather API key is missing.");
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=St%20Louis,US&units=imperial&appid=${apiKey}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Weather request failed.");
        }

        if (!data.main || !data.weather?.[0]) {
          throw new Error("Weather data was incomplete.");
        }

             setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
        description: data.weather[0].main,
        city: data.name,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Weather request failed."
      );
    }
  }

  loadWeather();
}, []);
 
  if (error) {
  return (
    <div className="space-y-1">
      <p className="text-sm">Weather unavailable</p>
      <p className="jaski-muted text-xs">{error}</p>
    </div>
  );
}

if (!weather) {
  return <p className="jaski-muted text-sm">Loading weather...</p>;
}

return (
  <div className="space-y-4">
    <div>
      <div className="text-5xl font-bold">{weather.temp}°</div>
      <p className="jaski-muted mt-1">{weather.description}</p>
    </div>

    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="jaski-muted">Feels like</p>
        <p className="font-semibold">{weather.feelsLike}°</p>
      </div>

      <div>
        <p className="jaski-muted">Humidity</p>
        <p className="font-semibold">{weather.humidity}%</p>
      </div>

      <div>
        <p className="jaski-muted">Wind</p>
        <p className="font-semibold">{weather.wind} mph</p>
      </div>

      <div>
        <p className="jaski-muted">Location</p>
        <p className="font-semibold">{weather.city}</p>
      </div>
    </div>
  </div>
);
}