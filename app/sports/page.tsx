import Sidebar from "../../components/Sidebar";
import SportsRoom from "../../components/SportsRoom";

export default function SportsPage() {
  return (
    <div className="app-shell">
      <Sidebar activePage="sports" />
      <section className="content-shell">
        <SportsRoom />
      </section>
    </div>
  );
}
