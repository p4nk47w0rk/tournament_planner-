export default function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-paper border border-slate-hairline dark:border-dark-border rounded-xl p-4 text-center swatch-card">
      <div className="text-2xl font-bold font-mono text-sage dark:text-dark-primary">
        {value}
      </div>
      <div className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}
