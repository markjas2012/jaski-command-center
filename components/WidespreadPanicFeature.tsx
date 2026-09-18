"use client";
import {useEffect,useState} from "react";
import styles from "./WidespreadPanicFeature.module.css";
type Show={date?:string;venue?:string;location?:string;href:string;songs:string[]};
type Feed={latest:Show|null;upcoming?:Show[];next?:Show|null;links:{shows:string;news:string;nugs:string;archive:string;tour?:string};updatedAt?:string};
function dateLabel(v?:string){if(!v)return"Latest show";const iso=v.match(/^(\d{4})-(\d{2})-(\d{2})$/),us=v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);const p=iso?[+iso[2],+iso[3],+iso[1]]:us?[+us[1],+us[2],+us[3]]:null;if(!p)return v;return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(p[2],p[0]-1,p[1]));}
export default function WidespreadPanicFeature(){
 const[feed,setFeed]=useState<Feed|null>(null);
 useEffect(()=>{let a=true;fetch("/api/panic-hub",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(d=>a&&setFeed(d)).catch(()=>a&&setFeed(null));return()=>{a=false}},[]);
 const latest=feed?.latest;
 const next=feed?.next || feed?.upcoming?.[0] || null;
 const latestHref=latest?.href||feed?.links?.shows||"https://widespreadpanic.com/shows/past/";
 const nextHref=next?.href||feed?.links?.tour||feed?.links?.shows||"https://widespreadpanic.com/shows/";
 return <section className={styles.shell}>
   <div className={styles.identity}><p>#3 · WIDESPREAD PANIC</p><h2>Widespread Panic.</h2></div>
   <div className={styles.shows}>
     <a className={styles.row} href={latestHref} target="_blank" rel="noreferrer"><span>LATEST SHOW</span><strong>{dateLabel(latest?.date)}</strong><b>{latest?.venue||"Open latest Panic show"}</b><small>{latest?.location||"Official show archive"}</small><em>View Show ↗</em></a>
     <a className={styles.row} href={nextHref} target="_blank" rel="noreferrer"><span>NEXT SHOW</span><strong>{next?dateLabel(next.date):"View upcoming shows"}</strong><b>{next?.venue||"Widespread Panic Tour"}</b><small>{next?.location||"Official tour schedule"}</small><em>View Tour ↗</em></a>
   </div>
 </section>
}