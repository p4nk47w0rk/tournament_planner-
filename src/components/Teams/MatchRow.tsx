"use client";

import type { Match } from "@/lib/tournament-data";

export function MatchRow({
  match,
  teamName,
}: {
  match: Match;
  teamName: string;
}) {
  const isHome = match.homeTeam === teamName;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const score = isHome
    ? `${match.homeScore ?? "–"}:${match.awayScore ?? "–"}`
    : `${match.awayScore ?? "–"}:${match.homeScore ?? "–"}`;
  const isFinished = match.status === "finished";

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-secondary/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <TimeDisplay time={match.time} />
        <TeamLineup isHome={isHome} teamName={teamName} opponent={opponent} />
      </div>
      <ScoreDisplay score={score} isFinished={isFinished} />
    </div>
  );
}

function TimeDisplay({ time }: { time: string }) {
  return (
    <span className="text-xs font-mono text-slate-stone shrink-0 w-10">
      {time}
    </span>
  );
}

function TeamLineup({
  isHome,
  teamName,
  opponent,
}: {
  isHome: boolean;
  teamName: string;
  opponent: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {isHome ? <HomeTeam name={teamName} /> : <AwayTeam name={opponent} />}
      <span className="text-slate-stone text-sm shrink-0">vs.</span>
      {isHome ? <AwayTeam name={opponent} /> : <HomeTeam name={teamName} />}
    </div>
  );
}

function HomeTeam({ name }: { name: string }) {
  return (
    <span className="font-medium text-slate-ink dark:text-dark-text truncate">
      {name}
    </span>
  );
}

function AwayTeam({ name }: { name: string }) {
  return (
    <span className="text-slate-ink dark:text-dark-text truncate">{name}</span>
  );
}

function ScoreDisplay({
  score,
  isFinished,
}: {
  score: string;
  isFinished: boolean;
}) {
  return (
    <span
      className={`text-sm font-mono font-bold shrink-0 ml-3 ${
        isFinished
          ? "text-slate-ink dark:text-dark-text"
          : "text-slate-stone dark:text-dark-text-secondary"
      }`}
    >
      {score}
    </span>
  );
}
