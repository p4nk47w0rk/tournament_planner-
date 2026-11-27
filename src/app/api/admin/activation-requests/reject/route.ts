/**
 * API Route: Reject Activation Request
 *
 * POST /api/admin/activation-requests/reject
 * Body: { id: string }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user?.user_metadata?.role ?? "user") as string;
    if (role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Update to rejected
    const { error } = await supabase
      .from("activation_requests")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error("Reject error:", error.message);
      return NextResponse.json(
        { error: "Failed to reject request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject request failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
