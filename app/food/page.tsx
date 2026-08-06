import Sidebar from "../../components/Sidebar";
import FoodRoom from "../../components/FoodRoom";
import "./food-backyard.css";

export default function FoodPage() {
  return (
    <main className="app-shell food-backyard-shell">
      <Sidebar activePage="food" />
      <section className="content-stage" aria-label="Food">
        <FoodRoom />
      </section>
    </main>
  );
}
