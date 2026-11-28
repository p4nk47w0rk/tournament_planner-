"use client";

import { useEffect, useState, useCallback } from "react";
import { type StandingsRow } from "@/lib/types";
import { MatchService } from "@/lib/services/match-service";
import { StandingsService } from "@/lib/services/standings-service";
import StandingsTableHeader from "./StandingsTableHeader";
import StandingsBody from "./StandingsBody";

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
      setStandings(StandingsService.getGroupStandings(matches, group));
    } catch {
      setError("Fehler beim Laden der Tabelle");
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    loadStandings();
  }, [loadStandings]);
  useEffect(() => {
    const unsubscribe = MatchService.subscribeToAll(() => loadStandings());
    return unsubscribe;
  }, [loadStandings]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState text={error} />;
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        role="table"
        aria-label={`Gruppenstand Gruppe ${group}`}
      >
        <StandingsTableHeader />
        <StandingsBody standings={standings} />
      </table>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-slate-hairline bg-paper p-8">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-muted rounded w-1/4" />
        <div className="h-32 bg-muted rounded" />
      </div>
    </div>
  );
}

function ErrorState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4">
      <p className="text-red-600 dark:text-red-400">{text}</p>
    </div>
  );
}
