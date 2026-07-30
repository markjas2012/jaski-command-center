"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "./remote.module.css";

type RemoteService = {
  id: string;
  label: string;
  status: "online" | "offline" | "configured";
  detail: string;
};

type RemoteStatus = {
  checkedAt: string;
  services: RemoteService[];
};

export default function RemotePage() {
  const [status, setStatus] = useState<RemoteStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadStatus() {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch("/api/remote/status", { cache: "no-store" });
      if (!response.ok) throw new Error(`Remote status failed: ${response.status}`);

      setStatus((await response.json()) as RemoteStatus);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  const services = status?.services ?? [];

  return (
    <main className="app-shell">
      <Sidebar activePage="home" />

      <section className="content-stage" aria-label="Remote control">
        <div className={styles.room}>
          <header className={styles.hero}>
            <div>
              <p className={styles.eyebrow}>HOME CONTROL</p>
              <h1>Remote.</h1>
              <p className={styles.lead}>
                One control room for the services Jaski can actually reach.
              </p>
            </div>

            <div className={styles.heroMark} aria-hidden="true">R</div>
          </header>

          <section className={styles.statusPanel} aria-labelledby="remote-status-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>LIVE STATUS</p>
                <h2 id="remote-status-title">What Jaski can reach.</h2>
              </div>

              <button type="button" className={styles.refresh} onClick={loadStatus}>
                Refresh
              </button>
            </div>

            {loading && <p className={styles.message}>Checking configured services…</p>}

            {!loading && error && (
              <div className={styles.emptyState}>
                <strong>Status check unavailable.</strong>
                <p>The Remote page could not reach its local status endpoint.</p>
              </div>
            )}

            {!loading && !error && services.length === 0 && (
              <div className={styles.emptyState}>
                <strong>No remote services are configured on this machine.</strong>
                <p>
                  Jaski is not guessing at device state. Controls will appear here only
                  after the home services are connected.
                </p>
              </div>
            )}

            {!loading && !error && services.length > 0 && (
              <div className={styles.serviceGrid}>
                {services.map((service) => (
                  <article className={styles.serviceCard} key={service.id}>
                    <div className={styles.serviceTop}>
                      <span
                        className={`${styles.statusDot} ${styles[service.status]}`}
                        aria-hidden="true"
                      />
                      <span className={styles.statusLabel}>{service.status}</span>
                    </div>
                    <h3>{service.label}</h3>
                    <p>{service.detail}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className={styles.footer}>
            <a href="/">← Back home</a>
            {status?.checkedAt && (
              <span>
                Checked {new Date(status.checkedAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}
          </footer>
        </div>
      </section>
    </main>
  );
}
