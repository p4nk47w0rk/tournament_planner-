import { useEffect, useState } from "react";
import { type Goal } from "@/lib/types";
import { GoalService } from "@/lib/services/goal-service";

export function useMatchGoals(matchId: number) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await GoalService.getGoals(matchId);
        setGoals(data);
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
    return GoalService.subscribeToGoals(matchId, (newGoal: Goal) => {
      setGoals((prev) => [...prev, newGoal]);
    });
  }, [matchId]);

  return goals as Array<{
    id: number;
    minute?: string;
    team: string;
    player?: string;
  }>;
}
