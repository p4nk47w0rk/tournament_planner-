"use client";

import { useParams } from "next/navigation";
import { useTournament } from "@/lib/tournament-context";
import { useAuth } from "@/lib/supabase/hooks";
import { Suspense, useEffect } from "react";
import TournamentHeader from "./TournamentHeader";
import TournamentTabs from "@/components/Tournament/TournamentTabs";

const SUB_NAVS = [
  { href: "", label: "Übersicht" },
  { href: "spielplan", label: "Spielplan" },
  { href: "gruppen", label: "Gruppen" },
  { href: "teams", label: "Mannschaften" },
  { href: "infos", label: "Infos" },
];

export default function TournamentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params?.slug as string;
  const { tournaments } = useTournament();
  const { isAuthenticated, isLoading } = useAuth();

  const tournament = tournaments.find((t) => t.slug === slug);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || !isAuthenticated) return <LoadingState />;
  if (!tournament) return <NotFoundState />;

  return (
    <div className="min-h-screen">
      <TournamentHeader tournament={tournament} slug={slug} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-stone dark:text-dark-text-secondary">
          Laden...
        </p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-ink mb-4">
        Turnier nicht gefunden
      </h1>
      <a href="/turniere" className="text-sage hover:underline">
        ← Zurück zur Übersicht
      </a>
    </div>
  );
}
