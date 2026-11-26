"use client";

import { useTranslations } from "next-intl";
import { ViewTransition } from "react";
import TeamGrid from "@/components/Teams/TeamGrid";

export default function TeamsPage() {
  const t = useTranslations("teams");

  return (
    <ViewTransition
      enter={{
        "nav-forward-team": "nav-back-team",
        "nav-back-team": "nav-forward-team",
        default: "none",
      }}
      exit={{
        "nav-forward-team": "nav-back-team",
        "nav-back-team": "nav-forward-team",
        default: "none",
      }}
      default="none"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-8">
          {t("title")}
        </h1>
        <TeamGrid />
      </div>
    </ViewTransition>
  );
}
