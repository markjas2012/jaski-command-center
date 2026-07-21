export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 bg-black border-r border-zinc-800 p-6">
          <h1 className="text-2xl font-bold mb-8">
            JASKI
          </h1>

          <nav className="space-y-4 text-zinc-300">
            <div className="hover:text-white cursor-pointer">🏠 Dashboard</div>
            <div className="hover:text-white cursor-pointer">🏢 Swan Industries</div>
            <div className="hover:text-white cursor-pointer">⛳ Albatross</div>
            <div className="hover:text-white cursor-pointer">📈 Sales Atlas</div>
            <div className="hover:text-white cursor-pointer">🎬 Entertainment</div>
            <div className="hover:text-white cursor-pointer">👨‍👩‍👧 Family</div>
            <div className="hover:text-white cursor-pointer">⚙ Settings</div>
          </nav>
        </aside>

        {/* Main */}
        <section className="flex-1 p-10">

          <h1 className="text-5xl font-bold">
            Welcome, Mark
          </h1>

          <p className="text-zinc-400 mt-2">
            Jaski Command Center
          </p>

          <div className="grid grid-cols-2 gap-6 mt-10">

            <div className="rounded-xl bg-zinc-900 p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold">
                Today's Brief
              </h2>

              <p className="text-zinc-400 mt-3">
                Good morning.
              </p>

              <p className="text-zinc-400">
                This section will summarize your day.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-900 p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold">
                Weather
              </h2>

              <p className="text-zinc-400 mt-3">
                Weather widget coming soon.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-900 p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold">
                Projects
              </h2>

              <ul className="mt-3 space-y-2 text-zinc-400">
                <li>• Swan Industries</li>
                <li>• Albatross</li>
                <li>• Sales Atlas</li>
              </ul>
            </div>

            <div className="rounded-xl bg-zinc-900 p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold">
                Quick Launch
              </h2>

              <ul className="mt-3 space-y-2 text-zinc-400">
                <li>GitHub</li>
                <li>Calendar</li>
                <li>Email</li>
                <li>Notes</li>
              </ul>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}