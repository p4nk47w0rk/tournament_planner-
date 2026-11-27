/**
 * API Route: Approve Activation Request
 *
 * POST /api/admin/activation-requests/approve
 * Body: { id: string }
 *
 * 1. Updates request status to "approved"
 * 2. Creates the Supabase user
 * 3. Sends a magic link / password reset email
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

    // Get the request
    const { data: req, error: fetchError } = await supabase
      .from("activation_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (req.status !== "pending") {
      return NextResponse.json(
        { error: `Request already ${req.status}` },
        { status: 400 }
      );
    }

    // Update to approved
    const { error: updateError } = await supabase
      .from("activation_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError.message);
      return NextResponse.json(
        { error: "Failed to approve request" },
        { status: 500 }
      );
    }

    // Generate a magic link for the user
    // This creates a user and sends a password reset email
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        email: req.email,
        type: "magiclink",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bambinicup.vercel.app"}/auth/set-password`,
        },
      });

    if (linkError) {
      console.error("Generate link error:", linkError.message);
      // If user already exists, still mark as approved
      // (they probably already have an account from a previous reset)
      if (linkError.message.includes("User already registered")) {
        return NextResponse.json({
          success: true,
          message: "User already exists — Login-Marker erneut gesendet.",
        });
      }
      return NextResponse.json(
        { error: "Failed to send magic link: " + linkError.message },
        { status: 500 }
      );
    }

    console.log(`Activation approved for ${req.email} — magic link sent`);

    return NextResponse.json({
      success: true,
      message: "Magic-Link an " + req.email + " gesendet.",
    });
  } catch (error) {
    console.error("Approve request failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
