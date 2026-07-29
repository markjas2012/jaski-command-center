import Sidebar from "../../components/Sidebar";
import StreamingRoom from "../../components/StreamingRoom";

export default function StreamingPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="streaming" />
      <section className="content-stage" aria-label="Streaming">
        <StreamingRoom />
      </section>
    </main>
  );
}
