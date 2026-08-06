import Sidebar from "../../../components/Sidebar";
import KitchenMode from "../../../components/KitchenMode";
import "../food-backyard.css";

export default function KitchenPage() {
  return <main className="app-shell food-backyard-shell"><Sidebar activePage="food" /><section className="content-stage" aria-label="Kitchen Mode"><KitchenMode /></section></main>;
}
