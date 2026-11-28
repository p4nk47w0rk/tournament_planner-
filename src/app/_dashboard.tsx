"use client";

import { useTranslations } from "next-intl";
import { useTournament } from "@/lib/tournament-context";
import { useAuth } from "@/lib/supabase/hooks";
import Link from "next/link";
import TournamentCard from "@/components/Tournament/TournamentCard";
import TrophyIcon from "./TrophyIcon";
import PlusIcon from "./PlusIcon";
import BoltIcon from "./BoltIcon";
import QuickLinks from "./QuickLinks";
import FeaturePreview from "./FeaturePreview";
import { extractDisplayName } from "./utils";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  tournaments: TrophyIcon,
  create: PlusIcon,
  goToTournament: BoltIcon,
};

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const { tournaments } = useTournament();
  const { user } = useAuth();
  const displayName = extractDisplayName(user);
  const upcomingTournaments = tournaments.filter(
    (t) => t.status === "upcoming" || t.status === "live"
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WelcomeHeader
        title={t("title")}
        displayName={displayName}
        subtitle={t("subtitle")}
      />
      {upcomingTournaments.length > 0 && (
        <UpcomingSection tournaments={upcomingTournaments} t={t} />
      )}
      <QuickLinks
        links={buildQuickLinks(t, upcomingTournaments)}
        iconMap={iconMap}
      />
      <FeaturePreview t={t} />
    </div>
  );
}

function WelcomeHeader({
  title,
  displayName,
  subtitle,
}: {
  title: string;
  displayName: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-2">
        {title} {displayName}!
      </h1>
      <p className="text-slate-stone dark:text-dark-text-secondary">
        {subtitle}
      </p>
    </div>
  );
}

function UpcomingSection({
  tournaments,
  t,
}: {
  tournaments: ReturnType<typeof useTournament>["tournaments"];
  t: (k: string) => string;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        {t("upcoming.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
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
  );
}

function buildQuickLinks(
  t: (k: string) => string,
  upcomingTournaments: ReturnType<typeof useTournament>["tournaments"]
) {
  const links: Array<{
    href: string;
    label: string;
    icon: string;
    description: string;
  }> = [
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
  ];
  if (upcomingTournaments.length === 1) {
    links.push({
      href: `/turnier/${upcomingTournaments[0].slug}`,
      label: t("links.goToTournament"),
      icon: "goToTournament",
      description: upcomingTournaments[0].name,
    });
  }
  return links;
}
