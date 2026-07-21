type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-white">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}