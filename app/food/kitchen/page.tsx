import Sidebar from "../../../components/Sidebar";
import KitchenMode from "../../../components/KitchenMode";

export default function Kitchen() {
  return (
    <main className="app-shell">
      <Sidebar activePage="food" />
      <section className="content-stage" aria-label="Kitchen Mode">
        <KitchenMode />
      </section>
    </main>
  );
}
