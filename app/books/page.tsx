import Sidebar from "../../components/Sidebar";
import BookRoom from "../../components/BookRoom";

export default function BooksPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="books" />
      <section className="content-stage" aria-label="Books">
        <BookRoom />
      </section>
    </main>
  );
}
