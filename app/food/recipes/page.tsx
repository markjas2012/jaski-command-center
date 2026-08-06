import Sidebar from "../../../components/Sidebar";
import RecipeBook from "../../../components/RecipeBook";
import "../food-backyard.css";

export default function RecipesPage() {
  return <main className="app-shell food-backyard-shell"><Sidebar activePage="food" /><section className="content-stage" aria-label="Recipe Book"><RecipeBook /></section></main>;
}
