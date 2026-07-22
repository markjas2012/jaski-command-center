import type { ReactNode } from "react";

type WidgetProps = {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
};

export default function Widget({
  title,
  children,
  className = "",
  action,
}: WidgetProps) {
  return (
    <section
      className={[
        "jaski-panel rounded-2xl border p-5 shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>

      <div>{children}</div>
    </section>
  );
}