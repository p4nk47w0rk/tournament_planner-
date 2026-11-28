/**
 * ArchivedView — Finale Ansicht für archivierte Turniere
 *
 * Rendert: Header, Medaillen-Platzierung, Endtabelle, Footer.
 * ≤ 70 Zeilen — KISS.
 */

import Link from "next/link";
import { Match, StandingsRow } from "@/lib/types";
import CollapsibleSection from "./CollapsibleSection";
import StandingsTable from "./StandingsTable";
import SoccerBallIcon from "./SoccerBallIcon";

interface ArchivedViewProps {
  matches: Match[];
  standings: StandingsRow[];
  slug: string;
}

function getMedalTeams(matches: Match[]): {
  gold: string;
  silver: string;
  bronze: string;
} {
  const finalMatch = matches.find(
    (m) => m.phase === "final" && m.status === "finished"
  );
  const bronzeMatch = matches.find(
    (m) => m.phase === "bronze" && m.status === "finished"
  );

  let goldTeam = "—";
  let silverTeam = "—";
  let bronzeTeam = "—";

  if (finalMatch) {
    const homeWon = (finalMatch.homeScore ?? 0) > (finalMatch.awayScore ?? 0);
    goldTeam = homeWon ? finalMatch.homeTeam : finalMatch.awayTeam;
    silverTeam = homeWon ? finalMatch.awayTeam : finalMatch.homeTeam;
  }

  if (bronzeMatch) {
    bronzeTeam =
      (bronzeMatch.homeScore ?? 0) > (bronzeMatch.awayScore ?? 0)
        ? bronzeMatch.homeTeam
        : bronzeMatch.awayTeam;
  }

  return { gold: goldTeam, silver: silverTeam, bronze: bronzeTeam };
}

export default function ArchivedView({
  matches,
  standings,
  slug,
}: ArchivedViewProps) {
  const { gold, silver, bronze } = getMedalTeams(matches);

  return (
    <div className="min-h-screen bg-slate-bg dark:bg-dark-bg">
      <header className="bg-paper dark:bg-paper border-b border-slate-hairline dark:border-dark-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <SoccerBallIcon className="w-6 h-6 text-sage" />
          <h1 className="text-lg font-bold text-slate-ink dark:text-dark-text tracking-tight">
            {slug}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <section aria-label="Finale Platzierung" className="mb-8">
          <h2 className="text-xl font-bold text-slate-ink dark:text-dark-text mb-6 text-center">
            Finale Platzierung
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl p-4 text-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700">
              <div className="text-2xl mb-1">🥈</div>
              <div className="text-sm font-bold">{silver}</div>
            </div>
            <div className="rounded-xl p-4 text-center bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 ring-2 ring-yellow-400">
              <div className="text-3xl mb-1">🥇</div>
              <div className="text-base font-bold">{gold}</div>
            </div>
            <div className="rounded-xl p-4 text-center bg-gradient-to-br from-amber-400 to-amber-600 text-amber-900">
              <div className="text-2xl mb-1">🥉</div>
              <div className="text-sm font-bold">{bronze}</div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-stone dark:text-dark-text-secondary mb-6">
            Das Turnier wurde archiviert.
          </p>
        </section>

        <section aria-label="Endtabelle">
          <CollapsibleSection title="Endtabelle" defaultOpen>
            <h3 className="text-sm font-medium text-slate-stone mb-2">
              Gruppe A
            </h3>
            <StandingsTable rows={standings.filter((s) => s.group === "A")} />
            <h3 className="text-sm font-medium text-slate-stone mt-4 mb-2">
              Gruppe B
            </h3>
            <StandingsTable rows={standings.filter((s) => s.group === "B")} />
          </CollapsibleSection>
        </section>
      </main>

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
    </div>
  );
}
