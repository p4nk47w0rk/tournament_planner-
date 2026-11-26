"use client";

import { useTranslations } from "next-intl";
import StandingsTable from "@/components/Gruppenstand/StandingsTable";

export default function StandingsPage() {
  const t = useTranslations("standings");

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-8">
        {t("title")}
      </h1>

      <div className="space-y-8">
        <StandingsTable group="A" />
        <StandingsTable group="B" />
      </div>

      {/* Playoff qualification info */}
      <div className="mt-12 bg-ochre-soft dark:bg-ochre/10 border border-ochre/20 dark:border-ochre/20 rounded-2xl p-6">
        <h3 className="font-bold text-ochre text-ochre mb-2 flex items-center gap-2">
          🏆 Playoff-Qualifikation
        </h3>
        <ul className="text-sm text-slate-stone dark:text-dark-text-secondary space-y-1">
          <li>• Platz 1 & 2 jeder Gruppe → direkt ins Viertelfinale</li>
          <li>• Platz 3 & 4 → Play-in Round</li>
          <li>
            • Die vier Playoff-Sieger spielen im Viertelfinale gegeneinander
          </li>
        </ul>
      </div>
    </div>
  );
}
