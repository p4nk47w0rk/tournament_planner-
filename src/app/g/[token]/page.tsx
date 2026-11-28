/**
 * Guest View Route — /g/[token]
 *
 * Server Component, das den Token validiert, OG-Tags dynamisch setzt
 * und die Gast-View rendert. Keine Navigation, kein Schnickschnack —
 * nur die essentiellen Turnierinfos, mobil-optimiert.
 *
 * T03: Guest-View Route mit OG-Tags
 * T06: Archiv-Zustand + Finale-Zusammenfassung
 */

import { notFound } from "next/navigation";
import { GuestTokenService } from "@/lib/services/guest-token-service";
import { createAdminClient } from "@/lib/supabase/server";
import {
  TOURNAMENT_METADATA,
  TOURNAMENT_SLUGS,
} from "@/lib/tournament-context";
import type { Metadata } from "next";
import GuestViewClient from "./client";

interface PageProps {
  params: Promise<{ token: string }>;
}

/**
 * Dynamische OG-Tags basierend auf dem Tournament.
 * Defensiv: Falls DB-Tabelle noch nicht existiert,
 * gibt es ein sicheres Fallback.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;

  let tournamentSlug: string | undefined;
  let isArchived = false;

  try {
    const supabase = createAdminClient();
    const guestToken = await GuestTokenService.getTokenByToken(
      token,
      supabase as any
    );
    tournamentSlug = guestToken?.tournamentSlug;

    if (tournamentSlug) {
      isArchived = await GuestTokenService.isTokenArchived(
        token,
        supabase as any
      );
    }
  } catch {
    // Table existiert noch nicht oder DB-Zugriff fehlgeschlagen
    // → Fallback OG-Tags
  }

  if (
    !tournamentSlug ||
    !TOURNAMENT_METADATA[tournamentSlug as keyof typeof TOURNAMENT_METADATA]
  ) {
    return {
      title: "Gast-View — Turnier nicht gefunden",
      description:
        "Das Turnier wurde nicht gefunden oder der Link ist ungültig.",
    };
  }

  const tournament =
    TOURNAMENT_METADATA[tournamentSlug as keyof typeof TOURNAMENT_METADATA];

  return {
    title: isArchived
      ? `${tournament.name} — Ergebnisse`
      : `${tournament.name} — Live Ergebnisse`,
    description: isArchived
      ? "Finale Ergebnisse und Endtabelle"
      : "Spielplan, Ergebnisse & Tabellenstand in Echtzeit",
    openGraph: {
      title: isArchived
        ? `${tournament.name} — Ergebnisse`
        : `${tournament.name} — Live Ergebnisse`,
      description: isArchived
        ? "Finale Ergebnisse und Endtabelle"
        : "Spielplan, Ergebnisse & Tabellenstand in Echtzeit",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: isArchived
        ? `${tournament.name} — Ergebnisse`
        : `${tournament.name} — Live Ergebnisse`,
      description: isArchived
        ? "Finale Ergebnisse und Endtabelle"
        : "Spielplan, Ergebnisse & Tabellenstand in Echtzeit",
    },
  };
}

/**
 * Server Component: Validiert Token, prüft Archiv-Status, rendert GuestViewClient.
 * Defensiv: Falls DB-Tabelle noch nicht existiert (Migration pending),
 * wird eine harmlose "nicht gefunden"-Seite gerendert statt 500er.
 */
export default async function GuestViewPage({ params }: PageProps) {
  const { token } = await params;

  let guestToken: Awaited<
    ReturnType<typeof GuestTokenService.getTokenByToken>
  > = null;
  let isArchived = false;

  try {
    const supabase = createAdminClient();
    guestToken = await GuestTokenService.getTokenByToken(
      token,
      supabase as any
    );
    if (guestToken) {
      isArchived = await GuestTokenService.isTokenArchived(
        token,
        supabase as any
      );
    }
  } catch {
    // Table existiert noch nicht oder DB-Zugriff fehlgeschlagen
    // → harmlose "nicht gefunden"-Seite
  }

  if (!guestToken) {
    return notFound();
  }

  const tournamentSlug =
    guestToken.tournamentSlug as (typeof TOURNAMENT_SLUGS)[number];
  const tournament = TOURNAMENT_METADATA[tournamentSlug];

  if (!tournament) {
    return notFound();
  }

  return (
    <GuestViewClient
      token={token}
      slug={tournamentSlug}
      isArchived={isArchived}
    />
  );
}
