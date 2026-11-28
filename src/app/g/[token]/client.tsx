/**
 * GuestViewClient — Guest View Orchestrator
 *
 * Client-Side mit Supabase Realtime Subscriptions.
 * Orchistriert: Header → LIVE → Nächste → Ergebnisse → Tabelle → Footer.
 *
 * ≤ 80 Zeilen — nur Layout-Logik, Daten kommen aus Hook.
 */

"use client";

import Link from "next/link";
import GuestHeader from "./GuestHeader";
import ArchivedView from "./ArchivedView";
import LiveSection from "./LiveSection";
import NextMatchesSection from "./NextMatchesSection";
import ResultsSection from "./ResultsSection";
import StandingsSection from "./StandingsSection";
import useGuestData from "./useGuestData";

export default function GuestViewClient({
  slug,
  isArchived = false,
}: {
  slug: string;
  isArchived?: boolean;
}) {
  const { matches, goals, standings, loading } = useGuestData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-bg dark:bg-dark-bg flex items-center justify-center">
        <p className="text-slate-stone dark:text-dark-text-secondary animate-pulse">
          Laden...
        </p>
      </div>
    );
  }

  if (isArchived)
    return <ArchivedView matches={matches} standings={standings} slug={slug} />;

  const liveMatches = matches.filter((m) => m.status === "live");
  const nextMatches = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.time.localeCompare(b.time));
  const finishedMatches = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => (b.matchNo ?? 0) - (a.matchNo ?? 0));

  return (
    <div className="min-h-screen bg-slate-bg dark:bg-dark-bg">
      <GuestHeader slug={slug} />
      <main className="max-w-2xl mx-auto px-4 py-4">
        {liveMatches.length > 0 && (
          <LiveSection matches={liveMatches} goals={goals} />
        )}
        {nextMatches.length > 0 && <NextMatchesSection matches={nextMatches} />}
        {finishedMatches.length > 0 && (
          <ResultsSection matches={finishedMatches} goals={goals} />
        )}
        {standings.length > 0 && <StandingsSection standings={standings} />}
      </main>
      <GuestFooter />
    </div>
  );
}

function GuestFooter() {
  return (
    <footer className="max-w-2xl mx-auto px-4 py-6 text-center">
      <p className="text-xs text-slate-stone dark:text-dark-text-secondary">
        Turnier-Planner App
      </p>
      <Link
        href="/impressum"
        className="text-xs text-sage hover:underline mt-1 inline-block"
      >
        Impressum
      </Link>
    </footer>
  );
}
