"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/lib/supabase/hooks";
import ImprintEditor from "@/components/Admin/ImprintEditor";
import PrivacyEditor from "@/components/Admin/PrivacyEditor";
import {
  DEFAULT_IMPRINT,
  type ImprintSettings,
  type PrivacySection,
} from "./types";
import { useSettings } from "./useSettings";

/* ============================================
 * Admin-Einstellungen Seite
 * ============================================ */

export default function AdminSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const locale = useLocale();

  const { tab, setTab, imprint, privacy } = useSettings(locale);

  if (isLoading) return <LoadingState />;
  if (!isAuthenticated) return <AuthRequired />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-ink text-slate-ink">
          Seiteneinstellungen
        </h1>
        <p className="text-sm text-slate-stone mt-2">
          Bearbeite Impressum und Datenschutzerklärung
        </p>
      </div>
      <TabBar tab={tab} onChange={setTab} />
      {imprint && (
        <ImprintEditor
          settings={imprint}
          onChange={() => {}}
          onSave={() => handleSaveImprint(imprint, locale)}
          saved={false}
        />
      )}
      {privacy && (
        <PrivacyEditor
          sections={privacy}
          onChange={() => {}}
          onSave={() => handleSavePrivacy(privacy, locale)}
          saved={false}
        />
      )}
    </div>
  );
}

async function handleSaveImprint(imprint: ImprintSettings, locale: string) {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "imprint", locale, value: imprint }),
  });
  if (res.ok) {
    // TODO: show success feedback
  }
}

async function handleSavePrivacy(privacy: PrivacySection[], locale: string) {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: "privacy",
      locale,
      value: { sections: privacy },
    }),
  });
  if (res.ok) {
    // TODO: show success feedback
  }
}

/* ============================================
 * Sub-Components
 * ============================================ */

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center text-slate-stone animate-pulse">
      Laden...
    </div>
  );
}

function TabBar({
  tab,
  onChange,
}: {
  tab: "imprint" | "privacy";
  onChange: (t: "imprint" | "privacy") => void;
}) {
  return (
    <div className="flex gap-2 mb-8 border-b border-slate-hairline dark:border-slate-hairline">
      <TabButton active={tab === "imprint"} onClick={() => onChange("imprint")}>
        Impressum
      </TabButton>
      <TabButton active={tab === "privacy"} onClick={() => onChange("privacy")}>
        Datenschutz
      </TabButton>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? "border-sage text-sage"
          : "border-transparent text-slate-stone hover:text-slate-ink"
      }`}
    >
      {children}
    </button>
  );
}

function AuthRequired() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <div className="bg-paper dark:bg-paper border border-slate-hairline rounded-2xl p-12">
        <p className="text-slate-ink text-lg font-medium mb-4">
          Nur für Admins
        </p>
        <p className="text-sm text-slate-stone">
          Bitte melde dich an, um die Einstellungen zu bearbeiten.
        </p>
      </div>
    </div>
  );
}
