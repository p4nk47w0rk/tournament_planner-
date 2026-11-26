"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTournament } from "@/lib/tournament-context";
import TournamentTabs from "@/components/Tournament/TournamentTabs";
import { Suspense } from "react";

interface SubNav {
  href: string;
  label: string;
}

const SUB_NAVS: SubNav[] = [
  { href: "", label: "Übersicht" },
  { href: "spielplan", label: "Spielplan" },
  { href: "gruppen", label: "Gruppen" },
  { href: "teams", label: "Mannschaften" },
  { href: "infos", label: "Infos" },
];

export default function TournamentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params?.slug as string;
  const { tournaments } = useTournament();

  const tournament = tournaments.find((t) => t.slug === slug);

  const t = useTranslations("turniere");

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-ink mb-4">
          Turnier nicht gefunden
        </h1>
        <Link href="/turniere" className="text-sage hover:underline">
          ← Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Tournament Header Bar */}
      <div className="bg-paper dark:bg-paper border-b border-slate-hairline dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row: Back + Tournament name + Switcher */}
          <div className="flex items-center justify-between py-4">
            <Link
              href="/turniere"
              className="text-sm text-slate-stone hover:text-sage inline-flex items-center gap-1"
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
              {t("backToOverview")}
            </Link>

            <div className="flex items-center gap-4">
              <h1 className="text-sm font-semibold text-slate-ink dark:text-dark-text truncate max-w-[180px] sm:max-w-xs">
                {tournament.name}
              </h1>
              <TournamentSwitcher currentSlug={slug} />
            </div>
          </div>

          {/* Sub navigation tabs */}
          <Suspense fallback={null}>
            <TournamentTabs
              slug={slug}
              subNavs={SUB_NAVS}
              tournament={tournament}
            />
          </Suspense>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

function TournamentSwitcher({ currentSlug }: { currentSlug: string }) {
  const { tournaments } = useTournament();

  if (tournaments.length <= 1) return null;

  return (
    <div className="relative group">
      <select
        value={currentSlug}
        onChange={(e) => {
          window.location.href = `/turnier/${e.target.value}`;
        }}
        className="appearance-none bg-transparent text-right text-sm font-medium text-slate-ink dark:text-dark-text
                   hover:text-sage dark:hover:text-dark-primary transition-colors
                   pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sage rounded-lg px-2 py-1"
        aria-label="Turnier wechseln"
      >
        {tournaments.map((t) => (
          <option
            key={t.id}
            value={t.slug}
            className="text-slate-ink dark:text-dark-text"
          >
            {t.name}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 text-slate-stone absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
