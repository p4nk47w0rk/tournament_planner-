/**
 * Guest View Client Component
 *
 * Client-Side mit Supabase Realtime Subscriptions.
 * Rendert die Gast-View: Header → LIVE → Nächste → Ergebnisse → Tabelle → Footer.
 *
 * T04: Guest-View Client — LIVE, Nächste, Ergebnisse, Tabelle + Realtime
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MatchService } from "@/lib/services/match-service";
import { GoalService } from "@/lib/services/goal-service";
import { StandingsService } from "@/lib/services/standings-service";
import type { Match, Goal, StandingsRow } from "@/lib/types";

// ============================================
// Soccer Ball Icon (inline SVG)
// ============================================

function SoccerBallIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2 L14.5 8 L12 10 L9.5 8 Z" />
      <path d="M22 12 L16 10 L14.5 12 L16 14 Z" />
      <path d="M12 22 L9.5 16 L12 14 L14.5 16 Z" />
      <path d="M2 12 L8 14 L10 12 L8 10 Z" />
    </svg>
  );
}

// ============================================
// Team helpers
// ============================================

function getTeamInfo(teamName: string) {
  const slug = teamName
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, 3);
  const teamNames = [
    "Varnsdorf",
    "Šluknov B",
    "Česká Lípa A",
    "Grossharthau",
    "Vilémov",
    "SFA Jiřetín",
    "Neusalza",
    "Šluknov A",
    "Česká Lípa B",
    "Union Děčín",
  ];
  const teamIndex = teamNames.indexOf(teamName);
  const colors = [
    "#1e40af",
    "#dc2626",
    "#059669",
    "#d97706",
    "#7c3aed",
    "#be185d",
    "#0891b2",
    "#65a30d",
    "#b45309",
    "#4338ca",
  ];
  return {
    name: teamName,
    shortName: teamName.slice(0, 3).toUpperCase(),
    color: colors[teamIndex] ?? "#94a3b8",
    logo: undefined,
  };
}

// ============================================
// Animation helpers (Web Animations API)
// ============================================

function animatePulse(element: HTMLElement | null, color: string) {
  if (!element) return;
  element.animate(
    [
      { boxShadow: `0 0 0 0 ${color}`, opacity: 1 },
      { boxShadow: `0 0 0 8px ${color}40`, opacity: 0.7 },
      { boxShadow: `0 0 0 0 ${color}`, opacity: 1 },
    ],
    { duration: 800, easing: "ease-out" }
  );
}

function animateFlash(element: HTMLElement | null) {
  if (!element) return;
  element.animate(
    [
      { color: "var(--text)", fontWeight: 400 },
      { color: "var(--accent)", fontWeight: 700 },
      { color: "var(--text)", fontWeight: 400 },
    ],
    { duration: 600, easing: "ease-out" }
  );
}

// ============================================
// Collapsible Section
// ============================================

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate to correct height on open/close
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.maxHeight = `${el.scrollHeight}px`;
    } else {
      el.style.maxHeight = "0px";
    }
  }, [isOpen]);

  return (
    <div className="border-b border-slate-hairline dark:border-dark-border">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-4 px-4 text-left"
        aria-expanded={isOpen}
      >
        <h2 className="text-base font-semibold text-slate-ink dark:text-dark-text">
          {title}
        </h2>
        <svg
          className={`w-5 h-5 text-slate-stone transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{
          maxHeight: "0px",
          transition: "max-height 0.3s ease",
        }}
      >
        <div className="pb-4 px-4">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// Match Card (Guest View version)
// ============================================

function GuestMatchCard({ match, goals }: { match: Match; goals: Goal[] }) {
  const homeTeam = getTeamInfo(match.homeTeam);
  const awayTeam = getTeamInfo(match.awayTeam);
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const homeScoreRef = useRef<HTMLSpanElement>(null);
  const awayScoreRef = useRef<HTMLSpanElement>(null);
  const prevHome = useRef(homeScore);
  const prevAway = useRef(awayScore);

  // Flash score on change
  useEffect(() => {
    if (homeScore !== prevHome.current) {
      animateFlash(homeScoreRef.current);
      prevHome.current = homeScore;
    }
    if (awayScore !== prevAway.current) {
      animateFlash(awayScoreRef.current);
      prevAway.current = awayScore;
    }
  }, [homeScore, awayScore]);

  return (
    <div className="bg-paper dark:bg-dark-surface rounded-xl p-4 mb-3 shadow-sm">
      {/* Score Row */}
      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: homeTeam.color }}
          >
            {homeTeam.logo ? (
              <img
                src={homeTeam.logo}
                alt={homeTeam.name}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              homeTeam.shortName
            )}
          </div>
          <span className="text-sm font-medium text-slate-ink dark:text-dark-text truncate">
            {match.homeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 mx-4">
          <span
            ref={homeScoreRef}
            className="text-lg font-bold text-slate-ink dark:text-dark-text w-6 text-center"
          >
            {homeScore}
          </span>
          <span className="text-slate-stone text-sm">:</span>
          <span
            ref={awayScoreRef}
            className="text-lg font-bold text-slate-ink dark:text-dark-text w-6 text-center"
          >
            {awayScore}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium text-slate-ink dark:text-dark-text truncate">
            {match.awayTeam}
          </span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: awayTeam.color }}
          >
            {awayTeam.logo ? (
              <img
                src={awayTeam.logo}
                alt={awayTeam.name}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              awayTeam.shortName
            )}
          </div>
        </div>
      </div>

      {/* Status + Goals */}
      <div className="mt-2">
        <div className="flex items-center gap-2">
          {match.status === "live" && (
            <span
              ref={(el) => {
                if (el) animatePulse(el, "#22c55e");
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          )}
          {match.status === "finished" && (
            <span className="text-xs text-slate-stone">Beendet</span>
          )}
          {match.status === "scheduled" && (
            <span className="text-xs text-slate-stone">{match.time}</span>
          )}
          {match.pitch && (
            <span className="text-xs text-slate-stone ml-auto">
              Platz {match.pitch}
            </span>
          )}
        </div>

        {/* Goals Feed */}
        {goals.length > 0 && (
          <div className="mt-2 space-y-1">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="text-xs text-slate-stone dark:text-dark-text-secondary flex items-center gap-1"
              >
                <span aria-hidden="true">⚽</span>
                <span>
                  {goal.minute && (
                    <span className="font-medium">{goal.minute}&apos;</span>
                  )}{" "}
                  {goal.team}
                  {goal.player && (
                    <>
                      {" "}
                      (<span className="italic">{goal.player}</span>)
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Standings Table (Guest View version)
// ============================================

function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  const sorted = [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const rankMap = new Map<string, number>();
  let currentRank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].points !== sorted[i - 1].points) {
      currentRank = i + 1;
    }
    rankMap.set(sorted[i].team, currentRank);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-hairline dark:border-dark-border">
            <th className="py-2 px-2 text-left text-xs font-medium text-slate-stone">
              #
            </th>
            <th className="py-2 px-2 text-left text-xs font-medium text-slate-stone">
              Team
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              Sp
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              Tore
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              TD
            </th>
            <th className="py-2 px-2 text-center text-xs font-medium text-slate-stone">
              Pkt
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.team}
              className="border-b border-slate-hairline/50 dark:border-dark-border/50"
            >
              <td className="py-2 px-2 text-slate-stone">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-dark-surface text-xs">
                  {rankMap.get(row.team)}
                </span>
              </td>
              <td className="py-2 px-2">
                <div className="flex items-center gap-2">
                  {row.logo && (
                    <img src={row.logo} alt="" className="w-5 h-5 rounded" />
                  )}
                  <span className="font-medium text-slate-ink dark:text-dark-text">
                    {row.team}
                  </span>
                </div>
              </td>
              <td className="py-2 px-2 text-center text-slate-stone">
                {row.played}
              </td>
              <td className="py-2 px-2 text-center text-slate-stone">
                {row.goalsFor}:{row.goalsAgainst}
              </td>
              <td className="py-2 px-2 text-center text-slate-stone">
                {row.goalDifference > 0
                  ? `+${row.goalDifference}`
                  : row.goalDifference}
              </td>
              <td className="py-2 px-2 text-center font-semibold text-slate-ink dark:text-dark-text">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Guest View Client
// ============================================

export default function GuestViewClient({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  const supabase = createClient();
  const [matches, setMatches] = useState<Match[]>([]);
  const [goals, setGoals] = useState<Record<number, Goal[]>>({});
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    let cancelled = false;

    MatchService.getAllMatches().then((data) => {
      if (!cancelled) {
        setMatches(data);
        setStandings(StandingsService.calculateStandings(data));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Subscribe to match updates (realtime)
  useEffect(() => {
    return MatchService.subscribeToAll(() => {
      MatchService.getAllMatches().then((data) => {
        setMatches(data);
        setStandings(StandingsService.calculateStandings(data));
      });
    });
  }, []);

  // Subscribe to goals for each match
  useEffect(() => {
    const subscribers: Array<() => void> = [];
    matches.forEach((match) => {
      const sub = GoalService.subscribeToGoals(match.id, (goal: Goal) => {
        setGoals((prev) => ({
          ...prev,
          [match.id]: [...(prev[match.id] || []), goal],
        }));
      });
      subscribers.push(sub);
    });

    return () => subscribers.forEach((s) => s());
  }, [matches]);

  // Fetch existing goals for all matches
  useEffect(() => {
    matches.forEach((match) => {
      GoalService.getGoals(match.id).then((goalList) => {
        setGoals((prev) => ({ ...prev, [match.id]: goalList }));
      });
    });
  }, [matches]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-stone dark:text-dark-text-secondary animate-pulse">
            Laden...
          </p>
        </div>
      </div>
    );
  }

  const liveMatches = matches.filter((m) => m.status === "live");
  const nextMatches = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.time.localeCompare(b.time));
  const finishedMatches = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => (b.matchNo ?? 0) - (a.matchNo ?? 0));

  return (
    <div className="min-h-screen bg-slate-bg dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-paper dark:bg-paper border-b border-slate-hairline dark:border-dark-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <SoccerBallIcon className="w-6 h-6 text-sage" />
          <h1 className="text-lg font-bold text-slate-ink dark:text-dark-text tracking-tight">
            {slug}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* LIVE Section */}
        {liveMatches.length > 0 && (
          <section aria-label="Aktive Spiele">
            <h2 className="text-base font-semibold text-slate-ink dark:text-dark-text mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </h2>
            {liveMatches.map((match) => (
              <GuestMatchCard
                key={match.id}
                match={match}
                goals={goals[match.id] || []}
              />
            ))}
          </section>
        )}

        {/* Next Matches */}
        {nextMatches.length > 0 && (
          <section aria-label="Nächste Spiele" className="mt-6">
            <h2 className="text-base font-semibold text-slate-ink dark:text-dark-text mb-3">
              Nächste Spiele
            </h2>
            {nextMatches.slice(0, 3).map((match) => (
              <GuestMatchCard key={match.id} match={match} goals={[]} />
            ))}
          </section>
        )}

        {/* Last Results (Collapsible) */}
        {finishedMatches.length > 0 && (
          <section aria-label="Letzte Ergebnisse" className="mt-4">
            <CollapsibleSection title="Letzte Ergebnisse">
              {finishedMatches.slice(0, 5).map((match) => (
                <GuestMatchCard
                  key={match.id}
                  match={match}
                  goals={goals[match.id] || []}
                />
              ))}
            </CollapsibleSection>
          </section>
        )}

        {/* Standings (Collapsible) */}
        {standings.length > 0 && (
          <section aria-label="Gruppenstand" className="mt-4">
            <CollapsibleSection title="Gruppenstand">
              {/* Group A */}
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
        )}
      </main>

      {/* Footer */}
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
