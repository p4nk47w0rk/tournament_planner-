import { useState, useCallback, useEffect, useMemo } from "react";
import {
  INITIAL_MATCHES,
  PLAYOFF_MATCHES,
  type Match,
} from "@/lib/tournament-data";
import { MatchService } from "@/lib/services/match-service";
import { GoalService } from "@/lib/services/goal-service";

export function useScheduleData() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [playoffMatches, setPlayoffMatches] =
    useState<Match[]>(PLAYOFF_MATCHES);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await MatchService.getAllMatches();
        setMatches(data);
      } catch (err) {
        console.warn("Failed to load matches from Supabase:", err);
      }
    };
    loadMatches();
    return MatchService.subscribeToAll(() => loadMatches());
  }, []);

  const handleScoreChange = useCallback(
    async (matchId: number, team: "home" | "away", delta: number) => {
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id !== matchId) return m;
          const currentScore =
            team === "home" ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
          const newScore = Math.max(0, currentScore + delta);
          return {
            ...m,
            homeScore: team === "home" ? newScore : m.homeScore,
            awayScore: team === "away" ? newScore : m.awayScore,
          };
        })
      );
      try {
        const match = matches.find((m) => m.id === matchId);
        if (match) {
          const newHome =
            team === "home" ? (match.homeScore ?? 0) + delta : match.homeScore;
          const newAway =
            team === "away" ? (match.awayScore ?? 0) + delta : match.awayScore;
          await MatchService.updateScore(matchId, newHome ?? 0, newAway ?? 0);
        }
      } catch (err) {
        console.warn("Failed to save score to Supabase:", err);
      }
    },
    [matches]
  );

  const handleGoalAdd = useCallback(
    async (matchId: number, team: string, minute?: string, player?: string) => {
      try {
        await GoalService.addGoal(matchId, team, minute, player);
      } catch (err) {
        console.warn("Failed to save goal to Supabase:", err);
      }
    },
    []
  );

  const allTeamNames = useMemo(() => {
    const names = new Set<string>();
    matches.forEach((m) => {
      names.add(m.homeTeam);
      names.add(m.awayTeam);
    });
    return Array.from(names).sort();
  }, [matches]);

  return {
    matches,
    playoffMatches,
    setPlayoffMatches,
    handleScoreChange,
    handleGoalAdd,
    allTeamNames,
  };
}
