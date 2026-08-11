"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FoodRecipe,
  RECIPES_KEY,
  SELECTED_KEY,
  formatQuantity,
  loadRecipes,
  saveRecipes,
  starterRecipes,
} from "./foodRecipeStore";
import styles from "./FoodVerification.module.css";

type Check = { name: string; detail: string; status: "pending" | "pass" | "fail" };

const MANUAL_KEY = "jaski.food.verification.v1";
const manualChecks = [
  "Food homepage opens Recipe Book and Kitchen Mode from their place cards.",
  "Recipe Book can add, edit, favorite, search, filter, print, and delete a temporary recipe.",
  "Backup downloads JSON; Restore accepts that file and rejects invalid JSON cleanly.",
  "Cook this opens Kitchen Mode with the recipe that was selected.",
  "Serving controls scale ingredient quantities without changing the saved recipe.",
  "Ingredient checkboxes, Previous/Next, step timers, named timers, pause, and remove all work.",
  "Finish cook records completion and the screen-wake control fails gracefully if unsupported.",
  "Leather heroes, stitched borders, journal place card, and mobile layout render without clipping.",
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export default function FoodVerification() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);
  const [manual, setManual] = useState<boolean[]>(manualChecks.map(() => false));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MANUAL_KEY) || "[]");
      if (Array.isArray(saved)) setManual(manualChecks.map((_, index) => Boolean(saved[index])));
    } catch {}
  }, []);

  const complete = useMemo(() => manual.filter(Boolean).length, [manual]);
  const updateManual = (index: number) => {
    const next = manual.map((value, item) => (item === index ? !value : value));
    setManual(next);
    localStorage.setItem(MANUAL_KEY, JSON.stringify(next));
  };

  const run = async () => {
    setRunning(true);
    const results: Check[] = [];
    const test = async (name: string, detail: string, action: () => boolean | Promise<boolean>) => {
      try {
        const passed = await action();
        results.push({ name, detail, status: passed ? "pass" : "fail" });
      } catch (error) {
        results.push({ name, detail: `${detail} (${error instanceof Error ? error.message : "error"})`, status: "fail" });
      }
      setChecks([...results]);
    };

    await test("Recipe data", "Starter recipes have ingredients, steps, and BBQ targets.", () =>
      starterRecipes.length >= 2 && starterRecipes.every(recipe => recipe.ingredients.length && recipe.steps.length && recipe.bbq)
    );
    await test("Quantity scaling", "Common fractions format correctly for Kitchen Mode.", () =>
      formatQuantity(.25) === "¼" && formatQuantity(.5) === "½" && formatQuantity(1.5) === "1½" && formatQuantity(2) === "2"
    );
    await test("Local persistence", "Recipe storage round-trips and restores the original collection.", () => {
      const before = localStorage.getItem(RECIPES_KEY);
      const probe: FoodRecipe[] = clone(starterRecipes);
      probe[0].title = "Jaski verification probe";
      try {
        saveRecipes(probe);
        return loadRecipes()[0]?.title === "Jaski verification probe";
      } finally {
        if (before === null) localStorage.removeItem(RECIPES_KEY);
        else localStorage.setItem(RECIPES_KEY, before);
      }
    });
    await test("Kitchen handoff", "Selected-recipe storage round-trips and restores its original value.", () => {
      const before = localStorage.getItem(SELECTED_KEY);
      try {
        localStorage.setItem(SELECTED_KEY, JSON.stringify(starterRecipes[1]));
        return JSON.parse(localStorage.getItem(SELECTED_KEY) || "null")?.id === starterRecipes[1].id;
      } finally {
        if (before === null) localStorage.removeItem(SELECTED_KEY);
        else localStorage.setItem(SELECTED_KEY, before);
      }
    });
    await test("Recipe Book route", "/food/recipes responds successfully.", async () => (await fetch("/food/recipes", { cache: "no-store" })).ok);
    await test("Kitchen Mode route", "/food/kitchen responds successfully.", async () => (await fetch("/food/kitchen", { cache: "no-store" })).ok);
    await test("Food homepage route", "/food responds successfully.", async () => (await fetch("/food", { cache: "no-store" })).ok);
    await test("Browser capabilities", "Local storage works; wake lock is treated as optional.", () => {
      const key = "jaski.food.verification.probe";
      localStorage.setItem(key, "ok");
      const passed = localStorage.getItem(key) === "ok";
      localStorage.removeItem(key);
      return passed;
    });
    setRunning(false);
  };

  const passed = checks.filter(check => check.status === "pass").length;
  return (
    <div className={styles.room}>
      <header className={styles.hero}>
        <div><p>SPRINT 17.25d · QUALITY CONTROL</p><h1>Food Room Verification.</h1><span>Prove the recipe shelf and cooking station are ready to lock.</span></div>
        <div className={styles.stamp}>JASKI<br/><small>TEST KITCHEN</small></div>
      </header>

      <section className={styles.panel}>
        <div className={styles.heading}><div><p>AUTOMATED SAFETY CHECK</p><h2>Run the bench test.</h2></div><button onClick={run} disabled={running}>{running ? "Testing…" : "Run verification"}</button></div>
        <p className={styles.notice}>The storage checks snapshot and restore your current recipe data. They do not clear or replace your collection.</p>
        <div className={styles.results}>
          {!checks.length && <div className={styles.empty}>Eight checks are ready.</div>}
          {checks.map(check => <article key={check.name} className={check.status === "pass" ? styles.pass : styles.fail}><b>{check.status === "pass" ? "✓" : "!"}</b><span><strong>{check.name}</strong><small>{check.detail}</small></span></article>)}
        </div>
        {!!checks.length && <p className={styles.summary}>{passed} of {checks.length} automated checks passed.</p>}
      </section>

      <section className={styles.panel}>
        <div className={styles.heading}><div><p>HANDS-ON ACCEPTANCE</p><h2>Walk the working room.</h2></div><span className={styles.counter}>{complete} / {manualChecks.length}</span></div>
        <div className={styles.manual}>{manualChecks.map((label, index) => <label key={label}><input type="checkbox" checked={manual[index]} onChange={() => updateManual(index)}/><span>{label}</span></label>)}</div>
        <footer><a href="/food">Food Room</a><a href="/food/recipes">Recipe Book</a><a href="/food/kitchen">Kitchen Mode</a></footer>
      </section>
    </div>
  );
}
