import { useTranslations } from "next-intl";

interface MatchHeaderProps {
  time: string;
  pitch: string;
  group: string;
  status: "finished" | "upcoming";
}

export default function MatchHeader({
  time,
  pitch,
  group,
  status,
}: MatchHeaderProps) {
  const t = useTranslations("schedule");
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium text-slate-600 dark:text-dark-text-secondary">
          {time}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary">
          {t("field")} {pitch}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary">
          {t("group")} {group}
        </span>
      </div>
      <StatusBadge status={status} t={t} />
    </div>
  );
}

function StatusBadge({
  status,
  t,
}: {
  status: string;
  t: (k: string) => string;
}) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${status === "finished" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}
    >
      {status === "finished" ? t("finished") : t("upcoming")}
    </span>
  );
}
