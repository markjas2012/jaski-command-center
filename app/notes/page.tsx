import Sidebar from "../../components/Sidebar";
import NotesRoom from "../../components/NotesRoom";
import "./notes-lodge.css";

export default function NotesPage() {
  return (
    <main className="app-shell notes-lodge-shell">
      <Sidebar activePage="notes" />
      <section className="content-stage" aria-label="Notes">
        <NotesRoom />
      </section>
    </main>
  );
}
