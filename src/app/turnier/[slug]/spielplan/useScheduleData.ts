import { useState, useMemo, useCallback } from "react";
import { MatchService } from "@/lib/services/match-service";
import { GoalService } from "@/lib/services/goal-service";
import {
  INITIAL_MATCHES,
  PLAYOFF_MATCHES,
  type Match,
} from "@/lib/tournament-data";

export function useScheduleData() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [playoffMatches] = useState<Match[]>(PLAYOFF_MATCHES);
  const [editable, setEditable] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("edit-mode") === "true";
    return false;
  });

  const toggleEditMode = useCallback(() => {
    setEditable((e) => !e);
  }, []);

  const handleScoreChange = useCallback(
    async (matchId: number, team: "home" | "away", delta: number) => {
      setMatches((prev) => updateScoreOptimistic(prev, matchId, team, delta));
      try {
        const match = matches.find((m) => m.id === matchId);
        if (match) {
          const scores = computeNewScores(match, team, delta);
          await MatchService.updateScore(
            matchId,
            scores.newHome,
            scores.newAway
          );
        }
      } catch {
        /* local state already updated */
      }
    },
    [matches]
  );

  const handleGoalAdd = useCallback(
    async (matchId: number, team: string, minute?: string, player?: string) => {
      try {
        await GoalService.addGoal(matchId, team, minute, player);
      } catch {
        /* ignore */
      }
    },
    []
  );

  return {
    matches,
    playoffMatches,
    editable,
    toggleEditMode,
    handleScoreChange,
    handleGoalAdd,
    setEditable,
  };
}

function updateScoreOptimistic(
  prev: Match[],
  matchId: number,
  team: "home" | "away",
  delta: number
) {
  return prev.map((m) => {
    if (m.id !== matchId) return m;
    const current = team === "home" ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
    const newScore = Math.max(0, current + delta);
    return {
      ...m,
      homeScore: team === "home" ? newScore : m.homeScore,
      awayScore: team === "away" ? newScore : m.awayScore,
    };
  });
}

function computeNewScores(match: Match, team: "home" | "away", delta: number) {
  const baseHome = match.homeScore ?? 0;
  const baseAway = match.awayScore ?? 0;
  return {
    newHome: team === "home" ? baseHome + delta : baseHome,
    newAway: team === "away" ? baseAway + delta : baseAway,
  };
}
