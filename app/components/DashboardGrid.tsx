import type { ReactNode } from "react";

type DashboardGridProps = {
  children: ReactNode;
};

export default function DashboardGrid({
  children,
}: DashboardGridProps) {
  return (
    <div
      className="
        grid
        gap-6
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {children}
    </div>
  );
}