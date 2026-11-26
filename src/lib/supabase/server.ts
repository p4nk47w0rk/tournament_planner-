import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in server components
          }
        },
      },
    }
  );
}

/**
 * Admin client — server-only, bypasses RLS.
 * Uses SUPABASE_SECRET_KEY (new) or SUPABASE_SERVICE_ROLE_KEY (legacy).
 * NEVER expose in browser code.
 */
export function createAdminClient() {
  return createServerClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "",
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

/**
 * Local-Dev-Auth: Wenn LOCAL_DEV_EMAIL + LOCAL_DEV_PASSWORD gesetzt sind,
 * geben wir immer einen gültigen Session-Zustand zurück — unabhängig davon,
 * ob Supabase erreichbar ist. So hat man local immer einen eingeloggt Zustand.
 */
function getLocalDevSession() {
  const email = process.env.LOCAL_DEV_EMAIL;
  const password = process.env.LOCAL_DEV_PASSWORD;

  if (!email || !password) return null;

  /**
   * Next.js 16 blockiert Date.now() während Prerendering.
   * Darum: einen statischen, fernen expires_at (Jahr 2099)
   * statt live berechneter Sekunden.
   */
  return {
    access_token: "local-mock-jwt",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: 4070908800,
    refresh_token: "local-mock-refresh",
    user: {
      id: "local-dev-user",
      email,
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2025-01-01T00:00:00.000Z",
    },
    session: {
      user_id: "local-dev-user",
      access_token: "local-mock-jwt",
      refresh_token: "local-mock-refresh",
      expires_at: 4070908800,
    },
  };
}

export async function getSession() {
  // Local dev: always return a mock session
  if (process.env.LOCAL_DEV_EMAIL && process.env.LOCAL_DEV_PASSWORD) {
    const localSession = getLocalDevSession();
    if (localSession) return localSession as any;
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const localSession = getLocalDevSession();
  if (localSession?.user) return localSession.user as any;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getRole() {
  const user = await getUser();
  if (!user) return "guest" as const;

  // TODO: In V2, check roles from custom claims or separate table
  // For MVP: all logged-in users are admins
  return "admin" as const;
}
