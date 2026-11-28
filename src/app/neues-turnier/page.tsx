"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/hooks";
import { useEffect } from "react";

export default function NewTournamentPage() {
  const t = useTranslations("newTournament");
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || !isAuthenticated) {
    return <LoadingView />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center">
        <HeaderIcon />
        <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-slate-stone dark:text-dark-text-secondary mb-10 max-w-lg mx-auto">
          {t("description")}
        </p>

        <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-dark-border rounded-2xl p-6 mb-10 text-left">
          <h2 className="font-bold text-slate-ink dark:text-dark-text mb-4">
            {t("features")}
          </h2>
          <ul className="space-y-3">
            {[
              t("featureSchedule"),
              t("featureStandings"),
              t("featureLive"),
              t("featureTeams"),
            ].map((feature, i) => (
              <FeatureItem key={i} text={feature} />
            ))}
          </ul>
        </div>

        <BackLink t={t} />
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-slate-stone dark:text-dark-text-secondary">Laden...</p>
    </div>
  );
}

function HeaderIcon() {
  return (
    <div className="w-20 h-20 rounded-3xl bg-sage/10 dark:bg-sage/20 flex items-center justify-center mx-auto mb-8">
      <svg
        className="w-10 h-10 text-sage dark:text-dark-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-slate-stone dark:text-dark-text-secondary">
      <svg
        className="w-5 h-5 text-sage shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}

function BackLink({ t }: { t: (k: string) => string }) {
  return (
    <Link
      href="/turniere"
      className="btn-primary inline-flex items-center gap-2"
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
      {t("backToTournaments")}
    </Link>
  );
}
