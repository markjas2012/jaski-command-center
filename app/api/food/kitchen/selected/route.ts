import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

type KitchenIngredient = {
  id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
};

type KitchenStep = {
  id: string;
  text: string;
  timerSeconds?: number | null;
};

type KitchenRecipe = {
  id: string;
  title: string;
  servings?: number | null;
  ingredients: KitchenIngredient[];
  steps: KitchenStep[];
};

function validRecipe(value: unknown): value is KitchenRecipe {
  if (!value || typeof value !== "object") return false;
  const recipe = value as Partial<KitchenRecipe>;
  return (
    typeof recipe.id === "string" &&
    typeof recipe.title === "string" &&
    Array.isArray(recipe.ingredients) &&
    Array.isArray(recipe.steps)
  );
}

export async function GET() {
  // Sprint 17.4 contract: the later Mealie bridge writes the currently selected
  // recipe here. No sample recipe ships with Jaski.
  const selectedPath = path.join(process.cwd(), "public", "mealie", "selected-recipe.json");

  try {
    const raw = await fs.readFile(selectedPath, "utf8");
    const recipe: unknown = JSON.parse(raw);

    if (!validRecipe(recipe)) {
      return NextResponse.json(
        { connected: false, reason: "invalid-recipe-contract" },
        { status: 422, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { connected: true, recipe },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") {
      return NextResponse.json(
        { connected: false, reason: "no-recipe-selected" },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("Kitchen Mode selected recipe read failed", error);
    return NextResponse.json(
      { connected: false, reason: "read-failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
