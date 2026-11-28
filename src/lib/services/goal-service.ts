/**
 * Goal-Service
 *
 * CRUD operations for goals. Used by Admin to track goals
 * during matches with optional time stamps and player names.
 */

import { createClient } from "@/lib/supabase/client";
import type { Goal, GoalDbRow } from "@/lib/types";

export class GoalService {
  /**
   * Normalize goal input data — pure function
   */
  static normalizeGoalData(
    matchId: number,
    team: string,
    minute: string | null | undefined,
    player: string | null | undefined
  ) {
    return {
      match_id: matchId,
      team,
      minute: minute || null,
      player: player || null,
    };
  }

  /**
   * Map Supabase row to Goal interface — pure function
   */
  static mapToGoal(row: GoalDbRow): Goal {
    return {
      id: row.id,
      matchId: row.match_id,
      team: row.team,
      minute: row.minute,
      player: row.player,
      createdAt: row.created_at,
    };
  }

  /**
   * Sort goals by creation time — pure function
   */
  static sortGoalsByTime(goals: Goal[]): Goal[] {
    return [...goals].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  /**
   * Add a goal to a match
   */
  static async addGoal(
    matchId: number,
    team: string,
    minute?: string | null,
    player?: string | null
  ): Promise<Goal> {
    const supabase = createClient();
    const data = this.normalizeGoalData(matchId, team, minute, player);

    const { data: result, error } = await supabase
      .from("goals")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    if (!result) throw new Error("Goal created but no data returned");

    return this.mapToGoal(result);
  }

  /**
   * Get all goals for a match, ordered by creation time
   */
  static async getGoals(matchId: number): Promise<Goal[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return this.sortGoalsByTime(data.map((row) => this.mapToGoal(row)));
  }

  /**
   * Remove a goal (admin only)
   */
  static async removeGoal(goalId: number): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from("goals").delete().eq("id", goalId);

    if (error) throw error;
  }

  /**
   * Subscribe to new goals for a match (realtime)
   */
  static subscribeToGoals(matchId: number, callback: (goal: Goal) => void) {
    const supabase = createClient();

    const channel = supabase
      .channel(`goals-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "goals",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const data = payload.new as GoalDbRow;
          callback(this.mapToGoal(data));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}
