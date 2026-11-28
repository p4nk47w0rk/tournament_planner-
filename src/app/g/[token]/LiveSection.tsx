/**
 * LiveSection — LIVE-Spiele anzeigen
 */

import GuestMatchCard from "./GuestMatchCard";
import type { Match, Goal } from "@/lib/types";

interface LiveSectionProps {
  matches: Match[];
  goals: Record<number, Goal[]>;
}

export default function LiveSection({ matches, goals }: LiveSectionProps) {
  return (
    <section aria-label="Aktive Spiele">
      <h2 className="text-base font-semibold text-slate-ink dark:text-dark-text mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        LIVE
      </h2>
      {matches.map((m) => (
        <GuestMatchCard key={m.id} match={m} goals={goals[m.id] || []} />
      ))}
    </section>
  );
}
