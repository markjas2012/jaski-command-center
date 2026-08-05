import Sidebar from "../components/Sidebar";
import LiveDashboard from "../components/LiveDashboard";
import "./home-lodge.css";
import "./home-lodge-final.css";

export default function Home() {
  return (
    <main className="app-shell home-lodge-shell">
      <Sidebar activePage="home" />

      <section className="content-stage" aria-label="Command Center content">
        <LiveDashboard />
      </section>
    </main>
  );
}
