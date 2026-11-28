"use client";

import { type Match, type Goal } from "@/lib/types";
import { TEAMS } from "@/lib/tournament-data";
import MatchHeader from "./MatchHeader";
import ScoreDisplay from "./ScoreDisplay";
import GoalsFeed from "./GoalsFeed";
import GoalEntry from "./GoalEntry";
import { useMatchGoals } from "./useMatchGoals";

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
  const goals = useMatchGoals(match.id);
  const homeTeam = TEAMS.find((t) => t.name === match.homeTeam);
  const awayTeam = TEAMS.find((t) => t.name === match.awayTeam);
  const status =
    match.homeScore !== null || match.awayScore !== null
      ? "finished"
      : "upcoming";

  return (
    <div
      className={`match-card rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 transition-all duration-200 ${status === "finished" ? "opacity-80" : ""}`}
    >
      <MatchHeader
        time={match.time}
        pitch={match.pitch}
        group={match.group}
        status={status}
      />
      <div className="flex items-center justify-between gap-4">
        <TeamSection team={homeTeam} name={match.homeTeam} />
        <ScoreDisplay
          score={match.homeScore}
          oppositeScore={match.awayScore}
          editable={editable}
          onScoreChange={onScoreChange}
          matchId={match.id}
        />
        <TeamSection team={awayTeam} name={match.awayTeam} reverse />
      </div>
      {!editable && goals.length > 0 && <GoalsFeed goals={goals} />}
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

function TeamSection({
  team,
  name,
  reverse,
}: {
  team?: { shortName: string; color: string };
  name: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 flex-1 min-w-0 ${reverse ? "justify-end" : ""}`}
    >
      {reverse && (
        <span className="text-sm font-semibold truncate text-slate-900 dark:text-dark-text text-right">
          {name}
        </span>
      )}
      <TeamBadge team={team} />
      {!reverse && (
        <span className="text-sm font-semibold truncate text-slate-900 dark:text-dark-text">
          {name}
        </span>
      )}
    </div>
  );
}

function TeamBadge({ team }: { team?: { shortName: string; color: string } }) {
  if (!team)
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-dark-secondary shrink-0" />
    );
  return (
    <div
      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${team.color} text-white shrink-0 flex items-center justify-center text-xs font-bold`}
    >
      {team.shortName}
    </div>
  );
}
