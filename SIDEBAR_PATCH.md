# Sprint 10.7 Sidebar change

In `components/Sidebar.tsx`, update the existing Video Games entry:

```tsx
{ label: "Video Games", icon: "◆", href: "/games", page: "games" },
```

Also add `"games"` to the `activePage` union type.

Example:

```tsx
type SidebarProps = {
  activePage?: "home" | "jam" | "sports" | "golf" | "movies" | "tv" | "games";
};
```

Do not replace your whole Sidebar.tsx if it already contains working Sprint 10 routes.
