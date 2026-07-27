"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./CookingRoom.module.css";

type Recipe = {
  id: string;
  name: string;
  type: string;
  note: string;
  status: "cooking" | "keeper";
};

const KEY = "jaski-cooking-bbq-v1";

export default function CookingRoom() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ready, setReady] = useState(false);
  const [adding, setAdding] = useState<"cooking" | "keeper" | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setRecipes(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(recipes));
  }, [recipes, ready]);

  function add(e: FormEvent<HTMLFormElement>, status: "cooking" | "keeper") {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    setRecipes(r => [...r, {
      id: crypto.randomUUID(),
      name,
      type: String(fd.get("type") || "").trim() || "Recipe",
      note: String(fd.get("note") || "").trim(),
      status
    }]);
    e.currentTarget.reset();
    setAdding(null);
  }

  function save(e: FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setRecipes(r => r.map(x => x.id === id ? {
      ...x,
      name: String(fd.get("name") || "").trim() || x.name,
      type: String(fd.get("type") || "").trim() || x.type,
      note: String(fd.get("note") || "").trim()
    } : x));
    setEditing(null);
  }

  const move = (id: string, status: Recipe["status"]) =>
    setRecipes(r => r.map(x => x.id === id ? {...x, status} : x));
  const remove = (id: string) => setRecipes(r => r.filter(x => x.id !== id));

  function Form({status}: {status: Recipe["status"]}) {
    if (adding !== status) return null;
    return <form className={styles.form} onSubmit={e => add(e, status)}>
      <input name="name" placeholder="Dish / recipe" required />
      <input name="type" placeholder="BBQ, dinner, side, dessert…" />
      <input name="note" placeholder="Temp, source, tweak, idea…" />
      <button type="submit">Save</button>
      <button type="button" onClick={() => setAdding(null)}>Cancel</button>
    </form>;
  }

  function Card({recipe}: {recipe: Recipe}) {
    if (editing === recipe.id) return <article className={styles.card}>
      <form className={styles.edit} onSubmit={e => save(e, recipe.id)}>
        <label>Dish<input name="name" defaultValue={recipe.name} /></label>
        <label>Type<input name="type" defaultValue={recipe.type} /></label>
        <label>Note<textarea name="note" defaultValue={recipe.note} /></label>
        <div className={styles.actions}><button>Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
      </form>
    </article>;

    return <article className={styles.card}>
      <div className={styles.meta}><span>{recipe.type}</span><span>{recipe.status === "cooking" ? "ON DECK" : "KEEPER"}</span></div>
      <div><h3>{recipe.name}</h3><p>{recipe.note || "No notes yet."}</p></div>
      <div className={styles.actions}>
        {recipe.status === "cooking" ? <button onClick={() => move(recipe.id, "keeper")}>Keep This</button> : <button onClick={() => move(recipe.id, "cooking")}>Cook Again</button>}
        <button onClick={() => setEditing(recipe.id)}>Edit</button>
        <button className={styles.remove} onClick={() => remove(recipe.id)}>Remove</button>
      </div>
    </article>;
  }

  const onDeck = recipes.filter(r => r.status === "cooking");
  const keepers = recipes.filter(r => r.status === "keeper");

  return <div className={styles.room}>
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>FIRE & TABLE</p>
        <h1>Cooking / BBQ.</h1>
        <p>What sounds good, recipes worth keeping, and a little inspiration for the next cook.</p>
      </div>
      <div className={styles.mark}><strong>J</strong><small>BACKYARD KITCHEN</small></div>
      <div className={styles.foot}><span>SPRINT 10 · COMPONENT 09</span><span>LOW & SLOW. HOT & FAST.</span></div>
    </section>

    <section className={styles.panel}>
      <div className={styles.head}><div><p className={styles.kicker}>WHAT I'M COOKING</p><h2>On deck.</h2></div><button className={styles.primary} onClick={() => setAdding(adding === "cooking" ? null : "cooking")}>+ Add Dish</button></div>
      <Form status="cooking" />
      <div className={styles.grid}>{onDeck.map(r => <Card recipe={r} key={r.id} />)}</div>
      {!onDeck.length && <p className={styles.empty}>Add whatever you're thinking about cooking next.</p>}
    </section>

    <div className={styles.split}>
      <section className={styles.panel}>
        <div className={styles.head}><div><p className={styles.kicker}>RECIPES WORTH KEEPING</p><h2>The good stuff.</h2></div><button onClick={() => setAdding(adding === "keeper" ? null : "keeper")}>+ Add</button></div>
        <Form status="keeper" />
        <div className={styles.stack}>{keepers.map(r => <Card recipe={r} key={r.id} />)}</div>
        {!keepers.length && <p className={styles.empty}>The recipes you know you'll make again.</p>}
      </section>

      <section className={styles.panel}>
        <p className={styles.kicker}>BBQ / COOKING INSPIRATION</p>
        <h2>What's cooking?</h2>
        <p className={styles.empty}>Reserved for fresh recipes, BBQ ideas, and videos worth watching later—without turning this into a recipe database.</p>
        <div className={styles.tags}><span>BBQ</span><span>GRILL</span><span>CAST IRON</span><span>WEEKEND COOK</span></div>
      </section>
    </div>
  </div>;
}
