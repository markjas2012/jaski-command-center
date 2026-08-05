import Sidebar from "../../components/Sidebar";
import GolfRoom from "../../components/GolfRoom";
import "./golf-clubhouse.css";

export default function GolfPage() {
  return (
    <main className="app-shell golf-clubhouse-shell">
      <Sidebar activePage="golf" />
      <section className="content-stage" aria-label="Golf room">
        <GolfRoom />
      </section>
    </main>
  );
}

