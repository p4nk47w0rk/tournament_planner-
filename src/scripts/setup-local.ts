#!/usr/bin/env node
/**
 * Create a test user in Supabase Auth
 * Run: pnpm setup:local
 *
 * Requirements: Supabase local dev running (docker compose up -d)
 */

const SUPABASE_URL = "http://localhost:54321";

// eslint-disable-next-line unicorn/prefer-top-level-await -- script entry point
(async () => {
  console.log("Creating test user in Supabase...");
  console.log(
    "Please run this with the correct SUPABASE_URL and SUPABASE_ANON_KEY"
  );

  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/signup`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key",
      Authorization: `Bearer your-service-role-key`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test@bambini-cup.local",
      password: "TestPassword123!",
      data: {
        display_name: "Test User",
        role: "editor",
      },
    }),
  });

  if (response.ok) {
    const user = await response.json();
    console.log("✅ Test user created:", user);
  } else {
    const error = await response.text();
    console.log("❌ Error:", error);
  }
})();
