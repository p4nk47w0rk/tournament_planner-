import { INITIAL_MATCHES } from "@/lib/tournament-data";

export default function NextMatchesSection() {
  const upcomingMatches = INITIAL_MATCHES.filter(
    (m) => m.homeScore === null && m.awayScore === null
  ).slice(0, 3);

  if (upcomingMatches.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        Nächste Spiele
      </h2>
      <div className="space-y-3">
        {upcomingMatches.map((match) => (
          <div
            key={match.id}
            className="bg-paper dark:bg-dark-card border border-slate-hairline dark:border-dark-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-ink dark:text-dark-text">
                {match.homeTeam}
              </span>
              <span className="text-xs font-mono text-slate-stone dark:text-dark-text-secondary mx-3">
                {match.time}
              </span>
              <span className="font-medium text-slate-ink dark:text-dark-text">
                {match.awayTeam}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
