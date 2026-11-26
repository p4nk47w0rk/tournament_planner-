"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTournament } from "@/lib/tournament-context";
import MatchCard from "@/components/Spielplan/MatchCard";
import { INITIAL_MATCHES, TEAMS } from "@/lib/tournament-data";
import { Suspense } from "react";

export default function TournamentLanding() {
  const t = useTranslations("turnier.detail");
  const params = useParams();
  const slug = params?.slug as string;
  const { tournaments } = useTournament();

  const tournament = tournaments.find((t) => t.slug === slug);

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-ink mb-4">
          {t("notFoundTitle")}
        </h1>
        <Link href="/turniere" className="text-sage hover:underline">
          ← {t("backToTournaments")}
        </Link>
      </div>
    );
  }

  const upcomingMatches = INITIAL_MATCHES.filter(
    (m) => m.homeScore === null && m.awayScore === null
  ).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title (no back link — layout handles that) */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-2">
          {tournament.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-stone dark:text-dark-text-secondary">
          <span>📅 {tournament.date}</span>
          <span>📍 {tournament.location}</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium">
            {t("status." + tournament.status)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard
          value={String(tournament.teamCount)}
          label={t("stats.teams")}
        />
        <StatCard
          value={String(tournament.matchCount)}
          label={t("stats.matches")}
        />
        <StatCard
          value={String(tournament.groupCount)}
          label={t("stats.groups")}
        />
        <StatCard
          value={String(tournament.groupCount * 2)}
          label={t("stats.fields")}
        />
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <QuickLink
          href={`/turnier/${tournament.slug}/spielplan`}
          label={t("quickLinks.schedule")}
          icon="📋"
        />
        <QuickLink
          href={`/turnier/${tournament.slug}/gruppen`}
          label={t("quickLinks.standings")}
          icon="🏆"
        />
        <QuickLink
          href={`/turnier/${tournament.slug}/teams`}
          label={t("quickLinks.teams")}
          icon="👥"
        />
      </div>

      {/* Preview sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<div className="text-slate-stone">Laden...</div>}>
          <NextMatchesSection />
        </Suspense>
        <GroupPreview />
      </div>
    </div>
  );
}

function NextMatchesSection() {
  const t = useTranslations("home");

  const upcomingMatches = INITIAL_MATCHES.filter(
    (m) => m.homeScore === null && m.awayScore === null
  ).slice(0, 3);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
        {t("nextMatch")}
      </h2>
      <div className="space-y-3">
        {upcomingMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

function GroupPreview() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        {useTranslations("home")("stats.groups")}
      </h2>
      <div className="space-y-4">
        {(["A", "B"] as const).map((group) => {
          const groupTeams = TEAMS.filter((t) => t.group === group);
          return (
            <div
              key={group}
              className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-xl p-4"
            >
              <h3 className="text-sm font-bold text-slate-ink dark:text-dark-text mb-2">
                Gruppe {group}
              </h3>
              <div className="space-y-2">
                {groupTeams.map((team) => (
                  <div key={team.name} className="flex items-center gap-3">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={`${team.name} Logo`}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                        onError={(e) => {
                          const fallback = e.target as HTMLImageElement;
                          fallback.style.display = "none";
                          const placeholder =
                            fallback.nextElementSibling as HTMLDivElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${team.color} text-white text-xs shrink-0 flex items-center justify-center ${team.logo ? "hidden" : ""}`}
                    >
                      {team.shortName}
                    </div>
                    <span className="text-sm text-slate-stone dark:text-dark-text-secondary">
                      {team.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-xl p-4 text-center swatch-card">
      <div className="text-2xl font-bold font-mono text-sage dark:text-dark-primary">
        {value}
      </div>
      <div className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-5
                 flex items-center gap-3 text-left
                 hover:border-sage dark:hover:border-dark-primary
                 transition-all duration-200 group cursor-pointer"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-slate-ink dark:text-dark-text group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
        {label}
      </span>
    </Link>
  );
}
