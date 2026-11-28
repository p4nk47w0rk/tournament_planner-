"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTournament } from "@/lib/tournament-context";
import { INITIAL_MATCHES } from "@/lib/tournament-data";
import { Suspense } from "react";
import GuestShareDialog from "@/components/Guest/GuestShareDialog";
import DateIcon from "./DateIcon";
import LocationIcon from "./LocationIcon";
import NextMatchesSection from "./NextMatchesSection";
import GroupPreview from "./GroupPreview";
import TournamentTitle from "./TournamentTitle";
import TournamentStats from "./TournamentStats";
import QuickNav from "./QuickNav";
import PreviewSections from "./PreviewSections";
import GuestLinkSection from "./GuestLinkSection";

export default function TournamentLanding() {
  const t = useTranslations("turnier.detail");
  const params = useParams();
  const slug = params?.slug as string;
  const { tournaments } = useTournament();
  const tournament = tournaments.find((t) => t.slug === slug);

  if (!tournament) return <NotFoundView t={t} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TournamentTitle tournament={tournament} t={t} />
      <TournamentStats tournament={tournament} t={t} />
      <QuickNav slug={tournament.slug} t={t} />
      <GuestLinkSection slug={tournament.slug} name={tournament.name} />
      <PreviewSections slug={tournament.slug} />
    </div>
  );
}

function NotFoundView({ t }: { t: (k: string) => string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-ink mb-4">
        {t("notFoundTitle")}
      </h1>
      <Link href="/turniere" className="text-sage hover:underline">
        ← {t("backToTournaments")}
      </Link>
    </div>
  );
}
