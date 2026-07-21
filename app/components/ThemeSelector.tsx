"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";

const themes: { value: ThemeName; label: string }[] = [
  { value: "mission", label: "Mission" },
  { value: "executive", label: "Executive" },
  { value: "augusta", label: "Augusta" },
  { value: "midnight", label: "Midnight" },
  { value: "apple", label: "Apple" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(event) => setTheme(event.target.value as ThemeName)}
      aria-label="Select theme"
      className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none"
    >
      {themes.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}