"use client";

import type { Tournament } from "@/lib/tournament-context";

const STATUS_LABELS: Record<Tournament["status"], string> = {
  upcoming: "Kommt bald",
  live: "Live ⚽",
  finished: "Beendet",
};

export default function TournamentCard({
  tournament,
}: {
  tournament: Tournament;
}) {
  return (
    <div
      className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-dark-border rounded-2xl p-6
                    hover:border-sage dark:hover:border-dark-primary transition-all duration-200 group h-full"
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            tournament.status === "live"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : tournament.status === "upcoming"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-slate-100 text-slate-600 dark:bg-dark-secondary dark:text-dark-text-secondary"
          }`}
        >
          {STATUS_LABELS[tournament.status]}
        </span>

        {/* Arrow */}
        <svg
          className="w-5 h-5 text-slate-stone group-hover:text-sage dark:group-hover:text-dark-primary transition-colors -translate-x-1 group-hover:translate-x-0 group-hover:-translate-y-1 transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Tournament name */}
      <h3 className="font-bold text-slate-ink dark:text-dark-text text-lg mb-2 group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
        {tournament.name}
      </h3>

      {/* Date & location */}
      <div className="space-y-1 text-sm text-slate-stone dark:text-dark-text-secondary mb-4">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{tournament.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{tournament.location}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-slate-stone dark:text-dark-text-secondary border-t border-slate-hairline dark:border-dark-border pt-4">
        <span>
          {tournament.teamCount}{" "}
          {tournament.teamCount === 1 ? "Mannschaft" : "Mannschaften"}
        </span>
        <span>·</span>
        <span>{tournament.matchCount} Spiele</span>
        <span>·</span>
        <span>{tournament.groupCount} Gruppen</span>
      </div>
    </div>
  );
}
