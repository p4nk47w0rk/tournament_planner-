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
   * Add a goal to a match
   */
  static async addGoal(
    matchId: number,
    team: string,
    minute?: string | null,
    player?: string | null
  ): Promise<Goal> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("goals")
      .insert({
        match_id: matchId,
        team,
        minute: minute || null,
        player: player || null,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Goal created but no data returned");

    return {
      id: data.id,
      matchId: data.match_id,
      team: data.team,
      minute: data.minute,
      player: data.player,
      createdAt: data.created_at,
    };
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

    return data.map((row: GoalDbRow) => ({
      id: row.id,
      matchId: row.match_id,
      team: row.team,
      minute: row.minute,
      player: row.player,
      createdAt: row.created_at,
    }));
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
          callback({
            id: data.id,
            matchId: data.match_id,
            team: data.team,
            minute: data.minute,
            player: data.player,
            createdAt: data.created_at,
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}
