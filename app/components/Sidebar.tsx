import Link from "next/link";

const navigation = [
  { label: "Dashboard", href: "/" },
  { label: "Calendar", href: "/calendar" },
  { label: "Notes", href: "/notes" },
  { label: "Favorites", href: "/favorites" },
  { label: "Entertainment", href: "/entertainment" },
  { label: "Family", href: "/family" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="jaski-sidebar flex min-h-screen w-60 shrink-0 flex-col border-r p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">JASKI</h1>
        <p className="jaski-muted mt-1 text-sm">Personal Command Center</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-white/5"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}