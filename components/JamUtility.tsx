"use client";

import styles from "./JamUtility.module.css";

const links = [
  {
    label: "JamBase",
    detail: "Concerts & tour dates",
    href: "https://www.jambase.com/concerts",
  },
  {
    label: "Nugs",
    detail: "Livestreams & recent shows",
    href: "https://www.nugs.net/",
  },
  {
    label: "Relix",
    detail: "Shows, festivals & music news",
    href: "https://relix.com/",
  },
];

export default function JamUtility() {
  return (
    <section className={styles.utility}>
      <div className={styles.heading}>
        <div>
          <p>TONIGHT</p>
          <h2>See what’s happening live.</h2>
        </div>
        <span>Three doors. No giant feed.</span>
      </div>

      <div className={styles.links}>
        {links.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
            <span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </span>
            <b>↗</b>
          </a>
        ))}
      </div>
    </section>
  );
}
