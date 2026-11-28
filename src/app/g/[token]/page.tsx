/**
 * Guest View Route — /g/[token]
 *
 * Server Component, das den Token validiert, OG-Tags dynamisch setzt
 * und die Gast-View rendert. Keine Navigation, kein Schnickschnack —
 * nur die essentiellen Turnierinfos, mobil-optimiert.
 *
 * T03: Guest-View Route mit OG-Tags
 */

import { notFound, redirect } from "next/navigation";
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
 * Wird von Next.js im Server-Kontext aufgerufen.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = createAdminClient();

  const guestToken = await GuestTokenService.getTokenByToken(
    token,
    supabase as any
  );
  const tournamentSlug = guestToken?.tournamentSlug;

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
    title: `${tournament.name} — Live Ergebnisse`,
    description: "Spielplan, Ergebnisse & Tabellenstand in Echtzeit",
    openGraph: {
      title: `${tournament.name} — Live Ergebnisse`,
      description: "Spielplan, Ergebnisse & Tabellenstand in Echtzeit",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${tournament.name} — Live Ergebnisse`,
      description: "Spielplan, Ergebnisse & Tabellenstand in Echtzeit",
    },
  };
}

/**
 * Server Component: Validiert Token und rendert GuestViewClient.
 */
export default async function GuestViewPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Token validieren
  const guestToken = await GuestTokenService.getTokenByToken(
    token,
    supabase as any
  );

  if (!guestToken) {
    // Token existiert nicht
    return notFound();
  }

  // Tournament-Slug aus Token
  const tournamentSlug =
    guestToken.tournamentSlug as (typeof TOURNAMENT_SLUGS)[number];
  const tournament = TOURNAMENT_METADATA[tournamentSlug];

  if (!tournament) {
    return notFound();
  }

  // Client-Component hydratisieren
  return <GuestViewClient token={token} slug={tournamentSlug} />;
}
