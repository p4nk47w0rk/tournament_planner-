/**
 * API Route: List Activation Requests (Admin Only)
 *
 * GET /api/admin/activation-requests
 */

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super_admin
    const role = (session.user?.user_metadata?.role ??
      session.user?.user_metadata?.role ??
      "user") as string;

    if (role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { data: requests, error } = await supabase
      .from("activation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch requests:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch requests" },
        { status: 500 }
      );
    }

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("List requests failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
