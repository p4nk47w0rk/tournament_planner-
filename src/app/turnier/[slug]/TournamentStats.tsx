interface TournamentStatsProps {
  tournament: { teamCount: number; matchCount: number; groupCount: number };
  t: (k: string) => string;
}

export default function TournamentStats({
  tournament,
  t,
}: TournamentStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      <StatCard value={String(tournament.teamCount)} label={t("stats.teams")} />
      <StatCard
        value={String(tournament.matchCount)}
        label={t("stats.matches")}
      />
      <StatCard
        value={String(tournament.groupCount)}
        label={t("stats.groups")}
      />
      <StatCard
        value={String(tournament.groupCount * 2)}
        label={t("stats.fields")}
      />
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-paper border border-slate-hairline dark:border-dark-border rounded-xl p-4 text-center">
      <div className="text-2xl font-bold font-mono text-sage dark:text-dark-primary">
        {value}
      </div>
      <div className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}
