import Sidebar from "../../components/Sidebar";
import SportsRoom from "../../components/SportsRoom";
import "./sports-clubhouse.css";
import "./sports-hero-lock.css";

export default function SportsPage() {
  return (
    <div className="app-shell sports-clubhouse-shell">
      <Sidebar activePage="sports" />
      <section className="content-shell">
        <SportsRoom />
      </section>
    </div>
  );
}
