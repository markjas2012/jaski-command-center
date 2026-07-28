"use client";

import { useEffect, useState } from "react";
import styles from "./SportsNews.module.css";

type Story = { title:string; source:string; href:string; tag?:string; date?:string };
type Feed = { updatedAt?:string; stories:Story[] };

export default function SportsNews(){
  const [feed,setFeed]=useState<Feed|null>(null);

  useEffect(()=>{
    fetch(`/api/sports-news?t=${Date.now()}`,{cache:"no-store"})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(setFeed)
      .catch(()=>setFeed({stories:[]}));
  },[]);

  if(!feed?.stories?.length) return null;

  return (
    <section className={styles.wrap}>
      <div className={styles.heading}>
        <div><p>SPORTS NEWS</p><h2>What matters.</h2></div>
        <span>{feed.updatedAt?`Updated ${feed.updatedAt}`:"Current"}</span>
      </div>
      <div className={styles.grid}>
        {feed.stories.slice(0,6).map(story=>(
          <a key={story.href+story.title} className={styles.card} href={story.href} target="_blank" rel="noreferrer">
            <div><span>{story.tag||story.source}</span><small>{story.date||story.source}</small></div>
            <h3>{story.title}</h3>
            <b>Read ↗</b>
          </a>
        ))}
      </div>
    </section>
  );
}
