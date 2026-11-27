"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { type Match, type Team, type Goal } from "@/lib/types";
import { TEAMS } from "@/lib/tournament-data";
import { GoalService } from "@/lib/services/goal-service";

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
  const t = useTranslations("schedule");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load goals on mount
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

    // Subscribe to realtime goal updates
    const unsubscribe = GoalService.subscribeToGoals(
      match.id,
      (newGoal: Goal) => {
        setGoals((prev) => [...prev, newGoal]);
      }
    );

    return unsubscribe;
  }, [match.id]);

  const homeTeam = TEAMS.find((t) => t.name === match.homeTeam);
  const awayTeam = TEAMS.find((t) => t.name === match.awayTeam);

  const status =
    match.homeScore !== null || match.awayScore !== null
      ? "finished"
      : "upcoming";

  return (
    <div
      className={`match-card rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 transition-all duration-200 ${
        status === "finished" ? "opacity-80" : ""
      }`}
    >
      {/* Time, Field, Group */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-slate-600 dark:text-dark-text-secondary">
            {match.time}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary">
            {t("field")} {match.pitch}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary">
            {t("group")} {match.group}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            status === "finished"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}
        >
          {status === "finished" ? t("finished") : t("upcoming")}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TeamBadge team={homeTeam} />
          <span className="text-sm font-semibold truncate text-slate-900 dark:text-dark-text">
            {match.homeTeam}
          </span>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-2 shrink-0">
          {editable ? (
            <EditableScore
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              onScoreChange={onScoreChange}
              matchId={match.id}
            />
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary">
              <span className="font-mono text-2xl font-bold text-slate-900 dark:text-dark-text">
                {match.homeScore ?? "—"}
              </span>
              <span className="text-slate-300 dark:text-dark-border">:</span>
              <span className="font-mono text-2xl font-bold text-slate-900 dark:text-dark-text">
                {match.awayScore ?? "—"}
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="text-sm font-semibold truncate text-slate-900 dark:text-dark-text text-right">
            {match.awayTeam}
          </span>
          <TeamBadge team={awayTeam} />
        </div>
      </div>

      {/* Goals Feed (only in read-only mode) */}
      {!editable && goals.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border">
          <p className="text-xs font-medium text-slate-500 dark:text-dark-text-secondary mb-2">
            {t("goalsLabel")}
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Admin Goal Entry */}
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

// ============================================
// TeamBadge
// ============================================

function TeamBadge({ team }: { team?: Team }) {
  if (!team) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-dark-secondary shrink-0" />
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
  homeScore,
  awayScore,
  onScoreChange,
  matchId,
}: {
  homeScore: number | null;
  awayScore: number | null;
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => void;
  matchId: number;
}) {
  const home = homeScore ?? 0;
  const away = awayScore ?? 0;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onScoreChange?.(matchId, "home", -1)}
        className="min-w-[44px] min-h-[44px] rounded-lg bg-slate-100 dark:bg-dark-secondary text-slate-600 hover:bg-slate-200 dark:hover:bg-dark-border flex items-center justify-center"
        aria-label={`${home} minus`}
      >
        −
      </button>
      <div className="w-12 h-10 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center font-mono text-lg font-bold text-slate-900 dark:text-dark-text">
        {home}
      </div>
      <button
        onClick={() => onScoreChange?.(matchId, "home", 1)}
        className="min-w-[44px] min-h-[44px] rounded-lg bg-sage/20 dark:bg-dark-secondary text-sage-dark hover:bg-sage/30 dark:text-dark-primary flex items-center justify-center"
        aria-label={`${home} plus`}
      >
        +
      </button>
      <span className="text-slate-300 dark:text-dark-border px-1">:</span>
      <button
        onClick={() => onScoreChange?.(matchId, "away", -1)}
        className="min-w-[44px] min-h-[44px] rounded-lg bg-slate-100 dark:bg-dark-secondary text-slate-600 hover:bg-slate-200 dark:hover:bg-dark-border flex items-center justify-center"
        aria-label={`${away} minus`}
      >
        −
      </button>
      <div className="w-12 h-10 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center font-mono text-lg font-bold text-slate-900 dark:text-dark-text">
        {away}
      </div>
      <button
        onClick={() => onScoreChange?.(matchId, "away", 1)}
        className="min-w-[44px] min-h-[44px] rounded-lg bg-sage/20 dark:bg-dark-secondary text-sage-dark hover:bg-sage/30 dark:text-dark-primary flex items-center justify-center"
        aria-label={`${away} plus`}
      >
        +
      </button>
    </div>
  );
}

// ============================================
// GoalItem (Read-Only)
// ============================================

function GoalItem({ goal }: { goal: Goal }) {
  // Format: ⚽ 12' Team (Player)
  const timePart = goal.minute ? `${goal.minute}' ` : "";
  const playerPart = goal.player ? ` (${goal.player})` : "";

  return (
    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-dark-text-secondary">
      <span className="text-base">⚽</span>
      <span className="font-mono text-xs text-slate-500 dark:text-dark-text-tertiary">
        {timePart || "—"}
      </span>
      <span className="font-medium">{goal.team}</span>
      {playerPart && (
        <span className="text-slate-500 dark:text-dark-text-tertiary text-xs italic">
          {playerPart}
        </span>
      )}
    </div>
  );
}

// ============================================
// GoalEntry (Admin)
// ============================================

function GoalEntry({
  match,
  onGoalAdd,
  onGoalRemove,
}: {
  match: Match;
  onGoalAdd?: (
    matchId: number,
    team: string,
    minute?: string,
    player?: string
  ) => void;
  onGoalRemove?: (goalId: number) => void;
}) {
  const t = useTranslations("schedule");
  const [minute, setMinute] = useState("");
  const [player, setPlayer] = useState("");

  const teams = [match.homeTeam, match.awayTeam];

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border">
      <p className="text-xs font-medium text-slate-500 dark:text-dark-text-secondary mb-2">
        {t("goalEntryTitle")}
      </p>
      <div className="flex flex-wrap gap-2">
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => {
              onGoalAdd?.(
                match.id,
                team,
                minute || undefined,
                player || undefined
              );
              setMinute("");
              setPlayer("");
            }}
            className="flex-1 min-w-[120px] min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
          >
            ⚽ {team}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder={t("minutePlaceholder")}
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-slate-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage/50"
        />
        <input
          type="text"
          placeholder={t("playerPlaceholder")}
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-slate-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage/50"
        />
      </div>
    </div>
  );
}
