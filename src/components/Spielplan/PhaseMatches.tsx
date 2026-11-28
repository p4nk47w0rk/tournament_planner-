import { PHASES } from "./types";
import MatchCard from "./MatchCard";

interface PhaseMatchesProps {
  phases: typeof PHASES;
  matchesByPhase: Record<string, import("@/lib/types").Match[]>;
  active: string;
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

export default function PhaseMatches({
  phases,
  matchesByPhase,
  active,
  editable,
  onScoreChange,
  onGoalAdd,
  onGoalRemove,
}: PhaseMatchesProps) {
  return (
    <div className="space-y-6">
      {phases.map((phase) => {
        const phaseMatches = matchesByPhase[phase.key] || [];
        if (active !== phase.key) return null;
        return (
          <div
            key={phase.key}
            className={`grid gap-4 ${getGridClass(phase.colSpan)}`}
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
  );
}

function getGridClass(colSpan: number) {
  if (colSpan === 4) return "grid-cols-1 sm:grid-cols-2";
  if (colSpan === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 max-w-lg mx-auto";
}
