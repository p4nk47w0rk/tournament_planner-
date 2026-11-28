import type { User } from "@supabase/supabase-js";

export function extractDisplayName(user: User | null): string {
  const email = user?.email ?? null;
  if (!email) return "Coach";
  const beforeAt = email.split("@")[0];
  return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1).toLowerCase();
}
