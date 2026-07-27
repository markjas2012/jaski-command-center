"use client";

import { useMemo, useState } from "react";

type Favorite = {
  label: string;
  detail: string;
  href: string;
  mark: string;
};

type Props = {
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  resetFavorites: () => void;
};

export default function FavoritesEditor({
  favorites,
  setFavorites,
  resetFavorites,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Favorite[]>(favorites);

  const canSave = useMemo(
    () =>
      drafts.every(
        (item) =>
          item.label.trim().length > 0 &&
          item.href.trim().length > 0 &&
          item.mark.trim().length > 0
      ),
    [drafts]
  );

  function openEditor() {
    setDrafts(favorites.map((item) => ({ ...item })));
    setEditing(true);
  }

  function update(index: number, field: keyof Favorite, value: string) {
    setDrafts((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function remove(index: number) {
    setDrafts((current) => current.filter((_, i) => i !== index));
  }

  function add() {
    setDrafts((current) => [
      ...current,
      {
        label: "New favorite",
        detail: "Shortcut",
        href: "https://",
        mark: "N",
      },
    ]);
  }

  function save() {
    if (!canSave) return;
    setFavorites(
      drafts.map((item) => ({
        label: item.label.trim(),
        detail: item.detail.trim(),
        href: item.href.trim(),
        mark: item.mark.trim().slice(0, 2).toUpperCase(),
      }))
    );
    setEditing(false);
  }

  return (
    <>
      <button className="favorites-edit-button" type="button" onClick={openEditor}>
        Edit Favorites
      </button>

      {editing && (
        <div className="favorites-editor-overlay" role="dialog" aria-modal="true">
          <div className="favorites-editor-panel">
            <div className="favorites-editor-heading">
              <div>
                <p className="dashboard-eyebrow">ONE-CLICK ACCESS</p>
                <h2>Edit Favorites</h2>
                <p>Change the shortcuts shown on your homepage.</p>
              </div>
              <button type="button" onClick={() => setEditing(false)}>
                Close
              </button>
            </div>

            <div className="favorites-editor-list">
              {drafts.map((item, index) => (
                <div className="favorites-editor-row" key={`${item.label}-${index}`}>
                  <input
                    aria-label={`Favorite ${index + 1} mark`}
                    value={item.mark}
                    onChange={(e) => update(index, "mark", e.target.value)}
                    maxLength={2}
                  />
                  <input
                    aria-label={`Favorite ${index + 1} label`}
                    value={item.label}
                    onChange={(e) => update(index, "label", e.target.value)}
                  />
                  <input
                    aria-label={`Favorite ${index + 1} detail`}
                    value={item.detail}
                    onChange={(e) => update(index, "detail", e.target.value)}
                  />
                  <input
                    aria-label={`Favorite ${index + 1} URL`}
                    value={item.href}
                    onChange={(e) => update(index, "href", e.target.value)}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="favorites-editor-actions">
              <button type="button" onClick={add}>
                + Add Favorite
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFavorites();
                  setDrafts([]);
                  setEditing(false);
                }}
              >
                Reset Defaults
              </button>
              <button type="button" onClick={save} disabled={!canSave}>
                Save Favorites
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
