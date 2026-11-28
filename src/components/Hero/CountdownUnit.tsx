export default function CountdownUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-ink dark:text-dark-text">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}
