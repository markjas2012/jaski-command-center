"use client";

import { FormEvent, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password || working) return;

    setWorking(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, remember }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "Unable to sign in.");
        setWorking(false);
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/";

      window.location.replace(safeNext);
    } catch {
      setError("Unable to reach the sign-in service.");
      setWorking(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark}>J</span>
          <div>
            <p>JASKI</p>
            <small>PERSONAL COMMAND CENTER</small>
          </div>
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>PRIVATE ACCESS</p>
          <h1>Welcome home.</h1>
          <p>Enter your password to open Jaski&apos;s World.</p>
        </div>

        <form onSubmit={submit} className={styles.form}>
          <label className={styles.password}>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={working}
            />
          </label>

          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={working}
            />
            <span>
              <strong>Keep me signed in</strong>
              <small>Remember this device for 90 days.</small>
            </span>
          </label>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={!password || working}>
            {working ? "Opening..." : "Enter Jaski’s World"}
          </button>
        </form>

        <p className={styles.footer}>jaskisworld.com · Private</p>
      </section>
    </main>
  );
}
