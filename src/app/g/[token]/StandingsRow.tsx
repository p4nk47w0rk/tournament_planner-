/**
 * StandingsRow — Einzelne Zeile der Gruppentabelle
 *
 * Rendert ein Team mit Rank, Stats, Tordifferenz. ≤ 35 Zeilen — KISS.
 */

import type { StandingsRow } from "@/lib/types";

interface StandingsRowProps {
  row: StandingsRow;
  rank: number;
}

export default function StandingsRow({ row, rank }: StandingsRowProps) {
  return (
    <tr className="border-b border-slate-hairline/50 dark:border-dark-border/50">
      <td className="py-2 px-2 text-slate-stone">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-dark-surface text-xs">
          {rank}
        </span>
      </td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-2">
          {row.logo && (
            <img src={row.logo} alt="" className="w-5 h-5 rounded" />
          )}
          <span className="font-medium text-slate-ink dark:text-dark-text">
            {row.team}
          </span>
        </div>
      </td>
      <td className="py-2 px-2 text-center text-slate-stone">{row.played}</td>
      <td className="py-2 px-2 text-center text-slate-stone">
        {row.goalsFor}:{row.goalsAgainst}
      </td>
      <td className="py-2 px-2 text-center text-slate-stone">
        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
      </td>
      <td className="py-2 px-2 text-center font-semibold text-slate-ink dark:text-dark-text">
        {row.points}
      </td>
    </tr>
  );
}
