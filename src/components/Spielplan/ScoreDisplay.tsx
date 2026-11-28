interface ScoreDisplayProps {
  score: number | null;
  oppositeScore: number | null;
  editable: boolean;
  onScoreChange?: (
    matchId: number,
    team: "home" | "away",
    delta: number
  ) => void;
  matchId: number;
}

export default function ScoreDisplay({
  score,
  oppositeScore,
  editable,
  onScoreChange,
  matchId,
}: ScoreDisplayProps) {
  if (editable) {
    return (
      <EditableScore
        homeScore={score}
        awayScore={oppositeScore}
        onScoreChange={onScoreChange}
        matchId={matchId}
      />
    );
  }
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary">
      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-dark-text">
        {score ?? "—"}
      </span>
      <span className="text-slate-300 dark:text-dark-border">:</span>
      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-dark-text">
        {oppositeScore ?? "—"}
      </span>
    </div>
  );
}

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
      <ScoreButton
        label={`${home} minus`}
        onClick={() => onScoreChange?.(matchId, "home", -1)}
      >
        −
      </ScoreButton>
      <div className="w-12 h-10 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center font-mono text-lg font-bold text-slate-900 dark:text-dark-text">
        {home}
      </div>
      <ScoreButton
        label={`${home} plus`}
        onClick={() => onScoreChange?.(matchId, "home", 1)}
        variant="plus"
      >
        +
      </ScoreButton>
      <span className="text-slate-300 dark:text-dark-border px-1">:</span>
      <ScoreButton
        label={`${away} minus`}
        onClick={() => onScoreChange?.(matchId, "away", -1)}
      >
        −
      </ScoreButton>
      <div className="w-12 h-10 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center font-mono text-lg font-bold text-slate-900 dark:text-dark-text">
        {away}
      </div>
      <ScoreButton
        label={`${away} plus`}
        onClick={() => onScoreChange?.(matchId, "away", 1)}
        variant="plus"
      >
        +
      </ScoreButton>
    </div>
  );
}

function ScoreButton({
  children,
  onClick,
  label,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  variant?: "plus";
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[44px] min-h-[44px] rounded-lg ${variant ? "bg-sage/20 dark:bg-dark-secondary text-sage-dark hover:bg-sage/30 dark:text-dark-primary" : "bg-slate-100 dark:bg-dark-secondary text-slate-600 hover:bg-slate-200 dark:hover:bg-dark-border"} flex items-center justify-center`}
      aria-label={label}
    >
      {children}
    </button>
  );
}
