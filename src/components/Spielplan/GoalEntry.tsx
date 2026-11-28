import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Match } from "@/lib/types";

interface GoalEntryProps {
  match: Match;
  onGoalAdd: (
    matchId: number,
    team: string,
    minute?: string,
    player?: string
  ) => void;
  onGoalRemove?: (goalId: number) => void;
}

export default function GoalEntry({ match, onGoalAdd }: GoalEntryProps) {
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
              onGoalAdd(
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
