export default function SwanPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-2">
        Swan Industries
      </h1>

      <p className="text-zinc-400 mb-10">
        Company Operations Center
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

        <button className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-left hover:bg-zinc-800 transition">
          📦
          <h2 className="mt-4 text-xl font-semibold">Orders</h2>
          <p className="text-zinc-400 mt-2">
            Quotes, sales orders and production.
          </p>
        </button>

        <button className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-left hover:bg-zinc-800 transition">
          🚚
          <h2 className="mt-4 text-xl font-semibold">Shipping</h2>
          <p className="text-zinc-400 mt-2">
            Packing slips and shipments.
          </p>
        </button>

        <button className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-left hover:bg-zinc-800 transition">
          👥
          <h2 className="mt-4 text-xl font-semibold">Customers</h2>
          <p className="text-zinc-400 mt-2">
            Customer database.
          </p>
        </button>

        <button className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-left hover:bg-zinc-800 transition">
          📄
          <h2 className="mt-4 text-xl font-semibold">Forms</h2>
          <p className="text-zinc-400 mt-2">
            Company forms and templates.
          </p>
        </button>

        <button className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-left hover:bg-zinc-800 transition">
          📈
          <h2 className="mt-4 text-xl font-semibold">Sales</h2>
          <p className="text-zinc-400 mt-2">
            Sales Atlas and opportunities.
          </p>
        </button>

        <button className="rounded-xl bg-zinc-900 border border-yellow-700 p-8 text-left">
          ⏸️
          <h2 className="mt-4 text-xl font-semibold">
            Quality (On Hold)
          </h2>

          <p className="text-yellow-400 mt-2">
            QMS development paused.
          </p>
        </button>

      </div>
    </main>
  );
}