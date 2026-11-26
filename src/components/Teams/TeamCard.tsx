"use client";

import { useTranslations } from "next-intl";
import { type Team } from "@/lib/types";
import Link from "next/link";
import { ViewTransition } from "react";

export function TeamCard({ team }: { team: Team }) {
  const t = useTranslations("teams");
  const teamSlug = toSlug(team.name);
  const leagueShort = team.league?.split(" ").slice(0, 2).join(" ") || "";

  return (
    <Link
      href={`/turnier/bambini-cup-2026/teams/${teamSlug}`}
      transitionTypes={["nav-forward-team"]}
      className="block group"
      aria-label={`${team.name} — Mannschaften-Details`}
    >
      <TeamCardInner
        team={team}
        teamSlug={teamSlug}
        t={t}
        leagueShort={leagueShort}
      />
    </Link>
  );
}

function TeamCardInner({
  team,
  teamSlug,
  t,
  leagueShort,
}: {
  team: Team;
  teamSlug: string;
  t: ReturnType<typeof useTranslations>;
  leagueShort: string;
}) {
  return (
    <ViewTransition name={`team-card-${teamSlug}`}>
      <CardContent team={team} t={t} leagueShort={leagueShort} />
    </ViewTransition>
  );
}

function CardContent({
  team,
  t,
  leagueShort,
}: {
  team: Team;
  t: ReturnType<typeof useTranslations>;
  leagueShort: string;
}) {
  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden
        bg-gradient-to-br ${team.color}
        h-64 flex flex-col
        border border-transparent hover:border-white/30
        dark:border-transparent dark:hover:border-white/20
        focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg
        transition-all duration-200
      `}
    >
      {/* Top badge: Group */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="inline-block bg-black/25 backdrop-blur-sm text-white/90 text-xs font-mono font-bold px-2 py-0.5 rounded-md">
          {t("group")} {team.group}
        </span>
      </div>

      {/* Decorative corner pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
          <circle cx="80" cy="20" r="40" />
          <circle cx="100" cy="0" r="30" />
          <circle cx="60" cy="0" r="20" />
        </svg>
      </div>

      {/* Main content: vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-2">
        {/* Logo / Initials */}
        <div className="mb-2.5">
          {team.logo ? <TeamLogo team={team} /> : <TeamInitials team={team} />}
        </div>

        {/* Team Name */}
        <h3 className="relative z-10 text-white text-base font-bold text-center drop-shadow-md group-hover:text-white/95 transition-colors leading-tight">
          {team.name}
        </h3>

        {/* League (short) */}
        {leagueShort && (
          <p className="mt-1 text-white/70 text-xs text-center font-medium truncate max-w-full px-1">
            {leagueShort}
          </p>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 flex items-center justify-between">
        {team.website ? <WebsiteLink website={team.website} /> : <span />}
        <ArrowIcon />
      </div>
    </div>
  );
}

function TeamLogo({ team }: { team: Team }) {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white/90 dark:bg-white/80 rounded-xl p-2 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
      <img
        src={team.logo}
        alt={`${team.name} Logo`}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

function TeamInitials({ team }: { team: Team }) {
  return (
    <div className="w-16 h-16 bg-white/90 dark:bg-white/80 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
      <span className="text-base font-bold text-slate-ink font-mono">
        {team.shortName}
      </span>
    </div>
  );
}

function WebsiteLink({ website }: { website: string }) {
  return (
    <span className="text-white/80 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
      <IconWeb />
      <span className="truncate max-w-[120px]">
        {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </span>
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 text-white/60 group-hover:text-white/90 group-hover:translate-x-1 transition-all shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function IconWeb() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
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
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}
