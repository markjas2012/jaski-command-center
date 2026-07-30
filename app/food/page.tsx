import Sidebar from "../../components/Sidebar";
import FoodRoom from "../../components/FoodRoom";

export default function FoodPage() {
  return (
    <main className="app-shell">
      <Sidebar activePage="food" />
      <section className="content-stage" aria-label="Food">
        <FoodRoom />
      </section>
    </main>
  );
}
