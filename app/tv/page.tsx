import Sidebar from "../../components/Sidebar";
import TVRoom from "../../components/TVRoom";

export default function TVPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="tv" />
      <section className="content-stage" aria-label="TV Shows">
        <TVRoom />
      </section>
    </main>
  );
}
