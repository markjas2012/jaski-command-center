import Sidebar from "../../components/Sidebar";
import JamHero from "../../components/JamHero";
import NewReleases from "../../components/NewReleases";

export default function JamRoom() {
  return (
    <main className="app-shell jam-shell">
      <Sidebar activePage="jam" />

      <section className="content-stage jam-stage" aria-label="Jam Room content">
        <div className="jam-room-page">
          <JamHero />
          <NewReleases />
        </div>
      </section>
    </main>
  );
}
