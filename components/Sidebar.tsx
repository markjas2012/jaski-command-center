import Link from "next/link";

type SidebarProps = {
  activePage?: "home" | "jam" | "sports" | "golf" | "movies" | "tv" | "games";
};
const interestLinks = [
  { label: "Home", icon: "⌂", href: "/", page: "home" },
  { label: "Jam Room", icon: "🌹", href: "/jam", page: "jam" },
  { label: "St. Louis Sports", icon: "◉", href: "/sports", page: "sports" },
  { label: "Golf", icon: "◌", href: "/golf", page: "golf" },
  { label: "Movies", icon: "▣", href: "/movies", page: "movies" },
  { label: "TV Shows", icon: "▤", href: "/tv", page: "tv" },
  { label: "Video Games", icon: "◆", href: "/games", page: "games" },
  { label: "Books", icon: "▥", href: "#" },
  { label: "Hiking", icon: "▲", href: "#" },
  { label: "Cooking / BBQ", icon: "●", href: "#" },
];

const utilityLinks = [
  { label: "Quick Launch", icon: "↗", href: "#" },
  { label: "Notes", icon: "✎", href: "#" },
  { label: "Settings", icon: "⚙", href: "#" },
];

export default function Sidebar({ activePage = "home" }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon" aria-hidden="true">J</div>
        <div><p className="brand-name">JASKI</p><p className="brand-subtitle">Personal Command Center</p></div>
      </div>
      <nav className="sidebar-navigation" aria-label="Primary navigation">
        <p className="navigation-label">My Interests</p>
        <div className="navigation-group">
          {interestLinks.map((link) => (
            <Link key={link.label} className={`navigation-link ${link.page === activePage ? "active" : ""}`} href={link.href}>
              <span className="navigation-icon" aria-hidden="true">{link.icon}</span><span>{link.label}</span>
            </Link>
          ))}
        </div>
        <div className="navigation-divider" />
        <div className="navigation-group">
          {utilityLinks.map((link) => (
            <Link key={link.label} className="navigation-link" href={link.href}>
              <span className="navigation-icon" aria-hidden="true">{link.icon}</span><span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      <p className="sidebar-footer">Things that make me smile.</p>
    </aside>
  );
}
