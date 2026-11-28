/**
 * StandingsSection — Gruppenstand (akkordeon)
 */

import CollapsibleSection from "./CollapsibleSection";
import StandingsTable from "./StandingsTable";
import type { StandingsRow } from "@/lib/types";

interface StandingsSectionProps {
  standings: StandingsRow[];
}

export default function StandingsSection({ standings }: StandingsSectionProps) {
  return (
    <section aria-label="Gruppenstand" className="mt-4">
      <CollapsibleSection title="Gruppenstand">
        <h3 className="text-sm font-medium text-slate-stone mb-2">Gruppe A</h3>
        <StandingsTable rows={standings.filter((s) => s.group === "A")} />
        <h3 className="text-sm font-medium text-slate-stone mt-4 mb-2">
          Gruppe B
        </h3>
        <StandingsTable rows={standings.filter((s) => s.group === "B")} />
      </CollapsibleSection>
    </section>
  );
}
