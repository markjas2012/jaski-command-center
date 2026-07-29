import styles from "./StreamingRoom.module.css";

export default function StreamingRoom() {
  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.glowOne} aria-hidden="true" />
        <div className={styles.glowTwo} aria-hidden="true" />

        <div className={styles.eyebrow}>YOUR ENTERTAINMENT / ONE PLACE</div>

        <div className={styles.heroCopy}>
          <p className={styles.kicker}>STREAMING</p>
          <h1>What are we watching?</h1>
          <p className={styles.lede}>
            Your services, your library, and the things actually worth watching — without browsing ten apps first.
          </p>
        </div>

        <div className={styles.signal} aria-hidden="true">
          <span className={styles.signalRing} />
          <span className={styles.play}>▶</span>
          <strong>ON</strong>
          <small>JASKI STREAMING</small>
        </div>

        <div className={styles.footer}>
          <span>SPRINT 15.1 · STREAMING FOUNDATION</span>
          <span>LESS BROWSING. MORE WATCHING.</span>
        </div>
      </section>

      <section className={styles.tonight}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>TONIGHT</p>
            <h2>Worth watching.</h2>
            <p className={styles.sectionCopy}>A few picks, not another endless wall of thumbnails.</p>
          </div>
          <span className={styles.pickCount}>5 PICKS</span>
        </div>

        <div className={styles.cardRow}>
          <article className={`${styles.watchCard} ${styles.cardOne}`}>
            <div className={styles.cardShade} />
            <div className={styles.cardTop}><span>PARAMOUNT+</span><span>DRAMA</span></div>
            <div className={styles.cardBottom}>
              <div><small>TONIGHT</small><h3>The Agency</h3></div>
              <button type="button">Watch</button>
            </div>
          </article>

          <article className={`${styles.watchCard} ${styles.cardTwo}`}>
            <div className={styles.cardShade} />
            <div className={styles.cardTop}><span>MAX</span><span>FAVORITE</span></div>
            <div className={styles.cardBottom}>
              <div><small>SERIES</small><h3>House of the Dragon</h3></div>
              <button type="button">Watch</button>
            </div>
          </article>

          <article className={`${styles.watchCard} ${styles.cardThree}`}>
            <div className={styles.cardShade} />
            <div className={styles.cardTop}><span>PEACOCK</span><span>MOVIE</span></div>
            <div className={styles.cardBottom}>
              <div><small>TONIGHT</small><h3>Oppenheimer</h3></div>
              <button type="button">Watch</button>
            </div>
          </article>

          <article className={`${styles.watchCard} ${styles.cardFour}`}>
            <div className={styles.cardShade} />
            <div className={styles.cardTop}><span>HULU</span><span>COMEDY</span></div>
            <div className={styles.cardBottom}>
              <div><small>CONTINUE</small><h3>The Bear</h3></div>
              <button type="button">Watch</button>
            </div>
          </article>

          <article className={`${styles.watchCard} ${styles.cardFive}`}>
            <div className={styles.cardShade} />
            <div className={styles.cardTop}><span>APPLE TV</span><span>MOVIE</span></div>
            <div className={styles.cardBottom}>
              <div><small>FROM YOUR LIBRARY</small><h3>Top Gun: Maverick</h3></div>
              <button type="button">Watch</button>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.newComing}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>NEW & COMING</p>
            <h2>What’s next.</h2>
            <p className={styles.sectionCopy}>New releases, returning seasons, and premieres across your services.</p>
          </div>
          <span className={styles.pickCount}>5 PICKS</span>
        </div>

        <div className={styles.newGrid}>
          <article className={`${styles.newCard} ${styles.newOne}`}>
            <div className={styles.newShade} />
            <div className={styles.newTop}>
              <span>DISNEY+</span>
              <span>NEW MOVIE</span>
            </div>
            <div className={styles.newBottom}>
              <small>JUL 26</small>
              <h3>Deadpool & Wolverine</h3>
              <span>Now streaming</span>
            </div>
          </article>

          <article className={`${styles.newCard} ${styles.newTwo}`}>
            <div className={styles.newShade} />
            <div className={styles.newTop}>
              <span>HULU</span>
              <span>NEW SERIES</span>
            </div>
            <div className={styles.newBottom}>
              <small>NOW</small>
              <h3>Alien: Earth</h3>
              <span>New episodes</span>
            </div>
          </article>

          <article className={`${styles.newCard} ${styles.newThree}`}>
            <div className={styles.newShade} />
            <div className={styles.newTop}>
              <span>PARAMOUNT+</span>
              <span>RETURNING</span>
            </div>
            <div className={styles.newBottom}>
              <small>AUG 04</small>
              <h3>Mayor of Kingstown</h3>
              <span>Season return</span>
            </div>
          </article>

          <article className={`${styles.newCard} ${styles.newFour}`}>
            <div className={styles.newShade} />
            <div className={styles.newTop}>
              <span>PRIME VIDEO</span>
              <span>NEW MOVIE</span>
            </div>
            <div className={styles.newBottom}>
              <small>JUL 30</small>
              <h3>The Instigators</h3>
              <span>Coming soon</span>
            </div>
          </article>

          <article className={`${styles.newCard} ${styles.newFive}`}>
            <div className={styles.newShade} />
            <div className={styles.newTop}>
              <span>NETFLIX</span>
              <span>NEW SEASON</span>
            </div>
            <div className={styles.newBottom}>
              <small>AUG 06</small>
              <h3>Wednesday</h3>
              <span>Season 2</span>
            </div>
          </article>
        </div>
      </section>


      <section className={styles.services}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>MY SERVICES</p>
            <h2>Where you watch.</h2>
            <p className={styles.sectionCopy}>Your streaming shelf — one clean place to jump into the services you already use.</p>
          </div>
          <span className={styles.pickCount}>12 SERVICES</span>
        </div>

        <div className={styles.serviceGrid}>
          {[
            {
              name: "YouTube TV",
              kind: "LIVE TV",
              href: "https://tv.youtube.com/",
              logo: "/streaming-logos/youtubetv.svg",
            },
            {
              name: "YouTube",
              kind: "VIDEO",
              href: "https://www.youtube.com/",
              logo: "/streaming-logos/youtube.svg",
            },
            {
              name: "Paramount+",
              kind: "STREAMING",
              href: "https://www.paramountplus.com/",
              logo: "/streaming-logos/paramountplus.svg",
            },
            {
              name: "Max",
              kind: "STREAMING",
              href: "https://www.max.com/",
              logo: "/streaming-logos/max.svg",
            },
            {
              name: "Disney+",
              kind: "STREAMING",
              href: "https://www.disneyplus.com/",
              logo: "/streaming-logos/disneyplus.svg",
            },
            {
              name: "Hulu",
              kind: "STREAMING",
              href: "https://www.hulu.com/",
              logo: "/streaming-logos/hulu.svg",
            },
            {
              name: "ESPN",
              kind: "SPORTS",
              href: "https://www.espn.com/watch/",
              logo: "/streaming-logos/espn.svg",
            },
            {
              name: "Discovery+",
              kind: "STREAMING",
              href: "https://www.discoveryplus.com/",
              logo: "/streaming-logos/discoveryplus.svg",
            },
            {
              name: "Peacock",
              kind: "STREAMING",
              href: "https://www.peacocktv.com/",
              logo: "/streaming-logos/peacock.svg",
            },
            {
              name: "Prime Video",
              kind: "STREAMING",
              href: "https://www.primevideo.com/",
              logo: "/streaming-logos/primevideo.svg",
            },
            {
              name: "Netflix",
              kind: "STREAMING",
              href: "https://www.netflix.com/",
              logo: "/streaming-logos/netflix.svg",
            },
            {
              name: "Apple TV",
              kind: "LIBRARY + TV",
              href: "https://tv.apple.com/",
              logo: "/streaming-logos/appletv.svg",
            },
          ].map((service) => (
            <a
              className={styles.serviceCard}
              href={service.href}
              target="_blank"
              rel="noreferrer"
              key={service.name}
            >
              <span className={styles.serviceMark}>
                <img
                  src={service.logo}
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <span className={styles.serviceText}>
                <strong>{service.name}</strong>
                <small>{service.kind}</small>
              </span>
              <span className={styles.serviceArrow}>↗</span>
            </a>
          ))}
        </div>
      </section>


      <section className={styles.continueWatching}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>CONTINUE WATCHING</p>
            <h2>Pick up where you left off.</h2>
            <p className={styles.sectionCopy}>A few things already in progress — no digging through apps.</p>
          </div>
          <span className={styles.pickCount}>3 IN PROGRESS</span>
        </div>

        <div className={styles.continueGrid}>
          <article className={styles.continueCard}>
            <div className={styles.continueArt + " " + styles.continueOne} />
            <div className={styles.continueBody}>
              <div className={styles.continueMeta}>
                <span>APPLE TV</span>
                <span>SERIES</span>
              </div>
              <h3>Silo</h3>
              <p>Season 1 · Episode 7</p>
              <div className={styles.progressTrack}>
                <span style={{ width: "68%" }} />
              </div>
              <div className={styles.continueFooter}>
                <small>68% watched</small>
                <button type="button">Resume</button>
              </div>
            </div>
          </article>

          <article className={styles.continueCard}>
            <div className={styles.continueArt + " " + styles.continueTwo} />
            <div className={styles.continueBody}>
              <div className={styles.continueMeta}>
                <span>PRIME VIDEO</span>
                <span>SERIES</span>
              </div>
              <h3>Reacher</h3>
              <p>Season 3 · Episode 4</p>
              <div className={styles.progressTrack}>
                <span style={{ width: "42%" }} />
              </div>
              <div className={styles.continueFooter}>
                <small>42% watched</small>
                <button type="button">Resume</button>
              </div>
            </div>
          </article>

          <article className={styles.continueCard}>
            <div className={styles.continueArt + " " + styles.continueThree} />
            <div className={styles.continueBody}>
              <div className={styles.continueMeta}>
                <span>PARAMOUNT+</span>
                <span>SERIES</span>
              </div>
              <h3>Mayor of Kingstown</h3>
              <p>Season 3 · Episode 2</p>
              <div className={styles.progressTrack}>
                <span style={{ width: "31%" }} />
              </div>
              <div className={styles.continueFooter}>
                <small>31% watched</small>
                <button type="button">Resume</button>
              </div>
            </div>
          </article>
        </div>
      </section>


      <section className={styles.libraryShelf}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>FROM YOUR LIBRARY</p>
            <h2>Already yours.</h2>
            <p className={styles.sectionCopy}>Movies and shows you own — separate from whatever happens to be streaming this month.</p>
          </div>
          <span className={styles.pickCount}>5 OWNED</span>
        </div>

        <div className={styles.libraryGrid}>
          <article className={`${styles.libraryCard} ${styles.libraryOne}`}>
            <div className={styles.libraryShade} />
            <div className={styles.libraryTop}>
              <span>APPLE TV</span>
              <span className={styles.ownedBadge}>OWNED</span>
            </div>
            <div className={styles.libraryBottom}>
              <small>MOVIE</small>
              <h3>The Dark Knight</h3>
              <span>Purchased</span>
            </div>
          </article>

          <article className={`${styles.libraryCard} ${styles.libraryTwo}`}>
            <div className={styles.libraryShade} />
            <div className={styles.libraryTop}>
              <span>PRIME VIDEO</span>
              <span className={styles.ownedBadge}>OWNED</span>
            </div>
            <div className={styles.libraryBottom}>
              <small>MOVIE</small>
              <h3>Gladiator</h3>
              <span>Purchased</span>
            </div>
          </article>

          <article className={`${styles.libraryCard} ${styles.libraryThree}`}>
            <div className={styles.libraryShade} />
            <div className={styles.libraryTop}>
              <span>APPLE TV</span>
              <span className={styles.ownedBadge}>OWNED</span>
            </div>
            <div className={styles.libraryBottom}>
              <small>MOVIE</small>
              <h3>The Godfather</h3>
              <span>Purchased</span>
            </div>
          </article>

          <article className={`${styles.libraryCard} ${styles.libraryFour}`}>
            <div className={styles.libraryShade} />
            <div className={styles.libraryTop}>
              <span>PRIME VIDEO</span>
              <span className={styles.ownedBadge}>OWNED</span>
            </div>
            <div className={styles.libraryBottom}>
              <small>MOVIE</small>
              <h3>Heat</h3>
              <span>Purchased</span>
            </div>
          </article>

          <article className={`${styles.libraryCard} ${styles.libraryFive}`}>
            <div className={styles.libraryShade} />
            <div className={styles.libraryTop}>
              <span>APPLE TV</span>
              <span className={styles.ownedBadge}>OWNED</span>
            </div>
            <div className={styles.libraryBottom}>
              <small>MOVIE</small>
              <h3>Top Gun: Maverick</h3>
              <span>Purchased</span>
            </div>
          </article>
        </div>
      </section>

    </div>
  );
}
