"use client";

import { useTranslations } from "next-intl";
import InfoPageContent from "@/components/Infos/InfoPage";

export default function InfosPage() {
  const t = useTranslations("info");

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-ink dark:text-dark-text mb-8">
        {t("title")}
      </h1>
      <InfoPageContent />
    </div>
  );
}
