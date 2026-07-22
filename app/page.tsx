import TodayTasks from "./components/TodayTasks";
import Button from "./Button";
import DashboardGrid from "./components/DashboardGrid";
import Widget from "./components/Widget";
import QuickNotes from "./components/QuickNotes";
export default function Home() {
  return (
    <div className="space-y-8 p-6">
      <section>
        <p className="jaski-muted text-sm font-semibold uppercase tracking-[0.2em]">
          Personal Command Center
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Good afternoon, Mark.
        </h1>

        <p className="jaski-muted mt-2">
          Everything important, without the clutter.
        </p>
      </section>

      <DashboardGrid>
        <Widget title="Today">
                <TodayTasks />
        </Widget>
        <Widget title="Weather">
          <div className="space-y-1">
            <div className="text-4xl font-bold">94°</div>
            <div className="jaski-muted">Sunny</div>
          </div>
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