import Sidebar from "../../components/Sidebar";
import StreamingRoom from "../../components/StreamingRoom";
import "./streaming-lounge.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StreamingPage() {
  return (
    <main className="app-shell streaming-lounge-shell">
      <Sidebar activePage="streaming" />
      <section className="content-stage" aria-label="Streaming">
        <StreamingRoom />
      </section>
    </main>
  );
}
