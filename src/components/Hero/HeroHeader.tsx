export default function HeroHeader({ t }: { t: (k: string) => string }) {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-ink dark:text-dark-text mb-4">
        {t("hero.title")}
      </h1>
      <p className="text-xl sm:text-2xl text-slate-stone dark:text-dark-text-secondary font-light max-w-2xl mx-auto mb-8">
        {t("hero.tagline")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-stone dark:text-dark-text-secondary font-mono">
        <span>📅 {t("hero.date")}</span>
        <span>·</span>
        <span>🕐 {t("hero.time")}</span>
        <span>·</span>
        <span>📍 {t("hero.location")}</span>
      </div>
    </>
  );
}
