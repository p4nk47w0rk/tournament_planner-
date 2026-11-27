"use client";

import { createClient } from "@/lib/supabase/client";
import {
  isLocalDevAuth,
  getLocalDevSession,
  getLocalDevUser,
} from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";

export function useSupabase() {
  return createClient();
}

export function useSession() {
  const [session, setSession] = useState<
    import("@supabase/supabase-js").Session | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local dev: always return mock session
    // But respect ?dev=logout flag on first mount
    if (isLocalDevAuth()) {
      // Check for dev=logout flag from URL
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("dev") === "logout") {
        setLoading(false);
        return;
      }
      setSession(getLocalDevSession() as any);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useUser() {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local dev: always return mock user
    // But respect ?dev=logout flag on first mount
    if (isLocalDevAuth()) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("dev") === "logout") {
        setLoading(false);
        return;
      }
      setUser(getLocalDevUser());
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useAuth() {
  const { session, loading: sessionLoading } = useSession();
  const { user, loading: userLoading } = useUser();

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    // Local dev: redirect to landing page
    if (isLocalDevAuth()) {
      // Clear any Supabase cookies
      document.cookie = "sb-access-token-0=; path=/; max-age=0";
      document.cookie = "sb-refresh-token-0=; path=/; max-age=0";
      document.cookie = "sb-auth-token=; path=/; max-age=0";
      // Force full reload with dev=logout flag
      window.location.href = "/?dev=logout";
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const isLoading = sessionLoading || userLoading;

  const isAuthenticated = !!session;

  const role = user?.user_metadata?.role as
    "super_admin" | "admin" | "user" | undefined;

  const isSuperAdmin = role === "super_admin";

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    role,
    isSuperAdmin,
  };
}
