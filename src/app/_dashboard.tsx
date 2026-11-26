"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTournament } from "@/lib/tournament-context";
import { useAuth } from "@/lib/supabase/hooks";
import TournamentCard from "@/components/Tournament/TournamentCard";

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

function PlusIcon({ className }: { className?: string }) {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
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
        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
      />
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  tournaments: TrophyIcon,
  create: PlusIcon,
  goToTournament: BoltIcon,
};

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
      icon: "tournaments",
      description: t("links.tournamentsDesc"),
    },
    {
      href: "/neues-turnier",
      label: t("links.create"),
      icon: "create",
      description: t("links.createDesc"),
    },
    ...(upcomingTournaments.length === 1
      ? [
          {
            href: `/turnier/${upcomingTournaments[0].slug}`,
            label: t("links.goToTournament"),
            icon: "goToTournament",
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
          {quickLinks.map((link) => {
            const IconComponent = iconMap[link.icon];
            return (
              <Link
                key={link.href}
                href={link.href}
                className="swatch-card bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-2xl p-6
                           flex items-center gap-4 group cursor-pointer hover:border-sage dark:hover:border-dark-primary
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
              >
                <div className="w-10 h-10 rounded-lg bg-sage/10 dark:bg-dark-primary/20 flex items-center justify-center text-sage dark:text-dark-primary shrink-0">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-ink group-hover:text-sage dark:group-hover:text-dark-primary transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-slate-stone">{link.description}</p>
                </div>
              </Link>
            );
          })}
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
