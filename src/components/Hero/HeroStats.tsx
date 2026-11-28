import StatCard from "./StatCard";

interface HeroStatsProps {
  t: (k: string) => string;
}

export default function HeroStats({ t }: HeroStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
      <StatCard value="10" label={t("hero.stats.teams")} />
      <StatCard value="20" label={t("hero.stats.matches")} />
      <StatCard value="2" label={t("hero.stats.fields")} />
      <StatCard value="2" label={t("hero.stats.groups")} />
    </div>
  );
}
