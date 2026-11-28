"use client";

import { useTranslations } from "next-intl";
import MatchCard from "@/components/Spielplan/MatchCard";
import PlayoffBracket from "@/components/Spielplan/PlayoffBracket";
import TabBar from "./TabBar";
import TeamFilter from "./TeamFilter";
import MatchList from "./MatchList";
import { useScheduleData } from "./useScheduleData";

type Tab = "all" | "A" | "B" | "playoffs";

export default function SchedulePage() {
  const t = useTranslations("schedule");
  const {
    matches,
    playoffMatches,
    editable,
    toggleEditMode,
    handleScoreChange,
    handleGoalAdd,
  } = useScheduleData();

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [filterTeam, setFilterTeam] = useState<"all" | string>("all");

  const filteredMatches = useMemo(() => {
    let f = [...matches];
    if (activeTab === "A") f = f.filter((m) => m.group === "A");
    else if (activeTab === "B") f = f.filter((m) => m.group === "B");
    if (filterTeam !== "all")
      f = f.filter(
        (m) => m.homeTeam === filterTeam || m.awayTeam === filterTeam
      );
    return f.sort((a, b) => a.time.localeCompare(b.time));
  }, [matches, activeTab, filterTeam]);

  const allTeamNames = useMemo(() => {
    const names = new Set<string>();
    matches.forEach((m) => {
      names.add(m.homeTeam);
      names.add(m.awayTeam);
    });
    return [...names].sort();
  }, [matches]);

  return (
    <div>
      <PageTitle t={t} editable={editable} onToggle={toggleEditMode} />
      <TabBar
        tabs={["all", "A", "B", "playoffs"] as Tab[]}
        active={activeTab}
        onChange={setActiveTab}
        t={t}
      />
      <TeamFilter
        teams={allTeamNames}
        selected={filterTeam}
        onChange={setFilterTeam}
        t={t}
      />
      {activeTab === "playoffs" ? (
        <PlayoffBracket
          matches={playoffMatches}
          editable={editable}
          onScoreChange={handleScoreChange}
          onGoalAdd={handleGoalAdd}
        />
      ) : (
        <MatchList
          matches={filteredMatches}
          editable={editable}
          onScoreChange={editable ? handleScoreChange : undefined}
          onGoalAdd={editable ? handleGoalAdd : undefined}
          t={t}
        />
      )}
    </div>
  );
}

import { useState, useMemo } from "react";

function PageTitle({
  t,
  editable,
  onToggle,
}: {
  t: (k: string) => string;
  editable: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text">
        {t("title")}
      </h1>
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${editable ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-dark-border"}`}
      >
        {editable ? "✏️ Edit-Mode" : "👁 View-Mode"}
      </button>
    </div>
  );
}
