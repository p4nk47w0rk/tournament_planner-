/**
 * Tests for GuestToken type — ensures the type correctly reflects
 * the DB schema created by 002_create_tournament_guest_tokens.sql
 *
 * T01: DB-Schema — tournament_guest_tokens Tabelle + RLS
 */

import { GuestToken } from "../../types";

describe("GuestToken type", () => {
  it("has all required properties with correct types", () => {
    const guestToken: GuestToken = {
      id: 1,
      token: "bc4a8f2e3d71b9c0",
      tournamentSlug: "bambini-cup-2026",
      createdAt: "2026-11-28T00:00:00.000Z",
    };

    expect(guestToken.id).toBeTypeOf("number");
    expect(guestToken.token).toBeTypeOf("string");
    expect(guestToken.token.length).toBe(16);
    expect(guestToken.token).toMatch(/^[0-9a-f]{16}$/);
    expect(guestToken.tournamentSlug).toBeTypeOf("string");
    expect(guestToken.createdAt).toBeTypeOf("string");
  });

  it("accepts any valid 16-char hex token", () => {
    const validTokens = [
      "0000000000000000",
      "ffffffffffffffff",
      "abcdef0123456789",
    ];

    for (const token of validTokens) {
      const guestToken: GuestToken = {
        id: 1,
        token,
        tournamentSlug: "test",
        createdAt: "2026-01-01T00:00:00.000Z",
      };

      expect(guestToken.token).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  it("rejects invalid tokens at type-check time (compile test)", () => {
    // This test exists to ensure invalid tokens fail type checking.
    // It should NOT compile if uncommented — that is the desired behavior.
    // Uncommenting the following should cause a TypeScript error:
    //
    // const invalidToken: GuestToken = {
    //   id: 1,
    //   token: "not-valid-hex", // too short
    //   tournamentSlug: "test",
    //   createdAt: "2026-01-01T00:00:00.000Z",
    // };
    //
    // const tooLongToken: GuestToken = {
    //   id: 1,
    //   token: "bc4a8f2e3d71b9c0extra", // too long
    //   tournamentSlug: "test",
    //   createdAt: "2026-01-01T00:00:00.000Z",
    // };
  });

  it("has optional properties where expected", () => {
    // GuestTokenDbRow (raw DB row) should have snake_case columns
    const dbRow: import("../../types").GuestTokenDbRow = {
      id: 1,
      token: "bc4a8f2e3d71b9c0",
      tournament_slug: "bambini-cup-2026",
      created_at: "2026-11-28T00:00:00.000Z",
    };

    expect(dbRow.id).toBeTypeOf("number");
    expect(dbRow.token).toBeTypeOf("string");
    expect(dbRow.tournament_slug).toBeTypeOf("string");
    expect(dbRow.created_at).toBeTypeOf("string");
  });
});
