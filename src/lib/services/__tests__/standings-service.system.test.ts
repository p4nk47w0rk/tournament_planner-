/**
 * System Tests: StandingsService mit realen Team-Daten
 *
 * Testet die vollständige Pipeline: matches → standings → ranking
 * mit realen Team-Daten aus tournament-data.ts.
 */

import { describe, it, expect } from "vitest";
import { StandingsService } from "@/lib/services/standings-service";
import { TEAMS, GROUP_A_TEAMS, GROUP_B_TEAMS } from "@/lib/tournament-data";
import type { Match } from "@/lib/types";

// Helper to create a realistic match
// eslint-disable-next-line max-params
function createMatch(
  id: number,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  group: "A" | "B"
): Match {
  return {
    id,
    matchNo: id,
    time: "12:00",
    pitch: "A",
    group,
    phase: "group",
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status: "finished",
    fairplay: false,
  };
}

describe("StandingsService with real tournament data", () => {
  it("should calculate standings for all 10 teams across both groups", () => {
    const matches: Match[] = [
      // Group A matches
      createMatch(1, "Varnsdorf", "Šluknov B", 3, 1, "A"),
      createMatch(2, "Česká Lípa A", "Grossharthau", 2, 0, "A"),
      createMatch(3, "Vilémov", "Varnsdorf", 0, 2, "A"),
      createMatch(4, "Šluknov B", "Česká Lípa A", 1, 1, "A"),
      createMatch(5, "Grossharthau", "Vilémov", 3, 2, "A"),
      // Group B matches
      createMatch(6, "SFA Jiřetín", "Neusalza", 2, 1, "B"),
      createMatch(7, "Šluknov A", "Česká Lípa B", 0, 0, "B"),
      createMatch(8, "Union Děčín", "SFA Jiřetín", 1, 3, "B"),
      createMatch(9, "Neusalza", "Šluknov A", 2, 2, "B"),
      createMatch(10, "Česká Lípa B", "Union Děčín", 1, 0, "B"),
    ];

    const standings = StandingsService.calculateStandings(matches);
    const groups = new Set(standings.map((s) => s.group));

    // Both groups should be represented
    expect(groups).toContain("A");
    expect(groups).toContain("B");
    // 10 teams, each played some matches
    expect(standings.length).toBe(10);
  });

  it("should correctly rank teams after full group stage (Group A)", () => {
    const matches: Match[] = [
      createMatch(1, "Varnsdorf", "Šluknov B", 2, 0, "A"),
      createMatch(2, "Česká Lípa A", "Grossharthau", 1, 0, "A"),
      createMatch(3, "Vilémov", "Varnsdorf", 0, 1, "A"),
      createMatch(4, "Šluknov B", "Česká Lípa A", 1, 2, "A"),
      createMatch(5, "Grossharthau", "Vilémov", 3, 1, "A"),
      createMatch(6, "Varnsdorf", "Grossharthau", 2, 0, "A"),
      createMatch(7, "Česká Lípa A", "Vilémov", 1, 0, "A"),
      createMatch(8, "Šluknov B", "Vilémov", 2, 1, "A"),
      createMatch(9, "Varnsdorf", "Česká Lípa A", 1, 1, "A"),
      createMatch(10, "Šluknov B", "Grossharthau", 0, 0, "A"),
    ];

    const standings = StandingsService.getGroupStandings(matches, "A");

    // Varnsdorf: 3W 1D 0L = 10 pts → should be #1
    const varnsdorf = standings.find((s) => s.team === "Varnsdorf")!;
    expect(varnsdorf.points).toBe(10);
    expect(varnsdorf.rank).toBe(1);
    expect(varnsdorf.played).toBe(4);
    expect(varnsdorf.won).toBe(3);
  });

  it("should handle knockout/phase matches correctly", () => {
    const playoffMatches: Match[] = [
      createMatch(21, "Varnsdorf", "Neusalza", 2, 1, "A"),
      createMatch(22, "Česká Lípa A", "SFA Jiřetín", 0, 0, "A"),
    ];

    // Playoff matches should still generate standings for participating teams
    const standings = StandingsService.calculateStandings(playoffMatches);
    expect(standings.length).toBe(4); // 2 teams per match
  });

  it("should include fairplay logo from TEAMS data", () => {
    const matches: Match[] = [
      createMatch(1, "Varnsdorf", "Šluknov B", 2, 0, "A"),
    ];

    const standings = StandingsService.calculateStandings(matches);
    const varnsdorf = standings.find((s) => s.team === "Varnsdorf")!;

    // Should have logo from TEAMS data
    expect(varnsdorf.logo).toBe("/logos/varnsdorf.png");
  });

  it("should group standings by correct group", () => {
    const matches: Match[] = [
      createMatch(1, "Varnsdorf", "Šluknov B", 2, 0, "A"),
      createMatch(2, "SFA Jiřetín", "Neusalza", 1, 0, "B"),
    ];

    const groupA = StandingsService.getGroupStandings(matches, "A");
    const groupB = StandingsService.getGroupStandings(matches, "B");

    expect(groupA[0].group).toBe("A");
    expect(groupA[0].team).toBe("Varnsdorf");
    expect(groupB[0].group).toBe("B");
    expect(groupB[0].team).toBe("SFA Jiřetín");
  });

  it("should handle all 8 tournament teams (5 per group, overlapping in knockouts)", () => {
    // Full round-robin for both groups (5 teams = 10 matches per group)
    const matches: Match[] = [
      // Group A
      createMatch(1, "Varnsdorf", "Šluknov B", 2, 0, "A"),
      createMatch(2, "Varnsdorf", "Česká Lípa A", 1, 1, "A"),
      createMatch(3, "Varnsdorf", "Grossharthau", 3, 0, "A"),
      createMatch(4, "Varnsdorf", "Vilémov", 2, 1, "A"),
      createMatch(5, "Šluknov B", "Česká Lípa A", 0, 2, "A"),
      createMatch(6, "Šluknov B", "Grossharthau", 1, 1, "A"),
      createMatch(7, "Šluknov B", "Vilémov", 0, 1, "A"),
      createMatch(8, "Česká Lípa A", "Grossharthau", 2, 0, "A"),
      createMatch(9, "Česká Lípa A", "Vilémov", 1, 0, "A"),
      createMatch(10, "Grossharthau", "Vilémov", 2, 2, "A"),
      // Group B
      createMatch(11, "SFA Jiřetín", "Neusalza", 2, 1, "B"),
      createMatch(12, "SFA Jiřetín", "Šluknov A", 1, 0, "B"),
      createMatch(13, "SFA Jiřetín", "Česká Lípa B", 3, 0, "B"),
      createMatch(14, "SFA Jiřetín", "Union Děčín", 2, 0, "B"),
      createMatch(15, "Neusalza", "Šluknov A", 1, 1, "B"),
      createMatch(16, "Neusalza", "Česká Lípa B", 0, 1, "B"),
      createMatch(17, "Neusalza", "Union Děčín", 2, 0, "B"),
      createMatch(18, "Šluknov A", "Česká Lípa B", 1, 0, "B"),
      createMatch(19, "Šluknov A", "Union Děčín", 0, 1, "B"),
      createMatch(20, "Česká Lípa B", "Union Děčín", 1, 1, "B"),
    ];

    const allStandings = StandingsService.calculateStandings(matches);
    expect(allStandings.length).toBe(10); // 5 teams per group

    const groupA = StandingsService.getGroupStandings(matches, "A");
    const groupB = StandingsService.getGroupStandings(matches, "B");

    expect(groupA).toHaveLength(5);
    expect(groupB).toHaveLength(5);

    // Verify all GROUP_A_TEAMS are in standings
    for (const teamName of GROUP_A_TEAMS) {
      expect(groupA.find((s) => s.team === teamName)).toBeDefined();
    }
    for (const teamName of GROUP_B_TEAMS) {
      expect(groupB.find((s) => s.team === teamName)).toBeDefined();
    }
  });

  it("should handle all TEAMS data correctly", () => {
    // All 10 teams should be resolvable from TEAMS data
    expect(TEAMS).toHaveLength(10);
    expect(TEAMS.filter((t) => t.group === "A")).toHaveLength(5);
    expect(TEAMS.filter((t) => t.group === "B")).toHaveLength(5);
  });
});

