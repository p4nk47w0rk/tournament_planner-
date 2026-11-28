"use client";

import { useParams, useRouter } from "next/navigation";
import { useTransition, useCallback, useMemo, ViewTransition } from "react";
import { TEAMS, INITIAL_MATCHES, PLAYOFF_MATCHES } from "@/lib/tournament-data";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { MatchRow } from "@/components/Teams/MatchRow";
import {
  extractColors,
  StatItem,
  TeamAddress,
  TeamWebsite,
  TeamAbout,
  TeamMatchesList,
  toSlug,
} from "./TeamSections";

interface TeamData {
  name: string;
  group: "A" | "B";
  shortName: string;
  color: string;
  logo?: string;
  founded?: string;
  stadium?: string;
  address?: string;
  website?: string;
  league?: string;
  about?: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const t = useTranslations("teams");

  const teamSlug = (params.team as string) || "";
  const team = TEAMS.find((team) => toSlug(team.name) === teamSlug) as
    TeamData | undefined;

  const handleBack = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router, startTransition]);

  const teamMatches = useMemo(() => {
    if (!team) return [];
    const allMatches = [...INITIAL_MATCHES, ...PLAYOFF_MATCHES];
    return allMatches.filter(
      (m) => m.homeTeam === team.name || m.awayTeam === team.name
    );
  }, [team]);

  if (!team) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-ink dark:text-dark-text mb-4">
          Team nicht gefunden
        </h2>
        <Link
          href="/turnier/bambini-cup-2026/teams"
          className="text-sage hover:underline"
        >
          ← {t("backToTeams")}
        </Link>
      </div>
    );
  }

  const teamNameSlug = toSlug(team.name);

  return (
    <ViewTransition
      enter={{
        "nav-forward-team": "nav-forward-team",
        default: "none",
      }}
      exit={{
        "nav-forward-team": "nav-forward-team",
        default: "none",
      }}
      default="none"
    >
      <div className="max-w-3xl mx-auto">
        <BackButton onClick={handleBack} label={t("backToTeams")} />
        <TeamHero team={team} teamNameSlug={teamNameSlug} />
        <TeamStats team={team} />
        {team.address && (
          <TeamAddress address={team.address} label={t("address")} />
        )}
        {team.website && (
          <TeamWebsite website={team.website} color={team.color} />
        )}
        {team.about && <TeamAbout about={team.about} label={t("about")} />}
        <TeamMatchesList team={team} teamMatches={teamMatches} />
      </div>
    </ViewTransition>
  );
}

function BackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <div className="mb-6">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 text-sm text-slate-stone hover:text-sage dark:hover:text-dark-text transition-colors
                   focus:outline-none focus:ring-2 focus:ring-sage rounded-lg px-3 py-2"
        aria-label="Zurück zu den Mannschaften"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {label}
      </button>
    </div>
  );
}

function TeamHero({
  team,
  teamNameSlug,
}: {
  team: TeamData;
  teamNameSlug: string;
}) {
  const t = useTranslations("teams");
  return (
    <ViewTransition name={`team-card-${teamNameSlug}`}>
      <div
        className={`
          relative rounded-2xl overflow-hidden
          bg-gradient-to-br ${team.color}
          h-56 sm:h-64 flex flex-col items-center justify-center
          shadow-xl
        `}
        style={{ margin: 0 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
            <circle cx="80" cy="20" r="40" />
            <circle cx="100" cy="0" r="30" />
            <circle cx="60" cy="0" r="20" />
          </svg>
        </div>
        <div className="relative z-10 mb-4">
          {team.logo ? (
            <div className="w-24 h-24 flex items-center justify-center bg-white/90 dark:bg-white/80 rounded-xl p-3 shadow-lg backdrop-blur-sm">
              <img
                src={team.logo}
                alt={`${team.name} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-white/90 dark:bg-white/80 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <span className="text-xl font-bold text-slate-ink font-mono">
                {team.shortName}
              </span>
            </div>
          )}
        </div>
        <h1 className="relative z-10 text-white text-2xl sm:text-3xl font-bold text-center px-4 drop-shadow-md">
          {team.name}
        </h1>
        <div className="relative z-10 mt-2">
          <span className="inline-block bg-black/20 backdrop-blur-sm text-white/90 text-xs font-mono font-bold px-3 py-1 rounded-full">
            {t("group")} {team.group}
          </span>
        </div>
      </div>
    </ViewTransition>
  );
}

function TeamStats({ team }: { team: TeamData }) {
  const t = useTranslations("teams");
  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden">
      <div
        className="h-1.5 bg-gradient-to-r w-full bg-transparent"
        style={{
          background: `linear-gradient(to right, ${extractColors(team.color)})`,
        }}
      />
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {team.founded && team.founded !== "—" && (
            <StatItem
              label={t("founded")}
              value={team.founded}
              gradient={team.color}
            />
          )}
          {team.league && <StatItem label={t("league")} value={team.league} />}
          {team.stadium && (
            <StatItem label={t("stadium")} value={team.stadium} />
          )}
          <StatItem
            label={t("pitch")}
            value={team.group}
            gradient={team.color}
          />
        </div>
      </div>
    </div>
  );
}
