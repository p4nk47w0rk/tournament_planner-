/**
 * Unit Tests: GoalService — Pure Functions
 *
 * Testet mapToGoal, normalizeGoalData, sortGoalsByTime
 * ohne Supabase-Abhängigkeiten.
 */

import { describe, it, expect } from "vitest";
import { GoalService } from "@/lib/services/goal-service";
import type { Goal, GoalDbRow } from "@/lib/types";

describe("GoalService.mapToGoal", () => {
  it("should map DB row to Goal interface correctly", () => {
    const row: GoalDbRow = {
      id: 1,
      match_id: 5,
      team: "Varnsdorf",
      minute: "42",
      player: "Kuba",
      created_at: "2024-01-15T10:00:00Z",
    };

    const goal = GoalService.mapToGoal(row);

    expect(goal).toEqual<Goal>({
      id: 1,
      matchId: 5,
      team: "Varnsdorf",
      minute: "42",
      player: "Kuba",
      createdAt: "2024-01-15T10:00:00Z",
    });
  });

  it("should handle null minute and player", () => {
    const row: GoalDbRow = {
      id: 2,
      match_id: 5,
      team: "Šluknov B",
      minute: null,
      player: null,
      created_at: "2024-01-15T10:30:00Z",
    };

    const goal = GoalService.mapToGoal(row);
    expect(goal.minute).toBe(null);
    expect(goal.player).toBe(null);
  });

  it("should handle high match IDs and special characters", () => {
    const row: GoalDbRow = {
      id: 999,
      match_id: 99999,
      team: "Česká Lípa A",
      minute: "90+5",
      player: "Jan Novák",
      created_at: "2024-12-31T23:59:59Z",
    };

    const goal = GoalService.mapToGoal(row);
    expect(goal.matchId).toBe(99999);
    expect(goal.minute).toBe("90+5");
    expect(goal.player).toBe("Jan Novák");
  });
});

describe("GoalService.sortGoalsByTime", () => {
  const goals: Goal[] = [
    {
      id: 4,
      matchId: 1,
      team: "A",
      minute: "60",
      player: "P4",
      createdAt: "2024-01-15T11:00:00Z",
    },
    {
      id: 1,
      matchId: 1,
      team: "A",
      minute: "10",
      player: "P1",
      createdAt: "2024-01-15T10:10:00Z",
    },
    {
      id: 3,
      matchId: 1,
      team: "A",
      minute: "5",
      player: "P3",
      createdAt: "2024-01-15T10:05:00Z",
    },
    {
      id: 2,
      matchId: 1,
      team: "B",
      minute: "25",
      player: "P2",
      createdAt: "2024-01-15T10:25:00Z",
    },
  ];

  it("should sort by createdAt ascending", () => {
    const sorted = GoalService.sortGoalsByTime(goals);
    expect(sorted[0].id).toBe(3);
    expect(sorted[1].id).toBe(1);
    expect(sorted[2].id).toBe(2);
    expect(sorted[3].id).toBe(4);
  });

  it("should not mutate the original array", () => {
    const originalIds = goals.map((g) => g.id);
    GoalService.sortGoalsByTime(goals);
    expect(goals.map((g) => g.id)).toEqual(originalIds);
  });

  it("should return empty array for empty input", () => {
    expect(GoalService.sortGoalsByTime([])).toEqual([]);
  });

  it("should handle single goal", () => {
    const single: Goal[] = [
      {
        id: 1,
        matchId: 1,
        team: "A",
        minute: "10",
        player: "P1",
        createdAt: "2024-01-15T10:10:00Z",
      },
    ];
    expect(GoalService.sortGoalsByTime(single)).toEqual(single);
  });
});

describe("GoalService.normalizeGoalData", () => {
  it("should set minute to null when falsy", () => {
    const result = GoalService.normalizeGoalData(1, "Team", "", "Player");
    expect(result.minute).toBe(null);
  });

  it("should preserve truthy minute", () => {
    const result = GoalService.normalizeGoalData(1, "Team", "45", "Player");
    expect(result.minute).toBe("45");
  });

  it("should set player to null when falsy", () => {
    const result = GoalService.normalizeGoalData(1, "Team", null, "");
    expect(result.player).toBe(null);
  });

  it("should preserve truthy player", () => {
    const result = GoalService.normalizeGoalData(
      1,
      "Team",
      "45",
      "Player Name"
    );
    expect(result.player).toBe("Player Name");
  });

  it("should include match_id and team", () => {
    const result = GoalService.normalizeGoalData(99, "Varnsdorf", "42", "Kuba");
    expect(result.match_id).toBe(99);
    expect(result.team).toBe("Varnsdorf");
  });
});
