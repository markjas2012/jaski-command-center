# Sprint 10.9.1 — Sidebar Hotfix

In `components/Sidebar.tsx`:

1. Add `"bbq"` to the `activePage` union.
2. Remove the Hiking entry completely.
3. Set the Cooking / BBQ entry exactly to:

```tsx
{ label: "Cooking / BBQ", icon: "●", href: "/bbq", page: "bbq" },
```

Do not change the existing Home, Jam Room, St. Louis Sports, Golf, Movies,
TV Shows, Video Games, or Books entries.
