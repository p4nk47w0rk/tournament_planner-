/**
 * Unit Tests: MatchService — Pure Functions
 *
 * Testet mapToMatch, determineStatus
 * ohne Supabase-Abhängigkeiten.
 */

import { describe, it, expect } from "vitest";
import { MatchService } from "@/lib/services/match-service";
import type { Match, MatchDbRow } from "@/lib/types";

describe("MatchService.mapToMatch", () => {
  it("should map DB row to Match interface correctly", () => {
    const row: MatchDbRow = {
      id: 1,
      match_no: 5,
      time: "14:00",
      pitch: "A" as const,
      group_name: "A" as const,
      phase: "group",
      home_team: "Varnsdorf",
      away_team: "Šluknov B",
      home_score: 2,
      away_score: 1,
      status: "finished",
      fairplay: false,
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-15T14:30:00Z",
    };

    const match = MatchService.mapToMatch(row);

    expect(match).toEqual<Match>({
      id: 1,
      matchNo: 5,
      time: "14:00",
      pitch: "A",
      group: "A",
      phase: "group",
      homeTeam: "Varnsdorf",
      awayTeam: "Šluknov B",
      homeScore: 2,
      awayScore: 1,
      status: "finished",
      fairplay: false,
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
    });
  });

  it("should handle null scores as scheduled", () => {
    const row: MatchDbRow = {
      id: 2,
      match_no: 1,
      time: "09:15",
      pitch: "B" as const,
      group_name: "B" as const,
      phase: "group",
      home_team: "SFA Jiřetín",
      away_team: "Union Děčín",
      home_score: null,
      away_score: null,
      status: "scheduled",
      fairplay: true,
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-10T08:00:00Z",
    };

    const match = MatchService.mapToMatch(row);
    expect(match.homeScore).toBe(null);
    expect(match.awayScore).toBe(null);
    expect(match.fairplay).toBe(true);
  });

  it("should handle all phase types", () => {
    const phases: MatchDbRow["phase"][] = [
      "group",
      "play_in",
      "quarterfinal",
      "semifinal",
      "final",
      "bronze",
    ];

    for (const phase of phases) {
      const row: MatchDbRow = {
        id: 1,
        match_no: 1,
        time: "12:00",
        pitch: "A" as const,
        group_name: "A" as const,
        phase,
        home_team: "A",
        away_team: "B",
        home_score: 0,
        away_score: 0,
        status: "finished",
        fairplay: false,
        created_at: "2024-01-10T08:00:00Z",
        updated_at: "2024-01-10T08:00:00Z",
      };

      const match = MatchService.mapToMatch(row);
      expect(match.phase).toBe(phase);
    }
  });
});

describe("MatchService.determineStatus", () => {
  it("should return 'scheduled' when both scores are null", () => {
    expect(MatchService.determineStatus(null, null)).toBe("scheduled");
  });

  it("should return 'live' when home team has scored", () => {
    expect(MatchService.determineStatus(1, 0)).toBe("live");
    expect(MatchService.determineStatus(3, 1)).toBe("live");
  });

  it("should return 'live' when away team has scored", () => {
    expect(MatchService.determineStatus(0, 1)).toBe("live");
    expect(MatchService.determineStatus(1, 3)).toBe("live");
  });

  it("should return 'finished' when both scores are 0", () => {
    expect(MatchService.determineStatus(0, 0)).toBe("finished");
  });

  it("should handle high scores", () => {
    expect(MatchService.determineStatus(7, 6)).toBe("live");
    expect(MatchService.determineStatus(10, 10)).toBe("live");
  });
});
