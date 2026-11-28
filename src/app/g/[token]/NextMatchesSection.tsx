/**
 * NextMatchesSection — Nächste Spiele anzeigen
 */

import GuestMatchCard from "./GuestMatchCard";
import type { Match } from "@/lib/types";

interface NextMatchesSectionProps {
  matches: Match[];
}

export default function NextMatchesSection({
  matches,
}: NextMatchesSectionProps) {
  return (
    <section aria-label="Nächste Spiele" className="mt-6">
      <h2 className="text-base font-semibold text-slate-ink dark:text-dark-text mb-3">
        Nächste Spiele
      </h2>
      {matches.slice(0, 3).map((m) => (
        <GuestMatchCard key={m.id} match={m} goals={[]} />
      ))}
    </section>
  );
}
