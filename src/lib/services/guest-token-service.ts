/**
 * GuestTokenService
 *
 * Generiert, rotiert und validiert Gast-Token für QR-Code Sharing.
 * Supabase-Client wird injiziert für Mockability in Tests.
 *
 * T02: GuestTokenService — Token generieren, rotieren, validieren
 */

import type { GuestToken, GuestTokenDbRow } from "@/lib/types";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Minimal Supabase client interface — typ-sicher über PostgrestSingleResponse.
 * Ermöglicht Mocking in Tests.
 */
interface SupabaseClient {
  from<T>(table: string): {
    insert(data: Record<string, unknown>): {
      select(): Promise<PostgrestSingleResponse<T[] | null>>;
    };
    eq(
      column: string,
      value: unknown
    ): Promise<PostgrestSingleResponse<T | null>>;
    update(data: Record<string, unknown>): {
      eq(
        column: string,
        value: unknown
      ): Promise<PostgrestSingleResponse<T | null>>;
    };
  };
}

const MAX_RETRIES = 5;

/**
 * Generiert einen 16-stelligen hex-Token mit krypto-sicherem Zufall.
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
   * Bei UNIQUE-Verstoß wird bis zu MAX_RETRIES Mal neu generiert.
   * Wirft bei anhaltendem Konflikt.
   */
  static async generateToken(
    slug: string,
    supabase: SupabaseClient
  ): Promise<GuestToken> {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const token = generateHexToken();

      const { data, error } = await supabase
        .from("tournament_guest_tokens")
        .insert({ token, tournament_slug: slug })
        .select();

      if (error) {
        lastError = error;
        // UNIQUE-Verstoß → Retry mit neuem Token
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code?: string }).code === "23505"
        ) {
          continue;
        }
        throw error;
      }

      if (!data?.[0]) {
        throw new Error("Token konnte nicht erstellt werden");
      }

      return this.mapToGuestToken(data[0] as GuestTokenDbRow);
    }

    throw lastError;
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
    const { data, error } = await supabase
      .from("tournament_guest_tokens")
      .eq("token", token);

    if (error) throw error;
    return data !== null;
  }

  /**
   * Lädt Token-Daten inkl. zugehörigem Tournament-Slug.
   * Gibt null zurück wenn Token nicht existiert.
   */
  static async getTokenByToken(
    token: string,
    supabase: SupabaseClient
  ): Promise<GuestToken | null> {
    const { data, error } = await supabase
      .from("tournament_guest_tokens")
      .eq("token", token);

    if (error) throw error;
    if (!data) return null;

    return this.mapToGuestToken(data as GuestTokenDbRow);
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

  /**
   * Archiviert einen Token: Setzt archived = true.
   * Nach Archivierung zeigt die Gast-View die Finale-Zusammenfassung.
   */
  static async archiveToken(
    token: string,
    supabase: SupabaseClient
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("tournament_guest_tokens")
      .update({ archived: true })
      .eq("token", token);

    if (error) throw error;
    return !!data;
  }

  /**
   * Prüft ob ein Token archiviert ist.
   */
  static async isTokenArchived(
    token: string,
    supabase: SupabaseClient
  ): Promise<boolean> {
    const { data } = (await supabase
      .from("tournament_guest_tokens")
      .eq("token", token)) as { data: GuestTokenDbRow | null; error: unknown };

    if (!data) return false;
    return data.archived === true;
  }
}
