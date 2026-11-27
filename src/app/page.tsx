import { getSession } from "@/lib/supabase/server";
import LandingPage from "./_landing-page";
import Dashboard from "./_dashboard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ dev?: string }>;
}) {
  const params = await searchParams;

  // Local dev: ?dev=logout zwingt die Landing Page
  if (params.dev === "logout") {
    return <LandingPage />;
  }

  // Local dev: ?dev=login zeigt immer das Dashboard (auch ohne echte Session)
  if (params.dev === "login") {
    return <Dashboard />;
  }

  const session = await getSession();
  const isAuthenticated = !!session;

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
