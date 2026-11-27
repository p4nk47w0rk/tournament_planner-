/**
 * Integration Tests: GoalService mit mocktem Supabase
 *
 * Testet vollständige CRUD-Pipelines mit Supabase-Mock.
 * Mock nachbaut das fluent Query-Builder API von Supabase.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoalService } from "@/lib/services/goal-service";
import type { GoalDbRow } from "@/lib/types";

// Fluent Query Builder Mock — simuliert Supabases .select().eq().order() etc.
function createQueryBuilder(result: {
  data: unknown | null;
  error: unknown | null;
}) {
  // delete returns a chainable for .eq() call, then .eq() returns resolved result
  const deleteChain = {
    eq: vi.fn().mockResolvedValue(result),
  };

  const chainable = {
    order: vi.fn().mockResolvedValue(result),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnValueOnce(deleteChain),
  } as const;
  return chainable;
}

// Supabase client mock
const mockSupabase = {
  from: vi.fn(() => createQueryBuilder({ data: null, error: null })),
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(),
  })),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

describe("GoalService integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addGoal", () => {
    it("should add a goal and return it", async () => {
      const mockRow: GoalDbRow = {
        id: 100,
        match_id: 5,
        team: "Varnsdorf",
        minute: "42",
        player: "Kuba",
        created_at: "2024-01-15T10:42:00Z",
      };

      const chain = createQueryBuilder({ data: mockRow, error: null });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);
      chain.single.mockResolvedValueOnce({ data: mockRow, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      const goal = await GoalService.addGoal(5, "Varnsdorf", "42", "Kuba");

      expect(goal.id).toBe(100);
      expect(goal.matchId).toBe(5);
      expect(goal.team).toBe("Varnsdorf");
      expect(goal.minute).toBe("42");
      expect(goal.player).toBe("Kuba");
    });

    it("should normalize empty minute to null", async () => {
      const mockRow: GoalDbRow = {
        id: 101,
        match_id: 5,
        team: "Šluknov B",
        minute: null,
        player: null,
        created_at: "2024-01-15T10:50:00Z",
      };

      const chain = createQueryBuilder({ data: mockRow, error: null });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);
      chain.single.mockResolvedValueOnce({ data: mockRow, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      const goal = await GoalService.addGoal(5, "Šluknov B");
      expect(goal.minute).toBe(null);
      expect(goal.player).toBe(null);
    });

    it("should throw when Supabase returns error", async () => {
      const chain = createQueryBuilder({
        data: null,
        error: new Error("Insert failed"),
      });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      await expect(
        GoalService.addGoal(5, "Varnsdorf", "42", "Kuba")
      ).rejects.toThrow("Insert failed");
    });

    it("should throw when no data returned", async () => {
      const chain = createQueryBuilder({ data: null, error: null });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);
      chain.single.mockResolvedValueOnce({ data: null, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      await expect(
        GoalService.addGoal(5, "Varnsdorf", "42", "Kuba")
      ).rejects.toThrow("Goal created but no data returned");
    });
  });

  describe("getGoals", () => {
    it("should return goals sorted by creation time", async () => {
      const mockRows: GoalDbRow[] = [
        {
          id: 1,
          match_id: 5,
          team: "A",
          minute: "60",
          player: "P4",
          created_at: "2024-01-15T11:00:00Z",
        },
        {
          id: 3,
          match_id: 5,
          team: "A",
          minute: "10",
          player: "P1",
          created_at: "2024-01-15T10:10:00Z",
        },
      ];

      const chain = createQueryBuilder({ data: mockRows, error: null });
      chain.select.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      const goals = await GoalService.getGoals(5);

      expect(goals).toHaveLength(2);
      expect(goals[0].id).toBe(3); // earliest first
      expect(goals[1].id).toBe(1);
    });

    it("should return empty array when no goals found", async () => {
      const chain = createQueryBuilder({ data: null, error: null });
      chain.select.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      const goals = await GoalService.getGoals(999);
      expect(goals).toEqual([]);
    });

    it("should throw when Supabase returns error", async () => {
      const chain = createQueryBuilder({
        data: null,
        error: new Error("Select failed"),
      });
      chain.select.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      await expect(GoalService.getGoals(5)).rejects.toThrow("Select failed");
    });
  });

  describe("removeGoal", () => {
    it("should delete a goal", async () => {
      mockSupabase.from.mockReturnValueOnce(
        createQueryBuilder({ data: null, error: null })
      );

      await expect(GoalService.removeGoal(1)).resolves.toBeUndefined();
    });

    it("should throw when deletion fails", async () => {
      mockSupabase.from.mockReturnValueOnce(
        createQueryBuilder({ data: null, error: new Error("Delete failed") })
      );

      await expect(GoalService.removeGoal(1)).rejects.toThrow("Delete failed");
    });
  });

  describe("subscribeToGoals", () => {
    it("should create a channel for the match", () => {
      const callback = vi.fn();
      mockSupabase.channel.mockReturnValueOnce({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn(),
      });

      GoalService.subscribeToGoals(5, callback);

      expect(mockSupabase.channel).toHaveBeenCalledWith("goals-5");
    });
  });
});
