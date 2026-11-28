interface GoalsFeedProps {
  goals: Array<{ id: number; minute?: string; team: string; player?: string }>;
}

export default function GoalsFeed({ goals }: GoalsFeedProps) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border">
      <p className="text-xs font-medium text-slate-500 dark:text-dark-text-secondary mb-2">
        Tore
      </p>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}

function GoalItem({
  goal,
}: {
  goal: { minute?: string; team: string; player?: string };
}) {
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
