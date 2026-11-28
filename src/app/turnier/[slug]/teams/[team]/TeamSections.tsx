"use client";

import { useTranslations } from "next-intl";
import { type Match, INITIAL_MATCHES } from "@/lib/tournament-data";

export function extractColors(colorClass: string): string {
  return colorClass
    .replace(/bg-gradient-to-br from-/, "")
    .replace(/ to-[^ ]+$/, "");
}

export function StatItem({
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

export function TeamAddress({
  address,
  label,
}: {
  address: string;
  label: string;
}) {
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

export function TeamWebsite({
  website,
  color,
}: {
  website: string;
  color: string;
}) {
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

export function TeamAbout({ about, label }: { about: string; label: string }) {
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

export function TeamMatchesList({
  team,
  teamMatches,
}: {
  team: { group: string; name: string };
  teamMatches: Match[];
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

function MatchRow({ match, teamName }: { match: Match; teamName: string }) {
  const isHome = match.homeTeam === teamName;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const score = isHome
    ? `${match.homeScore ?? "—"}`
    : `${match.awayScore ?? "—"}`;
  const opponentScore = isHome
    ? `${match.awayScore ?? "—"}`
    : `${match.homeScore ?? "—"}`;
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-hairline dark:border-slate-hairline last:border-0">
      <span className="text-sm text-slate-ink dark:text-dark-text">
        {opponent}
      </span>
      <span className="text-xs font-mono text-slate-stone dark:text-dark-text-secondary">
        {match.time}
      </span>
      <span className="text-sm font-mono font-bold text-slate-ink dark:text-dark-text">
        {score}:{opponentScore}
      </span>
    </div>
  );
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}
