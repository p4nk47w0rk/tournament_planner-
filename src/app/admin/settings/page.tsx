"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/lib/supabase/hooks";
import ImprintEditor from "@/components/Admin/ImprintEditor";
import PrivacyEditor from "@/components/Admin/PrivacyEditor";

/* ============================================
 * Typen — müssen mit der DB-Struktur übereinstimmen
 * ============================================ */

export interface ImprintSettings {
  company: string;
  legal_form?: string;
  owner: string;
  street: string;
  postal_code: string;
  city: string;
  country?: string;
  email: string;
  phone?: string;
  vat_id?: string;
  register_court?: string;
  register_number?: string;
}

export interface PrivacySection {
  title: string;
  content: string;
}

export interface PrivacySettings {
  sections: PrivacySection[];
}

/* ============================================
 * Default-Werte
 * ============================================ */

export const DEFAULT_IMPRINT: ImprintSettings = {
  company: "Tournament Planner",
  legal_form: "e. K.",
  owner: "Max Mustermann",
  street: "Musterstraße 1",
  postal_code: "01234",
  city: "Musterstadt",
  country: "Deutschland",
  email: "kontakt@tournament-planner.app",
  phone: "+49 123 456 789",
  vat_id: "DE123456789",
  register_court: "Amtsgericht Musterstadt",
  register_number: "HRB 12345",
};

/* ============================================
 * Admin-Einstellungen Seite
 * ============================================ */

export default function AdminSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const locale = useLocale();

  const [tab, setTab] = useState<"imprint" | "privacy">(() => {
    if (typeof window !== "undefined") {
      return (window.location.hash === "#privacy" ? "privacy" : "imprint") as
        "imprint" | "privacy";
    }
    return "imprint";
  });

  const [imprint, setImprint] = useState<ImprintSettings | null>(null);
  const [imprintSaved, setImprintSaved] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacySection[] | null>(null);
  const [privacySaved, setPrivacySaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/settings?locale=${locale}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (cancelled) return;
        setImprint(json.imprint ?? DEFAULT_IMPRINT);
        setPrivacy(
          (json.privacy as { sections: PrivacySection[] })?.sections ?? null
        );
      } catch {
        if (!cancelled) setImprint(DEFAULT_IMPRINT);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (isLoading) {
    return <LoadingState />;
  }
  if (!isAuthenticated || !user) {
    return <AuthRequired />;
  }

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
      <div className="flex gap-2 mb-8 border-b border-slate-hairline dark:border-slate-hairline">
        <TabButton
          active={tab === "imprint"}
          onClick={() => {
            setTab("imprint");
            window.location.hash = "imprint";
          }}
        >
          Impressum
        </TabButton>
        <TabButton
          active={tab === "privacy"}
          onClick={() => {
            setTab("privacy");
            window.location.hash = "privacy";
          }}
        >
          Datenschutz
        </TabButton>
      </div>
      {imprint && (
        <ImprintEditor
          settings={imprint}
          onChange={setImprint}
          onSave={() => handleSaveImprint(imprint, locale, setImprintSaved)}
          saved={imprintSaved}
        />
      )}
      {privacy && (
        <PrivacyEditor
          sections={privacy}
          onChange={setPrivacy}
          onSave={() => handleSavePrivacy(privacy, locale, setPrivacySaved)}
          saved={privacySaved}
        />
      )}
    </div>
  );
}

async function handleSaveImprint(
  imprint: ImprintSettings,
  locale: string,
  setSaved: (v: boolean) => void
) {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "imprint", locale, value: imprint }),
  });
  if (res.ok) {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }
}

async function handleSavePrivacy(
  privacy: PrivacySection[],
  locale: string,
  setSaved: (v: boolean) => void
) {
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
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
