"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTournament } from "@/lib/tournament-context";
import MatchCard from "@/components/Spielplan/MatchCard";
import { INITIAL_MATCHES, TEAMS } from "@/lib/tournament-data";
import { Suspense, useState } from "react";
import GuestShareDialog from "@/components/Guest/GuestShareDialog";

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 15.375V12m0 0V8.625c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125V12m0 0v3.375m0 0h3.375M11.25 12h-6.75m6.75 3.375V15.75"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  schedule: ClipboardIcon,
  standings: TrophyIcon,
  teams: UsersIcon,
};

function DateIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 19.875m-18 0v-7.5A2.25 2.25 0 0 1 5.25 10.5h13.5A2.25 2.25 0 0 1 21 12.375v7.5"
      />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}

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
          <span className="flex items-center gap-1.5">
            <DateIcon className="w-4 h-4" />
            {tournament.date}
          </span>
          <span className="flex items-center gap-1.5">
            <LocationIcon className="w-4 h-4" />
            {tournament.location}
          </span>
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
          icon="schedule"
        />
        <QuickLink
          href={`/turnier/${tournament.slug}/gruppen`}
          label={t("quickLinks.standings")}
          icon="standings"
        />
        <QuickLink
          href={`/turnier/${tournament.slug}/teams`}
          label={t("quickLinks.teams")}
          icon="teams"
        />
      </div>

      {/* Guest Link & QR */}
      <GuestLinkSection slug={tournament.slug} name={tournament.name} />

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
  const IconComponent = iconMap[icon];
  return (
    <Link
      href={href}
      className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-5
                 flex items-center gap-3 text-left
                 hover:border-sage dark:hover:border-dark-primary
                 transition-all duration-200 group cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-sage/10 dark:bg-dark-primary/20 flex items-center justify-center text-sage dark:text-dark-primary">
        {IconComponent && <IconComponent className="w-4 h-4" />}
      </div>
      <span className="font-medium text-slate-ink dark:text-dark-text group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
        {label}
      </span>
    </Link>
  );
}

// ============================================
// Guest Link Section (T05)
// ============================================

function GuestLinkSection({ slug, name }: { slug: string; name: string }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="mb-10">
        <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-sage"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" rx="0.5" />
              <path d="M21 14h-4v4" strokeLinecap="round" />
              <path d="M18 21v-4h4" strokeLinecap="round" />
            </svg>
            <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text">
              Gast-Link &amp; QR-Code
            </h2>
          </div>
          <p className="text-sm text-slate-stone dark:text-dark-text-secondary mb-4">
            Erstelle einen QR-Code und einen öffentlichen Link, mit dem Gäste
            den Spielplan, Live-Ergebnisse und Tabellenstände in Echtzeit sehen
            können.
          </p>
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="px-4 py-2 rounded-xl bg-sage text-white font-medium text-sm
                       hover:bg-sage/90 active:bg-sage/80
                       dark:bg-dark-primary dark:hover:bg-dark-primary/90 dark:active:bg-dark-primary/80
                       transition-colors duration-200"
          >
            Gast-Link &amp; QR-Code erstellen
          </button>
        </div>
      </div>

      {showDialog && <GuestShareDialog slug={slug} tournamentName={name} />}
    </>
  );
}
