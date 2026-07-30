"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./GamingRoom.module.css";

type SystemKey = "nes" | "snes" | "n64" | "ps1" | "gc" | "arcade";
type Game = { id:string; title:string; system:SystemKey; platforms:string[]; year:number|null; cover:string|null; installed:boolean };
type Library = { generatedAt:string; source:string; games:Game[] };
type SystemShelf = { key:SystemKey; mark:string; era:string; maker:string; name:string; note:string; cardClass:string };

const systems:SystemShelf[] = [
  {key:"nes",mark:"NES",era:"8-BIT",maker:"NINTENDO",name:"NES",note:"Nintendo Entertainment System",cardClass:"nesCard"},
  {key:"snes",mark:"SNES",era:"16-BIT",maker:"NINTENDO",name:"Super Nintendo",note:"The 16-bit shelf",cardClass:"snesCard"},
  {key:"n64",mark:"N64",era:"64-BIT",maker:"NINTENDO",name:"Nintendo 64",note:"Four-player era classics",cardClass:"n64Card"},
  {key:"ps1",mark:"PS",era:"DISC",maker:"SONY",name:"PlayStation",note:"Original PlayStation library",cardClass:"ps1Card"},
  {key:"gc",mark:"GC",era:"CUBE",maker:"NINTENDO",name:"GameCube",note:"Controller-first console shelf",cardClass:"gcCard"},
  {key:"arcade",mark:"ARCADE",era:"COIN-OP",maker:"CABINET",name:"Arcade",note:"RetroArch arcade library",cardClass:"arcadeCard"},
];

export default function MyArcade(){
  const [active,setActive]=useState<SystemKey>("nes");
  const [library,setLibrary]=useState<Library|null>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{ fetch("/playnite/library.json",{cache:"no-store"}).then(r=>{if(!r.ok) throw new Error(); return r.json()}).then(setLibrary).catch(()=>setFailed(true)); },[]);
  const selected=systems.find(s=>s.key===active)??systems[0];
  const games=useMemo(()=>library?.games.filter(g=>g.system===active)??[],[library,active]);
  const counts=useMemo(()=>Object.fromEntries(systems.map(s=>[s.key,library?.games.filter(g=>g.system===s.key).length??0])),[library]);
  return <section className={`${styles.panel} ${styles.arcadeLibrary}`}>
    <div className={styles.sectionHead}><div><p className={styles.sectionEyebrow}>MY ARCADE</p><h2>Pick a system.</h2><p className={styles.sectionCopy}>Live from the Playnite library on the Jaski Game Server.</p></div><span className={styles.count}>{library?`${library.games.length} GAMES`:"PLAYNITE"}</span></div>
    <div className={styles.systemShelf}>{systems.map(system=><button key={system.key} type="button" className={`${styles.systemCard} ${styles[system.cardClass]} ${active===system.key?styles.systemCardActive:""}`} onClick={()=>setActive(system.key)} aria-pressed={active===system.key}>
      <div className={styles.systemArt}><span>{system.mark}</span><i>{system.era}</i></div><div className={styles.systemInfo}><small>{system.maker}</small><strong>{system.name}</strong><p>{library?`${counts[system.key]} games on server`:system.note}</p></div>
    </button>)}</div>
    <div className={styles.libraryDrawer} aria-live="polite"><div className={styles.libraryDrawerHead}><div><small>{selected.maker} / LIVE LIBRARY</small><h3>{selected.name}</h3></div><span>{library?`${games.length} TITLES · PLAYNITE`:failed?"SYNC REQUIRED":"CONNECTING…"}</span></div>
      {library ? (games.length ? <div className={styles.gameShelf}>{games.map(game=><article className={styles.gameCard} key={game.id}><div className={`${styles.gameCover} ${!game.cover?styles.gameCoverEmpty:""}`}>{game.cover?<img src={game.cover} alt="" loading="lazy"/>:<b>{game.title.slice(0,3).toUpperCase()}</b>}<i>{game.installed?"READY":"LIBRARY"}</i></div><div className={styles.gameMeta}><strong>{game.title}</strong><span>{game.year??""}</span></div></article>)}</div> : <div className={styles.libraryEmpty}>No {selected.name} titles are currently exported from Playnite.</div>) : <div className={styles.libraryEmpty}>{failed?<>Playnite has not exported the library yet. Restart Playnite or choose <b>Extensions → Sync Jaski Arcade library</b>.</>:"Connecting to Playnite…"}</div>}
    </div>
    <div className={styles.arcadeFooter}><span><i/> {library?"PLAYNITE LIVE":"WAITING FOR PLAYNITE"}</span><strong>MOONLIGHT → PLAYNITE → RETROARCH</strong></div>
  </section>;
}
