"use client";

import { ChangeEvent, PointerEvent, useEffect, useRef, useState } from "react";
import styles from "./NotesRoom.module.css";

type Tool = "pen" | "eraser" | "text";
type Mode = "spiral" | "dot" | "dos";

const MODE_KEY = "jaski-notes-mode-v2";
const textKey = (mode: Mode) => `jaski-notes-text-v2-${mode}`;
const drawKey = (mode: Mode) => `jaski-notes-drawing-v2-${mode}`;
const LEGACY_TEXT_KEY = "jaski-notes-text-v1";
const LEGACY_DRAW_KEY = "jaski-notes-drawing-v1";

export default function NotesRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const modeRef = useRef<Mode>("spiral");
  const [mode, setMode] = useState<Mode>("spiral");
  const [tool, setTool] = useState<Tool>("pen");
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  function ctx() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function saveDrawing(activeMode = modeRef.current) {
    const canvas = canvasRef.current;
    if (canvas && activeMode !== "dos") {
      localStorage.setItem(drawKey(activeMode), canvas.toDataURL());
    }
  }

  function sizeAndLoadCanvas(activeMode = modeRef.current) {
    const canvas = canvasRef.current;
    const paper = paperRef.current;
    if (!canvas || !paper) return;
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
    const saved = localStorage.getItem(drawKey(activeMode));
    if (saved && activeMode !== "dos") {
      const img = new Image();
      img.onload = () => c.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = saved;
    }
  }

  useEffect(() => {
    if (
      !localStorage.getItem(textKey("spiral")) &&
      localStorage.getItem(LEGACY_TEXT_KEY)
    ) {
      localStorage.setItem(
        textKey("spiral"),
        localStorage.getItem(LEGACY_TEXT_KEY) ?? "",
      );
    }
    if (
      !localStorage.getItem(drawKey("spiral")) &&
      localStorage.getItem(LEGACY_DRAW_KEY)
    ) {
      localStorage.setItem(
        drawKey("spiral"),
        localStorage.getItem(LEGACY_DRAW_KEY) ?? "",
      );
    }
    const stored = localStorage.getItem(MODE_KEY) as Mode | null;
    const initial: Mode =
      stored === "dot" || stored === "dos" ? stored : "spiral";
    modeRef.current = initial;
    setMode(initial);
    setTool(initial === "dos" ? "text" : "pen");
    setText(localStorage.getItem(textKey(initial)) ?? "");
    requestAnimationFrame(() => sizeAndLoadCanvas(initial));
    setReady(true);

    const onResize = () => {
      saveDrawing(modeRef.current);
      sizeAndLoadCanvas(modeRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(textKey(mode), text);
  }, [text, mode, ready]);

  function selectMode(nextMode: Mode) {
    if (nextMode === modeRef.current) return;
    saveDrawing(modeRef.current);
    localStorage.setItem(textKey(modeRef.current), text);
    modeRef.current = nextMode;
    localStorage.setItem(MODE_KEY, nextMode);
    setMode(nextMode);
    setText(localStorage.getItem(textKey(nextMode)) ?? "");
    setTool(nextMode === "dos" ? "text" : "pen");
    requestAnimationFrame(() => sizeAndLoadCanvas(nextMode));
  }

  function point(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: PointerEvent<HTMLCanvasElement>) {
    if (tool === "text" || mode === "dos") return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const c = ctx();
    const p = point(e);
    if (!c) return;
    c.beginPath();
    c.moveTo(p.x, p.y);
  }

  function move(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || tool === "text" || mode === "dos") return;
    const c = ctx();
    if (!c) return;
    const p = point(e);
    if (tool === "eraser") {
      c.globalCompositeOperation = "destination-out";
      c.lineWidth = 22;
    } else {
      c.globalCompositeOperation = "source-over";
      c.strokeStyle = "#2e392e";
      c.lineWidth = 2.4;
    }
    c.lineTo(p.x, p.y);
    c.stroke();
  }

  function finish() {
    if (!drawing.current) return;
    drawing.current = false;
    saveDrawing();
  }

  function clearPage() {
    const canvas = canvasRef.current;
    const c = ctx();
    if (canvas && c) c.clearRect(0, 0, canvas.width, canvas.height);
    setText("");
    localStorage.removeItem(drawKey(mode));
    localStorage.removeItem(textKey(mode));
  }

  function downloadFile(name: string, contents: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadPage() {
    const label =
      mode === "spiral"
        ? "spiral-notebook"
        : mode === "dot"
          ? "dot-grid"
          : "dos-prompt";
    downloadFile(`jaski-${label}.txt`, text, "text/plain;charset=utf-8");
  }

  function backupAll() {
    saveDrawing(modeRef.current);
    localStorage.setItem(textKey(modeRef.current), text);
    const payload = {
      format: "jaski-notes-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      activeMode: modeRef.current,
      modes: {
        spiral: {
          text: localStorage.getItem(textKey("spiral")) ?? "",
          drawing: localStorage.getItem(drawKey("spiral")),
        },
        dot: {
          text: localStorage.getItem(textKey("dot")) ?? "",
          drawing: localStorage.getItem(drawKey("dot")),
        },
        dos: {
          text: localStorage.getItem(textKey("dos")) ?? "",
          drawing: null,
        },
      },
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(
      `jaski-notes-backup-${date}.json`,
      JSON.stringify(payload, null, 2),
      "application/json",
    );
  }

  async function restoreBackup(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (payload?.format !== "jaski-notes-backup" || !payload?.modes)
        throw new Error("Invalid backup");
      (["spiral", "dot", "dos"] as Mode[]).forEach((itemMode) => {
        const item = payload.modes[itemMode];
        if (typeof item?.text === "string")
          localStorage.setItem(textKey(itemMode), item.text);
        if (itemMode !== "dos" && typeof item?.drawing === "string")
          localStorage.setItem(drawKey(itemMode), item.drawing);
      });
      const restoredMode: Mode =
        payload.activeMode === "dot" || payload.activeMode === "dos"
          ? payload.activeMode
          : "spiral";
      modeRef.current = restoredMode;
      localStorage.setItem(MODE_KEY, restoredMode);
      setMode(restoredMode);
      setTool(restoredMode === "dos" ? "text" : "pen");
      setText(localStorage.getItem(textKey(restoredMode)) ?? "");
      requestAnimationFrame(() => sizeAndLoadCanvas(restoredMode));
    } catch {
      window.alert("That file is not a valid Jaski Notes backup.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.heroBrand}>
          <h1>JASKI</h1>
          <p>FIELD NOTES &amp; IDEAS</p>
          <span aria-hidden="true">❧</span>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.commandBar}>
          <div className={styles.modes} aria-label="Writing mode">
            <button
              className={mode === "spiral" ? styles.modeActive : ""}
              onClick={() => selectMode("spiral")}
            >
              ▤ <span>Spiral Notebook</span>
            </button>
            <button
              className={mode === "dot" ? styles.modeActive : ""}
              onClick={() => selectMode("dot")}
            >
              ⠿ <span>Dot Grid</span>
            </button>
            <button
              className={`${styles.dosMode} ${mode === "dos" ? styles.dosActive : ""}`}
              onClick={() => selectMode("dos")}
            >
              &gt;_ <span>DOS Prompt</span>
            </button>
          </div>

          <div className={styles.links}>
            <a
              href="https://www.icloud.com/reminders"
              target="_blank"
              rel="noreferrer"
            >
              <span
                className={`${styles.serviceIcon} ${styles.remindersIcon}`}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>
              <span>Apple Reminders</span>
              <b aria-hidden="true">↗</b>
            </a>
            <a
              href="https://to-do.office.com/tasks/"
              target="_blank"
              rel="noreferrer"
            >
              <span
                className={`${styles.serviceIcon} ${styles.todoIcon}`}
                aria-hidden="true"
              >
                ✓
              </span>
              <span>Microsoft To Do</span>
              <b aria-hidden="true">↗</b>
            </a>
          </div>

          <div className={styles.storageArea}>
            <p className={styles.saved}>
              <i aria-hidden="true" /> Saved locally
            </p>
            <div className={styles.transferTools}>
              <button onClick={downloadPage}>↓ Page</button>
              <button onClick={backupAll}>↓ Backup all</button>
              <button onClick={() => importRef.current?.click()}>
                ↑ Restore
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                onChange={restoreBackup}
              />
            </div>
          </div>
        </div>

        <div className={styles.toolRow}>
          <p>
            {mode === "spiral"
              ? "RULED FIELD BOOK"
              : mode === "dot"
                ? "DOT-GRID FIELD BOOK"
                : "C:\\JASKI\\NOTES>"}
          </p>
          <div className={styles.tools}>
            <button
              disabled={mode === "dos"}
              className={tool === "pen" ? styles.active : ""}
              onClick={() => setTool("pen")}
            >
              ✎ Pen
            </button>
            <button
              disabled={mode === "dos"}
              className={tool === "eraser" ? styles.active : ""}
              onClick={() => setTool("eraser")}
            >
              ▱ Eraser
            </button>
            <button
              className={tool === "text" ? styles.active : ""}
              onClick={() => setTool("text")}
            >
              T Text
            </button>
            <button onClick={clearPage}>⌫ Clear</button>
          </div>
        </div>

        <div ref={paperRef} className={`${styles.paper} ${styles[mode]}`}>
          {mode !== "dos" && (
            <div className={styles.spiralBinding} aria-hidden="true" />
          )}
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${tool === "text" || mode === "dos" ? styles.canvasText : ""}`}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={finish}
            onPointerCancel={finish}
          />
          <textarea
            className={`${styles.textarea} ${tool === "text" || mode === "dos" ? styles.textActive : ""}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === "dos" ? "_" : tool === "text" ? "Start typing…" : ""
            }
            aria-label={`${mode} notes`}
            spellCheck={mode !== "dos"}
          />
        </div>
      </section>
    </div>
  );
}
