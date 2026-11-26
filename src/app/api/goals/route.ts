/**
 * API Route: Manage Goals
 *
 * GET    /api/goals?matchId=X     — Get goals for a match
 * POST   /api/goals               — Add a goal
 * DELETE /api/goals/:id           — Remove a goal
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TEAMS } from "@/lib/tournament-data";

// Get all team names for validation
const teamNames = new Set(TEAMS.map((t) => t.name));

/**
 * Validate that a user is authenticated. Returns user or null.
 */
async function requireAuth(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

/**
 * Validate goal input. Returns error response or null.
 */
function validateGoalInput(
  matchId: unknown,
  team: unknown
): ReturnType<typeof NextResponse.json> | null {
  if (!matchId || !team) {
    return NextResponse.json(
      { error: "matchId and team are required" },
      { status: 400 }
    );
  }
  if (!teamNames.has(String(team))) {
    return NextResponse.json(
      { error: `Invalid team name: ${team}` },
      { status: 400 }
    );
  }
  const num = Number(matchId);
  if (isNaN(num)) {
    return NextResponse.json(
      { error: "matchId must be a number" },
      { status: 400 }
    );
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json(
      { error: "matchId parameter is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("match_id", parseInt(matchId))
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Get goals error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!(await requireAuth(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { matchId, team, minute, player } = body;

  const validationError = validateGoalInput(matchId, team);
  if (validationError) return validationError;

  const { data, error } = await supabase
    .from("goals")
    .insert({
      match_id: Number(matchId),
      team,
      minute: minute || null,
      player: player || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Add goal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  if (!(await requireAuth(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");
  if (!matchId) {
    return NextResponse.json({ error: "matchId is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("match_id", parseInt(matchId));

  if (error) {
    console.error("Delete goal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
