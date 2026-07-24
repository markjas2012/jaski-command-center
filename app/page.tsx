import Sidebar from "../components/Sidebar";
import LiveDashboard from "../components/LiveDashboard";

export default function Home() {
  return (
    <main className="app-shell">
      <Sidebar activePage="home" />

      <section className="content-stage" aria-label="Command Center content">
        <LiveDashboard />
      </section>
    </main>
  );
}