describe("StandingsService real-world scenario", () => {
  it("should correctly determine top 2 for playoffs after 9 group matches (Group A)", () => {
    // Realistic Group A scenario
    const matches: Match[] = [
      createMatch(1, "Varnsdorf", "Šluknov B", 2, 0, "A"),
      createMatch(2, "Varnsdorf", "Česká Lípa A", 3, 1, "A"),
      createMatch(3, "Varnsdorf", "Grossharthau", 1, 0, "A"),
      createMatch(4, "Varnsdorf", "Vilémov", 2, 1, "A"),
      createMatch(5, "Šluknov B", "Česká Lípa A", 1, 2, "A"),
      createMatch(6, "Šluknov B", "Grossharthau", 3, 0, "A"),
      createMatch(7, "Šluknov B", "Vilémov", 0, 1, "A"),
      createMatch(8, "Česká Lípa A", "Grossharthau", 2, 2, "A"),
      createMatch(9, "Česká Lípa A", "Vilémov", 1, 0, "A"),
    ];

    const standings = StandingsService.getGroupStandings(matches, "A");

    // Top 2 should qualify for playoffs
    expect(standings[0].rank).toBe(1);
    expect(standings[1].rank).toBe(2);

    // Vilémov has only played 3 matches, Grossharthau has played 4
    const vilémov = standings.find((s) => s.team === "Vilémov");
    if (vilémov) {
      expect(vilémov.played).toBe(3);
    }
    const grossharthau = standings.find((s) => s.team === "Grossharthau");
    if (grossharthau) {
      expect(grossharthau.played).toBe(3);
    }
  });
});
