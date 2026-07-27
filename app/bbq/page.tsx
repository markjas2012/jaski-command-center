import Sidebar from "../../components/Sidebar";
import CookingRoom from "../../components/CookingRoom";

export default function BBQPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="bbq" />
      <section className="content-stage" aria-label="Cooking and BBQ">
        <CookingRoom />
      </section>
    </main>
  );
}
