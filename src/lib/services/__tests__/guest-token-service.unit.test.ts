/**
 * Unit Tests: GuestTokenService
 *
 * Testet Token-Generierung, Rotation und Validierung.
 * Supabase-Client wird gemockt (system boundary).
 *
 * T02: GuestTokenService — Token generieren, rotieren, validieren
 */

import { describe, it, expect, vi } from "vitest";
import { GuestTokenService } from "../guest-token-service";

/**
 * Mock-Factory: Erzeugt einen typ-sicheren Supabase-Mock.
 * Verwendet "any" nur für den Mock-Shape — der Production-Code
 * nutzt echte PostgrestSingleResponse Types.
 */
function createMockSupabase() {
  const eqFn = vi.fn();
  const insertFn = vi.fn();
  const fromFn = vi.fn();
  const mockResponse = (data: unknown, error: unknown) =>
    Promise.resolve({ data, error });

  return {
    from: fromFn,
    eqFn,
    insertFn,
    mockResponse,
    _from: (table: string) => ({
      insert: insertFn,
      eq: eqFn,
    }),
  };
}

describe("GuestTokenService.generateToken", () => {
  it("generates a 16-char hex token and inserts it", async () => {
    const supabase = createMockSupabase();
    const token = "abcdef0123456789";

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi
        .fn()
        .mockResolvedValue(supabase.mockResponse([{ token }], null)),
    });

    const result = await GuestTokenService.generateToken(
      "test",
      supabase as any
    );

    expect(result.token).toMatch(/^[0-9a-f]{16}$/);
    expect(result.token.length).toBe(16);
  });

  it("retries on UNIQUE constraint violation (code 23505)", async () => {
    const supabase = createMockSupabase();
    const uniqueError = { code: "23505", message: "duplicate key" };

    supabase.from.mockImplementation(supabase._from);
    let callCount = 0;
    supabase.insertFn.mockReturnValue({
      select: vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return supabase.mockResponse(null, uniqueError);
        }
        return supabase.mockResponse([{ token: "abcdef0123456789" }], null);
      }),
    });

    const result = await GuestTokenService.generateToken(
      "test",
      supabase as any
    );
    expect(result.token).toMatch(/^[0-9a-f]{16}$/);
    expect(callCount).toBe(2);
  });

  it("throws on non-unique errors", async () => {
    const supabase = createMockSupabase();
    const dbError = { code: "23503", message: "foreign key violation" };

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi.fn().mockResolvedValue(supabase.mockResponse(null, dbError)),
    });

    await expect(
      GuestTokenService.generateToken("test", supabase as any)
    ).rejects.toThrow("foreign key");
  });

  it("returns the created token with correct shape", async () => {
    const supabase = createMockSupabase();
    const token = "1234567890abcdef";
    const slug = "my-tournament";
    const now = "2026-01-01T00:00:00.000Z";
    const dbRow = { id: 1, token, tournament_slug: slug, created_at: now };

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi.fn().mockResolvedValue(supabase.mockResponse([dbRow], null)),
    });

    const result = await GuestTokenService.generateToken(slug, supabase as any);

    expect(result).toEqual({
      id: 1,
      token,
      tournamentSlug: slug,
      createdAt: now,
    });
  });

  it("throws after MAX_RETRIES (5) unique violations", async () => {
    const supabase = createMockSupabase();
    const uniqueError = { code: "23505", message: "duplicate key" };

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi
        .fn()
        .mockResolvedValue(supabase.mockResponse(null, uniqueError)),
    });

    await expect(
      GuestTokenService.generateToken("test", supabase as any)
    ).rejects.toThrow("duplicate key");
  });

  it("throws when no data returned", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi.fn().mockResolvedValue(supabase.mockResponse([], null)),
    });

    await expect(
      GuestTokenService.generateToken("test", supabase as any)
    ).rejects.toThrow("Token konnte nicht erstellt werden");
  });
});

describe("GuestTokenService.rotateToken", () => {
  it("generates a new token for the same tournament slug", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi
        .fn()
        .mockResolvedValue(
          supabase.mockResponse([{ token: "fedcba9876543210" }], null)
        ),
    });

    const result = await GuestTokenService.rotateToken("test", supabase as any);
    expect(result.token).toMatch(/^[0-9a-f]{16}$/);
  });

  it("calls crypto.getRandomValues", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.insertFn.mockReturnValue({
      select: vi
        .fn()
        .mockResolvedValue(
          supabase.mockResponse([{ token: "0000000000000000" }], null)
        ),
    });

    const spy = vi.spyOn(globalThis.crypto, "getRandomValues");
    await GuestTokenService.rotateToken("test", supabase as any);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("GuestTokenService.validateToken", () => {
  it("returns true for existing token", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.eqFn.mockResolvedValue(
      supabase.mockResponse(
        { token: "abcdef0123456789", tournament_slug: "test" },
        null
      )
    );

    const result = await GuestTokenService.validateToken(
      "abcdef0123456789",
      supabase as any
    );
    expect(result).toBe(true);
  });

  it("returns false for non-existing token", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.eqFn.mockResolvedValue(supabase.mockResponse(null, null));

    const result = await GuestTokenService.validateToken(
      "0000000000000000",
      supabase as any
    );
    expect(result).toBe(false);
  });

  it("throws on Supabase error", async () => {
    const supabase = createMockSupabase();
    const dbError = { message: "connection failed" };

    supabase.from.mockImplementation(supabase._from);
    supabase.eqFn.mockResolvedValue(supabase.mockResponse(null, dbError));

    await expect(
      GuestTokenService.validateToken("abcdef0123456789", supabase as any)
    ).rejects.toThrow("connection failed");
  });
});

describe("GuestTokenService.getTokenByToken", () => {
  it("returns token data when token exists", async () => {
    const supabase = createMockSupabase();
    const dbRow = {
      id: 1,
      token: "abcdef0123456789",
      tournament_slug: "bambini-cup-2026",
      created_at: "2026-01-01T00:00:00.000Z",
    };

    supabase.from.mockImplementation(supabase._from);
    supabase.eqFn.mockResolvedValue(supabase.mockResponse(dbRow, null));

    const result = await GuestTokenService.getTokenByToken(
      "abcdef0123456789",
      supabase as any
    );

    expect(result).toEqual({
      id: 1,
      token: "abcdef0123456789",
      tournamentSlug: "bambini-cup-2026",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("returns null when token does not exist", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.eqFn.mockResolvedValue(supabase.mockResponse(null, null));

    const result = await GuestTokenService.getTokenByToken(
      "0000000000000000",
      supabase as any
    );
    expect(result).toBeNull();
  });

  it("throws on Supabase error", async () => {
    const supabase = createMockSupabase();
    const dbError = { message: "database unavailable" };

    supabase.from.mockImplementation(supabase._from);
    supabase.eqFn.mockResolvedValue(supabase.mockResponse(null, dbError));

    await expect(
      GuestTokenService.getTokenByToken("abcdef0123456789", supabase as any)
    ).rejects.toThrow("database unavailable");
  });
});
