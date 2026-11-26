"use client";

import { useParams, useRouter } from "next/navigation";
import { useTransition, useCallback, useMemo, ViewTransition } from "react";
import { TEAMS, INITIAL_MATCHES, PLAYOFF_MATCHES } from "@/lib/tournament-data";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { MatchRow } from "@/components/Teams/MatchRow";

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

function extractColors(colorClass: string): string {
  // Convert 'from-blue-500 to-blue-700' to actual colors
  const parts = colorClass.split(" ");
  const from = parts[0].replace("from-", "");
  const to = parts[2]?.replace("to-", "");
  return `var(--${from}), var(--${to})`;
}

function StatItem({
  label,
  value,
  gradient,
}: {
  label: string;
  value: string;
  gradient?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xs text-slate-stone font-mono mb-1 uppercase tracking-wider">
        {label}
      </div>
      {gradient ? (
        <div
          className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {value}
        </div>
      ) : (
        <div className="text-sm font-bold text-slate-ink dark:text-dark-text line-clamp-1">
          {value}
        </div>
      )}
    </div>
  );
}

function TeamAddress({ address, label }: { address: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-hairline dark:border-slate-hairline p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-stone font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {label}
      </h3>
      <p className="text-slate-ink dark:text-dark-text leading-relaxed">
        {address}
      </p>
    </div>
  );
}

function TeamWebsite({ website, color }: { website: string; color: string }) {
  const display = website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="rounded-2xl border border-slate-hairline dark:border-slate-hairline p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-stone font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
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
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        Website
      </h3>
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-sm font-medium hover:underline ${`text-transparent bg-gradient-to-r ${color} bg-clip-text`}`}
      >
        {display}
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
            d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 17L21 6"
          />
        </svg>
      </a>
    </div>
  );
}

function TeamAbout({ about, label }: { about: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-hairline dark:border-slate-hairline p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-stone font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {label}
      </h3>
      <p className="text-slate-ink dark:text-dark-text leading-relaxed">
        {about}
      </p>
    </div>
  );
}

function TeamMatchesList({
  team,
  teamMatches,
}: {
  team: TeamData;
  teamMatches: typeof INITIAL_MATCHES;
}) {
  const t = useTranslations("teams");

  return (
    <div className="rounded-2xl border border-slate-hairline dark:border-slate-hairline p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-stone font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {t("group")} {team.group} · {t("matches")}
      </h3>
      <div className="space-y-2">
        {teamMatches.map((match) => (
          <MatchRow key={match.id} match={match} teamName={team.name} />
        ))}
      </div>
    </div>
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}
