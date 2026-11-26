"use client";

import { useTranslations } from "next-intl";
import { TEAMS } from "@/lib/tournament-data";
import { TeamCard } from "./TeamCard";

export default function TeamGrid() {
  const t = useTranslations("teams");

  const groupA = TEAMS.filter((team) => team.group === "A");
  const groupB = TEAMS.filter((team) => team.group === "B");

  return (
    <div className="space-y-12">
      <GroupSection
        label={t("groupA")}
        pitch="A"
        color="bg-sage"
        teams={groupA}
      />
      <GroupSection
        label={t("groupB")}
        pitch="B"
        color="bg-terracotta"
        teams={groupB}
      />
    </div>
  );
}

function GroupSection({
  label,
  pitch,
  color,
  teams,
}: {
  label: string;
  pitch: string;
  color: string;
  teams: typeof TEAMS;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-ink dark:text-dark-text mb-6 flex items-center gap-2">
        <span className={`inline-block w-2 h-7 rounded-full ${color}`} />
        {label} · {pitch}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.name} team={team} />
        ))}
      </div>
    </div>
  );
}
