/**
 * Match-Service
 *
 * CRUD operations for matches. Bridge between static tournament data
 * and live Supabase data.
 */

import { createClient } from "@/lib/supabase/client";
import type { Match } from "@/lib/types";
import { INITIAL_MATCHES } from "@/lib/tournament-data";

interface SupabaseMatchRow {
  id: number;
  match_no: number;
  time: string;
  pitch: string;
  group_name: string;
  phase: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  fairplay: boolean;
  created_at?: string;
  updated_at?: string;
}

const TIMEOUT = 2000; // ms

/**
 * Wrap a thenable (Supabase builder) with a timeout.
 * The thenable is awaited; if it doesn't resolve within ms, rejects.
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

export class MatchService {
  /**
   * Get all matches from Supabase (or fallback to static data)
   */
  static async getAllMatches(): Promise<Match[]> {
    try {
      const supabase = createClient();
      const builder = supabase
        .from("matches")
        .select("*")
        .order("match_no", { ascending: true });

      const result = await withTimeout(
        builder as unknown as PromiseLike<{ data: unknown; error: unknown }>,
        TIMEOUT
      );

      if (result.error) throw result.error;
      const data = result.data as Match[] | null;
      if (data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn(
        "Failed to fetch matches from Supabase, using static data:",
        err
      );
    }

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

    let status: "scheduled" | "live" | "finished" = "scheduled";
    if (homeScore > 0 && awayScore > 0) {
      status = "finished";
    } else if (homeScore > 0 || awayScore > 0) {
      status = "live";
    }

    const builder = supabase
      .from("matches")
      .update({ home_score: homeScore, away_score: awayScore, status })
      .eq("id", matchId)
      .select()
      .single();

    const result = await withTimeout(
      builder as unknown as PromiseLike<{ data: unknown; error: unknown }>,
      TIMEOUT
    );

    if (result.error) throw result.error;
    const data = result.data as Match | null;
    if (!data) throw new Error("Match not found");

    return data;
  }

  /**
   * Subscribe to all match changes (realtime)
   * Uses unique channel name to avoid Supabase channel pooling issues
   * in React Strict Mode (double-mount).
   */
  static subscribeToAll(callback: () => void) {
    const supabase = createClient();

    const channelName = `all-matches-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const channel = supabase.channel(channelName);
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "matches",
      },
      () => {
        callback();
      }
    );
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  /**
   * Map Supabase row to Match interface
   */
  private static mapToMatch(row: SupabaseMatchRow): Match {
    return {
      id: row.id,
      matchNo: row.match_no,
      time: row.time,
      pitch: row.pitch as "A" | "B",
      group: row.group_name as "A" | "B",
      phase: row.phase as Match["phase"],
      homeTeam: row.home_team,
      awayTeam: row.away_team,
      homeScore: row.home_score,
      awayScore: row.away_score,
      status: row.status as Match["status"],
      fairplay: row.fairplay,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
