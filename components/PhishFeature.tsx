"use client";
import {useEffect,useState} from "react";
import styles from "./PhishFeature.module.css";
type Show={date?:string;venue?:string;location?:string;href:string;songs:string[]};
type Feed={latest:Show|null;upcoming?:Show[];next?:Show|null;links:{setlists:string;news:string;livePhish:string;tour:string};updatedAt?:string};
function dateLabel(v?:string){if(!v)return"Latest show";const p=v.split("/");if(p.length!==3)return v;const[m,d,y]=p.map(Number);return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(y,m-1,d));}
export default function PhishFeature(){
 const[feed,setFeed]=useState<Feed|null>(null);
 useEffect(()=>{let a=true;fetch("/api/phish-hub",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(d=>a&&setFeed(d)).catch(()=>a&&setFeed(null));return()=>{a=false}},[]);
 const latest=feed?.latest;
 const next=feed?.next || feed?.upcoming?.[0] || null;
 const latestHref=latest?.href||feed?.links?.setlists||"https://phish.net/setlists/phish";
 const nextHref=next?.href||feed?.links?.tour||"https://phish.com/tours/";
 return <section className={styles.shell}>
   <div className={styles.identity}><p>#2 · PHISH</p><h2>Phish.</h2></div>
   <div className={styles.shows}>
     <a className={styles.row} href={latestHref} target="_blank" rel="noreferrer"><span>LATEST SHOW</span><strong>{dateLabel(latest?.date)}</strong><b>{latest?.venue||"Open latest Phish show"}</b><small>{latest?.location||"Phish.net"}</small><em>View Show ↗</em></a>
     <a className={styles.row} href={nextHref} target="_blank" rel="noreferrer"><span>NEXT SHOW</span><strong>{next?dateLabel(next.date):"View upcoming shows"}</strong><b>{next?.venue||"Phish Tour"}</b><small>{next?.location||"Official tour schedule"}</small><em>View Tour ↗</em></a>
   </div>
 </section>
}