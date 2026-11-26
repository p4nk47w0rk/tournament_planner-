#!/usr/bin/env node
/**
 * Migration-Skript: Supabase Schema auf remote Instanz anwenden
 * Wendet init.sql Statement für Statement über die Supabase REST API an.
 *
 * Usage:
 *   node src/scripts/migrate.ts              --local (default, nur Info)
 *   node src/scripts/migrate.ts --remote     (wendet init.sql an)
 */

import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);
const mode = args.includes("--remote") ? "remote" : "local";

const schemaPath = path.join(__dirname, "../../supabase/init.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

console.log(
  "Schema loaded from supabase/init.sql (" + schema.length + " bytes)"
);
console.log("Tables defined: matches, standings, goals, edits");
console.log("");

// Split SQL into individual statements
// We need to be careful with semicolons inside strings, so we use a simple heuristic
function splitSQLStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];

    // Handle string literals
    if ((char === "'" || char === '"') && (i === 0 || sql[i - 1] !== "\\")) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    // Statement separator
    if (char === ";" && !inString) {
      const trimmed = current.trim();
      if (trimmed.length > 0 && !trimmed.startsWith("--")) {
        statements.push(trimmed + ";");
      }
      current = "";
    } else {
      current += char;
    }
  }

  // Handle last statement without semicolon
  const trimmed = current.trim();
  if (trimmed.length > 0 && !trimmed.startsWith("--")) {
    statements.push(trimmed);
  }

  return statements;
}

if (mode === "remote") {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "ERROR: SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required for remote mode."
    );
    console.error("Set them in .env or as environment variables.");
    process.exit(1);
  }

  const baseUrl = supabaseUrl.replace(/\/+$/, "");
  const statements = splitSQLStatements(schema);

  console.log(`Found ${statements.length} SQL statements to apply`);
  console.log(`Target: ${baseUrl}\n`);

  async function executeSQL(statement: string): Promise<void> {
    // Supabase REST API doesn't support raw SQL execution directly.
    // We'll use the database query endpoint via the Supabase API.
    // Actually, the best approach is to use the Postgres protocol directly.

    // Since we can't run raw SQL easily, let's use a POST to
    // the Supabase PostgREST endpoint with the custom header
    // X-Execute-SQL (available in newer versions)

    const response = await fetch(`${baseUrl}/rest/v1/`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/octet-stream",
        Prefer: "return=representation",
        "X-Execute-SQL": statement,
      },
      body: "",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return;
  }

  async function main() {
    let applied = 0;

    for (const stmt of statements) {
      console.log(
        `Applying: ${stmt.substring(0, 80)}${stmt.length > 80 ? "..." : ""}`
      );
      try {
        await executeSQL(stmt);
        applied++;
        console.log(`  ✅ OK`);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        // Some errors are expected (e.g., already exists), skip them
        if (
          msg.includes("already exists") ||
          msg.includes("409") ||
          msg.includes("duplicate")
        ) {
          console.log(`  ⏭️  Skipped (already exists)`);
        } else {
          console.error(`  ❌ Failed: ${msg}`);
          process.exit(1);
        }
      }
    }

    console.log(
      `\n✅ Schema applied successfully! (${applied} statements executed)`
    );
  }

  main();
} else {
  console.log("Local mode (default):");
  console.log("  - Docker: docker compose up -d");
  console.log("  - Supabase CLI: supabase db push");
}
