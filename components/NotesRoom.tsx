"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import styles from "./NotesRoom.module.css";

type Tool = "pen" | "eraser" | "text";
const DRAW_KEY = "jaski-notes-drawing-v1";
const TEXT_KEY = "jaski-notes-text-v1";

export default function NotesRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  function ctx() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function resizeCanvas() {
    const canvas = canvasRef.current;
    const paper = paperRef.current;
    if (!canvas || !paper) return;
    const saved = canvas.toDataURL();
    const rect = paper.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const c = canvas.getContext("2d");
    if (!c) return;
    c.scale(ratio, ratio);
    c.lineCap = "round";
    c.lineJoin = "round";
    if (saved && saved !== "data:,") {
      const img = new Image();
      img.onload = () => c.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = saved;
    }
  }

  useEffect(() => {
    const savedText = localStorage.getItem(TEXT_KEY);
    if (savedText) setText(savedText);
    resizeCanvas();

    const savedDrawing = localStorage.getItem(DRAW_KEY);
    if (savedDrawing) {
      const canvas = canvasRef.current;
      const c = ctx();
      if (canvas && c) {
        const img = new Image();
        img.onload = () => {
          const rect = canvas.getBoundingClientRect();
          c.drawImage(img, 0, 0, rect.width, rect.height);
        };
        img.src = savedDrawing;
      }
    }
    setReady(true);
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(TEXT_KEY, text);
  }, [text, ready]);

  function point(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: PointerEvent<HTMLCanvasElement>) {
    if (tool === "text") return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const c = ctx();
    const p = point(e);
    if (!c) return;
    c.beginPath();
    c.moveTo(p.x, p.y);
  }

  function move(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || tool === "text") return;
    const c = ctx();
    if (!c) return;
    const p = point(e);
    if (tool === "eraser") {
      c.globalCompositeOperation = "destination-out";
      c.lineWidth = 22;
    } else {
      c.globalCompositeOperation = "source-over";
      c.strokeStyle = "#34455f";
      c.lineWidth = 2.4;
    }
    c.lineTo(p.x, p.y);
    c.stroke();
  }

  function finish() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) localStorage.setItem(DRAW_KEY, canvas.toDataURL());
  }

  function clearPage() {
    const canvas = canvasRef.current;
    const c = ctx();
    if (canvas && c) c.clearRect(0, 0, canvas.width, canvas.height);
    setText("");
    localStorage.removeItem(DRAW_KEY);
    localStorage.removeItem(TEXT_KEY);
  }

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>PAPER & PENCIL</p>
          <h1>Notes.</h1>
          <p>Write something down. Sketch an idea. Keep it simple.</p>
        </div>
        <div className={styles.mark}><strong>✎</strong><small>SCRATCHPAD</small></div>
        <div className={styles.foot}><span>SPRINT 10 · COMPONENT 11</span><span>THINK ON PAPER.</span></div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.toolbar}>
          <div>
            <p className={styles.kicker}>SCRATCHPAD</p>
            <h2>Blank page.</h2>
          </div>
          <div className={styles.tools}>
            <button className={tool === "pen" ? styles.active : ""} onClick={() => setTool("pen")}>✎ Pen</button>
            <button className={tool === "eraser" ? styles.active : ""} onClick={() => setTool("eraser")}>Eraser</button>
            <button className={tool === "text" ? styles.active : ""} onClick={() => setTool("text")}>T Text</button>
            <button onClick={clearPage}>Clear</button>
          </div>
        </div>

        <div ref={paperRef} className={styles.paper}>
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${tool === "text" ? styles.canvasText : ""}`}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={finish}
            onPointerCancel={finish}
          />
          <textarea
            className={`${styles.textarea} ${tool === "text" ? styles.textActive : ""}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={tool === "text" ? "Start typing…" : ""}
            aria-label="Typed notes"
          />
        </div>
        <p className={styles.saved}>Saved automatically on this device.</p>
      </section>
    </div>
  );
}
