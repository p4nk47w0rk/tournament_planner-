interface HeroStatusProps {
  liveStatus: "preparing" | "live" | "finished";
  t: (k: string) => string;
}

export default function HeroStatus({ liveStatus, t }: HeroStatusProps) {
  if (liveStatus === "finished") {
    return (
      <div className="text-center mb-12">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-dark-secondary text-sm text-slate-stone dark:text-dark-text-secondary font-medium">
          {t("hero.status.finished")}
        </span>
      </div>
    );
  }
  if (liveStatus === "live") {
    return (
      <div className="text-center mb-12">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-sm text-green-800 dark:text-green-300 font-medium">
          {t("hero.status.live")} ⚽
        </span>
      </div>
    );
  }
  return null;
}
