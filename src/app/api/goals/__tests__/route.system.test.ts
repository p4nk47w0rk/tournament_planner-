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
const mockSupabase: any = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => createQueryBuilder({ data: null, error: null })),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => mockSupabase,
}));

const baseApiUrl = "http://localhost/api/goals";
const created_at = "2024-01-15T10:42:00Z";
const testMatchId = 5;

// eslint-disable-next-line max-lines-per-function
describe("API /api/goals — System Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET ──────────────────────────────────────────────────────────

  it("GET should return 400 when matchId is missing", async () => {
    const response = await GET(createRequest(baseApiUrl));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("matchId parameter is required");
  });

  it("GET should return goals from Supabase", async () => {
    const mockGoals: GoalDbRow[] = [
      {
        id: 1,
        match_id: 5,
        team: "Varnsdorf",
        minute: "42",
        player: "Kuba",
        created_at,
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

    setupQuery({ data: mockGoals, error: null }, mockGoals, "order");
    mockSupabase.from.mockReturnValueOnce(queryChain(mockGoals));

    const response = await GET(
      createRequest(`${baseApiUrl}?matchId=${testMatchId}`)
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(2);
    expect(body[0].team).toBe("Varnsdorf");
  });

  it("GET should return empty array when no goals found", async () => {
    mockSupabase.from.mockReturnValueOnce(emptyQueryChain());

    const response = await GET(
      createRequest("http://localhost/api/goals?matchId=999")
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual([]);
  });

  it("GET should return 500 when Supabase errors", async () => {
    mockSupabase.from.mockReturnValueOnce(
      errorQuery("DB connection failed", "order")
    );

    const response = await GET(
      createRequest(`${baseApiUrl}?matchId=${testMatchId}`)
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("DB connection failed");
  });

  // ── POST ─────────────────────────────────────────────────────────

  it("POST should return 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(unauthResponse);

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: { matchId: testMatchId, team: "Varnsdorf" },
      })
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("POST should return 400 when matchId is missing", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: { team: "Varnsdorf" },
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("matchId and team are required");
  });

  it("POST should return 400 when team is invalid", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: { matchId: testMatchId, team: "InvalidTeamX" },
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Invalid team name");
  });

  it("POST should return 400 when matchId is not a number", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: { matchId: "abc", team: "Varnsdorf" },
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("matchId must be a number");
  });

  it("POST should insert goal and return 201 on success", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

    const insertedGoal = {
      id: 100,
      match_id: 5,
      team: "Varnsdorf",
      minute: "42",
      player: "Kuba",
      created_at,
    };

    setupQuery({ data: insertedGoal, error: null }, insertedGoal, "single");
    mockSupabase.from.mockReturnValueOnce(
      queryChainWithSingle(insertedGoal, { data: insertedGoal, error: null })
    );

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: {
          matchId: testMatchId,
          team: "Varnsdorf",
          minute: "42",
          player: "Kuba",
        },
      })
    );

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBe(100);
    expect(body.team).toBe("Varnsdorf");
  });

  it("POST should handle null minute and player", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

    const insertedGoal = {
      id: 101,
      match_id: 5,
      team: "SFA Jiřetín",
      minute: null,
      player: null,
      created_at: "2024-01-15T10:50:00Z",
    };

    mockSupabase.from.mockReturnValueOnce(
      queryChainWithSingle(insertedGoal, { data: insertedGoal, error: null })
    );

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: { matchId: testMatchId, team: "SFA Jiřetín" },
      })
    );

    expect(response.status).toBe(201);
  });

  it("POST should return 500 on Supabase error", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

    mockSupabase.from.mockReturnValueOnce(
      errorQuery("Unique constraint violation", "single")
    );

    const response = await POST(
      createRequest(baseApiUrl, {
        method: "POST",
        body: { matchId: testMatchId, team: "Varnsdorf" },
      })
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Unique constraint violation");
  });

  it("POST should accept all valid team names from tournament data", async () => {
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
      mockSupabase.auth.getUser.mockResolvedValueOnce(authResponse);

      const insertedGoal = {
        id: 200,
        match_id: 5,
        team,
        minute: "42",
        player: "Test",
        created_at,
      };

      mockSupabase.from.mockReturnValueOnce(
        queryChainWithSingle(insertedGoal, { data: insertedGoal, error: null })
      );

      const response = await POST(
        createRequest(baseApiUrl, {
          method: "POST",
          body: { matchId: testMatchId, team, minute: "42", player: "Test" },
        })
      );

      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.team).toBe(team);
    }
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const authResponse = { data: { user: { id: "123" } }, error: null };
const unauthResponse = { data: { user: null }, error: null };

function emptyQueryChain() {
  return createQueryBuilder({ data: null, error: null });
}

function queryChain(data: unknown) {
  return createQueryBuilder({ data, error: null });
}

function queryChainWithSingle(
  data: unknown,
  result: { data: unknown; error: null }
) {
  const chain = createQueryBuilder(result);
  (chain.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(chain);
  (chain.eq as ReturnType<typeof vi.fn>).mockReturnValueOnce(chain);
  chain.single.mockResolvedValueOnce(result);
  return chain;
}

function errorQuery(message: string, _method: "order" | "single") {
  return createQueryBuilder({
    data: null,
    error: new Error(message),
  });
}

function setupQuery(
  result: { data: unknown; error: null },
  data: unknown,
  method: "order" | "single"
) {
  const chain = queryChain(data);
  (chain.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(chain);
  (chain.eq as ReturnType<typeof vi.fn>).mockReturnValueOnce(chain);
  if (method === "order") {
    (chain.order as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data,
      error: null,
    });
  } else {
    (chain.single as ReturnType<typeof vi.fn>).mockResolvedValueOnce(result);
  }
}

function createRequest(
  url: string,
  options?: { method?: string; body?: object }
) {
  return new NextRequest(url, {
    method: options?.method,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
}
