"use client";

import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  icon: string;
  section?: string;
  active?: boolean;
};

type Project = {
  name: string;
  description: string;
  status: "Active" | "On Hold";
  progress: number;
};

const navigation: NavItem[] = [
  { label: "Dashboard", icon: "⌂", active: true },
  { label: "Swan Industries", icon: "▣", section: "WORK" },
  { label: "Sales Atlas", icon: "↗" },
  { label: "Albatross", icon: "◉", section: "PERSONAL" },
  { label: "Entertainment", icon: "▶" },
  { label: "Family Room", icon: "⌘" },
  { label: "Settings", icon: "⚙", section: "SYSTEM" },
];

const projects: Project[] = [
  {
    name: "Jaski Command Center",
    description: "Building the new dashboard foundation",
    status: "Active",
    progress: 32,
  },
  {
    name: "Project Albatross",
    description: "Golf app product and design system",
    status: "On Hold",
    progress: 68,
  },
  {
    name: "Midwest Sales Atlas",
    description: "Prospect research and sales routing",
    status: "On Hold",
    progress: 24,
  },
  {
    name: "Swan QMS",
    description: "Quality-system forms and automation",
    status: "On Hold",
    progress: 71,
  },
];

const briefItems = [
  {
    icon: "⛳",
    title: "PGA Golf",
    detail: "Leaderboard, schedules and tournament updates",
  },
  {
    icon: "🏆",
    title: "Major Sports",
    detail: "Scores and important events",
  },
  {
    icon: "🎬",
    title: "Movies & TV",
    detail: "Releases, trailers and watchlist updates",
  },
  {
    icon: "🎮",
    title: "Video Games",
    detail: "New releases and gaming news",
  },
  {
    icon: "♫",
    title: "Jam Band Music",
    detail: "Tour dates, live shows and music updates",
  },
];

