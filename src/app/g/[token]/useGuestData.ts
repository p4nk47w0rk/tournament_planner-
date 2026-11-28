/**
 * useGuestData — Realtime-Daten für Guest-View
 *
 * Zentrale Datenbeschaffung + Echtzeit-Subscriptions.
 * ≤ 50 Zeilen — KISS.
 */

import { useEffect, useState } from "react";
import { MatchService } from "@/lib/services/match-service";
import { GoalService } from "@/lib/services/goal-service";
import { StandingsService } from "@/lib/services/standings-service";
import type { Match, Goal, StandingsRow } from "@/lib/types";

interface GuestData {
  matches: Match[];
  goals: Record<number, Goal[]>;
  standings: StandingsRow[];
  loading: boolean;
}

export default function useGuestData(): GuestData {
  const [matches, setMatches] = useState<Match[]>([]);
  const [goals, setGoals] = useState<Record<number, Goal[]>>({});
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    MatchService.getAllMatches().then((data) => {
      if (!cancelled) {
        setMatches(data);
        setStandings(StandingsService.calculateStandings(data));
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime match updates
  useEffect(
    () =>
      MatchService.subscribeToAll(() => {
        MatchService.getAllMatches().then((data) => {
          setMatches(data);
          setStandings(StandingsService.calculateStandings(data));
        });
      }),
    []
  );

  // Realtime goal updates
  useEffect(() => {
    const subs = matches.map((m) =>
      GoalService.subscribeToGoals(m.id, (goal: Goal) =>
        setGoals((p) => ({ ...p, [m.id]: [...(p[m.id] || []), goal] }))
      )
    );
    return () => subs.forEach((s) => s());
  }, [matches]);

  // Fetch existing goals
  useEffect(() => {
    matches.forEach((m) =>
      GoalService.getGoals(m.id).then((g) =>
        setGoals((p) => ({ ...p, [m.id]: g }))
      )
    );
  }, [matches]);

  return { matches, goals, standings, loading };
}
