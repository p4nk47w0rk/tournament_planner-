/**
 * Unit Tests: GuestTokenService — Archiv-Funktion
 *
 * T06: Archiv-Funktion — Archiv-Button + Finale-Zusammenfassung
 */

import { describe, it, expect, vi } from "vitest";
import { GuestTokenService } from "../guest-token-service";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

function createMockSupabase() {
  const eqFn = vi.fn();
  const updateFn = vi.fn();
  const fromFn = vi.fn();
  const mockResponse = (data: unknown, error: unknown) =>
    Promise.resolve({ data, error } as PostgrestSingleResponse<unknown>);

  return {
    from: fromFn,
    eqFn,
    updateFn,
    mockResponse,
    _from: (table: string) => ({
      eq: eqFn,
      update: updateFn,
    }),
  };
}

describe("GuestTokenService.archiveToken", () => {
  it("sets archived = true on the token", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.updateFn.mockReturnValue({
      eq: vi
        .fn()
        .mockResolvedValue(supabase.mockResponse({ archived: true }, null)),
    });
    supabase.eqFn.mockResolvedValue(
      supabase.mockResponse({ archived: true }, null)
    );

    const result = await GuestTokenService.archiveToken(
      "abcdef0123456789",
      supabase as any
    );

    expect(result).toBe(true);
    expect(supabase.updateFn).toHaveBeenCalledWith({ archived: true });
  });

  it("throws on Supabase error", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.updateFn.mockReturnValue({
      eq: vi
        .fn()
        .mockResolvedValue(
          supabase.mockResponse(null, { message: "db error" })
        ),
    });

    await expect(
      GuestTokenService.archiveToken("abcdef0123456789", supabase as any)
    ).rejects.toThrow("db error");
  });

  it("returns false when no row updated", async () => {
    const supabase = createMockSupabase();

    supabase.from.mockImplementation(supabase._from);
    supabase.updateFn.mockReturnValue({
      eq: vi.fn().mockResolvedValue(supabase.mockResponse(null, null)),
    });

    const result = await GuestTokenService.archiveToken(
      "abcdef0123456789",
      supabase as any
    );
    expect(result).toBe(false);
  });
});
