import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/settings?locale=de&key=imprint
 *
 * Öffentliche Route: Jeder darf Settings lesen.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const key = searchParams.get("key");

  const supabase = await createClient();

  let query = supabase
    .from("site_settings")
    .select("setting_key, value")
    .eq("locale", locale);

  if (key) {
    query = query.eq("setting_key", key);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }

  // Group by key: [{ key: "imprint", value: {...} }, ...]
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.setting_key] = row.value;
  }

  return NextResponse.json(settings);
}

/**
 * PATCH /api/settings
 *
 * Nur Authenticated: Impressum/Datenschutz bearbeiten.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, locale, value } = body;

  if (!key || !locale || !value) {
    return NextResponse.json(
      { error: "Missing required fields: key, locale, value" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { setting_key: key, locale, value },
      { onConflict: "setting_key,locale" }
    );

  if (error) {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
