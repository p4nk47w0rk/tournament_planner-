/**
 * Integration Tests: MatchService mit mocktem Supabase
 *
 * Testet die vollständigen Service-Pipelines mit Supabase-Mock.
 * Mock nachbaut das fluent Query-Builder API von Supabase.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { MatchService } from "@/lib/services/match-service";
import { INITIAL_MATCHES } from "@/lib/tournament-data";
import type { Match } from "@/lib/types";

// Fluent Query Builder Mock — simuliert Supabases .select().eq().order() etc.
function createQueryBuilder(result: { data: unknown; error: unknown | null }) {
  const chainable = {
    order: vi.fn().mockResolvedValue(result),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
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

describe("MatchService integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllMatches", () => {
    it("should fetch from Supabase and return mapped matches", async () => {
      const mockRows = [
        {
          id: 1,
          match_no: 1,
          time: "09:15",
          pitch: "A" as const,
          group_name: "A" as const,
          phase: "group" as const,
          home_team: "Varnsdorf",
          away_team: "Šluknov B",
          home_score: null,
          away_score: null,
          status: "scheduled" as const,
          fairplay: false,
          created_at: "2024-01-10T08:00:00Z",
          updated_at: "2024-01-10T08:00:00Z",
        },
      ];

      mockSupabase.from.mockReturnValueOnce(
        createQueryBuilder({ data: mockRows, error: null })
      );

      const matches = await MatchService.getAllMatches();

      expect(matches).toHaveLength(1);
      expect(matches[0].homeTeam).toBe("Varnsdorf");
      expect(matches[0].awayTeam).toBe("Šluknov B");
    });

    it("should fallback to static data when Supabase fails", async () => {
      mockSupabase.from.mockReturnValueOnce(
        createQueryBuilder({ data: null, error: new Error("DB error") })
      );

      const matches = await MatchService.getAllMatches();

      // Should fall back to INITIAL_MATCHES
      expect(matches.length).toBeGreaterThan(0);
      expect(matches).toEqual(INITIAL_MATCHES);
    });

    it("should fallback when Supabase returns empty data", async () => {
      mockSupabase.from.mockReturnValueOnce(
        createQueryBuilder({ data: [], error: null })
      );

      const matches = await MatchService.getAllMatches();

      expect(matches).toEqual(INITIAL_MATCHES);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe("updateScore", () => {
    it("should update match score and return updated match", async () => {
      const mockUpdatedRow = {
        id: 1,
        match_no: 1,
        time: "09:15",
        pitch: "A" as const,
        group_name: "A" as const,
        phase: "group" as const,
        home_team: "Varnsdorf",
        away_team: "Šluknov B",
        home_score: 2,
        away_score: 1,
        status: "live" as const,
        fairplay: false,
        created_at: "2024-01-10T08:00:00Z",
        updated_at: "2024-01-15T14:30:00Z",
      };

      const chain = createQueryBuilder({ data: mockUpdatedRow, error: null });
      chain.update.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      const updatedMatch = await MatchService.updateScore(1, 2, 1);

      expect(updatedMatch.homeScore).toBe(2);
      expect(updatedMatch.awayScore).toBe(1);
      expect(updatedMatch.status).toBe("live");
    });

    it("should throw error when Supabase returns error", async () => {
      const chain = createQueryBuilder({
        data: null,
        error: new Error("Update failed"),
      });
      chain.update.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      await expect(MatchService.updateScore(999, 1, 0)).rejects.toThrow(
        "Update failed"
      );
    });

    it("should throw error when match not found", async () => {
      const chain = createQueryBuilder({ data: null, error: null });
      chain.update.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      await expect(MatchService.updateScore(999, 1, 0)).rejects.toThrow(
        "Match not found"
      );
    });
  });

  describe("determineStatus via updateScore", () => {
    it("should set status to 'finished' for 0-0", async () => {
      const chain = createQueryBuilder({
        data: {
          ...INITIAL_MATCHES[0],
          home_score: 0,
          away_score: 0,
          status: "finished" as const,
        },
        error: null,
      });
      chain.update.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      const match = await MatchService.updateScore(1, 0, 0);
      expect(match.status).toBe("finished");
    });

    it("should set status to 'live' for 1-1", async () => {
      const chain = createQueryBuilder({
        data: {
          ...INITIAL_MATCHES[0],
          home_score: 1,
          away_score: 1,
          status: "live" as const,
        },
        error: null,
      });
      chain.update.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      const match = await MatchService.updateScore(1, 1, 1);
      expect(match.status).toBe("live");
    });
  });

  describe("subscribeToAll", () => {
    it("should create a channel and subscribe", () => {
      const unsubscribeMock = vi.fn();
      mockSupabase.channel.mockReturnValueOnce({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockImplementation(() => ({
          unsubscribe: unsubscribeMock,
        })),
      });

      const unsubscribe = MatchService.subscribeToAll(vi.fn());

      expect(mockSupabase.channel).toHaveBeenCalledWith("all-matches");
      expect(unsubscribe).toBeDefined();
      expect(typeof unsubscribe).toBe("function");
    });
  });
});
