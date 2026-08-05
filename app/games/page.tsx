import Sidebar from "../../components/Sidebar";
import GamingRoom from "../../components/GamingRoom";
import "./arcade-room.css";

export default function GamesPage() {
  return (
    <main className="app-shell arcade-room-shell">
      <Sidebar activePage="games" />
      <section className="content-stage" aria-label="Video games room">
        <GamingRoom />
      </section>
    </main>
  );
}
