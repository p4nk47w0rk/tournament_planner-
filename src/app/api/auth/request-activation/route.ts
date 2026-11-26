/**
 * API Route: Admin Activation Request (with approval)
 *
 * POST /api/auth/request-activation
 * Body: { email: string }
 *
 * Saves the request to DB as "pending". Admin must approve before email is sent.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if there's already a pending request for this email
    const { data: existing } = await supabase
      .from("activation_requests")
      .select("id")
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Deine Anfrage wurde bereits gespeichert. Wir prüfen sie.",
        status: "already_pending",
      });
    }

    // Save to DB as pending
    const { error } = await supabase
      .from("activation_requests")
      .insert({ email, status: "pending" });

    if (error) {
      console.error("Activation request save error:", error.message);
      return NextResponse.json(
        { error: "Failed to save request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Deine Anfrage wurde gespeichert. Ein Admin wird sie prüfen und dir ggf. einen Link schicken.",
    });
  } catch (error) {
    console.error("Activation request failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
