/**
 * Validates that the GuestToken migration file exists and has the correct structure.
 *
 * T01: DB-Schema — tournament_guest_tokens Tabelle + RLS
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const MIGRATIONS_DIR = join(__dirname, "../../../../supabase/migrations");

describe("Migration: 002_create_tournament_guest_tokens", () => {
  const migrationFile = "002_create_tournament_guest_tokens.sql";
  const migrationPath = join(MIGRATIONS_DIR, migrationFile);

  let sql: string;

  beforeAll(() => {
    sql = readFileSync(migrationPath, "utf-8");
  });

  it("exists", () => {
    expect(sql.length).toBeGreaterThan(0);
  });

  it("creates the tournament_guest_tokens table", () => {
    expect(sql).toContain("tournament_guest_tokens");
    expect(sql).toContain("CREATE TABLE");
  });

  it("has id column as BIGSERIAL PRIMARY KEY", () => {
    expect(sql).toMatch(/id\s+BIGSERIAL\s+PRIMARY\s+KEY/i);
  });

  it("has token column as TEXT UNIQUE", () => {
    expect(sql).toMatch(/token\s+TEXT\s+UNIQUE/i);
  });

  it("has tournament_slug column as TEXT NOT NULL", () => {
    expect(sql).toMatch(/tournament_slug\s+TEXT\s+NOT\s+NULL/i);
  });

  it("has created_at column with TIMESTAMPTZ DEFAULT NOW()", () => {
    expect(sql).toMatch(
      /created_at\s+TIMESTAMPTZ\s+NOT\s+NULL\s+DEFAULT\s+NOW\(\)/i
    );
  });

  it("has UNIQUE index on token", () => {
    expect(sql).toMatch(/CREATE\s+UNIQUE\s+INDEX/i);
    expect(sql).toMatch(/idx_guest_token_token/i);
  });

  it("enables RLS on the table", () => {
    expect(sql).toMatch(
      /ALTER\s+TABLE\s+tournament_guest_tokens\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/i
    );
  });

  it("has a public-read policy (Anyone can read tokens)", () => {
    expect(sql).toMatch(/Anyone can read tokens/i);
    expect(sql).toContain("FOR SELECT");
    expect(sql).toMatch(/USING\s*\(\s*true\s*\)/i);
  });

  it("has an authenticated-insert policy", () => {
    expect(sql).toMatch(/Authenticated users can insert tokens/i);
    expect(sql).toContain("FOR INSERT");
    expect(sql).toContain("TO authenticated");
  });

  it("has an authenticated-update policy", () => {
    expect(sql).toMatch(/Authenticated users can update tokens/i);
    expect(sql).toContain("FOR UPDATE");
    expect(sql).toContain("TO authenticated");
  });
});
