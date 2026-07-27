# Sidebar patch for Sprint 10.8

Do NOT replace the whole Sidebar.tsx.

## 1. Extend SidebarProps
Add `"books"` to the existing activePage union.

Example:
```tsx
activePage?: "home" | "jam" | "sports" | "golf" | "movies" | "tv" | "games" | "books";
```

## 2. Change only the Books entry
Change the existing Books item so it uses:

```tsx
{ label: "Books", icon: "▦", href: "/books", page: "books" },
```

Save, then test `/books`.
