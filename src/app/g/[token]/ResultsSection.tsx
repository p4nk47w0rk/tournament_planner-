/**
 * ResultsSection — Letzte Ergebnisse (akkordeon)
 */

import GuestMatchCard from "./GuestMatchCard";
import CollapsibleSection from "./CollapsibleSection";
import type { Match, Goal } from "@/lib/types";

interface ResultsSectionProps {
  matches: Match[];
  goals: Record<number, Goal[]>;
}

export default function ResultsSection({
  matches,
  goals,
}: ResultsSectionProps) {
  return (
    <section aria-label="Letzte Ergebnisse" className="mt-4">
      <CollapsibleSection title="Letzte Ergebnisse">
        {matches.slice(0, 5).map((m) => (
          <GuestMatchCard key={m.id} match={m} goals={goals[m.id] || []} />
        ))}
      </CollapsibleSection>
    </section>
  );
}
