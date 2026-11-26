/**
 * Unit Tests: StandingsService
 *
 * Tests die pure Berechnungslogik — keine Side Effects,
 * keine Netzwerk-Abfragen, keine DOM-Abhängigkeiten.
 *
 * TDD Red-Green-Loop: Test zuerst, Code danach.
 */

import { describe, it, expect } from "vitest";
import { StandingsService } from "@/lib/services/standings-service";
import type { Match, StandingsRow } from "@/lib/types";

describe("StandingsService.calculateStandings", () => {
  it("should return empty array when no matches", () => {
    const standings = StandingsService.calculateStandings([]);
    expect(standings).toEqual([]);
  });

  it("should exclude teams without any played matches", () => {
    const matches: Match[] = [
      {
        id: 1,
        matchNo: 1,
        time: "09:00",
        pitch: "A" as const,
        group: "A" as const,
        phase: "group" as const,
        homeTeam: "Team A",
        awayTeam: "Team B",
        homeScore: null,
        awayScore: null,
        status: "scheduled",
        fairplay: false,
      },
    ];

    const standings = StandingsService.calculateStandings(matches);
    // Teams with 0 played games should not appear
    expect(standings).toEqual([]);
  });

  it("should calculate basic standings from one match", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 3, 1, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    expect(standings).toHaveLength(2);

    const teamA = standings.find((r) => r.team === "Team A")!;
    const teamB = standings.find((r) => r.team === "Team B")!;

    expect(teamA).toMatchObject({
      played: 1,
      won: 1,
      drawn: 0,
      lost: 0,
      goalsFor: 3,
      goalsAgainst: 1,
      goalDifference: 2,
      points: 3,
      group: "A",
    });

    expect(teamB).toMatchObject({
      played: 1,
      won: 0,
      drawn: 0,
      lost: 1,
      goalsFor: 1,
      goalsAgainst: 3,
      goalDifference: -2,
      points: 0,
      group: "A",
    });

    // Ranking: winner should be rank 1
    expect(teamA.rank).toBe(1);
    expect(teamB.rank).toBe(2);
  });

  it("should sort by points first", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 2, 0, "A"),
      StandingsService.createTestMatch(2, "Team C", "Team D", 3, 0, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    // Team C (3 pts) should be ranked higher than Team A (3 pts) — same points
    // Actually both have 3 points, so GD breaks tie
    // Team A: 3 pts, GD +2
    // Team C: 3 pts, GD +3
    // So Team C first
    expect(standings[0].team).toBe("Team C");
    expect(standings[1].team).toBe("Team A");
  });

  it("should sort by goal difference when points are equal", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 5, 1, "A"),
      StandingsService.createTestMatch(2, "Team C", "Team D", 3, 0, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    // Both have 3 points, but Team A has GD +4 vs Team C +3
    expect(standings[0].team).toBe("Team A");
    expect(standings[1].team).toBe("Team C");
  });

  it("should sort by goalsFor when points and GD are equal", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 2, 1, "A"),
      StandingsService.createTestMatch(2, "Team C", "Team D", 3, 2, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    // Both have 3 points, both have GD +1
    // Team A: GF 2, Team C: GF 3 → Team C first
    expect(standings[0].team).toBe("Team C");
    expect(standings[1].team).toBe("Team A");
  });

  it("should handle draw correctly", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 1, 1, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    const teamA = standings.find((r) => r.team === "Team A")!;
    expect(teamA.won).toBe(0);
    expect(teamA.drawn).toBe(1);
    expect(teamA.lost).toBe(0);
    expect(teamA.points).toBe(1);
  });

  it("should handle multiple matches for the same team", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 2, 0, "A"),
      StandingsService.createTestMatch(2, "Team A", "Team C", 1, 1, "A"),
      StandingsService.createTestMatch(3, "Team A", "Team D", 0, 3, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    const teamA = standings.find((r) => r.team === "Team A")!;
    expect(teamA.played).toBe(3);
    expect(teamA.won).toBe(1);
    expect(teamA.drawn).toBe(1);
    expect(teamA.lost).toBe(1);
    expect(teamA.goalsFor).toBe(3);
    expect(teamA.goalsAgainst).toBe(4);
    expect(teamA.goalDifference).toBe(-1);
    expect(teamA.points).toBe(4);
  });

  it("should handle ties in ranking (same points, GD, GF)", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 1, 0, "A"),
      StandingsService.createTestMatch(2, "Team C", "Team D", 1, 0, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    // All teams have 3 points, GD +1, GF 1
    // Rank should be sequential (1, 2, 3, 4)
    expect(standings.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
  });

  it("should only include teams that appear in group A or B", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "Team A", "Team B", 2, 1, "A"),
      StandingsService.createTestMatch(2, "Team C", "Team D", 3, 0, "B"),
    ];

    const standings = StandingsService.calculateStandings(matches);

    const groups = new Set(standings.map((r) => r.group));
    expect(groups).toContain("A");
    expect(groups).toContain("B");
    expect(groups.size).toBe(2);
  });
});

describe("StandingsService.getGroupStandings", () => {
  it("should filter by group", () => {
    const matches: Match[] = [
      StandingsService.createTestMatch(1, "A1", "A2", 2, 0, "A"),
      StandingsService.createTestMatch(2, "B1", "B2", 3, 1, "B"),
    ];

    const groupA = StandingsService.getGroupStandings(matches, "A");
    const groupB = StandingsService.getGroupStandings(matches, "B");

    expect(groupA).toHaveLength(2);
    expect(groupA.every((r) => r.group === "A")).toBe(true);

    expect(groupB).toHaveLength(2);
    expect(groupB.every((r) => r.group === "B")).toBe(true);
  });
});
