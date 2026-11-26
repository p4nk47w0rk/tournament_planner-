/**
 * Shared Types für Tournament Planner
 */

// ============================================
// Match Types
// ============================================

export type MatchPhase =
  "group" | "play_in" | "quarterfinal" | "semifinal" | "final" | "bronze";
export type MatchStatus = "scheduled" | "live" | "finished";

export interface Match {
  id: number;
  matchNo: number;
  time: string;
  pitch: "A" | "B";
  group: "A" | "B";
  phase: MatchPhase;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  fairplay: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Goal Types
// ============================================

export interface Goal {
  id: number;
  matchId: number;
  team: string;
  minute: string | null;
  player: string | null;
  createdAt: string;
}

// ============================================
// Standings Types
// ============================================

export interface StandingsRow {
  team: string;
  group: "A" | "B";
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairplayPoints: number;
  rank: number | null;
  logo?: string;
}

// ============================================
// Team Types
// ============================================

export interface Team {
  name: string;
  group: "A" | "B";
  shortName: string;
  color: string;
  logo?: string;
  founded?: string;
  stadium?: string;
  website?: string;
  address?: string;
  league?: string;
  about?: string;
}

// ============================================
// Auth Types
// ============================================

export type Role = "admin" | "guest";

export interface AuthState {
  user: import("@supabase/supabase-js").User | null;
  session: import("@supabase/supabase-js").Session | null;
  role: Role;
  isLoading: boolean;
  isAuthenticated: boolean;
}
