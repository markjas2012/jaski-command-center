import Sidebar from "../../components/Sidebar";
import GameRoom from "../../components/GameRoom";

export default function GamesPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="games" />
      <section className="content-stage" aria-label="Video Games">
        <GameRoom />
      </section>
    </main>
  );
}
