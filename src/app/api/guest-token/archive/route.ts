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

  // Auth check — defensiv gegen fehlende Session
  let user;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Keine Session oder Supabase nicht erreichbar → safe fallback
    return NextResponse.json(
      { error: "Auth service nicht verfügbar" },
      { status: 503 }
    );
  }
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
    // Defensive: Falls DB-Tabelle noch nicht existiert,
    // geben wir 503 statt 500. Kein Error-Message nach außen.
    return NextResponse.json(
      { error: "Archive service nicht verfügbar" },
      { status: 503 }
    );
  }
}
