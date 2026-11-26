"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
  );
}

export function createLocalClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_LOCAL || "http://localhost:54321",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL || ""
  );
}

/**
 * Local-Dev-Auth client helper:
 * Wenn LOCAL_DEV_EMAIL + LOCAL_DEV_PASSWORD gesetzt sind,
 * verhalten sich die Auth-Hooks so, als wäre man eingeloggt.
 */
export function isLocalDevAuth() {
  return !!(
    process.env.NEXT_PUBLIC_LOCAL_DEV_EMAIL &&
    process.env.NEXT_PUBLIC_LOCAL_DEV_PASSWORD
  );
}

export function getLocalDevUser() {
  if (!isLocalDevAuth()) return null;
  return {
    id: "local-dev-user",
    email: process.env.NEXT_PUBLIC_LOCAL_DEV_EMAIL!,
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2025-01-01T00:00:00.000Z",
  };
}

export function getLocalDevSession() {
  if (!isLocalDevAuth()) return null;
  return {
    user: getLocalDevUser(),
    expires_at: 4070908800,
    expires_in: 3600,
    access_token: "local-mock-jwt",
    refresh_token: "local-mock-refresh",
    token_type: "bearer",
    user_id: "local-dev-user",
  };
}
