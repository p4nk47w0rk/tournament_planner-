import MatchCard from "@/components/Spielplan/MatchCard";
import type { Match } from "@/lib/tournament-data";

interface MatchListProps {
  matches: Match[];
  editable: boolean;
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
  t: (k: string) => string;
}

export default function MatchList({
  matches,
  editable,
  onScoreChange,
  onGoalAdd,
  t,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-slate-stone dark:text-dark-text-secondary">
        Keine Spiele gefunden.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onScoreChange={onScoreChange}
          onGoalAdd={onGoalAdd}
          editable={editable}
        />
      ))}
    </div>
  );
}
