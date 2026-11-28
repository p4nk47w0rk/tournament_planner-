import MatchCard from "@/components/Spielplan/MatchCard";
import type { Match } from "@/lib/tournament-data";

interface MatchListProps {
  matches: Match[];
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => Promise<void>;
  onGoalAdd?: (
    matchId: number,
    team: string,
    minute?: string,
    player?: string
  ) => Promise<void>;
  editable: boolean;
  t: (k: string) => string;
}

export default function MatchList({
  matches,
  onScoreChange,
  onGoalAdd,
  editable,
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
