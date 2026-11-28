/**
 * API Route: Guest Token Management
 *
 * GET    /api/guest-token?slug=<slug>    — Bestehenden Token laden
 * POST   /api/guest-token                — Generiert oder rotiert einen Gast-Token
 * Body: { slug, action: 'create' | 'rotate' }
 * Returns: { token, guestUrl }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { GuestTokenService } from "@/lib/services/guest-token-service";

// ============================================
// GET — Bestehenden Token laden
// ============================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    // Get the latest token for this tournament slug
    const { data, error } = await supabase
      .from("tournament_guest_tokens")
      .select("*")
      .eq("tournament_slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ notFound: true });
    }

    const row = data as {
      token: string;
      tournament_slug: string;
      created_at: string;
    };
    const guestUrl = `/g/${row.token}`;

    return NextResponse.json({
      token: row.token,
      guestUrl,
      slug: row.tournament_slug,
    });
  } catch {
    return NextResponse.json({ notFound: true });
  }
}

// ============================================
// POST — Generieren / Rotieren
// ============================================

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
    const { slug, action = "create" } = body as {
      slug?: string;
      action?: "create" | "rotate";
    };

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    let tokenData;
    if (action === "rotate") {
      tokenData = await GuestTokenService.rotateToken(slug, supabase as any);
    } else {
      tokenData = await GuestTokenService.generateToken(slug, supabase as any);
    }

    const guestUrl = `/g/${tokenData.token}`;

    return NextResponse.json({
      token: tokenData.token,
      guestUrl,
      slug: tokenData.tournamentSlug,
    });
  } catch (error) {
    console.error("Guest token error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
