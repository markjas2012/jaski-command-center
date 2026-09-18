"use client";

import DeadTodayCard from "./DeadTodayCard";
import PhishFeature from "./PhishFeature";
import WidespreadPanicFeature from "./WidespreadPanicFeature";
import JamTonight from "./JamTonight";
import JamListen from "./JamListen";
import styles from "./JamHero.module.css";

export default function JamHero() {
  return (
    <main className={styles.room}>
      <section className={styles.hero}>
        <h1>Jam Room.</h1>
      </section>
      <section className={styles.deadSection}><DeadTodayCard /></section>
      <PhishFeature />
      <WidespreadPanicFeature />
      <JamTonight />
      <JamListen />
    </main>
  );
}
