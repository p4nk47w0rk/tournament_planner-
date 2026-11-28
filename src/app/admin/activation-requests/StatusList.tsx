interface StatusItem {
  id: string;
  email: string;
  created_at: string;
}

interface StatusListProps {
  items: StatusItem[];
  color: "green" | "red";
  label: string;
  statusText: string;
  t: (k: string) => string;
}

export default function StatusList({
  items,
  color,
  label,
  statusText,
  t,
}: StatusListProps) {
  if (items.length === 0) return null;
  const dotColor = color === "green" ? "bg-green-500" : "bg-red-500";
  const textColor =
    color === "green"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        {label} ({items.length})
      </h2>
      <div className="space-y-2">
        {items.map((req) => (
          <div
            key={req.id}
            className="bg-paper dark:bg-dark-bg border border-slate-hairline dark:border-dark-border rounded-xl p-4 flex items-center justify-between opacity-60"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-ink dark:text-dark-text truncate">
                {req.email}
              </p>
              <p className="text-xs text-slate-stone dark:text-dark-text-secondary mt-0.5">
                {new Date(req.created_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={`text-xs font-medium shrink-0 ${textColor}`}>
              {statusText}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
