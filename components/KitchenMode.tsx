"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./KitchenMode.module.css";

type Ingredient = {
  id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
};

type Step = {
  id: string;
  text: string;
  timerSeconds?: number | null;
};

type Recipe = {
  id: string;
  title: string;
  servings?: number | null;
  ingredients: Ingredient[];
  steps: Step[];
};

type ApiResponse =
  | { connected: true; recipe: Recipe }
  | { connected: false; reason: string };

type WakeLockSentinelLike = {
  release: () => Promise<void>;
  addEventListener?: (type: string, listener: () => void) => void;
};

function formatQuantity(value: number) {
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(2)).toString();
}

function formatTimer(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function KitchenMode() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [wakeActive, setWakeActive] = useState(false);
  const [wakeSupported, setWakeSupported] = useState(true);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);

  const loadRecipe = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/food/kitchen/selected", { cache: "no-store" });
      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.connected) {
        setRecipe(null);
        setStatus(response.status >= 500 ? "error" : "empty");
        return;
      }
      setRecipe(data.recipe);
      setStepIndex(0);
      setCheckedIngredients(new Set());
      setServingMultiplier(1);
      setTimerRemaining(null);
      setTimerRunning(false);
      setStatus("ready");
    } catch {
      setRecipe(null);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadRecipe();
  }, [loadRecipe]);

  useEffect(() => {
    if (!timerRunning || timerRemaining === null) return;
    if (timerRemaining <= 0) {
      setTimerRunning(false);
      return;
    }
    const tick = window.setInterval(() => {
      setTimerRemaining((current) => (current === null ? null : Math.max(0, current - 1)));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [timerRunning, timerRemaining]);

  useEffect(() => {
    return () => {
      void wakeLockRef.current?.release();
    };
  }, []);

  const currentStep = recipe?.steps[stepIndex] ?? null;
  const completedCount = checkedIngredients.size;
  const progress = recipe?.steps.length ? ((stepIndex + 1) / recipe.steps.length) * 100 : 0;

  const servingsLabel = useMemo(() => {
    if (!recipe?.servings) return null;
    return formatQuantity(recipe.servings * servingMultiplier);
  }, [recipe, servingMultiplier]);

  const toggleWakeLock = async () => {
    if (wakeActive) {
      await wakeLockRef.current?.release();
      wakeLockRef.current = null;
      setWakeActive(false);
      return;
    }

    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
    };
    if (!nav.wakeLock) {
      setWakeSupported(false);
      return;
    }

    try {
      const sentinel = await nav.wakeLock.request("screen");
      wakeLockRef.current = sentinel;
      setWakeActive(true);
      sentinel.addEventListener?.("release", () => setWakeActive(false));
    } catch {
      setWakeSupported(false);
    }
  };

  const startStepTimer = () => {
    if (!currentStep?.timerSeconds) return;
    setTimerRemaining(currentStep.timerSeconds);
    setTimerRunning(true);
  };

  if (status === "loading") {
    return (
      <div className={styles.kitchen}>
        <p className={styles.eyebrow}>FOOD / KITCHEN MODE</p>
        <h1>Kitchen Mode.</h1>
        <p className={styles.muted}>Checking for the selected recipe…</p>
      </div>
    );
  }

  if (status !== "ready" || !recipe) {
    return (
      <div className={styles.kitchen}>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>FOOD / KITCHEN MODE</p>
          <h1>Kitchen Mode.</h1>
          <p>
            {status === "error"
              ? "The recipe source could not be read."
              : "No recipe is selected for cooking."}
          </p>
          <p className={styles.muted}>
            Kitchen Mode is ready for the live Recipe Book connection. It does not ship with sample recipes.
          </p>
          <div className={styles.emptyActions}>
            <button type="button" onClick={() => void loadRecipe()}>Check again</button>
            <Link href="/food">Back to Food</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.kitchen}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>FOOD / KITCHEN MODE</p>
          <h1>{recipe.title}</h1>
          <p className={styles.muted}>
            {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
            {servingsLabel ? ` · ${servingsLabel} servings` : ""}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={() => void toggleWakeLock()} aria-pressed={wakeActive}>
            {wakeActive ? "Screen awake" : "Keep screen awake"}
          </button>
          <Link href="/food">Exit Kitchen</Link>
        </div>
      </header>

      {!wakeSupported && <p className={styles.notice}>Screen wake lock is unavailable in this browser.</p>}

      <div className={styles.progressTrack} aria-label={`Step ${stepIndex + 1} of ${recipe.steps.length}`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className={styles.workspace}>
        <aside className={styles.ingredientsPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>INGREDIENTS</p>
              <h2>{completedCount}/{recipe.ingredients.length} ready</h2>
            </div>
            {recipe.servings ? (
              <div className={styles.servingControl} aria-label="Serving size">
                <button type="button" onClick={() => setServingMultiplier((v) => Math.max(0.25, v - 0.25))}>−</button>
                <span>{servingsLabel}</span>
                <button type="button" onClick={() => setServingMultiplier((v) => Math.min(8, v + 0.25))}>+</button>
              </div>
            ) : null}
          </div>

          <div className={styles.ingredientList}>
            {recipe.ingredients.map((ingredient) => {
              const checked = checkedIngredients.has(ingredient.id);
              const scaledQuantity = typeof ingredient.quantity === "number"
                ? ingredient.quantity * servingMultiplier
                : null;
              return (
                <button
                  type="button"
                  key={ingredient.id}
                  className={`${styles.ingredientRow} ${checked ? styles.checked : ""}`}
                  onClick={() => {
                    setCheckedIngredients((current) => {
                      const next = new Set(current);
                      if (next.has(ingredient.id)) next.delete(ingredient.id);
                      else next.add(ingredient.id);
                      return next;
                    });
                  }}
                  aria-pressed={checked}
                >
                  <span className={styles.check}>{checked ? "✓" : ""}</span>
                  <span className={styles.quantity}>
                    {scaledQuantity === null ? "" : formatQuantity(scaledQuantity)}{ingredient.unit ? ` ${ingredient.unit}` : ""}
                  </span>
                  <strong>{ingredient.name}</strong>
                </button>
              );
            })}
          </div>
        </aside>

        <main className={styles.stepPanel}>
          <div className={styles.stepMeta}>
            <span>STEP {stepIndex + 1}</span>
            <span>OF {recipe.steps.length}</span>
          </div>
          <p className={styles.stepText}>{currentStep?.text}</p>

          {currentStep?.timerSeconds ? (
            <div className={styles.timerCard}>
              <div>
                <p className={styles.eyebrow}>STEP TIMER</p>
                <strong>{formatTimer(timerRemaining ?? currentStep.timerSeconds)}</strong>
              </div>
              <div className={styles.timerActions}>
                {timerRemaining === null ? (
                  <button type="button" onClick={startStepTimer}>Start timer</button>
                ) : (
                  <>
                    <button type="button" onClick={() => setTimerRunning((running) => !running)}>
                      {timerRunning ? "Pause" : "Resume"}
                    </button>
                    <button type="button" onClick={() => { setTimerRemaining(null); setTimerRunning(false); }}>Reset</button>
                  </>
                )}
              </div>
            </div>
          ) : null}

          <div className={styles.stepNavigation}>
            <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>← Previous</button>
            <button type="button" disabled={stepIndex >= recipe.steps.length - 1} onClick={() => setStepIndex((i) => Math.min(recipe.steps.length - 1, i + 1))}>Next step →</button>
          </div>
        </main>
      </section>
    </div>
  );
}
