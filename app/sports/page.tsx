import Sidebar from "../../components/Sidebar";
import StLouisSports from "../../components/StLouisSports";

export default function SportsPage() {
  return (
    <main className="app-shell sports-shell">
      <Sidebar activePage="sports" />

      <section className="content-stage sports-stage" aria-label="St. Louis Sports content">
        <StLouisSports />
      </section>
    </main>
  );
}
