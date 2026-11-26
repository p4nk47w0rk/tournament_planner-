/**
 * Goal-Service
 *
 * CRUD operations for goals. Used by Admin to track goals
 * during matches with optional time stamps and player names.
 */

import { createClient } from "@/lib/supabase/client";
import type { Goal } from "@/lib/types";

const TIMEOUT = 2000; // ms

type QueryResult<T> = { data: T | null; error: unknown };

/**
 * Wrap a thenable (Supabase builder) with a timeout.
 * Uses PromiseLike cast — Supabase builders are awaitable at runtime.
 */
function withTimeout<T>(thenable: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out after 2s"));
    }, ms);

    thenable.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (reason) => {
        clearTimeout(timer);
        reject(reason);
      }
    );
  });
}

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

    const builder = supabase
      .from("goals")
      .insert({
        match_id: matchId,
        team,
        minute: minute || null,
        player: player || null,
      })
      .select()
      .single();

    const result = await withTimeout(
      builder as unknown as PromiseLike<QueryResult<Goal>>,
      TIMEOUT
    );

    if (result.error) throw result.error;
    if (!result.data) throw new Error("Goal created but no data returned");

    return result.data;
  }

  /**
   * Get all goals for a match, ordered by creation time
   */
  static async getGoals(matchId: number): Promise<Goal[]> {
    const supabase = createClient();

    const builder = supabase
      .from("goals")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });

    const result = await withTimeout(
      builder as unknown as PromiseLike<QueryResult<Goal[]>>,
      TIMEOUT
    );

    if (result.error) throw result.error;
    if (!result.data) return [];

    return result.data;
  }

  /**
   * Remove a goal (admin only)
   */
  static async removeGoal(goalId: number): Promise<void> {
    const supabase = createClient();

    const builder = supabase.from("goals").delete().eq("id", goalId);

    const result = await withTimeout(
      builder as unknown as PromiseLike<QueryResult<null>>,
      TIMEOUT
    );

    if (result.error) throw result.error;
  }

  /**
   * Subscribe to new goals for a match (realtime)
   */
  static subscribeToGoals(matchId: number, callback: (goal: Goal) => void) {
    const supabase = createClient();

    const channel = supabase.channel(`goals-${matchId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "goals",
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        const data = payload.new as unknown as Goal;
        callback(data);
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}
