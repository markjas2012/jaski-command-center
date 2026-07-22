import Clock from "./components/Clock";
import TodayTasks from "./components/TodayTasks";
import Button from "./Button";
import DashboardGrid from "./components/DashboardGrid";
import Widget from "./components/Widget";
import QuickNotes from "./components/QuickNotes";
import Weather from "./components/Weather";
export default function Home() {
  const DISPLAY_NAME = "Jaski";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    
    <div className="space-y-8 p-6">
      <section>
        <p className="jaski-muted text-sm font-semibold uppercase tracking-[0.2em]">
          Personal Command Center
        </p>

        <h1 className="mt-2 text-4xl font-bold">
  {greeting}, {DISPLAY_NAME}.
</h1>

<div className="mt-2">
  <Clock />
</div>

<p className="jaski-muted mt-2">
  Everything important, without the clutter.
</p>
      </section>

      <DashboardGrid>
        <Widget title="Today">
                <TodayTasks />
        </Widget>
        <Widget title="Weather">
  <Weather />
</Widget>

        <Widget title="Favorites">
          <div className="grid grid-cols-2 gap-3">
            <Button>📧 Email</Button>
            <Button>🏢 Work</Button>
            <Button>📦 FedEx</Button>
            <Button>💳 Banking</Button>
            <Button>📅 Calendar</Button>
            <Button>🛒 Amazon</Button>
          </div>
        </Widget>

        <Widget title="Entertainment" className="md:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Button variant="secondary">⛳ PGA Golf</Button>
            <Button variant="secondary">🏆 Major Sports</Button>
            <Button variant="secondary">🎬 Movies</Button>
            <Button variant="secondary">📺 TV Shows</Button>
            <Button variant="secondary">🎮 Video Games</Button>
            <Button variant="secondary">🎵 Jam Bands</Button>
          </div>
        </Widget>

        <Widget title="Quick Notes">
    <QuickNotes />
</Widget>
</DashboardGrid>
</div>
);
}