import { TEAMS } from "@/lib/tournament-data";
import { useTranslations } from "next-intl";

export default function GroupPreview() {
  const t = useTranslations("home");
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-ink dark:text-dark-text mb-4">
        {t("stats.groups")}
      </h2>
      <div className="space-y-4">
        {(["A", "B"] as const).map((group) => (
          <GroupCard key={group} group={group} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: "A" | "B" }) {
  const groupTeams = TEAMS.filter((t) => t.group === group);
  return (
    <div className="bg-paper dark:bg-paper border border-slate-hairline dark:border-slate-hairline rounded-xl p-4">
      <h3 className="text-sm font-bold text-slate-ink dark:text-dark-text mb-2">
        Gruppe {group}
      </h3>
      <div className="space-y-2">
        {groupTeams.map((team) => (
          <TeamRow key={team.name} team={team} />
        ))}
      </div>
    </div>
  );
}

function TeamRow({
  team,
}: {
  team: { name: string; logo?: string; color: string; shortName: string };
}) {
  return (
    <div className="flex items-center gap-3">
      {team.logo ? (
        <img
          src={team.logo}
          alt={`${team.name} Logo`}
          className="w-8 h-8 rounded-lg object-cover shrink-0"
          onError={(e) => {
            const fallback = e.target as HTMLImageElement;
            fallback.style.display = "none";
            const placeholder = fallback.nextElementSibling as HTMLDivElement;
            if (placeholder) placeholder.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${team.color} text-white text-xs shrink-0 flex items-center justify-center ${team.logo ? "hidden" : ""}`}
      >
        {team.shortName}
      </div>
      <span className="text-sm text-slate-stone dark:text-dark-text-secondary">
        {team.name}
      </span>
    </div>
  );
}
