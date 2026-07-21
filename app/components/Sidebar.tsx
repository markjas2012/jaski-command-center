import Link from "next/link";

const items = [
  { name: "Dashboard", href: "/" },
  { name: "Swan Industries", href: "/swan" },
  { name: "Albatross", href: "/albatross" },
  { name: "Sales Atlas", href: "/sales-atlas" },
  { name: "Entertainment", href: "/entertainment" },
  { name: "Family", href: "/family" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white">
          JASKI
        </h1>

        <p className="text-zinc-500 mt-1">
          Command Center
        </p>
      </div>

      <nav className="px-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 mb-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}