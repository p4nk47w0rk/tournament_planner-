/**
 * Match-Service
 *
 * CRUD operations for matches. Bridge between static tournament data
 * and live Supabase data.
 */

import { createClient } from "@/lib/supabase/client";
import type { Match, MatchDbRow } from "@/lib/types";
import { INITIAL_MATCHES } from "@/lib/tournament-data";

export class MatchService {
  /**
   * Get all matches from Supabase (or fallback to static data)
   */
  static async getAllMatches(): Promise<Match[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_no", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map((row) => this.mapToMatch(row));
      }
    } catch (err) {
      console.warn(
        "Failed to fetch matches from Supabase, using static data:",
        err
      );
    }

    // Fallback to static data
    return INITIAL_MATCHES;
  }

  /**
   * Update score for a match
   */
  static async updateScore(
    matchId: number,
    homeScore: number,
    awayScore: number
  ): Promise<Match> {
    const supabase = createClient();

    // Determine status based on scores
    let status: "scheduled" | "live" | "finished";
    if (homeScore === null && awayScore === null) {
      status = "scheduled";
    } else if (homeScore > 0 || awayScore > 0) {
      status = "live";
    } else {
      // Both scores are 0 or explicitly set to 0:0
      status = "finished";
    }

    const { data, error } = await supabase
      .from("matches")
      .update({ home_score: homeScore, away_score: awayScore, status })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Match not found");

    return this.mapToMatch(data);
  }

  /**
   * Subscribe to all match changes (realtime)
   */
  static subscribeToAll(callback: () => void) {
    const supabase = createClient();

    const channel = supabase
      .channel("all-matches")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  /**
   * Map Supabase row to Match interface
   */
  private static mapToMatch(row: MatchDbRow): Match {
    return {
      id: row.id,
      matchNo: row.match_no,
      time: row.time,
      pitch: row.pitch,
      group: row.group_name,
      phase: row.phase,
      homeTeam: row.home_team,
      awayTeam: row.away_team,
      homeScore: row.home_score,
      awayScore: row.away_score,
      status: row.status,
      fairplay: row.fairplay,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
