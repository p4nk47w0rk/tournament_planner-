"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import MatchCard from "@/components/Spielplan/MatchCard";
import PlayoffBracket from "@/components/Spielplan/PlayoffBracket";
import { useEditMode } from "@/lib/edit-mode-context";
import TabBar from "./TabBar";
import TeamFilter from "./TeamFilter";
import MatchList from "./MatchList";
import { useScheduleData } from "./useScheduleData";

type Tab = "all" | "A" | "B" | "playoffs";

export default function SchedulePage() {
  const t = useTranslations("schedule");
  const { editable, toggle: toggleEditMode } = useEditMode();
  const {
    matches,
    playoffMatches,
    handleScoreChange,
    handleGoalAdd,
    allTeamNames,
  } = useScheduleData();

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [filterTeam, setFilterTeam] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header
        title={t("title")}
        editable={editable}
        onToggle={toggleEditMode}
        t={t}
      />
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
          matches={matches}
          onScoreChange={editable ? handleScoreChange : undefined}
          onGoalAdd={editable ? handleGoalAdd : undefined}
          editable={editable}
          t={t}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-dark-secondary rounded w-1/4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 dark:bg-dark-secondary rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({
  title,
  editable,
  onToggle,
  t,
}: {
  title: string;
  editable: boolean;
  onToggle: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text">
        {title}
      </h1>
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          editable
            ? "bg-green-600 text-white"
            : "bg-slate-100 dark:bg-dark-secondary text-slate-600 dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-dark-border"
        }`}
      >
        {editable ? t("editModeOn") : t("editModeOff")}
      </button>
    </div>
  );
}