function Card({
  title,
  eyebrow,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/20 hover:bg-white/[0.06] ${className}`}
    >
      {eyebrow && (
        <p className="mb-2 text-[10px] font-semibold tracking-[0.22em] text-amber-200/65">
          {eyebrow}
        </p>
      )}
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());

    updateClock();
    const timer = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const hour = now?.getHours() ?? 12;

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const dateText = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(now)
    : "Loading date";

  const timeText = now
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)
    : "--:--:--";

  return (
    <main className="min-h-screen bg-[#08090b] text-zinc-100">
      <div className="fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-48 -top-52 h-[520px] w-[520px] rounded-full bg-amber-500/[0.07] blur-[130px]" />
        <div className="absolute -right-52 top-1/3 h-[520px] w-[520px] rounded-full bg-slate-400/[0.05] blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/45 p-5 backdrop-blur-2xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-200/20 bg-gradient-to-br from-amber-200 to-amber-600 font-black text-black shadow-lg shadow-amber-500/10">
              J
            </div>

            <div>
              <p className="font-bold tracking-[0.18em] text-white">JASKI</p>
              <p className="text-[10px] tracking-[0.16em] text-zinc-500">
                COMMAND CENTER
              </p>
            </div>
          </div>

          <nav className="mt-6 flex-1">
            {navigation.map((item, index) => (
              <div key={item.label}>
                {item.section && (
                  <p
                    className={`mb-2 text-[9px] font-semibold tracking-[0.24em] text-zinc-600 ${
                      index === 0 ? "" : "mt-7"
                    }`}
                  >
                    {item.section}
                  </p>
                )}

                <button
                  type="button"
                  className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    item.active
                      ? "border border-amber-200/15 bg-amber-200/[0.09] text-amber-100 shadow-inner shadow-amber-200/[0.03]"
                      : "border border-transparent text-zinc-400 hover:border-white/5 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </div>
            ))}
          </nav>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">Local system</p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Development mode
                </p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.6)]" />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <header className="border-b border-white/10 bg-black/15 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
              <div className="lg:hidden">
                <p className="font-bold tracking-[0.18em] text-white">JASKI</p>
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-zinc-500 md:flex md:w-80">
                <span>⌕</span>
                <span>Search your command center...</span>
              </div>

              <div className="ml-auto text-right">
                <p className="font-mono text-sm font-medium text-white">
                  {timeText}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Local time
                </p>
              </div>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.045] text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Open settings"
              >
                ⚙
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 md:p-8">
            {/* Greeting */}
            <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/60">
                  Mission Control
                </p>

                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  {greeting}, Mark.
                </h1>

                <p className="mt-3 text-sm text-zinc-500">{dateText}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Open quick notes
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-amber-200/25 bg-gradient-to-r from-amber-200 to-amber-500 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/10 transition hover:brightness-110"
                >
                  Continue Jaski
                </button>
              </div>
            </section>

            {/* Metric row */}
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card title="Jaski Command Center" eyebrow="TODAY'S FOCUS">
                <p className="text-3xl font-semibold tracking-tight text-white">
                  Active
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Premium dashboard redesign
                </p>
              </Card>

              <Card title="Projects" eyebrow="OPEN WORK">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold text-white">4</p>
                  <p className="text-xs text-amber-200/70">1 active</p>
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  Jaski, Albatross, Sales Atlas, QMS
                </p>
              </Card>

              <Card title="Weather" eyebrow="ST. LOUIS">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold text-white">—°</p>
                  <span className="text-2xl">◌</span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  Live weather connection pending
                </p>
              </Card>

              <Card title="Office Launch" eyebrow="READY">
                <p className="text-3xl font-semibold text-white">NFC</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Ready when your tags arrive
                </p>
              </Card>
            </section>

            {/* Main dashboard */}
            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
              <div className="space-y-6">
                <Card title="Your Daily Brief" eyebrow="PERSONAL FEED">
                  <div className="space-y-2">
                    {briefItems.map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        className="group flex w-full items-center gap-4 rounded-xl border border-white/[0.07] bg-black/15 p-3.5 text-left transition hover:border-amber-200/15 hover:bg-white/[0.045]"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
                          {item.icon}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-white">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-zinc-500">
                            {item.detail}
                          </span>
                        </span>

                        <span className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-amber-200">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card title="Projects" eyebrow="WORKSPACES">
                  <div className="grid gap-3 md:grid-cols-2">
                    {projects.map((project) => (
                      <button
                        key={project.name}
                        type="button"
                        className="rounded-xl border border-white/[0.07] bg-black/15 p-4 text-left transition hover:border-amber-200/15 hover:bg-white/[0.045]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {project.name}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                              {project.description}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                              project.status === "Active"
                                ? "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-300"
                                : "border-zinc-500/20 bg-zinc-500/[0.08] text-zinc-500"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card title="Today" eyebrow="ACTION CENTER">
                  <div className="space-y-2">
                    {[
                      ["Check mail", "Open your inbox"],
                      ["Review calendar", "See today's schedule"],
                      ["Continue homepage", "Resume active development"],
                      ["Capture an idea", "Open quick notes"],
                    ].map(([title, subtitle]) => (
                      <button
                        key={title}
                        type="button"
                        className="group flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3 text-left transition hover:border-amber-200/15 hover:bg-white/[0.045]"
                      >
                        <span>
                          <span className="block text-sm text-white">{title}</span>
                          <span className="mt-0.5 block text-xs text-zinc-500">
                            {subtitle}
                          </span>
                        </span>
                        <span className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-amber-200">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card title="Quick Launch" eyebrow="ESSENTIALS">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["✉", "Yahoo Mail"],
                      ["▦", "Calendar"],
                      ["⌕", "Google"],
                      ["▶", "YouTube"],
                      ["◫", "GitHub"],
                      ["✎", "Notes"],
                    ].map(([icon, label]) => (
                      <button
                        key={label}
                        type="button"
                        className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-left transition hover:border-amber-200/15 hover:bg-white/[0.045]"
                      >
                        <span className="text-base">{icon}</span>
                        <span className="mt-2 block text-xs font-medium text-zinc-300">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card title="Quick Notes" eyebrow="CAPTURE">
                  <textarea
                    className="min-h-28 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 p-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-200/25"
                    placeholder="Type a note..."
                  />
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.045] py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Save note
                  </button>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}