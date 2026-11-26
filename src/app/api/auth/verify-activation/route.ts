/**
 * API Route: Verify Activation
 *
 * GET /api/auth/verify-activation?token=xxx&type=recovery
 *
 * Supabase redirects here after user clicks the magic link.
 * The user can then set their password and be redirected to login.
 */

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  if (type === "recovery" && token) {
    // User clicked the magic link — redirect to password setup page
    return NextResponse.redirect(
      new URL("/auth/set-password?token=" + token, request.url)
    );
  }

  // Default: redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}
