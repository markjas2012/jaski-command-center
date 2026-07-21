import Clock from "./Clock";
import ThemeSelector from "./ThemeSelector";

export default function TopBar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <div>
        <h2 className="text-2xl font-bold">Jaski Command Center</h2>

        <p className="text-sm text-zinc-500">
          Your personal operations dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeSelector />
        <Clock />
      </div>
    </header>
  );
}