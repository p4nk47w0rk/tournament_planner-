"use client";

import { useState } from "react";
import { type Match } from "@/lib/types";
import MatchCard from "@/components/Spielplan/MatchCard";

interface PlayoffBracketProps {
  matches: Match[];
  editable?: boolean;
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => void;
  onGoalAdd?: (
    matchId: number,
    team: string,
    minute?: string,
    player?: string
  ) => void;
  onGoalRemove?: (goalId: number) => void;
}

// Bracket-Phase Definition für korrekte Reihenfolge
const PHASES = [
  { key: "play_in", label: "Play-in", colSpan: 4 },
  { key: "quarterfinal", label: "Viertelfinale", colSpan: 2 },
  { key: "semifinal", label: "Halbfinale", colSpan: 1 },
  { key: "final", label: "Finale", colSpan: 1 },
  { key: "bronze", label: "Platz 3", colSpan: 1 },
] as const;

export default function PlayoffBracket({
  matches,
  editable,
  onScoreChange,
  onGoalAdd,
  onGoalRemove,
}: PlayoffBracketProps) {
  const [activePhase, setActivePhase] = useState<string>("play_in");

  // Split matches by phase
  const matchesByPhase: Record<string, Match[]> = {};
  for (const match of matches) {
    if (!matchesByPhase[match.phase]) matchesByPhase[match.phase] = [];
    matchesByPhase[match.phase].push(match);
  }

  return (
    <div>
      {/* Phase Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PHASES.map((phase) => {
          const phaseMatches = matchesByPhase[phase.key] || [];
          const hasMatches = phaseMatches.length > 0;
          const isActive = activePhase === phase.key;
          const hasLive = phaseMatches.some((m) => m.status === "live");

          return (
            <button
              key={phase.key}
              onClick={() => setActivePhase(phase.key)}
              disabled={!hasMatches}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !hasMatches
                  ? "bg-slate-100 dark:bg-muted text-slate-400 text-dark-text-tertiary cursor-not-allowed"
                  : isActive
                    ? "bg-[#D97757] text-white"
                    : "bg-slate-100 dark:bg-muted text-slate-600 text-slate-stone hover:bg-slate-200 dark:hover:bg-muted"
              }`}
            >
              {phase.label}
              {hasLive && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bracket Grid */}
      <div className="space-y-6">
        {PHASES.map((phase) => {
          const phaseMatches = matchesByPhase[phase.key] || [];
          if (activePhase !== phase.key) return null;

          return (
            <div
              key={phase.key}
              className={`grid gap-4 ${
                phase.colSpan === 4
                  ? "grid-cols-1 sm:grid-cols-2"
                  : phase.colSpan === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 max-w-lg mx-auto"
              }`}
            >
              {phaseMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  editable={editable}
                  onScoreChange={onScoreChange}
                  onGoalAdd={onGoalAdd}
                  onGoalRemove={onGoalRemove}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Bracket Legend */}
      <div className="mt-8 p-4 bg-muted rounded-xl">
        <h4 className="font-semibold text-sm text-slate-600 text-slate-stone mb-3">
          🏆 Playoff-Struktur
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-500" />
            <span className="text-slate-600 text-slate-stone">
              Play-in (2 Spiele)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-slate-600 text-slate-stone">
              Viertelfinale (4 Spiele)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-slate-600 text-slate-stone">
              Halbfinale (2 Spiele)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-slate-600 text-slate-stone">
              Finale + Platz 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
