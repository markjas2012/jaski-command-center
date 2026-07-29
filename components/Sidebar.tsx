import Link from "next/link";

type SidebarProps = {
  activePage?:
    | "home"
    | "jam"
    | "sports"
    | "golf"
    | "streaming"
    | "games"
    | "books"
    | "bbq"
    | "quick"
    | "notes";
};

const interestLinks = [
  { label: "Home", icon: "⌂", href: "/", page: "home" },
  { label: "Jam Room", icon: "🌹", href: "/jam", page: "jam" },
  { label: "Sports", icon: "◉", href: "/sports", page: "sports" },
  { label: "Golf", icon: "○", href: "/golf", page: "golf" },
  { label: "Streaming", icon: "▣", href: "/streaming", page: "streaming" },
  { label: "Video Games", icon: "◆", href: "/games", page: "games" },
  { label: "Books", icon: "▥", href: "/books", page: "books" },
  { label: "Cooking / BBQ", icon: "●", href: "/bbq", page: "bbq" },
];

const utilityLinks = [
  { label: "Quick Launch", icon: "↗", href: "/quick-launch", page: "quick" },
  { label: "Notes", icon: "✎", href: "/notes", page: "notes" },
];

export default function Sidebar({ activePage = "home" }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon" aria-hidden="true">J</div>
        <div>
          <p className="brand-name">JASKI</p>
          <p className="brand-subtitle">Personal Command Center</p>
        </div>
      </div>

      <nav className="sidebar-navigation" aria-label="Primary navigation">
        <p className="navigation-label">My Interests</p>

        <div className="navigation-group">
          {interestLinks.map((link) => (
            <Link key={link.label} className={`navigation-link ${link.page === activePage ? "active" : ""}`} href={link.href}>
              <span className="navigation-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navigation-divider" />

        <div className="navigation-group">
          {utilityLinks.map((link) => (
            <Link key={link.label} className={`navigation-link ${link.page === activePage ? "active" : ""}`} href={link.href}>
              <span className="navigation-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <p className="sidebar-footer"></p>
    </aside>
  );
}
