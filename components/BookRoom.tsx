"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./BookRoom.module.css";

type Shelf = "reading" | "next" | "finished";
type Book = {
  id: string;
  title: string;
  author: string;
  format: string;
  progress: string;
  shelf: Shelf;
};

const STORAGE_KEY = "jaski-books-v1";
const starter: Book[] = [];

export default function BookRoom() {
  const [books, setBooks] = useState<Book[]>(starter);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [targetShelf, setTargetShelf] = useState<Shelf>("reading");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setBooks(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books, ready]);

  const openNew = (shelf: Shelf) => {
    setTargetShelf(shelf);
    setEditing({ id: "", title: "", author: "", format: "Print", progress: "", shelf });
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || !editing.title.trim()) return;
    const book = { ...editing, title: editing.title.trim(), author: editing.author.trim(), shelf: targetShelf };
    if (book.id) setBooks((all) => all.map((b) => (b.id === book.id ? book : b)));
    else setBooks((all) => [...all, { ...book, id: crypto.randomUUID() }]);
    setEditing(null);
  };

  const move = (id: string, shelf: Shelf) =>
    setBooks((all) => all.map((b) => (b.id === id ? { ...b, shelf } : b)));
  const remove = (id: string) => setBooks((all) => all.filter((b) => b.id !== id));

  const cards = (shelf: Shelf) => books.filter((b) => b.shelf === shelf).map((book) => (
    <article className={styles.card} key={book.id}>
      <div className={styles.cardTop}><span>{book.format || "BOOK"}</span><span>{shelf === "reading" ? "READING" : shelf === "next" ? "UP NEXT" : "FINISHED"}</span></div>
      <h3>{book.title}</h3>
      <p>{book.author || "Author not entered"}{book.progress ? ` · ${book.progress}` : ""}</p>
      <div className={styles.actions}>
        {shelf === "reading" && <button onClick={() => move(book.id, "next")}>Read Later</button>}
        {shelf !== "finished" && <button onClick={() => move(book.id, "finished")}>Finished</button>}
        {shelf === "next" && <button onClick={() => move(book.id, "reading")}>Start Reading</button>}
        {shelf === "finished" && <button onClick={() => move(book.id, "reading")}>Read Again</button>}
        <button onClick={() => { setTargetShelf(book.shelf); setEditing(book); }}>Edit</button>
        <button className={styles.muted} onClick={() => remove(book.id)}>Remove</button>
      </div>
    </article>
  ));

  return (
    <div className={styles.room}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>OPEN A BOOK</p>
          <h1>Reading Room.</h1>
          <p>What you are reading, what is next, and the books worth keeping close.</p>
        </div>
        <div className={styles.seal}><strong>J</strong><span>PRIVATE LIBRARY</span></div>
        <div className={styles.heroFoot}><span>SPRINT 10 · COMPONENT 08</span><span>READ MORE. SCROLL LESS.</span></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.heading}><div><p className={styles.label}>READING NOW</p><h2>Keep your place.</h2></div><button className={styles.primary} onClick={() => openNew("reading")}>+ Add Book</button></div>
        {editing && targetShelf === "reading" && <Editor book={editing} setBook={setEditing} save={save} cancel={() => setEditing(null)} />}
        <div className={styles.grid}>{cards("reading")}</div>
        {!books.some(b => b.shelf === "reading") && !editing && <p className={styles.empty}>Your current book belongs here.</p>}
      </section>

      <div className={styles.twoCol}>
        <section className={styles.panel}>
          <div className={styles.heading}><div><p className={styles.label}>READ NEXT</p><h2>The short stack.</h2></div><button onClick={() => openNew("next")}>+ Add</button></div>
          {editing && targetShelf === "next" && <Editor book={editing} setBook={setEditing} save={save} cancel={() => setEditing(null)} />}
          <div className={styles.grid}>{cards("next")}</div>
          {!books.some(b => b.shelf === "next") && <p className={styles.empty}>Only books you genuinely want to read next.</p>}
        </section>
        <section className={styles.panel}>
          <p className={styles.label}>WORTH READING</p><h2>Worth knowing about.</h2>
          <p className={styles.empty}>A future home for recommendations and notable new releases—without turning this into a giant catalog.</p>
        </section>
      </div>

      <section className={styles.panel}>
        <p className={styles.label}>RECENTLY FINISHED</p><h2>Done, but not forgotten.</h2>
        <div className={styles.grid}>{cards("finished")}</div>
        {!books.some(b => b.shelf === "finished") && <p className={styles.empty}>Finished books will stay here until you remove them.</p>}
      </section>
    </div>
  );
}

function Editor({ book, setBook, save, cancel }: {
  book: Book; setBook: (book: Book) => void; save: (e: FormEvent<HTMLFormElement>) => void; cancel: () => void;
}) {
  return (
    <form className={styles.editor} onSubmit={save}>
      <label>Title<input autoFocus value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} /></label>
      <label>Author<input value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })} /></label>
      <label>Format<select value={book.format} onChange={(e) => setBook({ ...book, format: e.target.value })}><option>Print</option><option>Kindle</option><option>Audiobook</option><option>Other</option></select></label>
      <label>Progress<input placeholder="Page 142, 35%, Chapter 8..." value={book.progress} onChange={(e) => setBook({ ...book, progress: e.target.value })} /></label>
      <div className={styles.actions}><button type="submit">Save</button><button type="button" onClick={cancel}>Cancel</button></div>
    </form>
  );
}
