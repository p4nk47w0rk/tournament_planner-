/**
 * System Tests: API Route Handler
 *
 * Testet die API Route Handler direkt — mockt nur Supabase Auth/DB.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/goals/route";
import type { GoalDbRow } from "@/lib/types";

// Fluent Query Builder Mock
function createQueryBuilder(result: {
  data: unknown | null;
  error: unknown | null;
}) {
  const chainable = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue(result),
  };
  return chainable;
}

// Mock Supabase server client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => createQueryBuilder({ data: null, error: null })),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => mockSupabase,
}));

// Helper to create a NextRequest
function createRequest(
  url: string,
  options?: { method?: string; body?: object }
) {
  return new NextRequest(url, {
    method: options?.method,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
}

describe("API /api/goals — System Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/goals", () => {
    it("should return 400 when matchId is missing", async () => {
      const request = createRequest("http://localhost/api/goals");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("matchId parameter is required");
    });

    it("should return goals from Supabase", async () => {
      const mockGoals: GoalDbRow[] = [
        {
          id: 1,
          match_id: 5,
          team: "Varnsdorf",
          minute: "42",
          player: "Kuba",
          created_at: "2024-01-15T10:42:00Z",
        },
        {
          id: 2,
          match_id: 5,
          team: "Šluknov B",
          minute: "55",
          player: null,
          created_at: "2024-01-15T10:55:00Z",
        },
      ];

      const chain = createQueryBuilder({ data: mockGoals, error: null });
      chain.select.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.order.mockResolvedValueOnce({ data: mockGoals, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      const request = createRequest("http://localhost/api/goals?matchId=5");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveLength(2);
      expect(body[0].team).toBe("Varnsdorf");
    });

    it("should return empty array when no goals found", async () => {
      const chain = createQueryBuilder({ data: null, error: null });
      chain.select.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.order.mockResolvedValueOnce({ data: null, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      const request = createRequest("http://localhost/api/goals?matchId=999");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual([]);
    });

    it("should return 500 when Supabase errors", async () => {
      const chain = createQueryBuilder({
        data: null,
        error: { message: "DB connection failed" },
      });
      chain.select.mockReturnValueOnce(chain);
      chain.eq.mockReturnValueOnce(chain);
      chain.order.mockResolvedValueOnce({
        data: null,
        error: { message: "DB connection failed" },
      });

      mockSupabase.from.mockReturnValueOnce(chain);

      const request = createRequest("http://localhost/api/goals?matchId=5");
      const response = await GET(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("DB connection failed");
    });
  });

  describe("POST /api/goals", () => {
    it("should return 401 when not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { matchId: 5, team: "Varnsdorf" },
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("should return 400 when matchId is missing", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "123" } },
        error: null,
      });

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { team: "Varnsdorf" },
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("matchId and team are required");
    });

    it("should return 400 when team is invalid", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "123" } },
        error: null,
      });

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { matchId: 5, team: "InvalidTeamX" },
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("Invalid team name");
    });

    it("should return 400 when matchId is not a number", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "123" } },
        error: null,
      });

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { matchId: "abc", team: "Varnsdorf" },
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("matchId must be a number");
    });

    it("should insert goal and return 201 on success", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "123" } },
        error: null,
      });

      const insertedGoal = {
        id: 100,
        match_id: 5,
        team: "Varnsdorf",
        minute: "42",
        player: "Kuba",
        created_at: "2024-01-15T10:42:00Z",
      };

      const chain = createQueryBuilder({ data: insertedGoal, error: null });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);
      chain.single.mockResolvedValueOnce({ data: insertedGoal, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { matchId: 5, team: "Varnsdorf", minute: "42", player: "Kuba" },
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.id).toBe(100);
      expect(body.team).toBe("Varnsdorf");
    });

    it("should handle null minute and player", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "123" } },
        error: null,
      });

      const insertedGoal = {
        id: 101,
        match_id: 5,
        team: "SFA Jiřetín",
        minute: null,
        player: null,
        created_at: "2024-01-15T10:50:00Z",
      };

      const chain = createQueryBuilder({ data: insertedGoal, error: null });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);
      chain.single.mockResolvedValueOnce({ data: insertedGoal, error: null });

      mockSupabase.from.mockReturnValueOnce(chain);

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { matchId: 5, team: "SFA Jiřetín" },
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should return 500 on Supabase error", async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "123" } },
        error: null,
      });

      const chain = createQueryBuilder({
        data: null,
        error: { message: "Unique constraint violation" },
      });
      chain.insert.mockReturnValueOnce(chain);
      chain.select.mockReturnValueOnce(chain);

      mockSupabase.from.mockReturnValueOnce(chain);

      const request = createRequest("http://localhost/api/goals", {
        method: "POST",
        body: { matchId: 5, team: "Varnsdorf" },
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("Unique constraint violation");
    });

    it("should accept all valid team names from tournament data", async () => {
      const validTeams = [
        "Varnsdorf",
        "Šluknov B",
        "Česká Lípa A",
        "Grossharthau",
        "Vilémov",
        "SFA Jiřetín",
        "Neusalza",
        "Šluknov A",
        "Česká Lípa B",
        "Union Děčín",
      ];

      for (const team of validTeams) {
        // Set up auth mock for each iteration
        mockSupabase.auth.getUser.mockResolvedValueOnce({
          data: { user: { id: "123" } },
          error: null,
        });

        const insertedGoal = {
          id: 200,
          match_id: 5,
          team,
          minute: "42",
          player: "Test",
          created_at: "2024-01-15T10:42:00Z",
        };

        const chain = createQueryBuilder({ data: insertedGoal, error: null });
        chain.insert.mockReturnValueOnce(chain);
        chain.select.mockReturnValueOnce(chain);
        chain.single.mockResolvedValueOnce({ data: insertedGoal, error: null });

        mockSupabase.from.mockReturnValueOnce(chain);

        const request = createRequest("http://localhost/api/goals", {
          method: "POST",
          body: { matchId: 5, team, minute: "42", player: "Test" },
        });
        const response = await POST(request);

        expect(response.status).toBe(201);
        const body = await response.json();
        expect(body.team).toBe(team);
      }
    });
  });
});
