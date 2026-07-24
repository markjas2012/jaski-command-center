import Link from "next/link";

type SidebarProps = {
  activePage?: "home" | "jam";
};

const interestLinks = [
  { label: "Home", icon: "⌂", href: "/", page: "home" },
  { label: "Jam Room", icon: "🌹", href: "/jam", page: "jam" },
  { label: "St. Louis Sports", icon: "◉", href: "#" },
  { label: "Golf", icon: "◌", href: "#" },
  { label: "Movies", icon: "▣", href: "#" },
  { label: "TV Shows", icon: "▤", href: "#" },
  { label: "Video Games", icon: "◆", href: "#" },
  { label: "Books", icon: "▥", href: "#" },
  { label: "Hiking", icon: "▲", href: "#" },
  { label: "Cooking / BBQ", icon: "●", href: "#" },
];

const utilityLinks = [
  { label: "Quick Launch", icon: "↗" },
  { label: "Notes", icon: "✎" },
  { label: "Settings", icon: "⚙" },
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
          {interestLinks.map((link) => {
            const isActive = link.page === activePage;
            return (
              <Link
                key={link.label}
                className={`navigation-link ${isActive ? "active" : ""}`}
                href={link.href}
              >
                <span className="navigation-icon" aria-hidden="true">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="navigation-divider" />

        <div className="navigation-group">
          {utilityLinks.map((link) => (
            <a key={link.label} className="navigation-link" href="#">
              <span className="navigation-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <p className="sidebar-footer">Things that make me smile.</p>
    </aside>
  );
}
