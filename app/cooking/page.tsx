import Sidebar from "../../components/Sidebar";
import CookingRoom from "../../components/CookingRoom";

export default function CookingPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="cooking" />
      <section className="content-stage" aria-label="Cooking and BBQ">
        <CookingRoom />
      </section>
    </main>
  );
}
