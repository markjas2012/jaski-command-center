import Sidebar from "../../components/Sidebar";
import StreamingRoom from "../../components/StreamingRoom";

export default function MoviesPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="movies" />
      <section className="content-stage" aria-label="Movies and streaming">
        <StreamingRoom />
      </section>
    </main>
  );
}
