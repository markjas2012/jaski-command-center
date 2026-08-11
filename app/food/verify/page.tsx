import Sidebar from "../../../components/Sidebar";
import FoodVerification from "../../../components/FoodVerification";
import "../food-backyard.css";

export default function FoodVerificationPage() {
  return (
    <main className="app-shell food-backyard-shell">
      <Sidebar activePage="food" />
      <section className="content-stage" aria-label="Food Room verification">
        <FoodVerification />
      </section>
    </main>
  );
}
