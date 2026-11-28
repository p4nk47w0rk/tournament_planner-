import { PHASES } from "./types";

export default function PlayoffBracket({
  matches,
  editable,
  onScoreChange,
  onGoalAdd,
  onGoalRemove,
}: {
  matches: import("@/lib/types").Match[];
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
}) {
  const [activePhase, setActivePhase] = useState<string>("play_in");
  const matchesByPhase = groupByPhase(matches);

  return (
    <div>
      <PhaseTabs
        phases={PHASES}
        matchesByPhase={matchesByPhase}
        active={activePhase}
        onChange={setActivePhase}
      />
      <PhaseMatches
        phases={PHASES}
        matchesByPhase={matchesByPhase}
        active={activePhase}
        editable={editable}
        onScoreChange={onScoreChange}
        onGoalAdd={onGoalAdd}
        onGoalRemove={onGoalRemove}
      />
      <BracketLegend />
    </div>
  );
}

import { useState } from "react";
import PhaseTabs from "./PhaseTabs";
import PhaseMatches from "./PhaseMatches";
import BracketLegend from "./BracketLegend";

function groupByPhase(matches: import("@/lib/types").Match[]) {
  const result: Record<string, import("@/lib/types").Match[]> = {};
  for (const match of matches) {
    if (!result[match.phase]) result[match.phase] = [];
    result[match.phase].push(match);
  }
  return result;
}
