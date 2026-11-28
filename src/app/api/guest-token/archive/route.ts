/**
 * API Route: Archive Tournament Token
 *
 * POST /api/guest-token/archive
 * Body: { slug }
 * Returns: { success: true }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { GuestTokenService } from "@/lib/services/guest-token-service";

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body as { slug?: string };

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    // Get the token for this slug
    const { data, error } = await supabase
      .from("tournament_guest_tokens")
      .select("token")
      .eq("tournament_slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "No guest token found" },
        { status: 404 }
      );
    }

    const token = (data as { token: string }).token;
    const success = await GuestTokenService.archiveToken(
      token,
      supabase as any
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to archive token" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Archive error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
