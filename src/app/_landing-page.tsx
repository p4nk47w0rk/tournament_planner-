"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { isLocalDevAuth } from "@/lib/supabase/client";

// SVG icon components to avoid emoji rendering issues
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

function ChartBarIcon({ className }: { className?: string }) {
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
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
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
  tournaments: TrophyIcon,
  schedule: ClipboardIcon,
  standings: ChartBarIcon,
  teams: UsersIcon,
};

export default function LandingPage() {
  const t = useTranslations("landing");
  const isLocalDev = isLocalDevAuth();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const features = [
    {
      id: "tournaments",
      title: t("features.tournaments.title"),
      description: t("features.tournaments.description"),
      link: "/turniere",
    },
    {
      id: "schedule",
      title: t("features.schedule.title"),
      description: t("features.schedule.description"),
      link: "/spielplan",
    },
    {
      id: "standings",
      title: t("features.standings.title"),
      description: t("features.standings.description"),
      link: "/gruppen",
    },
    {
      id: "teams",
      title: t("features.teams.title"),
      description: t("features.teams.description"),
      link: "/teams",
    },
  ];

  const handleCardClick = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Architectural grid background */}
        <div className="architectural-grid-bg absolute inset-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            {/* Brand icon */}
            <div className="w-16 h-16 rounded-2xl bg-sage/10 dark:bg-sage/20 flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-9 h-9 text-sage dark:text-dark-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-ink dark:text-dark-text mb-4">
              {t("hero.title")}
            </h1>

            <p className="text-xl sm:text-2xl text-slate-stone dark:text-dark-text-secondary font-light max-w-2xl mx-auto mb-8">
              {t("hero.tagline")}
            </p>

            <Link
              href="/neues-turnier"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-sage dark:bg-dark-primary text-white text-lg font-semibold
                         hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-200
                         shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
            >
              {t("hero.cta")}
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-ink dark:text-dark-text text-center mb-4">
          {t("features.title")}
        </h2>
        <p className="text-slate-stone dark:text-dark-text-secondary text-center max-w-xl mx-auto mb-12">
          {t("features.subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.id];
            return (
              <div
                key={feature.id}
                onClick={() => handleCardClick(feature.id)}
                className={`swatch-card bg-paper dark:bg-paper border rounded-2xl p-8
                           transition-all duration-300
                           ${
                             expandedCard === feature.id
                               ? "border-sage dark:border-dark-primary shadow-lg"
                               : "border-slate-hairline dark:border-slate-hairline"
                           }
                           cursor-pointer hover:border-sage dark:hover:border-dark-primary
                           focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-sage/10 dark:bg-dark-primary/20 flex items-center justify-center flex-shrink-0 text-sage dark:text-dark-primary">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg text-slate-ink dark:text-dark-text mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-stone dark:text-dark-text-secondary leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Expanded details */}
                    {expandedCard === feature.id && (
                      <div className="mt-4 pt-4 border-t border-slate-hairline dark:border-dark-border animate-fadeIn">
                        <p className="text-sm text-slate-ink dark:text-dark-text mb-4">
                          {feature.id === "tournaments" &&
                            t("features.tournaments.details")}
                          {feature.id === "schedule" &&
                            t("features.schedule.details")}
                          {feature.id === "standings" &&
                            t("features.standings.details")}
                          {feature.id === "teams" &&
                            t("features.teams.details")}
                        </p>
                        {isLocalDev ? (
                          <Link
                            href={feature.link}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage dark:bg-dark-primary text-white text-sm font-medium
                                       hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
                          >
                            Jetzt loslegen
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-stone dark:text-dark-text-secondary">
                              Anmelden, um diese Funktion zu nutzen
                            </span>
                            <Link
                              href="/login"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage dark:bg-dark-primary text-white text-sm font-medium
                                         hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
                            >
                              Anmelden
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-sage/5 dark:bg-dark-primary/10 border border-sage/20 dark:border-dark-primary/20 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-ink dark:text-dark-text mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-slate-stone dark:text-dark-text-secondary max-w-xl mx-auto mb-8">
            {t("cta.description")}
          </p>
          <Link
            href="/neues-turnier"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-sage dark:bg-dark-primary text-white text-lg font-semibold
                       hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-200
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
          >
            {t("cta.button")}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Local Dev Login Link */}
      {isLocalDev && (
        <div className="text-center pb-8">
          <Link
            href="/?dev=login"
            className="text-xs text-slate-stone hover:text-sage dark:hover:text-dark-primary underline transition-colors"
          >
            Admin anmelden (Local Dev)
          </Link>
        </div>
      )}
    </div>
  );
}
