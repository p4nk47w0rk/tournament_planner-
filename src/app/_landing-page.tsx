"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { isLocalDevAuth } from "@/lib/supabase/client";

export default function LandingPage() {
  const t = useTranslations("landing");
  const isLocalDev = isLocalDevAuth();

  const features = [
    {
      icon: "🏆",
      title: t("features.tournaments.title"),
      description: t("features.tournaments.description"),
      link: "/turniere",
    },
    {
      icon: "📋",
      title: t("features.schedule.title"),
      description: t("features.schedule.description"),
      link: "/spielplan",
    },
    {
      icon: "📊",
      title: t("features.standings.title"),
      description: t("features.standings.description"),
      link: "/gruppen",
    },
    {
      icon: "👥",
      title: t("features.teams.title"),
      description: t("features.teams.description"),
      link: "/teams",
    },
  ];

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
          {features.map((feature) => (
            <Link
              key={feature.link}
              href={feature.link}
              className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-8
                         group cursor-pointer hover:border-sage dark:hover:border-dark-primary
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
            >
              <div className="flex items-start gap-5">
                <span className="text-4xl flex-shrink-0" aria-hidden="true">
                  {feature.icon}
                </span>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-slate-ink dark:text-dark-text mb-2 group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-stone dark:text-dark-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
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
            🔑 Als Admin anmelden (Local Dev)
          </Link>
        </div>
      )}
    </div>
  );
}
