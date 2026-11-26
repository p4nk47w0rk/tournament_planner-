"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTournament } from "@/lib/tournament-context";
import { useAuth } from "@/lib/supabase/hooks";
import TournamentCard from "@/components/Tournament/TournamentCard";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const { tournaments } = useTournament();
  const { user } = useAuth();

  const upcomingTournaments = tournaments.filter(
    (t) => t.status === "upcoming" || t.status === "live"
  );

  const displayName = user ? extractDisplayName(user) : "Coach";

  const quickLinks = [
    {
      href: "/turniere",
      label: t("links.tournaments"),
      icon: "🏆",
      description: t("links.tournamentsDesc"),
    },
    {
      href: "/neues-turnier",
      label: t("links.create"),
      icon: "➕",
      description: t("links.createDesc"),
    },
    ...(upcomingTournaments.length === 1
      ? [
          {
            href: `/turnier/${upcomingTournaments[0].slug}`,
            label: t("links.goToTournament"),
            icon: "⚡",
            description: upcomingTournaments[0].name,
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-2">
          {t("title")} {displayName}!
        </h1>
        <p className="text-slate-stone dark:text-dark-text-secondary">
          {t("subtitle")}
        </p>
      </div>

      {/* Upcoming Tournaments */}
      {upcomingTournaments.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
            {t("upcoming.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/turnier/${tournament.slug}`}
                className="block"
              >
                <TournamentCard tournament={tournament} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
          {t("links.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6
                         flex items-center gap-4 group cursor-pointer hover:border-sage dark:hover:border-dark-primary
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
            >
              <span className="text-3xl" aria-hidden="true">
                {link.icon}
              </span>
              <div className="text-left">
                <h3 className="font-bold text-slate-ink group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-slate-stone">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Preview */}
      <section>
        <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
          {t("features.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: t("features.comingSoon.title1"),
              desc: t("features.comingSoon.desc1"),
            },
            {
              title: t("features.comingSoon.title2"),
              desc: t("features.comingSoon.desc2"),
            },
            {
              title: t("features.comingSoon.title3"),
              desc: t("features.comingSoon.desc3"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6"
            >
              <h3 className="font-bold text-sm text-slate-ink dark:text-dark-text mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-stone">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function extractDisplayName(user: { email?: string | null }): string {
  if (!user?.email) return "Coach";
  const beforeAt = user.email.split("@")[0];
  // Capitalize first letter, lowercase rest
  return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1).toLowerCase();
}
