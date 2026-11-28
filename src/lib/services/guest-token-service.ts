/**
 * GuestTokenService
 *
 * Generiert, rotiert und validiert Gast-Token für QR-Code Sharing.
 * Supabase-Client wird injiziert für Mockability in Tests.
 *
 * T02: GuestTokenService — Token generieren, rotieren, validieren
 */

import type { GuestToken, GuestTokenDbRow } from "@/lib/types";

/**
 * Minimal Supabase client interface — nur was wir brauchen.
 * Ermöglicht Mocking in Tests.
 */
interface SupabaseClient {
  from(table: string): {
    insert(data: Record<string, unknown>): {
      select(): Promise<{ data: unknown[] | null; error: unknown }>;
    };
    eq(
      column: string,
      value: unknown
    ): Promise<{
      data: unknown | null;
      error: unknown;
    }>;
  };
}

/**
 * Generiert einen 16-stelligen hex-Token.
 */
function generateHexToken(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export class GuestTokenService {
  /**
   * Generiert einen neuen Gast-Token für ein Turnier.
   * Prüft UNIQUE constraint — bei Kollision wird geworfen.
   */
  static async generateToken(
    slug: string,
    supabase: SupabaseClient
  ): Promise<GuestToken> {
    const token = generateHexToken();

    const { data, error } = (await supabase
      .from("tournament_guest_tokens")
      .insert({ token, tournament_slug: slug })
      .select()) as { data: (GuestTokenDbRow | null)[] | null; error: unknown };

    if (error) throw error;
    if (!data?.[0]) throw new Error("Failed to create guest token");

    const row = data[0];
    return this.mapToGuestToken(row);
  }

  /**
   * Rotiert den Token: Generiert neuen Token für dasselbe Turnier.
   * Der alte bleibt bestehen (keine Invalidierung).
   */
  static async rotateToken(
    slug: string,
    supabase: SupabaseClient
  ): Promise<GuestToken> {
    return this.generateToken(slug, supabase);
  }

  /**
   * Validiert ob ein Token existiert und gültig ist.
   */
  static async validateToken(
    token: string,
    supabase: SupabaseClient
  ): Promise<boolean> {
    const { data } = (await supabase
      .from("tournament_guest_tokens")
      .eq("token", token)) as { data: GuestTokenDbRow | null; error: unknown };

    return data !== null && data !== undefined;
  }

  /**
   * Lädt Token-Daten inkl. zugehörigem Tournament-Slug.
   * Gibt null zurück wenn Token nicht existiert.
   */
  static async getTokenByToken(
    token: string,
    supabase: SupabaseClient
  ): Promise<GuestToken | null> {
    const { data } = (await supabase
      .from("tournament_guest_tokens")
      .eq("token", token)) as {
      data: GuestTokenDbRow | null;
      error: unknown;
    };

    if (!data) return null;
    return this.mapToGuestToken(data);
  }

  /**
   * Mappt DB-Row zu GuestToken-Interface.
   */
  private static mapToGuestToken(row: GuestTokenDbRow): GuestToken {
    return {
      id: row.id,
      token: row.token,
      tournamentSlug: row.tournament_slug,
      createdAt: row.created_at,
    };
  }
}
