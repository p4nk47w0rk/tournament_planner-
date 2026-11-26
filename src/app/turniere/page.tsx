"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTournament } from "@/lib/tournament-context";
import { useAuth } from "@/lib/supabase/hooks";
import TournamentCard from "@/components/Tournament/TournamentCard";
import { useEffect } from "react";

export default function TurnierePage() {
  const t = useTranslations("turniere");
  const { tournaments } = useTournament();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-stone dark:text-dark-text-secondary">
          {t("title")}...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-2">
          {t("title")}
        </h1>
        <p className="text-slate-stone dark:text-dark-text-secondary">
          {t("subtitle")}
        </p>
      </div>

      {/* Tournament Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.id}
            href={`/turnier/${tournament.slug}`}
            className="block"
          >
            <TournamentCard tournament={tournament} />
          </Link>
        ))}

        {/* Create new tournament card */}
        <Link
          href="/neues-turnier"
          className="swatch-card bg-paper dark:bg-paper border-2 border-dashed border-slate-hairline dark:border-dark-border rounded-2xl p-6
                     flex flex-col items-center justify-center gap-3 text-center
                     hover:border-sage dark:hover:border-dark-primary hover:bg-sage-mist/30 dark:hover:bg-muted cursor-pointer
                     transition-all duration-200 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-sage/10 dark:bg-sage/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <svg
              className="w-8 h-8 text-sage dark:text-dark-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-slate-ink dark:text-dark-text text-sm">
              {t("createNew")}
            </p>
            <p className="text-xs text-slate-stone dark:text-dark-text-secondary mt-1">
              {t("createNewDesc")}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
