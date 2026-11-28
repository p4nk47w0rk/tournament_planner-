/**
 * GuestMatchCard — Einzelnes Spiel-Display
 *
 * Single Responsibility: Ein Match rendern inkl. Score-Animation.
 * ≤ 120 Zeilen — KISS.
 */

import { useEffect, useRef } from "react";
import { animateFlash } from "./match-animations";
import { getTeamInfo, type TeamInfo } from "./guest-view-types";
import type { Match, Goal } from "@/lib/types";

interface GuestMatchCardProps {
  match: Match;
  goals: Goal[];
}

export default function GuestMatchCard({ match, goals }: GuestMatchCardProps) {
  const homeTeam = getTeamInfo(match.homeTeam);
  const awayTeam = getTeamInfo(match.awayTeam);
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const homeScoreRef = useRef<HTMLSpanElement>(null);
  const awayScoreRef = useRef<HTMLSpanElement>(null);
  const prevHome = useRef(homeScore);
  const prevAway = useRef(awayScore);

  // Score-Flash bei Änderung
  useEffect(() => {
    if (homeScore !== prevHome.current) {
      animateFlash(homeScoreRef.current);
      prevHome.current = homeScore;
    }
    if (awayScore !== prevAway.current) {
      animateFlash(awayScoreRef.current);
      prevAway.current = awayScore;
    }
  }, [homeScore, awayScore]);

  return (
    <div className="bg-paper dark:bg-dark-surface rounded-xl p-4 mb-3 shadow-sm">
      <MatchScoreRow
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamName={match.homeTeam}
        awayTeamName={match.awayTeam}
        homeScore={homeScore}
        awayScore={awayScore}
        homeScoreRef={homeScoreRef}
        awayScoreRef={awayScoreRef}
      />
      <MatchStatusRow match={match} goals={goals} />
    </div>
  );
}

interface MatchScoreRowProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeScoreRef: React.RefObject<HTMLSpanElement | null>;
  awayScoreRef: React.RefObject<HTMLSpanElement | null>;
}

function MatchScoreRow({
  homeTeam,
  awayTeam,
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  homeScoreRef,
  awayScoreRef,
}: MatchScoreRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamBadge team={homeTeam} />
        <span className="text-sm font-medium text-slate-ink dark:text-dark-text truncate">
          {homeTeamName}
        </span>
      </div>
      <div className="flex items-center gap-2 mx-4">
        <span
          ref={homeScoreRef}
          className="text-lg font-bold text-slate-ink dark:text-dark-text w-6 text-center"
        >
          {homeScore}
        </span>
        <span className="text-slate-stone text-sm">:</span>
        <span
          ref={awayScoreRef}
          className="text-lg font-bold text-slate-ink dark:text-dark-text w-6 text-center"
        >
          {awayScore}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="text-sm font-medium text-slate-ink dark:text-dark-text truncate">
          {awayTeamName}
        </span>
        <TeamBadge team={awayTeam} />
      </div>
    </div>
  );
}

interface TeamBadgeProps {
  team: TeamInfo;
}

function TeamBadge({ team }: TeamBadgeProps) {
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: team.color }}
    >
      {team.logo ? (
        <img
          src={team.logo}
          alt={team.name}
          className="w-full h-full rounded-lg object-cover"
        />
      ) : (
        team.shortName
      )}
    </div>
  );
}

interface MatchStatusRowProps {
  match: Match;
  goals: Goal[];
}

function MatchStatusRow({ match, goals }: MatchStatusRowProps) {
  return (
    <div className="mt-2">
      <MatchStatusBadge match={match} />
      {goals.length > 0 && <GoalFeed goals={goals} />}
    </div>
  );
}

function MatchStatusBadge({ match }: { match: Match }) {
  return (
    <div className="flex items-center gap-2">
      {match.status === "live" && <LiveBadge />}
      {match.status === "finished" && (
        <span className="text-xs text-slate-stone">Beendet</span>
      )}
      {match.status === "scheduled" && (
        <span className="text-xs text-slate-stone">{match.time}</span>
      )}
      {match.pitch && (
        <span className="text-xs text-slate-stone ml-auto">
          Platz {match.pitch}
        </span>
      )}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      LIVE
    </span>
  );
}

interface GoalFeedProps {
  goals: Goal[];
}

function GoalFeed({ goals }: GoalFeedProps) {
  return (
    <div className="mt-2 space-y-1">
      {goals.map((goal) => (
        <GoalEntry key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

interface GoalEntryProps {
  goal: Goal;
}

function GoalEntry({ goal }: GoalEntryProps) {
  return (
    <div className="text-xs text-slate-stone dark:text-dark-text-secondary flex items-center gap-1">
      <span aria-hidden="true">⚽</span>
      <span>
        {goal.minute && (
          <span className="font-medium">{goal.minute}&apos;</span>
        )}{" "}
        {goal.team}
        {goal.player && (
          <>
            {" "}
            (<span className="italic">{goal.player}</span>)
          </>
        )}
      </span>
    </div>
  );
}
