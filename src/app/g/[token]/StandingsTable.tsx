/**
 * StandingsTable — Gruppenstand-Tabelle
 *
 * Sortiert Teams nach Punkten/TD/Toren und rendert mit StandingsRow.
 * ≤ 60 Zeilen — KISS.
 */

import type { StandingsRow as StandingsRowType } from "@/lib/types";
import StandingsRow from "./StandingsRow";

interface StandingsTableProps {
  rows: StandingsRowType[];
}

export default function StandingsTable({ rows }: StandingsTableProps) {
  const sorted = [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const rankMap = new Map<string, number>();
  let currentRank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].points !== sorted[i - 1].points) {
      currentRank = i + 1;
    }
    rankMap.set(sorted[i].team, currentRank);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-hairline dark:border-dark-border">
            <th className="py-2 px-2 text-left text-xs font-medium text-slate-stone">
              #
            </th>
            <th className="py-2 px-2 text-left text-xs font-medium text-slate-stone">
              Team
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              Sp
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              Tore
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              TD
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              Pkt
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <StandingsRow
              key={row.team}
              row={row}
              rank={rankMap.get(row.team)!}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
