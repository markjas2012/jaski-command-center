"use client";
import { useEffect, useState } from "react";
import { FoodRecipe, formatQuantity, loadRecipes, makeId, saveRecipes, SELECTED_KEY } from "./foodRecipeStore";
import styles from "./KitchenMode.module.css";

type Timer = { id:string; name:string; total:number; remaining:number; running:boolean };
const clock = (seconds:number) => `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;

export default function KitchenMode(){
 const [recipe,setRecipe]=useState<FoodRecipe|null>(null),[servings,setServings]=useState(1),[step,setStep]=useState(0),[checked,setChecked]=useState<string[]>([]),[timers,setTimers]=useState<Timer[]>([]),[timerName,setTimerName]=useState("Kitchen timer"),[timerMinutes,setTimerMinutes]=useState(5),[awake,setAwake]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(SELECTED_KEY);const found=raw?JSON.parse(raw):loadRecipes()[0];setRecipe(found);setServings(found?.servings||1)}catch{}},[]);
 useEffect(()=>{const handle=setInterval(()=>setTimers(ts=>ts.map(t=>t.running&&t.remaining>0?{...t,remaining:t.remaining-1}:t.remaining===0?{...t,running:false}:t)),1000);return()=>clearInterval(handle)},[]);
 const scale=recipe?servings/recipe.servings:1, current=recipe?.steps[step];
 const progress=recipe?Math.round(((step+1)/recipe.steps.length)*100):0;
 const addTimer=(name=timerName,minutes=timerMinutes)=>{if(minutes<=0)return;setTimers(t=>[...t,{id:makeId(),name,total:minutes*60,remaining:minutes*60,running:true}])};
 const toggleWake=async()=>{try{if(!awake&&"wakeLock" in navigator){await (navigator as Navigator & {wakeLock:{request:(type:string)=>Promise<unknown>}}).wakeLock.request("screen");setAwake(true)}}catch{setAwake(false)}};
 const finish=()=>{if(!recipe)return;const recipes=loadRecipes().map(r=>r.id===recipe.id?{...r,lastCooked:new Date().toISOString()}:r);saveRecipes(recipes);alert("Cook marked complete. Nice work.")};
 if(!recipe)return <div className={styles.empty}><h1>Kitchen Mode.</h1><p>Choose a recipe from your Recipe Book, then press “Cook this.”</p><a href="/food/recipes">Open Recipe Book →</a></div>;
 return <div className={styles.mode}>
  <header className={styles.hero}><div><p>COOKING NOW · {recipe.category}</p><h1>{recipe.title}</h1><span>Step {step+1} of {recipe.steps.length}</span></div><div className={styles.heroActions}><button onClick={toggleWake}>{awake?"● Screen awake":"○ Keep screen awake"}</button><a href="/food/recipes">Recipe Book</a></div><i style={{width:`${progress}%`}}/></header>
  <section className={styles.setup}><div className={styles.servings}><p>SERVINGS</p><button onClick={()=>setServings(Math.max(1,servings-1))}>−</button><b>{servings}</b><button onClick={()=>setServings(servings+1)}>＋</button></div>{recipe.bbq&&<><span><b>METHOD</b>{recipe.bbq.method}</span><span><b>GRILL</b>{recipe.bbq.grillTarget}</span><span><b>FOOD TARGET</b>{recipe.bbq.foodTarget}</span><span><b>FIRE</b>{recipe.bbq.fuel}<small>{recipe.bbq.vents}</small></span></>}</section>
  <div className={styles.grid}><aside className={styles.ingredients}><p>MISE EN PLACE</p><h2>Ingredients</h2>{recipe.ingredients.map(item=><label className={checked.includes(item.id)?styles.done:""} key={item.id}><input type="checkbox" checked={checked.includes(item.id)} onChange={()=>setChecked(c=>c.includes(item.id)?c.filter(x=>x!==item.id):[...c,item.id])}/><span><b>{formatQuantity(item.quantity*scale)} {item.unit}</b> {item.name}</span></label>)}</aside>
   <main className={styles.step}><p>STEP {String(step+1).padStart(2,"0")}</p><h2>{current?.text}</h2>{current?.timerMinutes&&<button className={styles.stepTimer} onClick={()=>addTimer(`Step ${step+1}`,current.timerMinutes)}>Start {current.timerMinutes}-minute timer</button>}<div className={styles.navigation}><button disabled={step===0} onClick={()=>setStep(step-1)}>← Previous</button>{step<recipe.steps.length-1?<button onClick={()=>setStep(step+1)}>Next step →</button>:<button onClick={finish}>Finish cook ✓</button>}</div><details><summary>Cook’s notes</summary><p>{recipe.notes||"No notes for this recipe."}</p></details></main>
   <aside className={styles.timerRail}><p>MULTI-TIMER</p><h2>Timers</h2><div className={styles.timerForm}><input value={timerName} onChange={e=>setTimerName(e.target.value)} aria-label="Timer name"/><input type="number" min="1" value={timerMinutes} onChange={e=>setTimerMinutes(+e.target.value)} aria-label="Timer minutes"/><button onClick={()=>addTimer()}>＋</button></div>{timers.map(timer=><div className={styles.timer} key={timer.id}><span>{timer.name}</span><b>{clock(timer.remaining)}</b><div><button onClick={()=>setTimers(ts=>ts.map(t=>t.id===timer.id?{...t,running:!t.running}:t))}>{timer.running?"Pause":"Start"}</button><button onClick={()=>setTimers(ts=>ts.filter(t=>t.id!==timer.id))}>×</button></div></div>)}{!timers.length&&<small>Add separate timers for the grill, sides, and resting.</small>}</aside>
  </div>
 </div>
}
