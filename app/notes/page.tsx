import Sidebar from "../../components/Sidebar";
import NotesRoom from "../../components/NotesRoom";

export default function NotesPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="notes" />
      <section className="content-stage" aria-label="Notes">
        <NotesRoom />
      </section>
    </main>
  );
}
