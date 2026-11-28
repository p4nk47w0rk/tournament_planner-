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
 * Mock-Factory: Erzeugt einen leeren Supabase-Mock
 */
function createMockSupabase() {
  const fromFn = vi.fn();
  const insertFn = vi.fn();
  const selectFn = vi.fn();
  const eqFn = vi.fn();
  const orderFn = vi.fn();

  return {
    from: fromFn,
    _mocks: { insertFn, selectFn, eqFn, orderFn },
  };
}

describe("GuestTokenService.generateToken", () => {
  it("generates a 16-char hex token and inserts it", async () => {
    const supabase = createMockSupabase() as any;
    const token = "abcdef0123456789";
    const slug = "bambini-cup-2026";

    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ token }],
          error: null,
        }),
      }),
    });

    const result = await GuestTokenService.generateToken(slug, supabase);

    expect(result.token).toMatch(/^[0-9a-f]{16}$/);
    expect(result.token.length).toBe(16);
    expect(supabase.from).toHaveBeenCalledWith("tournament_guest_tokens");
  });

  it("throws on UNIQUE constraint violation (token collision)", async () => {
    const supabase = createMockSupabase() as any;
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockRejectedValue(
            new Error("duplicate key value violates unique constraint")
          ),
      }),
    });

    await expect(
      GuestTokenService.generateToken("test", supabase)
    ).rejects.toThrow();
  });

  it("returns the created token with correct shape", async () => {
    const supabase = createMockSupabase() as any;
    const token = "1234567890abcdef";
    const slug = "my-tournament";
    const now = "2026-01-01T00:00:00.000Z";
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 1, token, tournament_slug: slug, created_at: now }],
          error: null,
        }),
      }),
    });

    const result = await GuestTokenService.generateToken(slug, supabase);

    expect(result).toHaveProperty("token", token);
    expect(result).toHaveProperty("tournamentSlug", slug);
    expect(result).toHaveProperty("createdAt", now);
    expect(result).toHaveProperty("id", 1);
  });
});

describe("GuestTokenService.rotateToken", () => {
  it("generates a new token for the same tournament slug", async () => {
    const supabase = createMockSupabase() as any;
    const token = "fedcba9876543210";
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ token }],
          error: null,
        }),
      }),
    });

    const slug = "bambini-cup-2026";
    const result = await GuestTokenService.rotateToken(slug, supabase);

    expect(result.token).toMatch(/^[0-9a-f]{16}$/);
    expect(supabase.from).toHaveBeenCalledWith("tournament_guest_tokens");
  });

  it("generates unique tokens on successive calls", async () => {
    const supabase = createMockSupabase() as any;
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockResolvedValue({
            data: [{ token: "0000000000000000" }],
            error: null,
          }),
      }),
    });

    // Spy on crypto.getRandomValues to verify it's called
    const spy = vi.spyOn(globalThis.crypto, "getRandomValues");

    await GuestTokenService.rotateToken("test", supabase);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe("GuestTokenService.validateToken", () => {
  it("returns true for existing token", async () => {
    const supabase = createMockSupabase() as any;
    supabase.from.mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: { token: "abcdef0123456789", tournament_slug: "test" },
        error: null,
      }),
    });

    const result = await GuestTokenService.validateToken(
      "abcdef0123456789",
      supabase
    );
    expect(result).toBe(true);
  });

  it("returns false for non-existing token", async () => {
    const supabase = createMockSupabase() as any;
    supabase.from.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await GuestTokenService.validateToken(
      "0000000000000000",
      supabase
    );
    expect(result).toBe(false);
  });
});

describe("GuestTokenService.getTokenByToken", () => {
  it("returns token data when token exists", async () => {
    const supabase = createMockSupabase() as any;
    const mockData = {
      id: 1,
      token: "abcdef0123456789",
      tournament_slug: "bambini-cup-2026",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    supabase.from.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await GuestTokenService.getTokenByToken(
      "abcdef0123456789",
      supabase
    );
    expect(result).not.toBeNull();
    expect(result!.token).toBe("abcdef0123456789");
    expect(result!.tournamentSlug).toBe("bambini-cup-2026");
  });

  it("returns null when token does not exist", async () => {
    const supabase = createMockSupabase() as any;
    supabase.from.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await GuestTokenService.getTokenByToken(
      "0000000000000000",
      supabase
    );
    expect(result).toBeNull();
  });
});
