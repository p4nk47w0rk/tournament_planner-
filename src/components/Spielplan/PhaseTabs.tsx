import { PHASES } from "./types";

interface PhaseTabsProps {
  phases: typeof PHASES;
  matchesByPhase: Record<string, import("@/lib/types").Match[]>;
  active: string;
  onChange: (phase: string) => void;
}

export default function PhaseTabs({
  phases,
  matchesByPhase,
  active,
  onChange,
}: PhaseTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {phases.map((phase) => {
        const phaseMatches = matchesByPhase[phase.key] || [];
        const hasMatches = phaseMatches.length > 0;
        const hasLive = phaseMatches.some((m) => m.status === "live");
        return (
          <button
            key={phase.key}
            onClick={() => onChange(phase.key)}
            disabled={!hasMatches}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !hasMatches
                ? "bg-slate-100 dark:bg-muted text-slate-400 text-dark-text-tertiary cursor-not-allowed"
                : active === phase.key
                  ? "bg-[#D97757] text-white"
                  : "bg-slate-100 dark:bg-muted text-slate-600 text-slate-stone hover:bg-slate-200 dark:hover:bg-muted"
            }`}
          >
            {phase.label}
            {hasLive && (
              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
