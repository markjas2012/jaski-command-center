export default function FavoritesPage() {
  const favorites = [
    { name: "Outlook", url: "https://outlook.office.com" },
    { name: "Calendar", url: "https://calendar.google.com" },
    { name: "OneDrive", url: "https://onedrive.live.com" },
    { name: "Plex", url: "https://app.plex.tv" },
    { name: "YouTube TV", url: "https://tv.youtube.com" },
    { name: "Amazon", url: "https://amazon.com" },
    { name: "FedEx", url: "https://fedex.com" },
    { name: "Banking", url: "#" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="jaski-muted text-sm uppercase tracking-[0.2em]">
          Personal Command Center
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Favorites
        </h1>

        <p className="jaski-muted mt-2">
          Your most-used websites and apps.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {favorites.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-neutral-700 bg-neutral-900 p-5 transition hover:border-blue-500 hover:bg-neutral-800"
          >
            <div className="text-lg font-semibold">
              {item.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}