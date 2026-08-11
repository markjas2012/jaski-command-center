export type Ingredient = { id: string; name: string; quantity: number; unit: string };
export type RecipeStep = { id: string; text: string; timerMinutes?: number };
export type BbqSetup = { method: string; grillTarget: string; foodTarget: string; fuel: string; vents: string };
export type FoodRecipe = {
  id: string; title: string; category: string; favorite: boolean; servings: number;
  prepMinutes: number; cookMinutes: number; notes: string; ingredients: Ingredient[];
  steps: RecipeStep[]; bbq?: BbqSetup; lastCooked?: string;
};

export const RECIPES_KEY = "jaski.food.recipes.v1";
export const SELECTED_KEY = "jaski.food.selectedRecipe.v1";

export const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const starterRecipes: FoodRecipe[] = [
  {
    id: "kettle-chicken-thighs", title: "Kettle-Grilled Chicken Thighs", category: "Backyard BBQ",
    favorite: true, servings: 4, prepMinutes: 15, cookMinutes: 35,
    notes: "Crisp skin over the coals, then finish gently on the cool side.",
    ingredients: [
      { id: "i1", quantity: 8, unit: "", name: "bone-in chicken thighs" },
      { id: "i2", quantity: 1, unit: "tbsp", name: "kosher salt" },
      { id: "i3", quantity: 2, unit: "tsp", name: "smoked paprika" },
      { id: "i4", quantity: 1, unit: "tsp", name: "black pepper" },
      { id: "i5", quantity: 1, unit: "tbsp", name: "neutral oil" },
    ],
    steps: [
      { id: "s1", text: "Pat the thighs dry. Season with salt, paprika, pepper, and oil." },
      { id: "s2", text: "Light a chimney of charcoal and arrange a two-zone fire.", timerMinutes: 15 },
      { id: "s3", text: "Start skin-side down over direct heat until deeply browned.", timerMinutes: 6 },
      { id: "s4", text: "Move to indirect heat, cover, and cook to 175°F.", timerMinutes: 24 },
      { id: "s5", text: "Rest before serving.", timerMinutes: 5 },
    ],
    bbq: { method: "Two-zone kettle", grillTarget: "400–425°F", foodTarget: "175°F", fuel: "1 chimney charcoal", vents: "Top open · bottom ¾ open" },
  },
  {
    id: "stl-pork-steaks", title: "St. Louis Pork Steaks", category: "Backyard BBQ",
    favorite: false, servings: 6, prepMinutes: 10, cookMinutes: 90,
    notes: "A backyard classic: smoke, sauce, and a patient covered finish.",
    ingredients: [
      { id: "p1", quantity: 6, unit: "", name: "pork shoulder steaks" },
      { id: "p2", quantity: 3, unit: "tbsp", name: "barbecue rub" },
      { id: "p3", quantity: 2, unit: "cups", name: "St. Louis-style barbecue sauce" },
      { id: "p4", quantity: 1, unit: "cup", name: "lager" },
    ],
    steps: [
      { id: "ps1", text: "Season pork steaks generously on both sides." },
      { id: "ps2", text: "Sear over direct heat, turning once.", timerMinutes: 8 },
      { id: "ps3", text: "Move to a foil pan with sauce and lager; cover tightly." },
      { id: "ps4", text: "Cook indirectly until tender.", timerMinutes: 60 },
      { id: "ps5", text: "Uncover, glaze, and set the sauce over direct heat.", timerMinutes: 5 },
    ],
    bbq: { method: "Two-zone kettle", grillTarget: "350°F", foodTarget: "Tender, 195°F", fuel: "Charcoal + hickory", vents: "Top open · bottom ½ open" },
  },
];

export function loadRecipes(): FoodRecipe[] {
  if (typeof window === "undefined") return starterRecipes;
  try { const value = localStorage.getItem(RECIPES_KEY); return value ? JSON.parse(value) : starterRecipes; }
  catch { return starterRecipes; }
}
export function saveRecipes(recipes: FoodRecipe[]) { localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes)); }
export function formatQuantity(value: number) {
  const rounded = Math.round(value * 100) / 100;
  const fractions: Record<string, string> = { "0.25": "¼", "0.33": "⅓", "0.5": "½", "0.67": "⅔", "0.75": "¾" };
  const whole = Math.floor(rounded), fraction = Math.round((rounded - whole) * 100) / 100;
  return fraction && fractions[String(fraction)] ? `${whole || ""}${fractions[String(fraction)]}` : String(rounded);
}
