"use client";

import { useEffect, useState, useCallback } from "react";
import { type StandingsRow } from "@/lib/types";
import { MatchService } from "@/lib/services/match-service";
import { StandingsService } from "@/lib/services/standings-service";

interface StandingsTableProps {
  group: "A" | "B";
}

export default function StandingsTable({ group }: StandingsTableProps) {
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStandings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const matches = await MatchService.getAllMatches();
      const standingsData = StandingsService.getGroupStandings(matches, group);
      setStandings(standingsData);
    } catch (err) {
      console.error("Failed to load standings:", err);
      setError("Fehler beim Laden der Tabelle");
    } finally {
      setLoading(false);
    }
  }, [group]);

  // Initial load
  useEffect(() => {
    loadStandings();
  }, [loadStandings]);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = MatchService.subscribeToAll(() => {
      loadStandings();
    });
    return unsubscribe;
  }, [loadStandings]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-hairline bg-paper p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        role="table"
        aria-label={`Gruppenstand Gruppe ${group}`}
      >
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-hairline">
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone w-10">
              #
            </th>
            <th className="py-3 px-2 text-left font-semibold text-slate-900 text-slate-ink">
              Team
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone hidden sm:table-cell">
              Sp
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone hidden sm:table-cell">
              S
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone hidden md:table-cell">
              U
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone hidden sm:table-cell">
              N
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone">
              Tore
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone">
              TD
            </th>
            <th className="py-3 px-2 text-center font-semibold text-slate-600 text-slate-stone">
              Pkt
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.team}
              className={`border-b border-slate-hairline transition-colors ${
                row.rank! <= 2 ? "bg-green-50/50 dark:bg-green-900/10" : ""
              } hover:bg-slate-50 dark:hover:bg-dark-secondary/50`}
            >
              <td className="py-3 px-2 text-center font-bold text-slate-900 text-slate-ink">
                {row.rank}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  {row.rank! <= 2 && (
                    <span
                      className="w-2 h-2 rounded-full bg-green-500"
                      title="Playoff-Platz"
                    />
                  )}
                  {row.logo ? (
                    <img
                      src={row.logo}
                      alt={`${row.team} Logo`}
                      className="w-6 h-6 object-contain shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded bg-slate-200 dark:bg-dark-secondary shrink-0" />
                  )}
                  <span className="font-medium text-slate-900 text-slate-ink">
                    {row.team}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden sm:table-cell">
                {row.played}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden sm:table-cell">
                {row.won}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden md:table-cell">
                {row.drawn}
              </td>
              <td className="py-3 px-2 text-center text-slate-600 text-slate-stone hidden sm:table-cell">
                {row.lost}
              </td>
              <td className="py-3 px-2 text-center font-mono text-slate-700 text-slate-ink">
                {row.goalsFor}:{row.goalsAgainst}
              </td>
              <td className="py-3 px-2 text-center font-mono font-medium text-slate-700 text-slate-ink">
                {row.goalDifference > 0 ? "+" : ""}
                {row.goalDifference}
              </td>
              <td className="py-3 px-2 text-center font-bold text-slate-900 text-slate-ink">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
