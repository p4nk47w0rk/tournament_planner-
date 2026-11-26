"use client";

import { useEffect, useState } from "react";
import { type Match, type Team, type Goal } from "@/lib/types";
import { TEAMS } from "@/lib/tournament-data";
import { GoalService } from "@/lib/services/goal-service";
import { GoalEntry } from "./GoalEntry";

// ============================================
// Hook: MatchCard state
// ============================================

function useMatchCard(match: Match, _editable: boolean) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await GoalService.getGoals(match.id);
        setGoals(data);
      } catch (err) {
        console.error("Failed to load goals:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
    return GoalService.subscribeToGoals(match.id, (newGoal: Goal) =>
      setGoals((prev) => [...prev, newGoal])
    );
  }, [match.id]);

  const homeTeam = TEAMS.find((t) => t.name === match.homeTeam);
  const awayTeam = TEAMS.find((t) => t.name === match.awayTeam);
  const status =
    match.homeScore !== null || match.awayScore !== null
      ? "finished"
      : "upcoming";
  const statusLabel = status === "finished" ? "✅ Beendet" : "⏱ Steht an";

  return { goals, loading, homeTeam, awayTeam, status, statusLabel };
}

// ============================================
// Sub-components
// ============================================

function MatchHeader({
  match,
  statusLabel,
}: {
  match: Match;
  statusLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium text-slate-stone bg-muted px-2 py-0.5 rounded">
          {match.time}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-slate-stone">
          Platz {match.pitch}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-slate-stone">
          Gruppe {match.group}
        </span>
      </div>
      {statusLabel.includes("Beendet") ? (
        <span className="badge-finished">{statusLabel}</span>
      ) : (
        <span className="badge-upcoming">{statusLabel}</span>
      )}
    </div>
  );
}

function MatchTeams({
  match,
  homeTeam,
  awayTeam,
}: {
  match: Match;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
}) {
  return (
    <>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <TeamBadge team={homeTeam} />
        <span className="text-sm font-semibold truncate text-slate-ink">
          {match.homeTeam}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
        <span className="text-sm font-semibold truncate text-slate-ink text-right">
          {match.awayTeam}
        </span>
        <TeamBadge team={awayTeam} />
      </div>
    </>
  );
}

function ScoreDisplay({
  match,
  editable,
  onScoreChange,
}: {
  match: Match;
  editable: boolean;
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => void;
}) {
  if (editable) {
    return (
      <EditableScore
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        onScoreChange={onScoreChange}
        matchId={match.id}
      />
    );
  }
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted">
      <span className="font-mono text-2xl font-bold text-slate-ink">
        {match.homeScore ?? "—"}
      </span>
      <span className="text-slate-hairline">:</span>
      <span className="font-mono text-2xl font-bold text-slate-ink">
        {match.awayScore ?? "—"}
      </span>
    </div>
  );
}

function GoalsFeed({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-slate-hairline">
      <p className="text-xs font-medium text-dark-text-tertiary mb-2">Tore</p>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// TeamBadge
// ============================================

function TeamBadge({ team }: { team?: Team }) {
  if (!team) {
    return <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />;
  }
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt={`${team.name} Logo`}
        className="w-8 h-8 rounded-lg object-contain shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${team.color} text-white shrink-0 flex items-center justify-center text-xs font-bold`}
    >
      {team.shortName}
    </div>
  );
}

// ============================================
// EditableScore (Admin)
// ============================================

function EditableScore({
  onScoreChange,
  homeScore,
  awayScore,
  matchId,
}: {
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => void;
  homeScore: number | null;
  awayScore: number | null;
  matchId: number;
}) {
  const home = homeScore ?? 0;
  const away = awayScore ?? 0;

  return (
    <div className="flex items-center gap-1">
      <ScoreButton
        delta={-1}
        matchId={matchId}
        onScoreChange={onScoreChange}
        team="home"
        label={`${home} minus`}
      />
      <div className="w-12 h-10 rounded-lg bg-paper border border-slate-hairline flex items-center justify-center font-mono text-lg font-bold text-slate-ink">
        {home}
      </div>
      <ScoreButton
        delta={1}
        matchId={matchId}
        onScoreChange={onScoreChange}
        team="home"
        label={`${home} plus`}
      />
      <span className="text-slate-hairline px-1">:</span>
      <ScoreButton
        delta={-1}
        matchId={matchId}
        onScoreChange={onScoreChange}
        team="away"
        label={`${away} minus`}
      />
      <div className="w-12 h-10 rounded-lg bg-paper border border-slate-hairline flex items-center justify-center font-mono text-lg font-bold text-slate-ink">
        {away}
      </div>
      <ScoreButton
        delta={1}
        matchId={matchId}
        onScoreChange={onScoreChange}
        team="away"
        label={`${away} plus`}
      />
    </div>
  );
}

function ScoreButton({
  delta,
  matchId,
  onScoreChange,
  team,
  label,
}: {
  delta: number;
  matchId: number;
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => void;
  team: "home" | "away";
  label: string;
}) {
  return (
    <button
      onClick={() => onScoreChange?.(matchId, team, delta)}
      className={`min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center ${
        delta > 0
          ? "bg-sage-mist text-sage hover:bg-sage-mist"
          : "bg-muted text-slate-stone hover:bg-muted"
      }`}
      aria-label={label}
    >
      {delta > 0 ? "+" : "−"}
    </button>
  );
}

// ============================================
// GoalItem (Read-Only)
// ============================================

function GoalItem({ goal }: { goal: Goal }) {
  const timePart = goal.minute ? `${goal.minute}' ` : "";
  const playerPart = goal.player ? ` (${goal.player})` : "";
  return (
    <div className="flex items-center gap-2 text-sm text-slate-stone">
      <span className="text-base">⚽</span>
      <span className="font-mono text-xs text-dark-text-tertiary">
        {timePart || "—"}
      </span>
      <span className="font-medium">{goal.team}</span>
      {playerPart && (
        <span className="text-dark-text-tertiary text-xs italic">
          {playerPart}
        </span>
      )}
    </div>
  );
}

// ============================================
// MatchCard Props & Component
// ============================================

interface MatchCardProps {
  match: Match;
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

export default function MatchCard({
  match,
  editable = false,
  onScoreChange,
  onGoalAdd,
  onGoalRemove,
}: MatchCardProps) {
  const { goals, homeTeam, awayTeam, status, statusLabel } = useMatchCard(
    match,
    editable
  );

  return (
    <div
      className={`match-card rounded-xl p-4 transition-all duration-200 ${
        status === "finished" ? "opacity-80" : ""
      }`}
    >
      <MatchHeader match={match} statusLabel={statusLabel} />
      <div className="flex items-center justify-between gap-4">
        <MatchTeams match={match} homeTeam={homeTeam} awayTeam={awayTeam} />
        <ScoreDisplay
          match={match}
          editable={editable}
          onScoreChange={onScoreChange}
        />
      </div>
      {!editable && <GoalsFeed goals={goals} />}
      {editable && onGoalAdd && (
        <GoalEntry
          match={match}
          onGoalAdd={onGoalAdd}
          onGoalRemove={onGoalRemove}
        />
      )}
    </div>
  );
}
