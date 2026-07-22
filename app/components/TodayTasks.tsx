"use client";

import { FormEvent, useEffect, useState } from "react";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "jaski-dashboard-tasks";

const starterTasks: Task[] = [
  { id: "morning-review", text: "Morning review", done: false },
  { id: "check-calendar", text: "Check today's calendar", done: false },
  { id: "open-tasks", text: "Follow up on open tasks", done: false },
];

export default function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [newTask, setNewTask] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved) as Task[]);
      }
    } catch {
      // Keep the starter tasks if saved browser data cannot be read.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text,
        done: false,
      },
    ]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="jaski-muted">
          {remaining === 0 ? "All caught up" : `${remaining} remaining`}
        </span>
        {tasks.some((task) => task.done) && (
          <button
            type="button"
            onClick={() => setTasks((current) => current.filter((task) => !task.done))}
            className="jaski-muted transition hover:text-[var(--text-primary)]"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="jaski-panel-soft group flex items-center gap-3 rounded-xl border px-3 py-2.5"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
              aria-label={`Mark ${task.text} complete`}
            />

            <span
              className={`min-w-0 flex-1 text-sm ${
                task.done ? "jaski-muted line-through" : ""
              }`}
            >
              {task.text}
            </span>

            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="jaski-muted rounded px-2 py-1 text-sm opacity-60 transition hover:bg-black/10 hover:opacity-100"
              aria-label={`Delete ${task.text}`}
              title="Delete task"
            >
              ×
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="jaski-panel-soft jaski-muted rounded-xl border border-dashed p-4 text-center text-sm">
            Nothing on the list. Enjoy the clear board.
          </div>
        )}
      </div>

      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add something for today…"
          className="jaski-panel-soft min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          className="jaski-accent rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:brightness-105"
        >
          Add
        </button>
      </form>
    </div>
  );
}
