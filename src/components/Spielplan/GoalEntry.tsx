"use client";

import { useState } from "react";
import { type Match } from "@/lib/types";

interface GoalEntryProps {
  match: Match;
  onGoalAdd?: (
    matchId: number,
    team: string,
    minute?: string,
    player?: string
  ) => void;
  onGoalRemove?: (goalId: number) => void;
}

export function GoalEntry({
  match,
  onGoalAdd,
  onGoalRemove: _onGoalRemove,
}: GoalEntryProps) {
  const [minute, setMinute] = useState("");
  const [player, setPlayer] = useState("");

  return (
    <div className="mt-3 pt-3 border-t border-slate-hairline">
      <p className="text-xs font-medium text-dark-text-tertiary mb-2">
        Tor erfassen
      </p>
      <div className="flex flex-wrap gap-2">
        {([match.homeTeam, match.awayTeam] as string[]).map((team) => (
          <GoalTeamButton
            key={team}
            team={team}
            matchId={match.id}
            onGoalAdd={onGoalAdd}
            minute={minute}
            player={player}
            setMinute={setMinute}
            setPlayer={setPlayer}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Minute (optional, z.B. 12')"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-slate-hairline rounded-lg bg-paper text-slate-ink focus:outline-none focus:ring-2 focus:ring-sage"
        />
        <input
          type="text"
          placeholder="Spieler (optional)"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-slate-hairline rounded-lg bg-paper text-slate-ink focus:outline-none focus:ring-2 focus:ring-sage"
        />
      </div>
    </div>
  );
}

function GoalTeamButton({
  team,
  matchId,
  onGoalAdd,
  minute,
  player,
  setMinute,
  setPlayer,
}: {
  team: string;
  matchId: number;
  onGoalAdd?: (
    matchId: number,
    team: string,
    minute?: string,
    player?: string
  ) => void;
  minute: string;
  player: string;
  setMinute: (v: string) => void;
  setPlayer: (v: string) => void;
}) {
  return (
    <button
      onClick={() => {
        onGoalAdd?.(matchId, team, minute || undefined, player || undefined);
        setMinute("");
        setPlayer("");
      }}
      className="flex-1 min-w-[120px] min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium bg-highlight text-sage hover:bg-highlight transition-colors"
    >
      ⚽ {team}
    </button>
  );
}
